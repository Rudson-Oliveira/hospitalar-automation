import { chromium } from 'playwright';
import { AIBrain } from '../core/ai-brain';
import { ActionExecutor } from '../core/action-executor';
import { TaskOrchestrator } from '../core/task-orchestrator';

// OBSIDIAN DESKTOP AGENT
// Este script deve ser rodado LOCALMENTE na máquina do usuário.
// Ele abre o navegador em modo HEADFUL (visível) e interage com o mouse.

async function startObsidian() {
    console.log('💎 Iniciando Obsidian Desktop Agent...');
    console.log('🖥️  Modo: INTERATIVO (Headful)');

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
    
    // Inicializar Cérebro
    const brain = new AIBrain();
    const orchestrator = new TaskOrchestrator();
    const executor = new ActionExecutor(page);

    console.log('✅ Obsidian pronto para receber comandos!');
    console.log('   (Integração com microfone/chat local pendente)');

    // Exemplo de fluxo inicial
    await page.goto('https://dev.hospitalarsaude.app.br');
    
    // Aqui entraria o loop de escuta de comandos locais
    // Por enquanto, mantemos o navegador aberto para o usuário assumir
}

startObsidian().catch(console.error);
