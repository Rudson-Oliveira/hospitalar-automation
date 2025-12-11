import { chromium } from 'playwright';
import { createCursor } from 'ghost-cursor';
import { performLogin } from './actions/login';
import { captureAndAnalyze } from './actions/vision';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    console.log('🤖 INICIANDO MODO INTERATIVO COM VISÃO COMPUTACIONAL...');
    
    const browser = await chromium.launch({ 
        headless: process.env.HEADLESS === 'true',
        args: ['--start-maximized']
    });
    
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const cursor = createCursor(page);

    // 1. Realizar Login
    const loginSuccess = await performLogin(page, cursor);

    if (!loginSuccess) {
        console.error('❌ Falha no login. Encerrando modo interativo.');
        await browser.close();
        process.exit(1);
    }

    console.log('\n✅ LOGIN REALIZADO! O robô está aguardando comandos.');
    console.log('---------------------------------------------------');

    while (true) {
        // 2. Ciclo de Comando e Ação
        const command = await askQuestion('\n📝 Digite um comando (ou "sair", "ver", "ler"): ');

        if (command.toLowerCase() === 'sair') {
            break;
        }

        if (command.toLowerCase() === 'ver' || command.toLowerCase() === 'ler') {
            const result = await captureAndAnalyze(page, 'interativo');
            console.log(`\n👀 O robô viu a tela.`);
            console.log(`📸 Imagem salva em: ${result.screenshotPath}`);
            console.log(`📄 Texto lido (resumo):\n${result.textContent.substring(0, 300)}...\n`);
            continue;
        }

        // Aqui poderíamos adicionar lógica para interpretar comandos como "clicar em X"
        // Por enquanto, vamos apenas registrar a intenção
        console.log(`🤖 Comando recebido: "${command}".`);
        console.log(`(Ainda não sei executar ações complexas dinamicamente, mas já sei ler a tela!)`);
        
        // Exemplo de ação simples baseada em texto
        if (command.toLowerCase().includes('relatorio')) {
            console.log('Tentando encontrar link de relatórios...');
            try {
                await page.click('text=Relatórios');
                console.log('Clique realizado em "Relatórios"!');
            } catch (e) {
                console.log('Não encontrei um botão com texto "Relatórios".');
            }
        }
    }

    console.log('Encerrando sessão...');
    await browser.close();
    rl.close();
})();
