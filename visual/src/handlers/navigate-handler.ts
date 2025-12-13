import { Page, Browser } from 'playwright';

/**
 * Handler para navegação real com Playwright
 * Abre URLs no navegador e captura screenshots em base64
 */
export class NavigateHandler {
  private page: Page | null = null;
  private browser: Browser | null = null;

  constructor(page: Page, browser: Browser) {
    this.page = page;
    this.browser = browser;
  }

  /**
   * Navega para uma URL e captura screenshot
   */
  async navigate(url: string): Promise<{
    success: boolean;
    url: string;
    title: string;
    screenshot: string;
    timestamp: string;
    error?: string;
  }> {
    try {
      // Validar URL
      if (!url || typeof url !== 'string') {
        throw new Error('URL inválida');
      }

      // Adicionar protocolo se necessário
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
      }

      console.log(`[NAVIGATE] Navegando para: ${fullUrl}`);

      // Navegar
      if (!this.page) {
        throw new Error('Página não inicializada');
      }

      await this.page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // Aguardar um pouco para carregar conteúdo dinâmico
      await this.page.waitForTimeout(1000);

      // Capturar screenshot
      const screenshotBuffer = await this.page.screenshot({ fullPage: true });
      const base64Screenshot = screenshotBuffer.toString('base64');

      // Obter título
      const title = await this.page.title();

      console.log(`[NAVIGATE] Sucesso: ${title} (${fullUrl})`);

      return {
        success: true,
        url: fullUrl,
        title: title || 'Página sem título',
        screenshot: base64Screenshot,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[NAVIGATE] Erro: ${errorMessage}`);

      return {
        success: false,
        url: url || 'desconhecida',
        title: 'Erro',
        screenshot: '',
        timestamp: new Date().toISOString(),
        error: errorMessage
      };
    }
  }

  /**
   * Fecha a página
   */
  async closePage(): Promise<void> {
    if (this.page) {
      try {
        await this.page.close();
        this.page = null;
      } catch (error) {
        console.error('[NAVIGATE] Erro ao fechar página:', error);
      }
    }
  }

  /**
   * Retorna a página atual
   */
  getPage(): Page | null {
    return this.page;
  }

  /**
   * Define a página
   */
  setPage(page: Page): void {
    this.page = page;
  }
}
