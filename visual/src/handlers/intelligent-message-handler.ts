/**
 * Handler Inteligente de Mensagens usando Abacus.AI
 * Processa comandos do usuário e executa ações autonomamente
 */

import { AbacusAI, initializeAbacus, getAbacusInstance } from '../ai/abacus-integration';

// API Key do Abacus.AI (deve ser configurada via variável de ambiente)
const ABACUS_API_KEY = process.env.ABACUS_API_KEY || 's2_c2aed0ec61b540cba3cc8858934a2084';

// Inicializar Abacus.AI
let abacus: AbacusAI;

export function initializeIntelligentHandler() {
  abacus = initializeAbacus(ABACUS_API_KEY);
  console.log('[IntelligentHandler] Abacus.AI initialized');
}

export interface MessageRequest {
  content: string;
  userId?: string;
  sessionId?: string;
}

export interface MessageResponse {
  success: boolean;
  response: {
    content: string;
    action?: any;
    reasoning?: string;
  };
  error?: string;
}

/**
 * Processa mensagem do usuário com inteligência Abacus.AI
 */
export async function handleIntelligentMessage(req: MessageRequest): Promise<MessageResponse> {
  try {
    if (!abacus) {
      initializeIntelligentHandler();
    }

    const userMessage = req.content;
    console.log('[IntelligentHandler] Processing message:', userMessage);

    // Processar com Abacus.AI
    const result = await abacus.processMessage(userMessage);

    if (!result.success) {
      return {
        success: false,
        response: {
          content: 'Desculpe, tive um erro ao processar sua mensagem.'
        },
        error: result.error
      };
    }

    // Se há ação a executar
    if (result.action) {
      console.log('[IntelligentHandler] Executing action:', result.action.type);
      
      try {
        // Executar ação
        const actionResult = await abacus.executeAction(result.action);
        
        // Responder com resultado
        return {
          success: true,
          response: {
            content: result.reasoning || `Ação executada: ${result.action.type}`,
            action: result.action,
            reasoning: result.reasoning
          }
        };
      } catch (error: any) {
        console.error('[IntelligentHandler] Action execution error:', error);
        return {
          success: false,
          response: {
            content: `Erro ao executar ação: ${error.message}`
          },
          error: error.message
        };
      }
    }

    // Resposta em texto (sem ação)
    return {
      success: true,
      response: {
        content: result.response || 'Entendi sua mensagem.'
      }
    };
  } catch (error: any) {
    console.error('[IntelligentHandler] Error:', error);
    return {
      success: false,
      response: {
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.'
      },
      error: error.message
    };
  }
}

/**
 * Limpa histórico de conversação
 */
export function clearConversationHistory() {
  if (abacus) {
    abacus.clearHistory();
  }
}

/**
 * Obtém histórico de conversação
 */
export function getConversationHistory() {
  if (abacus) {
    return abacus.getHistory();
  }
  return [];
}
