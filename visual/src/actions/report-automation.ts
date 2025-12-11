import { Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export async function downloadReport(page: Page, reportName: string): Promise<string | null> {
    console.log(`[RELATÓRIO] Iniciando busca por relatório: "${reportName}"`);

    const downloadPath = path.join(process.cwd(), 'results', 'reports');
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
    }

    try {
        // 1. Tentar encontrar o botão/link pelo texto
        // Usa seletores flexíveis para encontrar variações do texto
        const selector = `text=/${reportName}/i`; 
        
        // Verifica se existe antes de clicar
        const isVisible = await page.isVisible(selector);
        
        if (!isVisible) {
            console.warn(`[RELATÓRIO] Elemento com texto "${reportName}" não encontrado na tela atual.`);
            return null;
        }

        // 2. Preparar para o download
        const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
        
        // 3. Clicar no relatório
        await page.click(selector);
        console.log(`[RELATÓRIO] Clique realizado em "${reportName}". Aguardando download...`);

        // 4. Salvar o arquivo
        const download = await downloadPromise;
        const suggestedName = download.suggestedFilename();
        const timestamp = new Date().toISOString().split('T')[0];
        const finalName = `${timestamp}_${suggestedName}`;
        const fullPath = path.join(downloadPath, finalName);

        await download.saveAs(fullPath);
        console.log(`[RELATÓRIO] Download concluído: ${fullPath}`);

        return fullPath;

    } catch (error) {
        console.error(`[RELATÓRIO] Erro ao baixar relatório:`, error);
        return null;
    }
}
