import { chromium, Page, Browser } from 'playwright';
import { performLogin } from './login';
import { captureAndAnalyze, VisionResult } from './vision';
import { extractData } from './data-extraction';
import { downloadReport } from './report-automation';
import { scheduleTask, checkDueTasks } from './scheduler';
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

    // Verificador de tarefas agendadas (roda a cada minuto)
    const schedulerInterval = setInterval(() => {
        const dueTasks = checkDueTasks();
        if (dueTasks.length > 0) {
            console.log(`\n⏰ Executando ${dueTasks.length} tarefas agendadas...`);
            // Aqui implementaria a execução real das tarefas agendadas
        }
    }, 60000);

    const processCommand = async (command: string): Promise<boolean> => {
        const cmd = command.trim().toLowerCase();

        if (cmd === 'sair' || cmd === 'exit') {
            clearInterval(schedulerInterval);
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

        // COMANDO: EXTRAIR DADOS
        if (cmd.startsWith('extrair')) {
            const label = cmd.split(' ')[1] || 'manual';
            await extractData(page, label);
            return true;
        }

        // COMANDO: BAIXAR RELATÓRIO
        if (cmd.startsWith('relatorio ')) {
            const reportName = command.substring(10).trim(); // Pega o nome original com case
            await downloadReport(page, reportName);
            return true;
        }

        // COMANDO: AGENDAR TAREFA
        if (cmd.startsWith('agendar ')) {
            // Formato: agendar "comando" HH:mm
            const parts = command.match(/agendar "([^"]+)" (\d{2}:\d{2})/);
            if (parts) {
                const taskCmd = parts[1];
                const time = parts[2];
                scheduleTask(taskCmd, time);
            } else {
                console.log('❌ Formato inválido. Use: agendar "comando" HH:mm');
            }
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
    console.log('  ver / screenshot          - Captura tela atual');
    console.log('  ler / read                - Lê conteúdo da tela');
    console.log('  navegar [url]             - Vai para uma URL');
    console.log('  extrair [nome]            - Extrai tabelas e dados da tela');
    console.log('  relatorio [nome]          - Baixa relatório com texto específico');
    console.log('  agendar "cmd" HH:mm       - Agenda uma tarefa');
    console.log('  ajuda / help              - Mostra esta ajuda');
    console.log('  sair / exit               - Encerra o programa');
    console.log('─'.repeat(50) + '\n');
}
