import { Page, ElementHandle } from 'playwright';
import { captureAndAnalyze } from './vision';

export interface AutonomousResult {
    success: boolean;
    message: string;
    beforeScreenshot?: string;
    afterScreenshot?: string;
}

export interface ScreenAnalysis {
    hasButtons: boolean;
    hasForms: boolean;
    hasErrors: boolean;
    hasSuccess: boolean;
    interactiveElements: string[];
}

// Função auxiliar para encontrar elementos baseados em descrição textual
async function findElementByDescription(page: Page, description: string): Promise<ElementHandle | null> {
    console.log(`[AUTÔNOMO] Procurando elemento: "${description}"`);
    
    // Estratégia 1: Texto exato ou parcial (case insensitive)
    try {
        const element = await page.waitForSelector(`text=/${description}/i`, { timeout: 3000 });
        if (element) return element;
    } catch (e) {
        // Ignora timeout e tenta próxima estratégia
    }

    // Estratégia 2: Placeholder ou Label (para inputs)
    try {
        const input = await page.$(`input[placeholder*="${description}" i], label:has-text("${description}")`);
        if (input) return input;
    } catch (e) {}

    // Estratégia 3: Aria-label ou Alt text
    try {
        const aria = await page.$(`[aria-label*="${description}" i], [alt*="${description}" i]`);
        if (aria) return aria;
    } catch (e) {}

    console.warn(`[AUTÔNOMO] Elemento "${description}" não encontrado.`);
    return null;
}

export async function autonomousClick(page: Page, elementDescription: string): Promise<AutonomousResult> {
    console.log(`[AUTÔNOMO] Iniciando clique em: "${elementDescription}"`);

    // 1. Captura tela antes
    const beforeVision = await captureAndAnalyze(page, 'pre_click');
    
    // 2. Encontra elemento
    const element = await findElementByDescription(page, elementDescription);
    
    if (!element) {
        return { 
            success: false, 
            message: `Elemento "${elementDescription}" não encontrado.`,
            beforeScreenshot: beforeVision.screenshotPath
        };
    }
    
    // 3. Move mouse e clica
    try {
        await element.hover();
        await page.waitForTimeout(500); // Pausa humana
        await element.click();
        console.log(`[AUTÔNOMO] Clique realizado com sucesso.`);
    } catch (error) {
        return { 
            success: false, 
            message: `Erro ao clicar: ${error}`,
            beforeScreenshot: beforeVision.screenshotPath
        };
    }
    
    // 4. Aguarda possível navegação ou reação
    await page.waitForTimeout(2000);

    // 5. Valida resultado
    const afterVision = await captureAndAnalyze(page, 'pos_click');
    
    return { 
        success: true, 
        message: 'Clique realizado e estado capturado.',
        beforeScreenshot: beforeVision.screenshotPath,
        afterScreenshot: afterVision.screenshotPath
    };
}

export async function autonomousType(page: Page, fieldDescription: string, text: string): Promise<AutonomousResult> {
    console.log(`[AUTÔNOMO] Digitando "${text}" em "${fieldDescription}"`);

    const element = await findElementByDescription(page, fieldDescription);
    
    if (!element) {
        return { success: false, message: `Campo "${fieldDescription}" não encontrado.` };
    }

    try {
        await element.click();
        // Limpa campo antes de digitar (Ctrl+A, Del)
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Delete');
        
        // Digita com delay humano
        await page.keyboard.type(text, { delay: 100 });
        
        return { success: true, message: `Texto digitado em "${fieldDescription}".` };
    } catch (error) {
        return { success: false, message: `Erro ao digitar: ${error}` };
    }
}

export async function interpretScreen(page: Page): Promise<ScreenAnalysis> {
    const vision = await captureAndAnalyze(page, 'interpretation');
    const text = vision.textContent.toLowerCase();
    
    // Análise heurística simples baseada no texto extraído
    return {
        hasButtons: text.includes('salvar') || text.includes('enviar') || text.includes('entrar') || text.includes('cancelar'),
        hasForms: text.includes('nome') || text.includes('email') || text.includes('senha') || text.includes('buscar'),
        hasErrors: text.includes('erro') || text.includes('falha') || text.includes('inválido') || text.includes('obrigatório'),
        hasSuccess: text.includes('sucesso') || text.includes('bem-vindo') || text.includes('concluído'),
        interactiveElements: [] // Poderia ser preenchido com análise mais profunda do DOM
    };
}
