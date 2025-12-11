import { Page } from 'playwright';
import { GhostCursor } from 'ghost-cursor';
import * as dotenv from 'dotenv';

dotenv.config();

export async function performLogin(page: Page, cursor: GhostCursor): Promise<boolean> {
  const url = process.env.HOSPITAL_URL || 'https://dev.hospitalarsaude.app.br';
  const username = process.env.HOSPITAL_USER;
  const password = process.env.HOSPITAL_PASS;

  if (!username || !password) {
    console.error('Erro: Credenciais não encontradas no arquivo .env');
    return false;
  }

  console.log(`Navegando para: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.log('Timeout ou erro de rede ao carregar página, tentando continuar...');
  }

  try {
    // Seletores mais específicos baseados no screenshot
    // O botão "ENTRAR" parece ser um botão padrão, vamos tentar pegar pelo texto exato
    const userSelector = 'input[type="email"]'; // Parece ser type email
    const passSelector = 'input[type="password"]';
    const loginButtonSelector = 'button:has-text("ENTRAR")'; // Texto em maiúsculo conforme screenshot

    console.log('Aguardando campo de usuário...');
    await page.waitForSelector(userSelector, { state: 'visible', timeout: 20000 });

    // Movimento humanizado e preenchimento
    console.log('Preenchendo usuário...');
    try {
        // Tentar clicar no centro do elemento para evitar problemas de borda
        const userBox = await page.locator(userSelector).boundingBox();
        if (userBox) {
            await cursor.move({ x: userBox.x + userBox.width / 2, y: userBox.y + userBox.height / 2 });
            await cursor.click();
        } else {
            await page.click(userSelector);
        }
    } catch (cursorError) {
        console.warn('Ghost cursor falhou no clique do usuário, usando clique nativo');
        await page.click(userSelector);
    }
    
    // Limpar campo antes de digitar (caso tenha algo preenchido)
    await page.fill(userSelector, '');
    // Usar fill para garantir que o texto completo seja colado, evitando problemas com caracteres especiais
    await page.fill(userSelector, username); 

    console.log('Aguardando campo de senha...');
    await page.waitForSelector(passSelector, { state: 'visible' });
    
    console.log('Preenchendo senha...');
    try {
        const passBox = await page.locator(passSelector).boundingBox();
        if (passBox) {
            await cursor.move({ x: passBox.x + passBox.width / 2, y: passBox.y + passBox.height / 2 });
            await cursor.click();
        } else {
            await page.click(passSelector);
        }
    } catch (cursorError) {
        console.warn('Ghost cursor falhou no clique da senha, usando clique nativo');
        await page.click(passSelector);
    }
    await page.fill(passSelector, '');
    // Usar fill para garantir que a senha completa (incluindo ##) seja inserida corretamente
    await page.fill(passSelector, password);

    console.log('Aguardando botão de login...');
    await page.waitForSelector(loginButtonSelector, { state: 'visible' });

    console.log('Clicando em entrar...');
    try {
        const btnBox = await page.locator(loginButtonSelector).boundingBox();
        if (btnBox) {
            await cursor.move({ x: btnBox.x + btnBox.width / 2, y: btnBox.y + btnBox.height / 2 });
            await cursor.click();
        } else {
            await page.click(loginButtonSelector);
        }
    } catch (cursorError) {
        console.warn('Ghost cursor falhou no clique do botão, usando clique nativo');
        await page.click(loginButtonSelector);
    }

    // Aguardar navegação
    console.log('Aguardando redirecionamento...');
    
    // Esperar por qualquer mudança na URL ou aparecimento de elemento do dashboard
    try {
        await Promise.race([
            page.waitForURL((url) => !url.toString().includes('login') && !url.toString().endsWith('/#/'), { timeout: 20000 }),
            page.waitForSelector('.dashboard-container, .sidebar, .menu, header', { timeout: 20000 }) // Seletores genéricos de dashboard
        ]);
        console.log('Navegação detectada ou elemento de dashboard encontrado.');
    } catch (e) {
        console.log('Timeout aguardando mudança de estado. Verificando URL atual...');
    }
    
    // Tira screenshot final para verificação
    await page.screenshot({ path: 'results/login_attempt_v2.png' });
    
    const currentUrl = page.url();
    console.log(`URL Final: ${currentUrl}`);

    // Verifica se saiu da raiz ou login
    if (currentUrl.includes('dashboard') || currentUrl.includes('home') || (currentUrl !== url && !currentUrl.includes('login'))) {
        console.log('Login realizado com sucesso!');
        return true;
    } else {
        console.log('Não foi possível confirmar o login pela URL. Verifique o screenshot.');
        return false;
    }

  } catch (error) {
    console.error('Falha no login:', error);
    await page.screenshot({ path: 'results/login_error_v2.png' });
    return false;
  }
}
