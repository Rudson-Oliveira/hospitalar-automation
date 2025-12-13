import { Page, Browser } from 'playwright';
import sharp from 'sharp';

/**
 * Interface para resposta de navegação
 */
export interface NavigateResponse {
  success: boolean;
  url: string;
  screenshot: string; // base64
  title: string;
  timestamp: string;
  error?: string;
}

/**
 * Classe para gerenciar navegação e captura de screenshots
 */
export class NavigateHandler {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(browser: Browser | null, page: Page | null) {
    this.browser = browser;
    this.page = page;
  }

  /**
   * Navega para uma URL e captura screenshot
   */
  async navigate(url: string): Promise<NavigateResponse> {
    try {
      // Validar URL
      if (!url) {
        throw new Error('URL não fornecida');
      }

      // Adicionar protocolo se não existir
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = `https://${url}`;
      }

      console.log(`[NAVIGATE] Navegando para: ${fullUrl}`);

      // Se não há página aberta, criar uma nova
      if (!this.page || this.page.isClosed()) {
        if (!this.browser) {
          throw new Error('Navegador não inicializado');
        }
        this.page = await this.browser.newPage();
      }

      // Navegar para a URL
      await this.page.goto(fullUrl, { waitUntil: 'networkidle' });

      // Aguardar um pouco para garantir que a página carregou
      await this.page.waitForTimeout(1000);

      // Capturar screenshot
      const screenshotBuffer = await this.page.screenshot({ fullPage: true });

      // Converter para base64
      const base64Screenshot = screenshotBuffer.toString('base64');

      // Obter título da página
      const title = await this.page.title();

      console.log(`[NAVIGATE] Sucesso: ${title} (${fullUrl})`);

      return {
        success: true,
        url: fullUrl,
        screenshot: base64Screenshot,
        title,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[NAVIGATE] Erro: ${errorMessage}`);

      return {
        success: false,
        url,
        screenshot: '',
        title: 'Erro',
        timestamp: new Date().toISOString(),
        error: errorMessage
      };
    }
  }

  /**
   * Fecha a página
   */
  async closePage(): Promise<void> {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
      this.page = null;
    }
  }

  /**
   * Obtém a página atual
   */
  getPage(): Page | null {
    return this.page;
  }

  /**
   * Define a página
   */
  setPage(page: Page | null): void {
    this.page = page;
  }

  /**
   * Define o navegador
   */
  setBrowser(browser: Browser | null): void {
    this.browser = browser;
  }
}

export default NavigateHandler;
