import { NLPResult, Entity, Intent, IntentType } from './types';

class NLPProcessor {
  private model: string;
  private useOpenAI: boolean;

  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    this.useOpenAI = !!process.env.OPENAI_API_KEY;
  }

  /**
   * Processa mensagem em linguagem natural e extrai intenção e entidades
   */
  async processMessage(message: string): Promise<NLPResult> {
    console.log(`[NLP] Processando mensagem: ${message}`);

    try {
      if (this.useOpenAI) {
        return await this.processWithOpenAI(message);
      } else {
        return this.processWithRegex(message);
      }
    } catch (error) {
      console.error(`[NLP] Erro ao processar mensagem: ${error}`);
      return this.processWithRegex(message);
    }
  }

  /**
   * Processa com OpenAI (quando disponível)
   */
  private async processWithOpenAI(message: string): Promise<NLPResult> {
    try {
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const systemPrompt = `Você é um assistente especializado em análise de linguagem natural para um sistema de gestão de compras hospitalar.
      
Analise a mensagem do usuário e retorne um JSON com a seguinte estrutura:
{
  "intent": "criar_pedido|listar_demandas|gerar_relatorio|outro",
  "entities": [
    {
      "type": "item|quantidade|departamento|periodo|outro",
      "value": "valor extraído",
      "confidence": 0.95
    }
  ],
  "confidence": 0.95,
  "requiredActions": ["navigate", "fill_form", "click_button", "submit_form"],
  "parameters": {
    "chave": "valor"
  }
}

Seja preciso na extração de entidades e sempre retorne um JSON válido.`;

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        return this.processWithRegex(message);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        intent: parsed.intent || 'unknown',
        entities: (parsed.entities || []).map((e: any) => ({
          type: e.type,
          value: e.value,
          confidence: e.confidence || 0.8
        })),
        confidence: parsed.confidence || 0.8,
        requiredActions: parsed.requiredActions || [],
        parameters: parsed.parameters || {}
      };
    } catch (error) {
      console.warn(`[NLP] Erro ao usar OpenAI, caindo para regex: ${error}`);
      return this.processWithRegex(message);
    }
  }

  /**
   * Processa com regex (fallback)
   */
  private processWithRegex(message: string): NLPResult {
    const normalizedMsg = message.toLowerCase().trim();
    const entities: Entity[] = [];
    let intent = 'unknown';
    const parameters: Record<string, any> = {};

    // Detectar intenção
    if (normalizedMsg.includes('comprar') || normalizedMsg.includes('pedido')) {
      intent = 'criar_pedido';
    } else if (normalizedMsg.includes('demanda') || normalizedMsg.includes('aberta')) {
      intent = 'listar_demandas';
    } else if (normalizedMsg.includes('relatório') || normalizedMsg.includes('relatorio')) {
      intent = 'gerar_relatorio';
    }

    // Extrair quantidade
    const quantityMatch = message.match(/(\d+)\s*(luvas|itens?|unidades?|peças?|máscaras?|seringas?)/i);
    if (quantityMatch) {
      entities.push({
        type: 'quantidade',
        value: quantityMatch[1],
        confidence: 0.95
      });
      parameters.quantity = parseInt(quantityMatch[1]);
      parameters.item = quantityMatch[2];
    }

    // Extrair departamento
    const departmentMatch = message.match(/(administrativo|financeiro|rh|operacional|logística|compras)/i);
    if (departmentMatch) {
      entities.push({
        type: 'departamento',
        value: departmentMatch[1],
        confidence: 0.9
      });
      parameters.department = departmentMatch[1];
    }

    // Extrair período
    const periodMatch = message.match(/(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|mês|semana|ano)/i);
    if (periodMatch) {
      entities.push({
        type: 'periodo',
        value: periodMatch[1],
        confidence: 0.85
      });
      parameters.period = periodMatch[1];
    }

    return {
      intent,
      entities,
      confidence: entities.length > 0 ? 0.85 : 0.5,
      requiredActions: this.mapIntentToActions(intent),
      parameters
    };
  }

  /**
   * Mapeia intenção para ações necessárias
   */
  private mapIntentToActions(intent: string): string[] {
    const actionMap: Record<string, string[]> = {
      'criar_pedido': ['navigate', 'fill_form', 'click_button', 'submit_form'],
      'listar_demandas': ['navigate', 'wait', 'extract_data'],
      'gerar_relatorio': ['navigate', 'click_button', 'wait', 'extract_data'],
      'unknown': []
    };

    return actionMap[intent] || [];
  }

  /**
   * Valida se a mensagem é compreensível
   */
  isValidMessage(message: string): boolean {
    const isValid = message && message.trim().length > 0 && message.length < 5000;
    return !!isValid;
  }

  /**
   * Extrai parâmetros específicos
   */
  extractParameters(message: string, intent: string): Record<string, any> {
    const params: Record<string, any> = {};

    // Extrair quantidade
    const quantityMatch = message.match(/(\d+)\s*(luvas|itens?|unidades?|peças?)/i);
    if (quantityMatch) {
      params.quantity = parseInt(quantityMatch[1]);
      params.item = quantityMatch[2];
    }

    // Extrair departamento
    const departmentMatch = message.match(/(administrativo|financeiro|rh|operacional|logística)/i);
    if (departmentMatch) {
      params.department = departmentMatch[1];
    }

    // Extrair período
    const periodMatch = message.match(/(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|mês|semana|ano)/i);
    if (periodMatch) {
      params.period = periodMatch[1];
    }

    return params;
  }
}

const nlpProcessorInstance = new NLPProcessor();
export { NLPProcessor };
export default nlpProcessorInstance;
