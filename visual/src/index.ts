import { createAgentBrowser, closeAgentBrowser } from './utils/browser';
import { performLogin } from './actions/login';
import { runDemo } from './actions/demo';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Iniciando Agente de Automação Hospitalar...');
  
  // Pega argumentos da linha de comando
  const args = process.argv.slice(2);
  const mode = args[0] || 'login'; // default para login

  // Configuração headless via .env
  // IMPORTANTE: Para ver o mouse, HEADLESS deve ser false no .env local do usuário
  const headless = process.env.HEADLESS === 'true';
  
  console.log(`Modo de execução: ${mode}`);
  console.log(`Headless: ${headless}`);

  const agent = await createAgentBrowser(headless);
  
  try {
    if (mode === 'demo') {
      await runDemo(agent.page, agent.cursor);
    } else {
      // Modo padrão: apenas teste de login
      const success = await performLogin(agent.page, agent.cursor);
      if (success) {
        console.log('Teste de login concluído com SUCESSO.');
        await agent.page.screenshot({ path: 'results/login_success.png' });
      } else {
        console.log('Teste de login FALHOU.');
      }
    }
  } catch (error) {
    console.error('Erro fatal na execução:', error);
  } finally {
    // Em modo demo, talvez queiramos deixar aberto um pouco mais?
    // Por enquanto fecha para encerrar o processo limpo
    await closeAgentBrowser(agent);
  }
}

main();
