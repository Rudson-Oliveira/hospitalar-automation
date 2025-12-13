/**
 * Hospital Automation Strategy
 * Estratégia otimizada para automação do sistema hospitalar
 */

import { Page } from 'playwright';
import { HOSPITAL_ROUTES, HOSPITAL_SELECTORS } from '../config/hospital-selectors';

export interface AutomationTask {
  name: string;
  description: string;
  route: string;
  steps: AutomationStep[];
}

export interface AutomationStep {
  action: 'navigate' | 'click' | 'fill' | 'select' | 'wait' | 'extract' | 'validate';
  selector?: string;
  value?: string | number;
  timeout?: number;
  description?: string;
}

export interface TaskResult {
  success: boolean;
  taskName: string;
  duration: number;
  data?: any;
  error?: string;
  steps: StepResult[];
}

export interface StepResult {
  step: number;
  action: string;
  success: boolean;
  duration: number;
  error?: string;
}

class HospitalAutomationStrategy {
  private page: Page;
  private hospitalUrl: string;

  constructor(page: Page, hospitalUrl: string = 'https://dev.hospitalarsaude.app.br') {
    this.page = page;
    this.hospitalUrl = hospitalUrl;
  }

  /**
   * Executa uma tarefa de automação
   */
  async executeTask(task: AutomationTask): Promise<TaskResult> {
    const startTime = Date.now();
    const stepResults: StepResult[] = [];

    console.log(`[HospitalAutomation] Iniciando tarefa: ${task.name}`);

    try {
      // Navegar para a rota
      await this.navigateToRoute(task.route);

      // Executar cada passo
      for (let i = 0; i < task.steps.length; i++) {
        const step = task.steps[i];
        const stepStartTime = Date.now();

        try {
          console.log(`[HospitalAutomation] Passo ${i + 1}: ${step.description || step.action}`);

          let result: any;
          switch (step.action) {
            case 'navigate':
              await this.navigateToRoute(step.value as string);
              break;

            case 'click':
              await this.clickElement(step.selector!);
              break;

            case 'fill':
              await this.fillField(step.selector!, step.value as string);
              break;

            case 'select':
              await this.selectOption(step.selector!, step.value as string);
              break;

            case 'wait':
              await this.page.waitForTimeout(step.timeout || 1000);
              break;

            case 'extract':
              result = await this.extractData(step.selector!);
              break;

            case 'validate':
              await this.validateElement(step.selector!);
              break;
          }

          const duration = Date.now() - stepStartTime;
          stepResults.push({
            step: i + 1,
            action: step.action,
            success: true,
            duration,
          });

          console.log(`[HospitalAutomation] ✅ Passo ${i + 1} concluído em ${duration}ms`);
        } catch (error) {
          const duration = Date.now() - stepStartTime;
          const errorMessage = error instanceof Error ? error.message : String(error);

          stepResults.push({
            step: i + 1,
            action: step.action,
            success: false,
            duration,
            error: errorMessage,
          });

          console.error(`[HospitalAutomation] ❌ Passo ${i + 1} falhou: ${errorMessage}`);
          throw error;
        }
      }

      const duration = Date.now() - startTime;
      console.log(`[HospitalAutomation] ✅ Tarefa concluída em ${duration}ms`);

      return {
        success: true,
        taskName: task.name,
        duration,
        steps: stepResults,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.error(`[HospitalAutomation] ❌ Tarefa falhou: ${errorMessage}`);

      return {
        success: false,
        taskName: task.name,
        duration,
        error: errorMessage,
        steps: stepResults,
      };
    }
  }

  /**
   * Navega para uma rota
   */
  private async navigateToRoute(route: string): Promise<void> {
    const url = `${this.hospitalUrl}${route}`;
    console.log(`[HospitalAutomation] Navegando para: ${url}`);

    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(500); // Aguardar renderização
  }

  /**
   * Clica em um elemento
   */
  private async clickElement(selector: string): Promise<void> {
    console.log(`[HospitalAutomation] Clicando em: ${selector}`);

    // Aguardar elemento estar visível
    await this.page.waitForSelector(selector, { timeout: 5000 });

    // Scroll para elemento se necessário
    await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);

    await this.page.waitForTimeout(300);

    // Clicar
    await this.page.click(selector);
    await this.page.waitForTimeout(500);
  }

  /**
   * Preenche um campo
   */
  private async fillField(selector: string, value: string): Promise<void> {
    console.log(`[HospitalAutomation] Preenchendo ${selector} com: ${value}`);

    // Aguardar elemento
    await this.page.waitForSelector(selector, { timeout: 5000 });

    // Limpar campo
    await this.page.fill(selector, '');
    await this.page.waitForTimeout(200);

    // Preencher com digitação lenta (mais natural)
    await this.page.type(selector, value, { delay: 50 });
    await this.page.waitForTimeout(300);
  }

  /**
   * Seleciona uma opção em um select
   */
  private async selectOption(selector: string, value: string): Promise<void> {
    console.log(`[HospitalAutomation] Selecionando ${value} em ${selector}`);

    await this.page.waitForSelector(selector, { timeout: 5000 });
    await this.page.selectOption(selector, value);
    await this.page.waitForTimeout(300);
  }

  /**
   * Extrai dados de um elemento
   */
  private async extractData(selector: string): Promise<any> {
    console.log(`[HospitalAutomation] Extraindo dados de: ${selector}`);

    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;

      // Se for tabela, extrair dados
      if (element.tagName === 'TABLE') {
        const rows = element.querySelectorAll('tbody tr');
        return Array.from(rows).map((row) => {
          const cells = row.querySelectorAll('td');
          return Array.from(cells).map((cell) => cell.textContent?.trim());
        });
      }

      // Se for input, retornar valor
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
        return element.value;
      }

      // Caso contrário, retornar texto
      return element.textContent?.trim();
    }, selector);
  }

  /**
   * Valida se um elemento existe e está visível
   */
  private async validateElement(selector: string): Promise<void> {
    console.log(`[HospitalAutomation] Validando: ${selector}`);

    const isVisible = await this.page.isVisible(selector);
    if (!isVisible) {
      throw new Error(`Elemento não está visível: ${selector}`);
    }
  }

  /**
   * Aguarda por um padrão de sucesso
   */
  async waitForSuccess(selector: string, timeout: number = 5000): Promise<void> {
    console.log(`[HospitalAutomation] Aguardando sucesso: ${selector}`);
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Obtém mensagem de erro
   */
  async getErrorMessage(): Promise<string | null> {
    const errorSelectors = [
      HOSPITAL_SELECTORS.notifications.error,
      HOSPITAL_SELECTORS.messages.error,
      '.error-message',
      '.alert-danger',
    ];

    for (const selector of errorSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return await element.textContent();
      }
    }

    return null;
  }

  /**
   * Obtém mensagem de sucesso
   */
  async getSuccessMessage(): Promise<string | null> {
    const successSelectors = [
      HOSPITAL_SELECTORS.notifications.success,
      HOSPITAL_SELECTORS.messages.success,
      '.success-message',
      '.alert-success',
    ];

    for (const selector of successSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return await element.textContent();
      }
    }

    return null;
  }
}

export default HospitalAutomationStrategy;
