import { chromium, Browser, Page } from 'playwright';
import WebSocket from 'ws';

export class AutonomousAgent {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private ws: WebSocket | null = null;
    private isRunning: boolean = false;
    private dashboardUrl: string;

    constructor(dashboardUrl: string = 'ws://localhost:3002') {
        this.dashboardUrl = dashboardUrl;
    }

    public async start() {
        if (this.isRunning) return;
        this.isRunning = true;

        console.log('[AGENT] Iniciando Agente Autônomo...');
        
        try {
            // Conectar ao Dashboard via WebSocket
            this.connectToDashboard();

            // Iniciar Navegador com flags otimizadas para Docker/Railway
            console.log('[AGENT] Iniciando Chromium...');
            this.browser = await chromium.launch({ 
                headless: true,
                timeout: 60000, // Aumentar timeout para 60s (containers lentos)
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--no-zygote' // Reduz uso de memória extra
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
                // Capturar Screenshot com timeout para evitar travamento
                const screenshotBuffer = await this.page.screenshot({ timeout: 5000 });
                const screenshotBase64 = screenshotBuffer.toString('base64');
                
                // Enviar para o Dashboard
                this.ws.send(JSON.stringify({
                    type: 'screenshot',
                    image: `data:image/png;base64,${screenshotBase64}`,
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
