import { chromium } from 'playwright';
import { WebSocket } from 'ws';
import { AIBrain } from '../core/ai-brain';
import { ActionExecutor } from '../core/action-executor';
import { TaskOrchestrator } from '../core/task-orchestrator';

// OBSIDIAN DESKTOP AGENT
// Este script roda LOCALMENTE e se conecta ao Dashboard na NUVEM.
// Permite que o usuário veja o agente trabalhando e que o Dashboard remoto controle/visualize.

async function startObsidian() {
    console.log('💎 Iniciando Obsidian Desktop Agent...');
    console.log('🖥️  Modo: INTERATIVO (Headful)');

    // URL do Dashboard (Padrão: Local, mas pode ser sobrescrito para Prod)
    const DASHBOARD_URL = process.env.DASHBOARD_URL || 'ws://localhost:5001';
    console.log(`📡 Conectando ao Dashboard em: ${DASHBOARD_URL}`);

    // Iniciar navegador VISÍVEL (não headless)
    const browser = await chromium.launch({
        headless: false, // O usuário VÊ o navegador
        slowMo: 50,      // Movimentos mais humanos/lentos
        args: ['--start-maximized'] // Tela cheia
    });

    const context = await browser.newContext({
        viewport: null // Usar tamanho real da tela
    });

    const page = await context.newPage();
    
    // Inicializar Cérebro e Executor
    const brain = new AIBrain();
    const orchestrator = new TaskOrchestrator();
    const executor = new ActionExecutor(page);

    // Conectar ao WebSocket do Dashboard
    const ws = new WebSocket(DASHBOARD_URL);

    ws.on('open', () => {
        console.log('✅ Conectado ao Dashboard!');
        ws.send(JSON.stringify({ type: 'AGENT_CONNECT', source: 'OBSIDIAN_DESKTOP' }));
    });

    ws.on('error', (err) => {
        console.error('❌ Erro de conexão:', err.message);
    });

    // Receber comandos do Dashboard (Nuvem)
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('📩 Comando recebido:', message);

            if (message.type === 'command') {
                // Interpretar comando de linguagem natural
                const intent = await brain.interpret(message.content);
                const task = orchestrator.planTask(intent);
                
                ws.send(JSON.stringify({ type: 'log', content: `Executando: ${task.name}` }));
                
                // Executar tarefa
                await executor.executeTask(task);
                
                ws.send(JSON.stringify({ type: 'log', content: `Tarefa concluída: ${task.name}` }));
            }
        } catch (error) {
            console.error('Erro ao processar comando:', error);
        }
    });

    console.log('✅ Obsidian pronto e conectado!');
    console.log('   Aguardando comandos do Dashboard ou interação local...');

    // Loop de envio de Screenshots para o Dashboard ver o que acontece localmente
    setInterval(async () => {
        try {
            if (!page.isClosed()) {
                const buffer = await page.screenshot({ quality: 50, type: 'jpeg' });
                const base64 = buffer.toString('base64');
                
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'screenshot',
                        image: `data:image/jpeg;base64,${base64}`,
                        source: 'OBSIDIAN_DESKTOP'
                    }));
                }
            }
        } catch (err) {
            // Ignorar erros de screenshot se página fechar
        }
    }, 2000); // Enviar a cada 2 segundos

    // Página inicial
    await page.goto('https://dev.hospitalarsaude.app.br');
}

startObsidian().catch(console.error);
