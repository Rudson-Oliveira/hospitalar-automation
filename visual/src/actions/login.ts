import { Page } from 'playwright';
import { captureAndAnalyze } from './vision';
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
    const userSelector = 'input[type="email"]';
    const passSelector = 'input[type="password"]';
    const loginButtonSelector = 'button:has-text("ENTRAR")';

    console.log('Aguardando campo de usuário...');
    await page.waitForSelector(userSelector, { state: 'visible', timeout: 20000 });

    // Preenchendo usuário
    console.log('Preenchendo usuário...');
    try {
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
    
    // Método infalível: Injeção direta via JS + Disparo de eventos
    await page.evaluate(({ selector, value }) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, { selector: userSelector, value: username });

    console.log('Aguardando campo de senha...');
    await page.waitForSelector(passSelector, { state: 'visible' });
    
    console.log('Preenchendo senha (Modo Injeção Direta)...');
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
    
    // Método infalível para senha também
    await page.evaluate(({ selector, value }) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, { selector: passSelector, value: password });

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
    try {
        await Promise.race([
            page.waitForURL((url) => !url.toString().includes('login') && !url.toString().endsWith('/#/'), { timeout: 20000 }),
            page.waitForSelector('.dashboard-container, .sidebar, .menu, header', { timeout: 20000 })
        ]);
        console.log('Navegação detectada ou elemento de dashboard encontrado.');
    } catch (e) {
        console.log('Timeout aguardando mudança de estado. Verificando URL atual...');
    }
    
    // Substituindo screenshot simples pela nova Visão Computacional
    console.log('Analisando o estado final da tela...');
    const visionResult = await captureAndAnalyze(page, 'pos_login');
    
    const currentUrl = page.url();
    console.log(`URL Final: ${currentUrl}`);

    // Critérios de Sucesso expandidos: URL OU Texto na tela
    const successKeywords = ['Bem-vindo', 'Dashboard', 'Painel', 'Sucesso', 'Sair', 'Logout'];
    const hasSuccessText = successKeywords.some(keyword => visionResult.textContent.includes(keyword));

    if (currentUrl.includes('dashboard') || currentUrl.includes('home') || hasSuccessText) {
        console.log('✅ Login realizado com sucesso! (Confirmado por URL ou Leitura de Tela)');
        console.log('--- CONTEÚDO LIDO NA TELA ---');
        console.log(visionResult.textContent.substring(0, 500) + '...'); // Mostra os primeiros 500 chars
        console.log('-----------------------------');
        return true;
    } else {
        console.warn('⚠️ Não foi possível confirmar o login automaticamente.');
        console.log('Verifique a imagem salva em: ' + visionResult.screenshotPath);
        return false;
    }

  } catch (error) {
    console.error('Falha no login:', error);
    await page.screenshot({ path: 'results/login_error_v3.png' });
    return false;
  }
}
