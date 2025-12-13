import { chromium, Browser, Page } from 'playwright';
import WebSocket from 'ws';
import { BrowserbaseClient } from '../services/browserbase-client';
import { AIBrain } from '../core/ai-brain';
import { TaskOrchestrator } from '../core/task-orchestrator';
import { ActionExecutor } from '../core/action-executor';
import { Task } from '../core/types';

export class AutonomousAgent {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private ws: WebSocket | null = null;
    private isRunning: boolean = false;
    private dashboardUrl: string;
    private browserbase: BrowserbaseClient | null = null;
    private mode: 'LOCAL' | 'CLOUD' = 'LOCAL';
    
    // Novos componentes da arquitetura cognitiva
    private brain: AIBrain;
    private orchestrator: TaskOrchestrator;
    private executor: ActionExecutor | null = null;

    constructor(dashboardUrl: string = 'ws://localhost:3002') {
        this.dashboardUrl = dashboardUrl;
        this.brain = new AIBrain();
        this.orchestrator = new TaskOrchestrator();
        
        if (process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID) {
            this.browserbase = new BrowserbaseClient(
                process.env.BROWSERBASE_API_KEY,
                process.env.BROWSERBASE_PROJECT_ID
            );
        }
        
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
            this.connectToDashboard();

            if (this.mode === 'CLOUD' && this.browserbase) {
                await this.startCloudBrowser();
            } else {
                await this.startLocalBrowser();
            }
            
            if (this.browser) {
                this.page = await this.browser.newPage();
                await this.page.setViewportSize({ width: 1280, height: 720 });
                
                // Inicializar Executor com a página criada
                this.executor = new ActionExecutor(this.page);

                const targetUrl = process.env.HOSPITALAR_API_URL || 'https://dev.hospitalarsaude.app.br';
                console.log(`[AGENT] Navegando para: ${targetUrl}`);
                
                try {
                    await this.page.goto(targetUrl, { 
                        timeout: 60000, 
                        waitUntil: 'domcontentloaded'
                    });
                    console.log('[AGENT] Página carregada!');
                } catch (e) {
                    console.error(`[AGENT] Erro ao carregar página (continuando): ${e}`);
                }

                this.startMonitoringLoop();
            }

        } catch (error) {
            console.error('[AGENT] Erro crítico na inicialização:', error);
            
            if (this.mode === 'LOCAL' && this.browserbase) {
                console.log('🔄 ACTIVATING BROWSERBASE FALLBACK...');
                this.mode = 'CLOUD';
                this.isRunning = false;
                setTimeout(() => this.start(), 1000);
                return;
            }

            this.isRunning = false;
            console.log('[AGENT] Tentando reiniciar em 10 segundos...');
            setTimeout(() => this.start(), 10000);
        }
    }

    private async startCloudBrowser() {
        if (!this.browserbase) throw new Error('Browserbase client not initialized');
        console.log('[AGENT] Iniciando sessão remota via Browserbase...');
        try {
            const session = await this.browserbase.createSession();
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
        console.log('[AGENT] Iniciando Chromium Local (Railway) com Configuração Otimizada...');
        try {
            this.browser = await chromium.launch({ 
                headless: true,
                timeout: 120000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--no-zygote',
                    '--js-flags=--max-old-space-size=512'
                ]
            });
            console.log('[AGENT] Chromium Local iniciado com sucesso!');
        } catch (error) {
            console.error('[AGENT] Falha ao iniciar Chromium Local:', error);
            throw error;
        }
    }

    private connectToDashboard() {
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
                    await this.processNaturalLanguageCommand(message.command);
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
            setTimeout(() => this.connectToDashboard(), 5000);
        });
    }

    // NOVO: Processamento de Linguagem Natural e Execução de Tarefas
    private async processNaturalLanguageCommand(command: string) {
        if (!this.executor) {
            this.logToDashboard('Erro: Executor não inicializado.', 'error');
            return;
        }

        // 1. Interpretar Intenção (Brain)
        const intent = await this.brain.interpret(command);
        this.logToDashboard(`Intenção identificada: ${intent.type} (${Math.round(intent.confidence * 100)}%)`, 'info');

        if (intent.type === 'UNKNOWN') {
            this.logToDashboard('Não entendi o comando. Tente "ver google.com" ou "comprar 10 luvas".', 'warning');
            return;
        }

        // 2. Planejar Tarefa (Orchestrator)
        const task = this.orchestrator.planTask(intent);
        this.logToDashboard(`Iniciando tarefa: ${task.name}`, 'info');

        // 3. Executar Passos (Executor)
        await this.executeTask(task);
    }

    private async executeTask(task: Task) {
        if (!this.executor) return;

        task.status = 'IN_PROGRESS';
        
        for (const step of task.steps) {
            this.logToDashboard(`Executando: ${step.description}`, 'info');
            
            const success = await this.executor.executeStep(step);
            
            if (!success) {
                this.logToDashboard(`Falha no passo: ${step.description}`, 'error');
                task.status = 'FAILED';
                return;
            }
        }

        task.status = 'COMPLETED';
        this.logToDashboard(`Tarefa concluída com sucesso: ${task.name}`, 'success');
    }

    private logToDashboard(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
        this.ws?.send(JSON.stringify({
            type: 'log',
            message: message,
            level: level
        }));
    }

    private async executeClick(xPercent: number, yPercent: number) {
        if (!this.page) return;

        try {
            const viewport = this.page.viewportSize();
            if (!viewport) return;

            const x = viewport.width * xPercent;
            const y = viewport.height * yPercent;

            await this.page.mouse.click(x, y);
            
            this.logToDashboard(`Clique realizado em: ${Math.round(x)}x${Math.round(y)}`, 'info');

        } catch (e) {
            console.error('[AGENT] Erro ao clicar:', e);
        }
    }

    private async startMonitoringLoop() {
        console.log('[AGENT] Iniciando loop de monitoramento de screenshots...');
        
        if (!this.page || !this.ws) {
            console.error('[AGENT] Erro: Página ou WebSocket não inicializados para monitoramento.');
            return;
        }

        setInterval(async () => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.warn('[AGENT] WebSocket desconectado. Tentando reconectar...');
                return;
            }

            try {
                let screenshotBase64 = '';
                let source = this.mode === 'CLOUD' ? 'Browserbase (Cloud)' : 'Railway (Local)';

                if (this.page && !this.page.isClosed()) {
                    const screenshotBuffer = await this.page.screenshot({ timeout: 5000 });
                    screenshotBase64 = screenshotBuffer.toString('base64');
                } else {
                    console.error('[AGENT] Página fechada ou nula. Reiniciando navegador...');
                    this.isRunning = false;
                    this.start();
                    return;
                }
                
                this.ws.send(JSON.stringify({
                    type: 'screenshot',
                    image: `data:image/png;base64,${screenshotBase64}`,
                    source: source,
                    timestamp: new Date().toISOString()
                }));

            } catch (error) {
                console.error('[AGENT] Erro ao capturar screenshot:', error);
                try {
                    this.ws.send(JSON.stringify({
                        type: 'log',
                        message: `Erro na captura de tela: ${error}`,
                        level: 'error'
                    }));
                } catch (sendError) {
                    console.error('[AGENT] Falha ao enviar log de erro:', sendError);
                }
            }
        }, 2000);
    }

    public async stop() {
        this.isRunning = false;
        if (this.browser) await this.browser.close();
        if (this.ws) this.ws.close();
        console.log('[AGENT] Agente parado.');
    }
}
