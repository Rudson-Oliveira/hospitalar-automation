import { Page } from 'playwright';
import { ActionStep } from './types';

export class ActionExecutor {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async executeStep(step: ActionStep): Promise<boolean> {
        console.log(`[EXECUTOR] Executando passo: ${step.description} (${step.type})`);
        
        try {
            switch (step.type) {
                case 'NAVIGATE':
                    if (step.value) {
                        await this.page.goto(step.value, { waitUntil: 'domcontentloaded' });
                    }
                    break;

                case 'CLICK':
                    if (step.selector) {
                        await this.page.waitForSelector(step.selector, { timeout: 5000 });
                        await this.page.click(step.selector);
                    }
                    break;

                case 'TYPE':
                    if (step.selector && step.value) {
                        await this.page.waitForSelector(step.selector, { timeout: 5000 });
                        await this.page.fill(step.selector, step.value);
                    }
                    break;
                
                case 'SELECT':
                    if (step.selector && step.value) {
                        await this.page.waitForSelector(step.selector, { timeout: 5000 });
                        await this.page.selectOption(step.selector, step.value);
                    }
                    break;

                case 'WAIT':
                    const time = step.value ? parseInt(step.value) : 1000;
                    await this.page.waitForTimeout(time);
                    break;

                case 'READ':
                    // Implementar leitura de texto se necessário
                    break;
            }
            return true;
        } catch (error) {
            console.error(`[EXECUTOR] Falha no passo ${step.id}:`, error);
            if (step.optional) {
                console.log('[EXECUTOR] Passo opcional falhou, continuando...');
                return true;
            }
            return false;
        }
    }
}
