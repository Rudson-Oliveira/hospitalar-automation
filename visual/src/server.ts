import express, { Request, Response } from 'express';
import { chromium, Browser, Page } from 'playwright';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import aiBrainInstance from './core/ai-brain.js';
import taskOrchestratorInstance from './core/task-orchestrator.js';
import { ActionExecutor } from './core/action-executor.js';
import { UserMessage, AgentResponse, Task } from './core/types.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variáveis globais
let browser: Browser | null = null;
let page: Page | null = null;
let actionExecutor: ActionExecutor | null = null;
const responseCache = new Map<string, AgentResponse>();
const taskCache = new Map<string, Task>();

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
    console.log('[SERVER] Navegador inicializado');
  }
}

/**
 * Fecha o navegador
 */
async function closeBrowser(): Promise<void> {
  if (browser) {
    console.log('[SERVER] Fechando navegador...');
    await browser.close();
    browser = null;
    page = null;
    actionExecutor = null;
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
    const { content, userId, context } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Campo "content" é obrigatório'
      });
    }

    console.log(`[API] Recebida mensagem: ${content}`);

    const messageId = uuidv4();

    // 1. Interpretar mensagem
    const intent = await aiBrainInstance.interpret(content);
    console.log(`[API] Intenção detectada: ${intent.type} (${intent.confidence})`);

    // 2. Planejar tarefa
    const task = taskOrchestratorInstance.planTask(intent);
    taskCache.set(task.id, task);

    // 3. Executar tarefa
    try {
      await initBrowser();

      if (page && actionExecutor) {
        const executedTask = await actionExecutor.executeTask(task);
        taskCache.set(executedTask.id, executedTask);

        // 4. Gerar resposta
        const response: AgentResponse = {
          id: uuidv4(),
          messageId,
          content: `Tarefa executada: ${executedTask.name}. Status: ${executedTask.status}`,
          actions: executedTask.steps,
          status: executedTask.status === 'COMPLETED' ? 'success' : 'error',
          error: executedTask.error,
          timestamp: new Date(),
          executionTime: executedTask.executionTime || 0
        };

        responseCache.set(response.id, response);

        res.json({
          success: true,
          response,
          task: executedTask
        });
      } else {
        throw new Error('Navegador não inicializado');
      }
    } catch (error) {
      console.error(`[API] Erro ao executar tarefa: ${error}`);
      res.status(500).json({
        error: `Erro ao executar tarefa: ${String(error)}`,
        taskId: task.id
      });
    }
  } catch (error) {
    console.error(`[API] Erro ao processar mensagem: ${error}`);
    res.status(500).json({
      error: `Erro ao processar mensagem: ${String(error)}`
    });
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
 * Tratamento de erro 404
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method
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
