import { Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface VisionResult {
    screenshotPath: string;
    textPath: string;
    textContent: string;
    timestamp: string;
}

export async function captureAndAnalyze(page: Page, label: string = 'snapshot'): Promise<VisionResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsDir = path.join(process.cwd(), 'results', 'vision');
    
    // Garantir que o diretório existe
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    const screenshotFilename = `${label}_${timestamp}.png`;
    const textFilename = `${label}_${timestamp}.txt`;
    const screenshotPath = path.join(resultsDir, screenshotFilename);
    const textPath = path.join(resultsDir, textFilename);

    console.log(`[VISÃO] Iniciando captura visual: ${label}`);

    // 1. Captura de Tela (Olhos)
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`[VISÃO] Screenshot salvo em: ${screenshotPath}`);

    // 2. Extração de Texto (Cérebro/Leitura)
    // Extrai texto visível, limpa espaços extras e linhas vazias
    const textContent = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return bodyText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
    });

    fs.writeFileSync(textPath, textContent, 'utf-8');
    console.log(`[VISÃO] Conteúdo de texto extraído para: ${textPath}`);

    // 3. Análise Preliminar (Opcional - pode ser expandida)
    if (textContent.includes('Erro') || textContent.includes('Falha')) {
        console.warn('[VISÃO ALERTA] Palavras-chave de erro detectadas na tela.');
    }
    if (textContent.includes('Sucesso') || textContent.includes('Bem-vindo')) {
        console.log('[VISÃO INFO] Indicadores de sucesso detectados.');
    }

    return {
        screenshotPath,
        textPath,
        textContent,
        timestamp
    };
}
