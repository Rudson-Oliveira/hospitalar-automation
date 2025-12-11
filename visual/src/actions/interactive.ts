import { chromium, Page, Browser } from 'playwright';
import { performLogin } from './login';
import { captureAndAnalyze, VisionResult } from './vision';
import * as readline from 'readline';
import { createCursor } from 'ghost-cursor';

interface ActionResult {
    success: boolean;
    message: string;
    data?: any;
}

export async function runInteractiveMode() {
    console.log('🤖 Modo Interativo Iniciado!');
    console.log('Digite comandos ou "ajuda" para ver opções.\n');

    const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const cursor = createCursor(page);

    // Fazer login
    console.log('Fazendo login...');
    const loginSuccess = await performLogin(page, cursor);
    
    if (!loginSuccess) {
        console.error('❌ Falha no login!');
        await browser.close();
        return;
    }

    console.log('✅ Login realizado com sucesso!\n');

    // Capturar estado inicial
    const initialVision = await captureAndAnalyze(page, 'pos_login');
    console.log(`📸 Captura inicial salva: ${initialVision.screenshotPath}\n`);

    // Interface de linha de comando
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const processCommand = async (command: string): Promise<boolean> => {
        const cmd = command.trim().toLowerCase();

        if (cmd === 'sair' || cmd === 'exit') {
            return false;
        }

        if (cmd === 'ajuda' || cmd === 'help') {
            showHelp();
            return true;
        }

        if (cmd === 'ver' || cmd === 'screenshot') {
            const vision = await captureAndAnalyze(page, 'manual');
            console.log(`✅ Screenshot: ${vision.screenshotPath}`);
            console.log(`📄 Texto salvo: ${vision.textPath}\n`);
            return true;
        }

        if (cmd === 'ler' || cmd === 'read') {
            const vision = await captureAndAnalyze(page, 'leitura');
            console.log('📖 CONTEÚDO DA TELA:');
            console.log('─'.repeat(50));
            console.log(vision.textContent.substring(0, 500));
            console.log('...\n');
            return true;
        }

        if (cmd.startsWith('navegar ') || cmd.startsWith('ir ')) {
            const url = cmd.split(' ')[1];
            await page.goto(url);
            console.log(`✅ Navegou para: ${url}\n`);
            return true;
        }

        if (cmd === 'relatorio' || cmd.startsWith('baixar relatorio')) {
            await downloadReport(page);
            return true;
        }

        console.log(`❓ Comando não reconhecido: "${command}"`);
        console.log('Digite "ajuda" para ver comandos disponíveis.\n');
        return true;
    };

    // Loop interativo
    const prompt = () => {
        rl.question('🤖 Digite um comando: ', async (answer) => {
            const continuar = await processCommand(answer);
            if (continuar) {
                prompt();
            } else {
                console.log('\n👋 Encerrando...');
                rl.close();
                await browser.close();
            }
        });
    };

    prompt();
}

function showHelp() {
    console.log('\n📚 COMANDOS DISPONÍVEIS:');
    console.log('─'.repeat(50));
    console.log('  ver / screenshot  - Captura tela atual');
    console.log('  ler / read        - Lê conteúdo da tela');
    console.log('  navegar [url]     - Vai para uma URL');
    console.log('  relatorio         - Baixa relatório');
    console.log('  ajuda / help      - Mostra esta ajuda');
    console.log('  sair / exit       - Encerra o programa');
    console.log('─'.repeat(50) + '\n');
}

async function downloadReport(page: Page): Promise<ActionResult> {
    console.log('📥 Iniciando download de relatório...');
    
    try {
        // Capturar estado antes
        const beforeVision = await captureAndAnalyze(page, 'antes_relatorio');
        
        // Exemplo: procurar link de relatório
        // Adapte conforme o sistema real
        const hasRelatorio = beforeVision.textContent.includes('Relatório') || 
                            beforeVision.textContent.includes('Relatórios');
        
        if (!hasRelatorio) {
            console.log('⚠️  Não encontrei menu de relatórios na tela atual.');
            return { success: false, message: 'Relatório não encontrado' };
        }

        // Aqui você implementaria a lógica específica
        console.log('✅ Relatório localizado!');
        console.log('ℹ️  Implementação específica pendente.');
        
        return { success: true, message: 'Relatório processado' };
    } catch (error) {
        console.error('❌ Erro:', error);
        return { success: false, message: String(error) };
    }
}
