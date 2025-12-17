/**
 * Integração Abacus.AI para Agente COMET Hospitalar
 * Fornece inteligência autônoma para tomada de decisão e execução de tarefas
 */

interface AbacusConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

interface AbacusMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AbacusResponse {
  success: boolean;
  response?: string;
  action?: {
    type: 'navigate' | 'click' | 'input' | 'extract' | 'wait';
    params: any;
  };
  reasoning?: string;
  error?: string;
}

export class AbacusAI {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private conversationHistory: AbacusMessage[] = [];

  constructor(config: AbacusConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://routellm.abacus.ai';
    this.model = config.model || 'gpt-4';
    
    // System prompt para contexto do agente COMET
    this.conversationHistory.push({
      role: 'system',
      content: `Você é o Agente COMET, um assistente autônomo especializado em automação do sistema Hospitalar Saúde (dev.hospitalarsaude.app.br).

Suas capacidades:
1. Navegar autonomamente em sites e sistemas web
2. Fazer login automaticamente
3. Preencher formulários
4. Clicar em botões e links
5. Extrair informações de páginas
6. Executar fluxos complexos de trabalho

Quando receber um comando do usuário, você deve:
1. Analisar a intenção do usuário
2. Decidir qual ação executar
3. Retornar a ação em formato JSON

Formato de resposta:
{
  "action": {
    "type": "navigate" | "click" | "input" | "extract" | "wait",
    "params": { ... }
  },
  "reasoning": "Explicação da decisão"
}

Exemplos:
- "Entre no sistema" → {"action": {"type": "navigate", "params": {"url": "https://dev.hospitalarsaude.app.br"}}, "reasoning": "Navegar para tela de login"}
- "Faça login com email X e senha Y" → {"action": {"type": "input", "params": {"field": "email", "value": "X"}}, "reasoning": "Preencher campo de email"}
- "Crie um pedido de compra" → {"action": {"type": "navigate", "params": {"url": "https://dev.hospitalarsaude.app.br/#/pedidos/novo"}}, "reasoning": "Navegar para página de novo pedido"}

Sistema Hospitalar - Estrutura conhecida:
- Login: https://dev.hospitalarsaude.app.br/#/login
- Dashboard: https://dev.hospitalarsaude.app.br/#/dashboard/home
- Pedidos: https://dev.hospitalarsaude.app.br/#/pedidos
- Relatórios: https://dev.hospitalarsaude.app.br/#/relatorios

Seja preciso, objetivo e sempre retorne ações executáveis.`
    });
  }

  /**
   * Processa mensagem do usuário e decide ação
   */
  async processMessage(userMessage: string): Promise<AbacusResponse> {
    try {
      // Adicionar mensagem do usuário ao histórico
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Chamar API Abacus.AI
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Abacus API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Adicionar resposta ao histórico
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Tentar parsear como JSON (ação)
      try {
        const actionData = JSON.parse(assistantMessage);
        return {
          success: true,
          response: assistantMessage,
          action: actionData.action,
          reasoning: actionData.reasoning
        };
      } catch {
        // Se não for JSON, é uma resposta em texto
        return {
          success: true,
          response: assistantMessage
        };
      }
    } catch (error: any) {
      console.error('[AbacusAI] Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Executa ação decidida pela IA
   */
  async executeAction(action: any): Promise<any> {
    switch (action.type) {
      case 'navigate':
        return await this.navigate(action.params.url);
      
      case 'click':
        return await this.click(action.params.selector || action.params.text);
      
      case 'input':
        return await this.input(action.params.field, action.params.value);
      
      case 'extract':
        return await this.extract(action.params.selector);
      
      case 'wait':
        return await this.wait(action.params.ms || 1000);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Navega para URL
   */
  private async navigate(url: string): Promise<any> {
    const response = await fetch('/agent/navigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return await response.json();
  }

  /**
   * Clica em elemento
   */
  private async click(selector: string): Promise<any> {
    const response = await fetch('/agent/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selector })
    });
    return await response.json();
  }

  /**
   * Preenche campo
   */
  private async input(field: string, value: string): Promise<any> {
    const response = await fetch('/agent/input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value })
    });
    return await response.json();
  }

  /**
   * Extrai informação
   */
  private async extract(selector: string): Promise<any> {
    const response = await fetch('/agent/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selector })
    });
    return await response.json();
  }

  /**
   * Aguarda tempo
   */
  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Limpa histórico de conversação
   */
  clearHistory(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Manter apenas system prompt
  }

  /**
   * Obtém histórico de conversação
   */
  getHistory(): AbacusMessage[] {
    return [...this.conversationHistory];
  }
}

// Exportar instância singleton
let abacusInstance: AbacusAI | null = null;

export function initializeAbacus(apiKey: string): AbacusAI {
  abacusInstance = new AbacusAI({ apiKey });
  return abacusInstance;
}

export function getAbacusInstance(): AbacusAI | null {
  return abacusInstance;
}
