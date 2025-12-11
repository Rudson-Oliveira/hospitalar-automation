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
    // Tenta identificar elementos de menu comuns para interagir
    // Seletores genéricos para menus laterais ou superiores
    const menuSelectors = [
      'nav a', 
      '.sidebar a', 
      '.menu-item', 
      'button', 
      'a[href*="dashboard"]',
      'a[href*="agenda"]',
      'a[href*="paciente"]'
    ];

    console.log('Procurando elementos interativos para demonstrar o mouse...');
    
    // Move o mouse aleatoriamente pela tela para mostrar "vida"
    await cursor.moveTo({ x: 100, y: 100 });
    await page.waitForTimeout(1000);
    await cursor.moveTo({ x: 800, y: 600 });
    await page.waitForTimeout(1000);

    // Tenta encontrar elementos visíveis e passar o mouse sobre eles (Hover)
    for (const selector of menuSelectors) {
      const elements = await page.$$(selector);
      
      if (elements.length > 0) {
        console.log(`Encontrados ${elements.length} elementos para o seletor "${selector}". Interagindo com alguns...`);
        
        // Interage com até 3 elementos de cada tipo
        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          const box = await elements[i].boundingBox();
          if (box) {
            // Move até o elemento
            await cursor.move({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
            
            // Pausa para "ler" o tooltip ou ver o efeito hover
            await page.waitForTimeout(1500);
            
            // Opcional: Clicar (vamos evitar clicar para não alterar dados por enquanto, apenas hover)
            // await cursor.click(); 
          }
        }
      }
    }

    console.log('Demonstração de navegação concluída.');

  } catch (error) {
    console.error('Erro durante a navegação demonstrativa:', error);
  }
}
