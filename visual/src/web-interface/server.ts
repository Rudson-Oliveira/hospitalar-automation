import WebSocket from 'ws';
import express from 'express';
import path from 'path';
import { chromium } from 'playwright';
import { performLogin } from '../actions/login';
import { captureAndAnalyze } from '../actions/vision';
import { autonomousClick, autonomousType, interpretScreen } from '../actions/autonomous-control';
import { extractData } from '../actions/data-extraction';
import { downloadReport } from '../actions/report-automation';
import { createCursor } from 'ghost-cursor';

const app = express();
const PORT = 3001;

// Servir interface HTML
app.use(express.static(path.join(__dirname)));

const wss = new WebSocket.Server({ port: 3002 });

let page: any = null;
let browser: any = null;
let cursor: any = null;

wss.on('connection', (ws) => {
    console.log('Cliente conectado');
    
    ws.send(JSON.stringify({
        type: 'log',
        message: 'Conexão estabelecida com sucesso',
        level: 'success'
    }));

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'command') {
            await executeCommand(data.command, ws);
        }

        if (data.type === 'click_coordinate') {
            await executeClickCoordinate(data.x, data.y, ws);
        }
    });
});

async function executeClickCoordinate(xPercent: number, yPercent: number, ws: WebSocket) {
    if (!page) {
        ws.send(JSON.stringify({ type: 'log', message: 'Navegador não iniciado.', level: 'error' }));
        return;
    }

    try {
        const viewport = page.viewportSize();
        if (!viewport) return;

        const realX = viewport.width * xPercent;
        const realY = viewport.height * yPercent;

        ws.send(JSON.stringify({ 
            type: 'log', 
            message: `Clicando em X:${Math.round(realX)} Y:${Math.round(realY)}`, 
            level: 'info' 
        }));

        // Move cursor e clica
        if (cursor) {
            await cursor.move({ x: realX, y: realY });
            await cursor.click();
        } else {
            await page.mouse.click(realX, realY);
        }

        // Atualiza screenshot após clique
        await new Promise(r => setTimeout(r, 1000)); // Espera reação da UI
        const imageData = await page.screenshot({ encoding: 'base64' });
        ws.send(JSON.stringify({ type: 'screenshot', image: `data:image/png;base64,${imageData}` }));

    } catch (error) {
        ws.send(JSON.stringify({ type: 'log', message: `Erro no clique: ${error}`, level: 'error' }));
    }
}

async function executeCommand(command: string, ws: WebSocket) {
    try {
        ws.send(JSON.stringify({
            type: 'log',
            message: `Executando: ${command}`,
            level: 'info'
        }));

        // INICIAR
        if (command === 'iniciar' || (!browser && command !== 'sair')) {
            ws.send(JSON.stringify({ type: 'log', message: 'Iniciando navegador...', level: 'info' }));
            browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
            const context = await browser.newContext({ viewport: null });
            page = await context.newPage();
            cursor = createCursor(page);
            
            const loginSuccess = await performLogin(page, cursor);
            
            if (loginSuccess) {
                ws.send(JSON.stringify({ type: 'log', message: 'Login realizado com sucesso', level: 'success' }));
                // Tira screenshot inicial
                const imageData = await page.screenshot({ encoding: 'base64' });
                ws.send(JSON.stringify({ type: 'screenshot', image: `data:image/png;base64,${imageData}` }));
            } else {
                ws.send(JSON.stringify({ type: 'log', message: 'Falha no login', level: 'error' }));
            }
            return;
        }

        if (!page) {
            ws.send(JSON.stringify({ type: 'log', message: 'Navegador não iniciado. Digite "iniciar".', level: 'error' }));
            return;
        }

        // VER / SCREENSHOT
        if (command === 'ver' || command === 'screenshot') {
            const vision = await captureAndAnalyze(page, 'web_interface');
            const imageData = await page.screenshot({ encoding: 'base64' });
            ws.send(JSON.stringify({
                type: 'screenshot',
                image: `data:image/png;base64,${imageData}`
            }));
            ws.send(JSON.stringify({
                type: 'log',
                message: 'Screenshot capturado',
                level: 'success'
            }));
        }

        // LER
        if (command === 'ler') {
            const vision = await captureAndAnalyze(page, 'read');
            ws.send(JSON.stringify({
                type: 'log',
                message: `Conteúdo: ${vision.textContent.substring(0, 200)}...`,
                level: 'info'
            }));
        }

        // CLICAR
        if (command.startsWith('clicar ')) {
            const target = command.substring(7).trim().replace(/^"|"$/g, '');
            const result = await autonomousClick(page, target);
            
            if (result.success) {
                ws.send(JSON.stringify({ type: 'log', message: `Clicou em: ${target}`, level: 'success' }));
                // Atualiza screenshot
                const imageData = await page.screenshot({ encoding: 'base64' });
                ws.send(JSON.stringify({ type: 'screenshot', image: `data:image/png;base64,${imageData}` }));
            } else {
                ws.send(JSON.stringify({ type: 'log', message: `Erro: ${result.message}`, level: 'error' }));
            }
        }

        // DIGITAR
        if (command.startsWith('digitar ')) {
            const parts = command.match(/digitar "([^"]+)" "([^"]+)"/);
            if (parts) {
                const field = parts[1];
                const value = parts[2];
                const result = await autonomousType(page, field, value);
                if (result.success) {
                    ws.send(JSON.stringify({ type: 'log', message: `Digitado "${value}" em "${field}"`, level: 'success' }));
                } else {
                    ws.send(JSON.stringify({ type: 'log', message: `Erro: ${result.message}`, level: 'error' }));
                }
            }
        }

        // ANALISAR
        if (command === 'analisar') {
            const analysis = await interpretScreen(page);
            const msg = `Botões: ${analysis.hasButtons}, Forms: ${analysis.hasForms}, Sucesso: ${analysis.hasSuccess}`;
            ws.send(JSON.stringify({ type: 'log', message: msg, level: 'info' }));
        }

        // EXTRAIR
        if (command.startsWith('extrair')) {
            const label = command.split(' ')[1] || 'web';
            const path = await extractData(page, label);
            ws.send(JSON.stringify({ type: 'log', message: `Dados salvos em: ${path}`, level: 'success' }));
        }

        // RELATÓRIO
        if (command.startsWith('relatorio ')) {
            const reportName = command.substring(10).trim();
            const path = await downloadReport(page, reportName);
            if (path) {
                ws.send(JSON.stringify({ type: 'log', message: `Relatório baixado: ${path}`, level: 'success' }));
            } else {
                ws.send(JSON.stringify({ type: 'log', message: 'Falha ao baixar relatório', level: 'error' }));
            }
        }

        // NAVEGAR
        if (command.startsWith('navegar ') || command.startsWith('ir ')) {
            const url = command.split(' ')[1];
            await page.goto(url);
            ws.send(JSON.stringify({ type: 'log', message: `Navegou para: ${url}`, level: 'success' }));
            const imageData = await page.screenshot({ encoding: 'base64' });
            ws.send(JSON.stringify({ type: 'screenshot', image: `data:image/png;base64,${imageData}` }));
        }

        // SAIR
        if (command === 'sair') {
            if (browser) await browser.close();
            ws.send(JSON.stringify({ type: 'log', message: 'Navegador fechado', level: 'info' }));
            process.exit(0);
        }

    } catch (error) {
        ws.send(JSON.stringify({
            type: 'log',
            message: `Erro crítico: ${error}`,
            level: 'error'
        }));
    }
}

app.listen(PORT, () => {
    console.log(`Interface web rodando em: http://localhost:${PORT}`);
    console.log(`WebSocket rodando na porta: 3002`);
});
