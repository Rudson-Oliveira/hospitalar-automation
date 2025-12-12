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

            // Iniciar Navegador
            this.browser = await chromium.launch({ 
                headless: true, // Headless em produção
                args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            });
            
            this.page = await this.browser.newPage();
            await this.page.setViewportSize({ width: 1280, height: 720 });

            // Navegar para o sistema alvo (simulação ou real)
            const targetUrl = process.env.HOSPITALAR_API_URL || 'https://dev.hospitalarsaude.app.br';
            console.log(`[AGENT] Navegando para: ${targetUrl}`);
            
            try {
                await this.page.goto(targetUrl, { timeout: 60000 });
            } catch (e) {
                console.error(`[AGENT] Erro ao carregar página: ${e}`);
                // Continua mesmo com erro para tentar screenshot
            }

            // Loop de monitoramento e screenshots
            this.startMonitoringLoop();

        } catch (error) {
            console.error('[AGENT] Erro crítico na inicialização:', error);
            this.isRunning = false;
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
                // Capturar Screenshot
                const screenshot = await this.page.screenshot({ encoding: 'base64' });
                
                // Enviar para o Dashboard
                this.ws.send(JSON.stringify({
                    type: 'screenshot',
                    image: `data:image/png;base64,${screenshot}`,
                    timestamp: new Date().toISOString()
                }));

                // Log de atividade
                // console.log('[AGENT] Screenshot enviado');

            } catch (error) {
                console.error('[AGENT] Erro ao capturar screenshot:', error);
            }
        }, 2000); // A cada 2 segundos
    }

    public async stop() {
        this.isRunning = false;
        if (this.browser) await this.browser.close();
        if (this.ws) this.ws.close();
        console.log('[AGENT] Agente parado.');
    }
}
