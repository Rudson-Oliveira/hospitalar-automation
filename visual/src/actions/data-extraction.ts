import { Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface ExtractedData {
    timestamp: string;
    sourceUrl: string;
    tables: any[];
    metrics: any[];
    forms: any[];
}

export async function extractData(page: Page, label: string = 'data'): Promise<string> {
    console.log(`[EXTRAÇÃO] Iniciando extração de dados: ${label}`);
    
    const data: ExtractedData = {
        timestamp: new Date().toISOString(),
        sourceUrl: page.url(),
        tables: [],
        metrics: [],
        forms: []
    };

    // 1. Extrair Tabelas
    data.tables = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        return tables.map(table => {
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
            const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Pula header
            const rowData = rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => cell.innerText.trim());
            });
            return { headers, rows: rowData };
        });
    });

    // 2. Extrair Métricas (Cards de Dashboard)
    // Procura por elementos comuns de dashboard (cards com números)
    data.metrics = await page.evaluate(() => {
        // Seletor genérico para cards de métricas - ajustar conforme o sistema real
        const cards = Array.from(document.querySelectorAll('.card, .metric, .dashboard-item'));
        return cards.map(card => {
            return {
                text: (card as HTMLElement).innerText.replace(/\n/g, ' ').trim(),
                html: card.innerHTML
            };
        });
    });

    // 3. Salvar em JSON
    const resultsDir = path.join(process.cwd(), 'results', 'data');
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    const filename = `${label}_${data.timestamp.replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(resultsDir, filename);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[EXTRAÇÃO] Dados salvos em: ${filePath}`);
    
    return filePath;
}
