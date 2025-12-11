import { createAgentBrowser, closeAgentBrowser } from './utils/browser';
import { performLogin } from './actions/login';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Iniciando Agente de Automação Hospitalar...');
  
  // Configuração headless via .env (padrão false para ver o browser se possível, mas no sandbox será headless)
  const headless = process.env.HEADLESS === 'true';
  
  const agent = await createAgentBrowser(true); // Forçando headless true no sandbox
  
  try {
    const success = await performLogin(agent.page, agent.cursor);
    
    if (success) {
      console.log('Teste de login concluído com SUCESSO.');
      // Tira um screenshot do sucesso
      await agent.page.screenshot({ path: 'results/login_success.png' });
    } else {
      console.log('Teste de login FALHOU.');
    }
  } catch (error) {
    console.error('Erro fatal na execução:', error);
  } finally {
    await closeAgentBrowser(agent);
  }
}

main();
