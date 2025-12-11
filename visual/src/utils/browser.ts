import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { createCursor, GhostCursor } from 'ghost-cursor';

export interface AgentBrowser {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  cursor: GhostCursor;
}

export async function createAgentBrowser(headless: boolean = false): Promise<AgentBrowser> {
  const browser = await chromium.launch({
    headless: headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessário para rodar no ambiente sandbox
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  const page = await context.newPage();
  
  // Inicializa o cursor fantasma para movimentos humanizados
  const cursor = createCursor(page);

  return { browser, context, page, cursor };
}

export async function closeAgentBrowser(agent: AgentBrowser) {
  await agent.browser.close();
}
