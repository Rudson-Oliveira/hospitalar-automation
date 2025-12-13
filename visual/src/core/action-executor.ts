import { Page } from 'playwright';
import { ActionStep, Task } from './types.js';
import { exec } from 'child_process';

export class ActionExecutor {
  private page: Page;
  private retries: number = 3;
  private timeout: number = 5000;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Executa um passo de ação
   */
  public async executeStep(step: ActionStep): Promise<boolean> {
    console.log(`[EXECUTOR] Executando passo: ${step.description} (${step.type})`);

    try {
      switch (step.type) {
        case 'NAVIGATE':
          return await this.navigate(step.value);

        case 'CLICK':
          return await this.click(step.selector);

        case 'TYPE':
          return await this.type(step.selector, step.value);

        case 'SELECT':
          return await this.select(step.selector, step.value);

        case 'WAIT':
          return await this.wait(step.value);

        case 'READ':
          return await this.read(step.selector);

        case 'SCREENSHOT':
          return await this.screenshot(step.value);

        case 'EXECUTE_SCRIPT':
          return await this.executeScript(step.value);

        case 'OPEN_APP':
          return await this.openApp(step.value);

        default:
          console.warn(`[EXECUTOR] Tipo de ação desconhecido: ${step.type}`);
          return false;
      }
    } catch (error) {
      console.error(`[EXECUTOR] Falha no passo ${step.id}:`, error);
      if (step.optional) {
        console.log('[EXECUTOR] Passo opcional falhou, continuando...');
        return true;
      }
      return false;
    }
  }

  /**
   * Executa uma tarefa completa
   */
  public async executeTask(task: Task): Promise<Task> {
    console.log(`[EXECUTOR] Iniciando tarefa: ${task.name}`);
    task.status = 'IN_PROGRESS';
    const startTime = Date.now();

    for (let i = 0; i < task.steps.length; i++) {
      task.currentStepIndex = i;
      const step = task.steps[i];

      const success = await this.executeStep(step);

      if (!success && !step.optional) {
        task.status = 'FAILED';
        task.error = `Falha no passo: ${step.description}`;
        task.executionTime = Date.now() - startTime;
        console.error(`[EXECUTOR] Tarefa falhou: ${task.error}`);
        return task;
      }
    }

    task.status = 'COMPLETED';
    task.executionTime = Date.now() - startTime;
    console.log(`[EXECUTOR] Tarefa concluída em ${task.executionTime}ms`);
    return task;
  }

  /**
   * Navega para uma URL
   */
  private async navigate(url?: string): Promise<boolean> {
    if (!url) return false;

    try {
      console.log(`[EXECUTOR] Navegando para: ${url}`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: this.timeout });
      await this.page.waitForTimeout(1000);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao navegar: ${error}`);
      return false;
    }
  }

  /**
   * Clica em um elemento
   */
  private async click(selector?: string): Promise<boolean> {
    if (!selector) return false;

    try {
      console.log(`[EXECUTOR] Clicando em: ${selector}`);
      await this.page.waitForSelector(selector, { timeout: this.timeout });
      await this.page.click(selector);
      await this.page.waitForTimeout(500);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao clicar: ${error}`);
      return false;
    }
  }

  /**
   * Digita em um campo
   */
  private async type(selector?: string, value?: string): Promise<boolean> {
    if (!selector || !value) return false;

    try {
      console.log(`[EXECUTOR] Digitando em ${selector}: ${value}`);
      await this.page.waitForSelector(selector, { timeout: this.timeout });
      await this.page.fill(selector, value);
      await this.page.waitForTimeout(200);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao digitar: ${error}`);
      return false;
    }
  }

  /**
   * Seleciona uma opção
   */
  private async select(selector?: string, value?: string): Promise<boolean> {
    if (!selector || !value) return false;

    try {
      console.log(`[EXECUTOR] Selecionando ${value} em ${selector}`);
      await this.page.waitForSelector(selector, { timeout: this.timeout });
      await this.page.selectOption(selector, value);
      await this.page.waitForTimeout(200);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao selecionar: ${error}`);
      return false;
    }
  }

  /**
   * Aguarda um tempo
   */
  private async wait(duration?: string): Promise<boolean> {
    try {
      const ms = duration ? parseInt(duration) : 1000;
      console.log(`[EXECUTOR] Aguardando ${ms}ms`);
      await this.page.waitForTimeout(ms);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao aguardar: ${error}`);
      return false;
    }
  }

  /**
   * Lê texto de um elemento
   */
  private async read(selector?: string): Promise<boolean> {
    if (!selector) return false;

    try {
      console.log(`[EXECUTOR] Lendo texto de: ${selector}`);
      const text = await this.page.textContent(selector);
      console.log(`[EXECUTOR] Texto lido: ${text}`);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao ler: ${error}`);
      return false;
    }
  }

  /**
   * Tira screenshot
   */
  private async screenshot(filename?: string): Promise<boolean> {
    try {
      const path = filename || `screenshot-${Date.now()}.png`;
      console.log(`[EXECUTOR] Capturando screenshot: ${path}`);
      await this.page.screenshot({ path });
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao capturar screenshot: ${error}`);
      return false;
    }
  }

  /**
   * Abre um aplicativo local (OS Level)
   */
  private async openApp(appName?: string): Promise<boolean> {
    if (!appName) return false;

    console.log(`[EXECUTOR] Abrindo aplicativo: ${appName}`);
    
    return new Promise((resolve) => {
        // Comando genérico para tentar abrir apps em Windows/Mac/Linux
        // No Windows, 'start' é o comando mágico
        let command = '';
        if (process.platform === 'win32') {
            command = `start "" "${appName}"`;
        } else if (process.platform === 'darwin') {
            command = `open -a "${appName}"`;
        } else {
            command = `xdg-open "${appName}"`; // Linux
        }

        exec(command, (error) => {
            if (error) {
                console.error(`[EXECUTOR] Erro ao abrir app: ${error.message}`);
                // Tentar executar direto caso não seja um path
                exec(appName, (err) => {
                    if (err) {
                        console.error(`[EXECUTOR] Falha total ao abrir ${appName}`);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                resolve(true);
            }
        });
    });
  }

  /**
   * Executa script JavaScript
   */
  private async executeScript(script?: string): Promise<boolean> {
    if (!script) return false;

    try {
      console.log(`[EXECUTOR] Executando script`);
      const result = await this.page.evaluate(script);
      console.log(`[EXECUTOR] Resultado do script: ${JSON.stringify(result)}`);
      return true;
    } catch (error) {
      console.error(`[EXECUTOR] Erro ao executar script: ${error}`);
      return false;
    }
  }

  /**
   * Extrai dados da página
   */
  public async extractData(selectors: Record<string, string>): Promise<Record<string, any>> {
    const data: Record<string, any> = {};

    for (const [key, selector] of Object.entries(selectors)) {
      try {
        const value = await this.page.textContent(selector);
        data[key] = value?.trim() || null;
      } catch (error) {
        console.warn(`[EXECUTOR] Não foi possível extrair ${key}`);
        data[key] = null;
      }
    }

    return data;
  }

  /**
   * Obtém URL atual
   */
  public getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Obtém título da página
   */
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Aguarda elemento
   */
  public async waitForElement(selector: string, timeout?: number): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: timeout || this.timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Aguarda navegação
   */
  public async waitForNavigation(): Promise<boolean> {
    try {
      await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Define timeout
   */
  public setTimeout(ms: number): void {
    this.timeout = ms;
  }

  /**
   * Define número de tentativas
   */
  public setRetries(count: number): void {
    this.retries = count;
  }
}

export default ActionExecutor;
