import express, { Request, Response } from 'express';
import path from 'path';
import { chromium, Browser, Page } from 'playwright';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import aiBrainInstance from './core/ai-brain';
import taskOrchestratorInstance from './core/task-orchestrator';
import { ActionExecutor } from './core/action-executor';
import { UserMessage, AgentResponse, Task } from './core/types';
import { NavigateHandler } from './handlers/navigate-handler';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
const distPath = path.join(__dirname, '../dist');
console.log(`[SERVER] Servindo arquivos estáticos de: ${distPath}`);
// Forçar cache-control para evitar cache de arquivos antigos
app.use(express.static(distPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Variáveis globais
let browser: Browser | null = null;
let page: Page | null = null;
let actionExecutor: ActionExecutor | null = null;
let navigateHandler: NavigateHandler | null = null;
const responseCache = new Map<string, AgentResponse>();
const taskCache = new Map<string, Task>();

// Fila de comandos para o agente desktop (Polling)
let commandQueue: string[] = [];

/**
 * Inicializa o navegador
 */
async function initBrowser(): Promise<void> {
  if (!browser) {
    console.log('[SERVER] Inicializando navegador...');
    browser = await chromium.launch({
      headless: process.env.HEADLESS_BROWSER !== 'false'
    });
    page = await browser.newPage();
    actionExecutor = new ActionExecutor(page);
    navigateHandler = new NavigateHandler(page, browser);
    console.log('[SERVER] Navegador inicializado');
  }
}

/**
 * Fecha o navegador
 */
async function closeBrowser(): Promise<void> {
  if (browser) {
    console.log('[SERVER] Fechando navegador...');
    if (navigateHandler) {
      await navigateHandler.closePage();
    }
    await browser.close();
    browser = null;
    page = null;
    actionExecutor = null;
    navigateHandler = null;
  }
}

/**
 * Health check
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    browserActive: browser !== null
  });
});

/**
 * Informações do agente
 */
app.get('/agent/info', (req: Request, res: Response) => {
  res.json({
    name: 'Comet',
    version: '2.0.0',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    capabilities: [
      'Criar pedidos de compra',
      'Listar demandas',
      'Gerar relatórios',
      'Navegação automática',
      'Preenchimento de formulários',
      'Extração de dados'
    ],
    status: 'active',
    hasOpenAI: !!process.env.OPENAI_API_KEY
  });
});

/**
 * Processar mensagem do usuário
 */
app.post('/agent/message', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Campo "content" é obrigatório' });
    }

    console.log(`[API] Recebida mensagem: ${content}`);

    // Verificar se é comando para criar rotina
    if (content.toLowerCase().includes('criar rotina')) {
      commandQueue.push('create-routine');
      console.log('[API] Comando "create-routine" adicionado à fila');
      
      return res.json({
        success: true,
        response: {
          id: uuidv4(),
          content: '📝 Comando enviado! O agente está criando sua rotina no Obsidian...',
          status: 'success',
          timestamp: new Date()
        }
      });
    }

    // Resposta padrão para outros comandos
    res.json({
      success: true,
      response: {
        id: uuidv4(),
        content: `Recebi sua mensagem: "${content}". Por enquanto, só sei "Criar rotina".`,
        status: 'success',
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error(`[API] Erro ao processar mensagem: ${error}`);
    res.status(500).json({ error: String(error) });
  }
});

/**
 * Endpoint de Polling para o Agente Desktop
 */
app.get('/api/agent/poll', (req: Request, res: Response) => {
  if (commandQueue.length > 0) {
    const command = commandQueue.shift();
    console.log(`[POLL] Enviando comando para agente: ${command}`);
    res.json({ command });
  } else {
    res.json({ status: 'no-command' });
  }
});

/**
 * Obter resposta anterior
 */
app.get('/agent/response/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const response = responseCache.get(id);

  if (!response) {
    return res.status(404).json({
      error: 'Resposta não encontrada'
    });
  }

  res.json(response);
});

/**
 * Obter status de tarefa
 */
app.get('/agent/task/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = taskCache.get(id);

  if (!task) {
    return res.status(404).json({
      error: 'Tarefa não encontrada'
    });
  }

  res.json(task);
});

/**
 * Histórico de conversa
 */
app.get('/agent/history', (req: Request, res: Response) => {
  const history = aiBrainInstance.getConversationHistory();
  res.json({
    messages: history,
    count: history.length
  });
});

/**
 * Limpar histórico
 */
app.post('/agent/history/clear', (req: Request, res: Response) => {
  aiBrainInstance.clearConversationHistory();
  res.json({
    success: true,
    message: 'Histórico limpo com sucesso'
  });
});

/**
 * Listar testes disponíveis
 */
app.get('/agent/tests', (req: Request, res: Response) => {
  const tests = [
    {
      id: 1,
      command: 'Crie um pedido de compra para 10 luvas cirúrgicas',
      description: 'Testa criação de pedido de compra'
    },
    {
      id: 2,
      command: 'Mostre as demandas abertas do setor administrativo',
      description: 'Testa listagem de demandas filtradas'
    },
    {
      id: 3,
      command: 'Gere um relatório de compras do mês',
      description: 'Testa geração de relatório'
    },
    {
      id: 4,
      command: 'Navegar para https://google.com',
      description: 'Testa navegação simples'
    },
    {
      id: 5,
      command: 'Crie 5 pedidos para 100 máscaras cada',
      description: 'Testa criação em lote'
    }
  ];

  res.json({
    tests,
    total: tests.length
  });
});

/**
 * Executar teste por ID
 */
app.post('/agent/tests/:id/run', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tests: Record<string, string> = {
      '1': 'Crie um pedido de compra para 10 luvas cirúrgicas',
      '2': 'Mostre as demandas abertas do setor administrativo',
      '3': 'Gere um relatório de compras do mês',
      '4': 'Navegar para https://google.com',
      '5': 'Crie 5 pedidos para 100 máscaras cada'
    };

    const command = tests[id];

    if (!command) {
      return res.status(404).json({
        error: 'Teste não encontrado'
      });
    }

    console.log(`[TEST] Executando teste ${id}: ${command}`);

    const messageId = uuidv4();

    // Interpretar e executar
    const intent = await aiBrainInstance.interpret(command);
    const task = taskOrchestratorInstance.planTask(intent);

    res.json({
      success: true,
      testId: id,
      command,
      intent,
      task
    });
  } catch (error) {
    console.error(`[TEST] Erro ao executar teste: ${error}`);
    res.status(500).json({
      error: `Erro ao executar teste: ${String(error)}`
    });
  }
});

/**
 * Iniciar navegador manualmente
 */
app.post('/browser/init', async (req: Request, res: Response) => {
  try {
    await initBrowser();
    res.json({
      success: true,
      message: 'Navegador inicializado'
    });
  } catch (error) {
    res.status(500).json({
      error: `Erro ao inicializar navegador: ${String(error)}`
    });
  }
});

/**
 * Fechar navegador manualmente
 */
app.post('/browser/close', async (req: Request, res: Response) => {
  try {
    await closeBrowser();
    res.json({
      success: true,
      message: 'Navegador fechado'
    });
  } catch (error) {
    res.status(500).json({
      error: `Erro ao fechar navegador: ${String(error)}`
    });
  }
});


/**
 * Navegar para uma URL e capturar screenshot
 */
app.post('/agent/navigate', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL nao fornecida'
      });
    }

    // Inicializar navegador se necessario
    if (!navigateHandler) {
      await initBrowser();
    }

    // Navegar
    const result = await navigateHandler!.navigate(url);

    res.json(result);
  } catch (error) {
    console.error(`[NAVIGATE] Erro: ${error}`);
    res.status(500).json({
      success: false,
      error: `Erro ao navegar: ${String(error)}`
    });
  }
});

/**
 * Tratamento de erro 404 - Redirecionar para a página inicial
 */
app.get('*', (req: Request, res: Response) => {
  // Se for uma rota desconhecida, redirecionar para /comet.html
  if (!req.path.startsWith('/assets') && !req.path.includes('.')) {
    console.log(`[SERVER] Rota desconhecida: ${req.path} - Redirecionando para /comet.html`);
    return res.redirect('/comet.html');
  }
  
  // Para arquivos estáticos não encontrados, retornar 404
  console.log(`[SERVER] Arquivo não encontrado: ${req.path}`);
  res.status(404).json({
    success: false,
    error: 'Arquivo não encontrado',
    path: req.path
  });
});

/**
 * Iniciar servidor
 */
const server = app.listen(port, () => {
  console.log(`🚀 Agente Autônomo Comet iniciado na porta ${port}`);
  console.log(`📡 API disponível em http://localhost:${port}`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🤖 Informações do agente: http://localhost:${port}/agent/info`);
  console.log(`📝 Testes disponíveis: http://localhost:${port}/agent/tests`);
});

/**
 * Tratamento de sinais de encerramento
 */
process.on('SIGINT', async () => {
  console.log('\n[SERVER] Encerrando servidor...');
  await closeBrowser();
  server.close(() => {
    console.log('[SERVER] Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('[SERVER] Encerrando servidor (SIGTERM)...');
  await closeBrowser();
  server.close(() => {
    console.log('[SERVER] Servidor encerrado');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[SERVER] Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  console.error(`[SERVER] Uncaught Exception: ${error}`);
  process.exit(1);
});

export default app;
