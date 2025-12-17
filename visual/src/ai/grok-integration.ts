/**
 * Grok API Integration
 * Integração com xAI Grok para reasoning avançado e code execution
 */

import axios from 'axios';

const GROK_API_URL = 'https://api.x.ai/v1';
const GROK_API_KEY = process.env.GROK_API_KEY || '';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokResponse {
  success: boolean;
  content?: string;
  reasoning?: string;
  error?: string;
}

/**
 * Classe para integração com Grok API
 */
export class GrokAI {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'grok-4-1-fast-reasoning') {
    this.apiKey = apiKey || GROK_API_KEY;
    this.model = model;
  }

  /**
   * Enviar mensagem para Grok e obter resposta com reasoning
   */
  async chat(messages: GrokMessage[]): Promise<GrokResponse> {
    try {
      console.log('[GrokAI] Enviando mensagem para Grok...');
      
      const response = await axios.post(
        `${GROK_API_URL}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 segundos
        }
      );

      const content = (response.data as any).choices[0].message.content;
      const reasoning = (response.data as any).choices[0].message.reasoning || '';

      console.log('[GrokAI] Resposta recebida:', content.substring(0, 100) + '...');

      return {
        success: true,
        content,
        reasoning
      };
    } catch (error: any) {
      console.error('[GrokAI] Erro ao chamar Grok:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Executar código Python via Grok Code Execution
   */
  async executeCode(code: string): Promise<GrokResponse> {
    try {
      console.log('[GrokAI] Executando código Python via Grok...');
      
      const messages: GrokMessage[] = [
        {
          role: 'system',
          content: 'Você é um assistente que executa código Python. Execute o código fornecido e retorne o resultado.'
        },
        {
          role: 'user',
          content: `Execute este código Python:\n\n\`\`\`python\n${code}\n\`\`\``
        }
      ];

      const response = await axios.post(
        `${GROK_API_URL}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          tools: [
            {
              type: 'code_execution',
              code_execution: {
                language: 'python'
              }
            }
          ],
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 minutos para execução de código
        }
      );

      const content = (response.data as any).choices[0].message.content;

      console.log('[GrokAI] Código executado com sucesso');

      return {
        success: true,
        content
      };
    } catch (error: any) {
      console.error('[GrokAI] Erro ao executar código:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fazer busca na web via Grok Web Search
   */
  async webSearch(query: string): Promise<GrokResponse> {
    try {
      console.log('[GrokAI] Fazendo busca na web:', query);
      
      const messages: GrokMessage[] = [
        {
          role: 'user',
          content: `Busque informações sobre: ${query}`
        }
      ];

      const response = await axios.post(
        `${GROK_API_URL}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          tools: [
            {
              type: 'web_search'
            }
          ],
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      const content = (response.data as any).choices[0].message.content;

      console.log('[GrokAI] Busca concluída');

      return {
        success: true,
        content
      };
    } catch (error: any) {
      console.error('[GrokAI] Erro ao fazer busca:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Tomar decisão inteligente sobre qual ação executar
   */
  async decideAction(context: string, options: string[]): Promise<GrokResponse> {
    try {
      console.log('[GrokAI] Tomando decisão sobre ação...');
      
      const messages: GrokMessage[] = [
        {
          role: 'system',
          content: 'Você é um assistente especializado em automação hospitalar. Analise o contexto e decida qual ação executar.'
        },
        {
          role: 'user',
          content: `Contexto: ${context}\n\nOpções disponíveis:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nQual ação devo executar? Responda apenas com o número da opção e uma breve justificativa.`
        }
      ];

      return await this.chat(messages);
    } catch (error: any) {
      console.error('[GrokAI] Erro ao tomar decisão:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Exportar instância padrão
export const grokAI = new GrokAI();
