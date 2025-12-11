import { Page } from 'playwright';
import { GhostCursor } from 'ghost-cursor';
import { performLogin } from './login';

export async function runDemo(page: Page, cursor: GhostCursor): Promise<void> {
  console.log('--- Iniciando Demonstração Visual ---');
  
  // 1. Realizar Login
  const loginSuccess = await performLogin(page, cursor);
  
  if (!loginSuccess) {
    console.error('Não foi possível logar para continuar a demonstração.');
    return;
  }

  console.log('Login confirmado. Iniciando navegação demonstrativa...');
  
  // Aguarda um pouco para o usuário ver a tela inicial
  await page.waitForTimeout(3000);

  try {
    console.log('Procurando elementos interativos para demonstrar o mouse...');
    
    // Simplificando a movimentação para evitar erro interno da biblioteca ghost-cursor
    // Em vez de usar cursor.moveTo (que pode tentar acessar propriedades internas do browser),
    // vamos usar page.mouse.move para movimentos simples se o cursor falhar,
    // ou tentar usar o cursor de forma mais segura.

    try {
        await cursor.moveTo({ x: 100, y: 100 });
        await page.waitForTimeout(1000);
        await cursor.moveTo({ x: 500, y: 400 });
        await page.waitForTimeout(1000);
    } catch (e) {
        console.log('Movimento complexo falhou, usando movimento simples...');
        await page.mouse.move(100, 100);
        await page.waitForTimeout(1000);
        await page.mouse.move(500, 400);
    }

    // Seletores genéricos para menus laterais ou superiores
    const menuSelectors = [
      'nav a', 
      '.sidebar a', 
      '.menu-item', 
      'button', 
      'a[href*="dashboard"]'
    ];

    // Tenta encontrar elementos visíveis e passar o mouse sobre eles (Hover)
    for (const selector of menuSelectors) {
      // Usar locator em vez de $$ para melhor compatibilidade
      const locator = page.locator(selector).first();
      
      if (await locator.isVisible()) {
        console.log(`Interagindo com elemento: ${selector}`);
        
        const box = await locator.boundingBox();
        if (box) {
            try {
                // Tenta mover com ghost-cursor
                await cursor.move({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
            } catch (e) {
                // Fallback para mouse nativo se der erro
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            }
            await page.waitForTimeout(1500);
        }
      }
    }

    console.log('Demonstração de navegação concluída.');

  } catch (error) {
    console.error('Erro durante a navegação demonstrativa:', error);
  }
}
