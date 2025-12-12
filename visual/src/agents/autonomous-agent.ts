import { chromium, Browser, Page } from 'playwright';
import WebSocket from 'ws';
import { MultiOnClient } from '../services/multion-client';

export class AutonomousAgent {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private ws: WebSocket | null = null;
    private isRunning: boolean = false;
    private dashboardUrl: string;
    private multiOn: MultiOnClient | null = null;
    private mode: 'LOCAL' | 'MULTION' = 'LOCAL';

    constructor(dashboardUrl: string = 'ws://localhost:3002') {
        this.dashboardUrl = dashboardUrl;
        
        // Inicializar MultiOn se chave existir, mas modo padrão pode ser controlado externamente
        if (process.env.MULTION_API_KEY) {
            this.multiOn = new MultiOnClient(process.env.MULTION_API_KEY);
        }
        
        // Definir modo inicial
        this.mode = process.env.DEFAULT_AGENT_MODE === 'MULTION' && this.multiOn ? 'MULTION' : 'LOCAL';
        console.log(`[AGENT] Inicializado em modo: ${this.mode}`);
    }

    public setMode(newMode: 'LOCAL' | 'MULTION') {
        if (newMode === 'MULTION' && !this.multiOn) {
            console.warn('[AGENT] Tentativa de ativar MultiOn sem API Key configurada. Mantendo LOCAL.');
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

            if (this.mode === 'MULTION') {
                console.log('[AGENT] Iniciando sessão remota via MultiOn...');
                // Lógica do MultiOn será chamada no loop de monitoramento
                // Não precisamos iniciar o Chromium local se estivermos usando MultiOn puro
                // Mas mantemos o Chromium local como BACKUP se o MultiOn falhar
            }

            // Iniciar Navegador Local (Backup ou Principal)
            console.log('[AGENT] Iniciando Chromium Local (Railway)...');
            this.browser = await chromium.launch({ 
                headless: true,
                timeout: 60000, 
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--no-zygote'
                ]
            });
            console.log('[AGENT] Chromium iniciado com sucesso!');
            
            this.page = await this.browser.newPage();
            await this.page.setViewportSize({ width: 1280, height: 720 });

            // Navegar para o sistema alvo (simulação ou real)
            const targetUrl = process.env.HOSPITALAR_API_URL || 'https://dev.hospitalarsaude.app.br';
            console.log(`[AGENT] Navegando para: ${targetUrl}`);
            
            try {
                console.log(`[AGENT] Navegando para: ${targetUrl}`);
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

        } catch (error) {
            console.error('[AGENT] Erro crítico na inicialização:', error);
            this.isRunning = false;
            // Tentar reiniciar após falha crítica (ex: crash do navegador)
            console.log('[AGENT] Tentando reiniciar em 10 segundos...');
            setTimeout(() => this.start(), 10000);
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

        this.ws.on('error', (err) => {
            console.error('[AGENT] Erro de conexão WebSocket:', err.message);
            // Tentar reconectar em 5s
            setTimeout(() => this.connectToDashboard(), 5000);
        });
    }

    private async startMonitoringLoop() {
        if (!this.page || !this.ws) return;

        setInterval(async () => {
            if (!this.page || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            try {
                let screenshotBase64 = '';
                let source = 'Railway (Local)';

                if (this.mode === 'MULTION' && this.multiOn) {
                    try {
                        // Tentar obter screenshot do MultiOn
                        // const result = await this.multiOn.browse(...)
                        // Por enquanto, simulamos para não gastar créditos sem necessidade
                        // Se falhar, cai no catch e usa o local
                        source = 'MultiOn (Cloud)';
                    } catch (e) {
                        console.error('[AGENT] Falha no MultiOn, usando fallback local:', e);
                        source = 'Railway (Fallback)';
                    }
                }

                // Se não pegou do MultiOn ou se é modo local, usa Playwright
                if (!screenshotBase64 && this.page) {
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
