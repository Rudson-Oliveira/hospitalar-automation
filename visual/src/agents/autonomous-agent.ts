import { chromium, Browser, Page } from 'playwright';
import WebSocket from 'ws';
import { BrowserbaseClient } from '../services/browserbase-client';

export class AutonomousAgent {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private ws: WebSocket | null = null;
    private isRunning: boolean = false;
    private dashboardUrl: string;
    private browserbase: BrowserbaseClient | null = null;
    private mode: 'LOCAL' | 'CLOUD' = 'LOCAL'; // CLOUD = Browserbase

    constructor(dashboardUrl: string = 'ws://localhost:3002') {
        this.dashboardUrl = dashboardUrl;
        
        // Inicializar Browserbase se chaves existirem
        if (process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID) {
            this.browserbase = new BrowserbaseClient(
                process.env.BROWSERBASE_API_KEY,
                process.env.BROWSERBASE_PROJECT_ID
            );
        }
        
        // Definir modo inicial
        this.mode = process.env.DEFAULT_AGENT_MODE === 'CLOUD' && this.browserbase ? 'CLOUD' : 'LOCAL';
        console.log(`[AGENT] Inicializado em modo: ${this.mode}`);
    }

    public setMode(newMode: 'LOCAL' | 'CLOUD') {
        if (newMode === 'CLOUD' && !this.browserbase) {
            console.warn('[AGENT] Tentativa de ativar Cloud (Browserbase) sem credenciais. Mantendo LOCAL.');
            return false;
        }
        this.mode = newMode;
        console.log(`[AGENT] Modo alterado dinamicamente para: ${this.mode}`);
        return true;
    }

    public getMode() {
        return this.mode;
    }

    public async start() {
        if (this.isRunning) return;
        this.isRunning = true;

        console.log('[AGENT] Iniciando Agente Autônomo...');
        
        try {
            // Conectar ao Dashboard via WebSocket
            this.connectToDashboard();

            if (this.mode === 'CLOUD' && this.browserbase) {
                await this.startCloudBrowser();
            } else {
                await this.startLocalBrowser();
            }
            
            if (this.browser) {
                this.page = await this.browser.newPage();
                await this.page.setViewportSize({ width: 1280, height: 720 });

                // Navegar para o sistema alvo (simulação ou real)
                const targetUrl = process.env.HOSPITALAR_API_URL || 'https://dev.hospitalarsaude.app.br';
                console.log(`[AGENT] Navegando para: ${targetUrl}`);
                
                try {
                    await this.page.goto(targetUrl, { 
                        timeout: 60000, 
                        waitUntil: 'domcontentloaded' // Não esperar carregar tudo (imagens, analytics, etc)
                    });
                    console.log('[AGENT] Página carregada!');
                } catch (e) {
                    console.error(`[AGENT] Erro ao carregar página (continuando): ${e}`);
                }

                // Loop de monitoramento e screenshots
                this.startMonitoringLoop();
            }

        } catch (error) {
            console.error('[AGENT] Erro crítico na inicialização:', error);
            
            // SELF-HEALING: Se falhar no modo LOCAL, tentar CLOUD (Browserbase)
            if (this.mode === 'LOCAL' && this.browserbase) {
                console.log('🔄 ACTIVATING BROWSERBASE FALLBACK...');
                this.mode = 'CLOUD';
                this.isRunning = false; // Resetar flag para permitir restart
                setTimeout(() => this.start(), 1000); // Reiniciar imediatamente em modo CLOUD
                return;
            }

            this.isRunning = false;
            // Tentar reiniciar após falha crítica (ex: crash do navegador)
            console.log('[AGENT] Tentando reiniciar em 10 segundos...');
            setTimeout(() => this.start(), 10000);
        }
    }

    private async startCloudBrowser() {
        if (!this.browserbase) throw new Error('Browserbase client not initialized');
        console.log('[AGENT] Iniciando sessão remota via Browserbase...');
        try {
            const session = await this.browserbase.createSession();
            // Conectar ao navegador remoto via CDP (WebSocket)
            this.browser = await chromium.connectOverCDP(session.connectUrl);
            console.log('[AGENT] Conectado ao Browserbase com sucesso!');
        } catch (e) {
            console.error('[AGENT] Falha ao conectar no Browserbase:', e);
            console.log('[AGENT] Caindo para modo LOCAL (Fallback)...');
            this.mode = 'LOCAL';
            await this.startLocalBrowser();
        }
    }

    private async startLocalBrowser() {
        // Iniciar Navegador Local (Railway)
        console.log('[AGENT] Iniciando Chromium Local (Railway) com Configuração Otimizada...');
        try {
            this.browser = await chromium.launch({ 
                headless: true,
                timeout: 120000, // 2 minutos (sugestão Claude)
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process', // CRÍTICO para Docker
                    '--no-zygote',      // CRÍTICO para Docker
                    '--js-flags=--max-old-space-size=512' // Limite de memória JS
                ]
            });
            console.log('[AGENT] Chromium Local iniciado com sucesso!');
        } catch (error) {
            console.error('[AGENT] Falha ao iniciar Chromium Local:', error);
            throw error; // Repassar erro para ativar o Self-Healing no catch do start()
        }
    }

    private connectToDashboard() {
        // Em produção, conectar ao próprio servidor local
        // Se estiver rodando no mesmo processo/container, localhost funciona
        const wsUrl = process.env.NODE_ENV === 'production' 
            ? `ws://localhost:${process.env.PORT || 3000}`
            : this.dashboardUrl;

        console.log(`[AGENT] Conectando ao WebSocket: ${wsUrl}`);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.on('open', () => {
            console.log('[AGENT] Conectado ao Dashboard');
            this.ws?.send(JSON.stringify({
                type: 'AGENT_CONNECT',
                agentId: 'autonomous-browser',
                name: 'Navegador Autônomo'
            }));
        });

        this.ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                
                if (message.type === 'command') {
                    console.log(`[AGENT] Comando recebido: ${message.command}`);
                    await this.executeCommand(message.command);
                }
                
                if (message.type === 'click_coordinate') {
                    console.log(`[AGENT] Clique recebido: ${message.x}, ${message.y}`);
                    await this.executeClick(message.x, message.y);
                }

            } catch (e) {
                console.error('[AGENT] Erro ao processar mensagem:', e);
            }
        });

        this.ws.on('error', (err) => {
            console.error('[AGENT] Erro de conexão WebSocket:', err.message);
            // Tentar reconectar em 5s
            setTimeout(() => this.connectToDashboard(), 5000);
        });
    }

    private async executeCommand(command: string) {
        if (!this.page) return;

        try {
            // Comando simples: "ver [url]"
            if (command.startsWith('ver ') || command.startsWith('navegar ')) {
                const url = command.split(' ')[1];
                let targetUrl = url;
                if (!url.startsWith('http')) targetUrl = `https://${url}`;
                
                console.log(`[AGENT] Navegando para: ${targetUrl}`);
                await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                
                this.ws?.send(JSON.stringify({
                    type: 'log',
                    message: `Navegou para: ${targetUrl}`,
                    level: 'success'
                }));
            }
            // Outros comandos podem ser adicionados aqui (ex: "clicar", "escrever")
            else {
                this.ws?.send(JSON.stringify({
                    type: 'log',
                    message: `Comando não reconhecido: ${command}`,
                    level: 'error'
                }));
            }
        } catch (e) {
            console.error('[AGENT] Erro na execução do comando:', e);
            this.ws?.send(JSON.stringify({
                type: 'log',
                message: `Erro ao executar comando: ${e}`,
                level: 'error'
            }));
        }
    }

    private async executeClick(xPercent: number, yPercent: number) {
        if (!this.page) return;

        try {
            const viewport = this.page.viewportSize();
            if (!viewport) return;

            const x = viewport.width * xPercent;
            const y = viewport.height * yPercent;

            await this.page.mouse.click(x, y);
            
            this.ws?.send(JSON.stringify({
                type: 'log',
                message: `Clique realizado em: ${Math.round(x)}x${Math.round(y)}`,
                level: 'info'
            }));

        } catch (e) {
            console.error('[AGENT] Erro ao clicar:', e);
        }
    }

    private async startMonitoringLoop() {
        if (!this.page || !this.ws) return;

        setInterval(async () => {
            if (!this.page || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            try {
                let screenshotBase64 = '';
                let source = this.mode === 'CLOUD' ? 'Browserbase (Cloud)' : 'Railway (Local)';

                if (this.page) {
                    const screenshotBuffer = await this.page.screenshot({ timeout: 5000 });
                    screenshotBase64 = screenshotBuffer.toString('base64');
                }
                
                // Enviar para o Dashboard
                this.ws.send(JSON.stringify({
                    type: 'screenshot',
                    image: `data:image/png;base64,${screenshotBase64}`,
                    source: source,
                    timestamp: new Date().toISOString()
                }));

                // Log de atividade
                // console.log('[AGENT] Screenshot enviado');

            } catch (error) {
                console.error('[AGENT] Erro ao capturar screenshot:', error);
            }
        }, 5000); // A cada 5 segundos (reduz carga de CPU)
    }

    public async stop() {
        this.isRunning = false;
        if (this.browser) await this.browser.close();
        if (this.ws) this.ws.close();
        console.log('[AGENT] Agente parado.');
    }
}
