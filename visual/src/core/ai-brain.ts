import { Intent, IntentType, AIContext, NLPResult } from './types';
import { NLPProcessor } from './nlp-processor';
import { v4 as uuidv4 } from 'uuid';

class AIBrain {
  private nlpProcessor: NLPProcessor;
  private context: AIContext;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private useOpenAI: boolean;

  constructor() {
    this.nlpProcessor = new NLPProcessor();
    this.useOpenAI = !!process.env.OPENAI_API_KEY;
    this.context = {
      lastUrl: '',
      lastAction: '',
      memory: {},
      conversationHistory: []
    };
  }

  /**
   * Interpreta uma mensagem do usuário
   */
  public async interpret(query: string): Promise<Intent> {
    console.log(`[AIBrain] Interpretando: ${query}`);

    // Adicionar ao histórico
    this.conversationHistory.push({
      role: 'user',
      content: query
    });

    try {
      if (this.useOpenAI) {
        return await this.interpretWithOpenAI(query);
      } else {
        return this.interpretWithRegex(query);
      }
    } catch (error) {
      console.error(`[AIBrain] Erro ao interpretar, usando fallback: ${error}`);
      return this.interpretWithRegex(query);
    }
  }

  /**
   * Interpreta com OpenAI
   */
  private async interpretWithOpenAI(query: string): Promise<Intent> {
    try {
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const systemPrompt = `Você é o Comet, um agente autônomo conversacional especializado em gestão de compras hospitalar.

Analise a mensagem do usuário e retorne um JSON com a intenção detectada:
{
  "type": "NAVIGATE|CREATE_PURCHASE_ORDER|LIST_DEMANDS|GENERATE_REPORT|FILL_FORM|OPEN_APP|CHECK_STATUS|UNKNOWN",
  "confidence": 0.95,
  "params": {
    "quantity": 10,
    "item": "luvas cirúrgicas",
    "department": "administrativo"
  }
}

Seja preciso e sempre retorne um JSON válido.`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...this.conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return this.interpretWithRegex(query);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        type: (parsed.type || 'UNKNOWN') as IntentType,
        confidence: parsed.confidence || 0.7,
        params: parsed.params || {},
        originalQuery: query
      };
    } catch (error) {
      console.warn(`[AIBrain] Erro ao usar OpenAI: ${error}`);
      return this.interpretWithRegex(query);
    }
  }

  /**
   * Interpreta com regex (fallback)
   */
  private interpretWithRegex(query: string): Intent {
    const normalizedQuery = query.toLowerCase().trim();
    const params: Record<string, any> = {};

    // Abrir Aplicativo (OS Level)
    if (normalizedQuery.startsWith('abrir ') || normalizedQuery.startsWith('iniciar ') || normalizedQuery.startsWith('executar ')) {
      const appName = query.split(' ').slice(1).join(' ');
      return {
        type: 'OPEN_APP',
        confidence: 0.95,
        params: { appName },
        originalQuery: query
      };
    }

    // Verificar Status
    if (normalizedQuery.includes('status') || normalizedQuery.includes('estado') || normalizedQuery.includes('saúde') || normalizedQuery.includes('conectado')) {
      return {
        type: 'CHECK_STATUS',
        confidence: 0.95,
        params: {},
        originalQuery: query
      };
    }

    // Navegação
    if (normalizedQuery.startsWith('ver ') || normalizedQuery.startsWith('navegar ') || normalizedQuery.startsWith('ir para ')) {
      const url = query.split(' ').slice(1).join(' ');
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      return {
        type: 'NAVIGATE',
        confidence: 0.95,
        params: { url: targetUrl },
        originalQuery: query
      };
    }

    // Criar Pedido de Compra
    if (normalizedQuery.includes('comprar') || normalizedQuery.includes('pedido') || normalizedQuery.includes('luvas') || normalizedQuery.includes('máscaras')) {
      const quantityMatch = normalizedQuery.match(/(\d+)/);
      const itemMatch = normalizedQuery.match(/(?:de|para)\s+(.+)/);

      if (quantityMatch) {
        params.quantity = quantityMatch[1];
      }
      if (itemMatch) {
        params.item = itemMatch[1].trim();
      }

      return {
        type: 'CREATE_PURCHASE_ORDER',
        confidence: 0.85,
        params,
        originalQuery: query
      };
    }

    // Listar Demandas
    if (normalizedQuery.includes('demanda') || normalizedQuery.includes('aberta') || normalizedQuery.includes('mostre')) {
      const deptMatch = normalizedQuery.match(/(administrativo|financeiro|rh|operacional|logística)/i);
      if (deptMatch) {
        params.department = deptMatch[1];
      }

      return {
        type: 'LIST_DEMANDS',
        confidence: 0.8,
        params,
        originalQuery: query
      };
    }

    // Gerar Relatório
    if (normalizedQuery.includes('relatório') || normalizedQuery.includes('relatorio') || normalizedQuery.includes('gere')) {
      const periodMatch = normalizedQuery.match(/(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|mês|semana|ano)/i);
      if (periodMatch) {
        params.period = periodMatch[1];
      }

      return {
        type: 'GENERATE_REPORT',
        confidence: 0.8,
        params,
        originalQuery: query
      };
    }

    // Preencher Formulário
    if (normalizedQuery.includes('preencher') || normalizedQuery.includes('cadastrar')) {
      return {
        type: 'FILL_FORM',
        confidence: 0.7,
        params,
        originalQuery: query
      };
    }

    return {
      type: 'UNKNOWN',
      confidence: 0,
      params,
      originalQuery: query
    };
  }

  /**
   * Processa NLP avançado
   */
  public async processNLP(message: string): Promise<NLPResult> {
    return await this.nlpProcessor.processMessage(message);
  }

  /**
   * Atualiza contexto
   */
  public updateContext(url: string, action: string, data?: Record<string, any>): void {
    this.context.lastUrl = url;
    this.context.lastAction = action;
    if (data) {
      this.context.memory = { ...this.context.memory, ...data };
    }
  }

  /**
   * Obtém contexto
   */
  public getContext(): AIContext {
    return { ...this.context };
  }

  /**
   * Obtém histórico de conversa
   */
  public getConversationHistory(): Array<{ role: string; content: string }> {
    return [...this.conversationHistory];
  }

  /**
   * Limpa histórico
   */
  public clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Adiciona resposta ao histórico
   */
  public addResponse(content: string): void {
    this.conversationHistory.push({
      role: 'assistant',
      content
    });

    // Manter histórico limitado
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  /**
   * Gera resposta conversacional
   */
  public async generateResponse(query: string): Promise<string> {
    if (!this.useOpenAI) {
      return `Entendi sua solicitação: "${query}". Processando...`;
    }

    try {
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const systemPrompt = `Você é o Comet, um agente autônomo conversacional especializado em gestão de compras hospitalar.
Suas responsabilidades:
1. Entender solicitações em linguagem natural
2. Executar tarefas automaticamente
3. Fornecer informações estruturadas
4. Confirmar ações executadas
5. Sugerir melhorias

Seja conciso mas informativo. Sempre confirme as ações que vai executar.`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...this.conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
    } catch (error) {
      console.error(`[AIBrain] Erro ao gerar resposta: ${error}`);
      return `Processando sua solicitação: "${query}"`;
    }
  }
}

const aiBrainInstance = new AIBrain();
export { AIBrain };
export default aiBrainInstance;
