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

/**
 * Toma decisão baseado na interpretação da tela
 */
export async function makeDecision(page: Page, analysis: ScreenAnalysis): Promise<string> {
    console.log(`[AUTÔNOMO] Analisando situação...`);

    if (analysis.hasErrors) {
        console.log(`[AUTÔNOMO] 🚨 Erro detectado na tela`);
        return 'handle_error';
    }

    if (analysis.hasSuccess) {
        console.log(`[AUTÔNOMO] ✅ Sucesso detectado`);
        return 'continue';
    }

    if (analysis.hasForms) {
        console.log(`[AUTÔNOMO] 📝 Formulário detectado`);
        return 'fill_form';
    }

    if (analysis.hasButtons) {
        console.log(`[AUTÔNOMO] 🔘 Botões detectados`);
        return 'click_button';
    }

    console.log(`[AUTÔNOMO] ❓ Situação desconhecida`);
    return 'unknown';
}

/**
 * Executa fluxo autônomo completo com múltiplas ações
 */
export async function executeAutonomousFlow(
    page: Page,
    actions: Array<{
        type: 'click' | 'type' | 'wait';
        target?: string;
        value?: string;
        delay?: number;
    }>
): Promise<AutonomousResult[]> {
    console.log(`[AUTÔNOMO] Iniciando fluxo autônomo com ${actions.length} ações`);

    const results: AutonomousResult[] = [];

    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        console.log(`[AUTÔNOMO] Ação ${i + 1}/${actions.length}: ${action.type}`);

        let result: AutonomousResult;

        switch (action.type) {
            case 'click':
                result = await autonomousClick(page, action.target!);
                break;

            case 'type':
                result = await autonomousType(page, action.target!, action.value!);
                break;

            case 'wait':
                await page.waitForTimeout(action.delay || 1000);
                result = {
                    success: true,
                    message: `Aguardado ${action.delay || 1000}ms`,
                };
                break;

            default:
                result = {
                    success: false,
                    message: 'Ação desconhecida',
                };
        }

        results.push(result);

        if (!result.success) {
            console.error(`[AUTÔNOMO] ❌ Ação ${i + 1} falhou. Parando fluxo.`);
            break;
        }
    }

    console.log(`[AUTÔNOMO] ✅ Fluxo concluído: ${results.filter(r => r.success).length}/${results.length} ações bem-sucedidas`);

    return results;
}

/**
 * Monitora a tela continuamente e executa ações baseado em mudanças
 */
export async function monitorAndAct(
    page: Page,
    duration: number = 60000,
    onStateChange?: (analysis: ScreenAnalysis) => Promise<void>
): Promise<void> {
    console.log(`[AUTÔNOMO] Iniciando monitoramento por ${duration}ms`);

    const startTime = Date.now();
    let lastAnalysis: ScreenAnalysis | null = null;

    while (Date.now() - startTime < duration) {
        const analysis = await interpretScreen(page);

        // Detecta mudanças
        if (!lastAnalysis || JSON.stringify(analysis) !== JSON.stringify(lastAnalysis)) {
            console.log(`[AUTÔNOMO] 🔄 Mudança detectada na tela`);

            if (onStateChange) {
                await onStateChange(analysis);
            }

            lastAnalysis = analysis;
        }

        // Aguarda antes da próxima verificação
        await page.waitForTimeout(2000);
    }

    console.log(`[AUTÔNOMO] ✅ Monitoramento finalizado`);
}

/**
 * Preenche um formulário inteiro de forma autônoma
 */
export async function fillFormAutonomously(
    page: Page,
    formData: Record<string, string>
): Promise<AutonomousResult[]> {
    console.log(`[AUTÔNOMO] Preenchendo formulário com ${Object.keys(formData).length} campos`);

    const results: AutonomousResult[] = [];

    for (const [fieldName, fieldValue] of Object.entries(formData)) {
        console.log(`[AUTÔNOMO] Preenchendo campo: ${fieldName}`);
        const result = await autonomousType(page, fieldName, fieldValue);
        results.push(result);

        if (!result.success) {
            console.warn(`[AUTÔNOMO] ⚠️ Falha ao preencher ${fieldName}`);
        }

        // Pequeno delay entre campos
        await page.waitForTimeout(300);
    }

    return results;
}

/**
 * Extrai dados de uma tabela de forma autônoma
 */
export async function extractTableDataAutonomously(
    page: Page,
    tableSelector: string = 'table'
): Promise<Record<string, string>[]> {
    console.log(`[AUTÔNOMO] Extraindo dados da tabela`);

    try {
        const data = await page.evaluate((selector) => {
            const table = document.querySelector(selector);
            if (!table) return [];

            const rows = Array.from(table.querySelectorAll('tr'));
            const headers = Array.from(rows[0]?.querySelectorAll('th, td') || []).map(th => th.textContent?.trim() || '');

            return rows.slice(1).map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                const obj: Record<string, string> = {};
                headers.forEach((header, index) => {
                    obj[header] = cells[index]?.textContent?.trim() || '';
                });
                return obj;
            });
        }, tableSelector);

        console.log(`[AUTÔNOMO] ✅ ${data.length} linhas extraídas`);
        return data;
    } catch (error) {
        console.error(`[AUTÔNOMO] ❌ Erro ao extrair tabela: ${error}`);
        return [];
    }
}
