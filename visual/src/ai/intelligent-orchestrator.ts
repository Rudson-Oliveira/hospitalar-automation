/**
 * Intelligent Orchestrator
 * Orquestra Abacus.AI + Grok + COMET Bridge para máxima autonomia
 */

import { AbacusAI } from './abacus-integration';
import { GrokAI } from './grok-integration';
import axios from 'axios';

const COMET_BRIDGE_URL = process.env.COMET_BRIDGE_URL || '';

export interface OrchestrationContext {
  task: string;
  data?: any;
  requiresReasoning?: boolean;
  requiresDesktopAccess?: boolean;
  requiresWebSearch?: boolean;
}

export interface OrchestrationResult {
  success: boolean;
  result?: any;
  reasoning?: string;
  steps?: string[];
  error?: string;
}

/**
 * Orquestrador Inteligente que decide qual AI usar para cada tarefa
 */
export class IntelligentOrchestrator {
  private abacus: AbacusAI;
  private grok: GrokAI;

  constructor() {
    this.abacus = new AbacusAI({
      apiKey: process.env.ABACUS_API_KEY || '',
      baseUrl: 'https://routellm.abacus.ai',
      model: 'gpt-4'
    });
    this.grok = new GrokAI();
  }

  /**
   * Executar tarefa de forma inteligente, escolhendo a melhor AI
   */
  async executeTask(context: OrchestrationContext): Promise<OrchestrationResult> {
    const steps: string[] = [];
    
    try {
      console.log('[Orchestrator] Iniciando execução da tarefa:', context.task);
      steps.push('Analisando tarefa');

      // Decisão 1: Precisa de reasoning avançado?
      if (context.requiresReasoning) {
        console.log('[Orchestrator] Tarefa requer reasoning avançado - usando Grok');
        steps.push('Usando Grok para reasoning');
        
        const grokResult = await this.grok.chat([
          {
            role: 'system',
            content: 'Você é um assistente especializado em automação hospitalar. Analise a tarefa e forneça um plano de ação detalhado.'
          },
          {
            role: 'user',
            content: context.task
          }
        ]);

        if (!grokResult.success) {
          throw new Error(`Grok falhou: ${grokResult.error}`);
        }

        steps.push('Reasoning concluído');
        
        return {
          success: true,
          result: grokResult.content,
          reasoning: grokResult.reasoning,
          steps
        };
      }

      // Decisão 2: Precisa de busca na web?
      if (context.requiresWebSearch) {
        console.log('[Orchestrator] Tarefa requer busca na web - usando Grok Web Search');
        steps.push('Buscando informações na web');
        
        const searchResult = await this.grok.webSearch(context.task);

        if (!searchResult.success) {
          throw new Error(`Web Search falhou: ${searchResult.error}`);
        }

        steps.push('Busca concluída');
        
        return {
          success: true,
          result: searchResult.content,
          steps
        };
      }

      // Decisão 3: Precisa de acesso ao desktop?
      if (context.requiresDesktopAccess) {
        console.log('[Orchestrator] Tarefa requer acesso ao desktop - usando COMET Bridge');
        steps.push('Conectando ao COMET Bridge');
        
        // Verificar se COMET Bridge está disponível
        if (!COMET_BRIDGE_URL) {
          throw new Error('COMET Bridge URL não configurada');
        }

        // Usar Grok para gerar código Python que se conecta ao COMET Bridge
        const codeGenResult = await this.grok.chat([
          {
            role: 'system',
            content: 'Você é um gerador de código Python. Gere código que faça uma requisição HTTP POST para executar comandos via COMET Bridge.'
          },
          {
            role: 'user',
            content: `Gere código Python para executar esta tarefa via COMET Bridge (${COMET_BRIDGE_URL}): ${context.task}\n\nDados: ${JSON.stringify(context.data)}`
          }
        ]);

        if (!codeGenResult.success) {
          throw new Error(`Geração de código falhou: ${codeGenResult.error}`);
        }

        steps.push('Código Python gerado');

        // Executar código Python via Grok Code Execution
        const executionResult = await this.grok.executeCode(codeGenResult.content || '');

        if (!executionResult.success) {
          throw new Error(`Execução falhou: ${executionResult.error}`);
        }

        steps.push('Tarefa executada no desktop');
        
        return {
          success: true,
          result: executionResult.content,
          steps
        };
      }

      // Decisão 4: Tarefa simples - usar Abacus.AI
      console.log('[Orchestrator] Tarefa simples - usando Abacus.AI');
      steps.push('Usando Abacus.AI');
      
      const abacusResult = await this.abacus.processMessage(context.task);

      if (!abacusResult.success) {
        throw new Error(`Abacus falhou: ${abacusResult.error}`);
      }

      steps.push('Tarefa concluída');
      
      return {
        success: true,
        result: abacusResult.response || 'Tarefa processada',
        steps
      };

    } catch (error: any) {
      console.error('[Orchestrator] Erro na execução:', error.message);
      steps.push(`Erro: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        steps
      };
    }
  }

  /**
   * Criar paciente no sistema Hospitalar de forma autônoma
   */
  async createPatient(patientData: any): Promise<OrchestrationResult> {
    console.log('[Orchestrator] Criando paciente:', patientData.nome);

    // Usar Grok para planejar a execução
    const planResult = await this.grok.chat([
      {
        role: 'system',
        content: 'Você é um especialista em automação de sistemas hospitalares. Crie um plano passo a passo para cadastrar um paciente.'
      },
      {
        role: 'user',
        content: `Preciso cadastrar este paciente no sistema:\n${JSON.stringify(patientData, null, 2)}\n\nCrie um plano detalhado de execução.`
      }
    ]);

    if (!planResult.success) {
      return {
        success: false,
        error: `Falha ao criar plano: ${planResult.error}`
      };
    }

    console.log('[Orchestrator] Plano criado:', planResult.content);

    // Executar criação via COMET Bridge
    const executionResult = await this.executeTask({
      task: `Criar paciente no sistema Hospitalar com os dados: ${JSON.stringify(patientData)}`,
      data: patientData,
      requiresDesktopAccess: true,
      requiresReasoning: false
    });

    return executionResult;
  }

  /**
   * Processar mensagem do usuário de forma inteligente
   */
  async processMessage(message: string): Promise<OrchestrationResult> {
    console.log('[Orchestrator] Processando mensagem:', message);

    // Usar Grok para analisar a intenção
    const intentResult = await this.grok.chat([
      {
        role: 'system',
        content: 'Você é um analisador de intenções. Analise a mensagem do usuário e identifique: 1) O que ele quer fazer, 2) Se precisa de reasoning avançado, 3) Se precisa de acesso ao desktop, 4) Se precisa de busca na web. Responda em JSON.'
      },
      {
        role: 'user',
        content: message
      }
    ]);

    if (!intentResult.success) {
      // Fallback para Abacus se Grok falhar
      console.log('[Orchestrator] Grok falhou, usando Abacus como fallback');
      return await this.executeTask({
        task: message,
        requiresReasoning: false,
        requiresDesktopAccess: false,
        requiresWebSearch: false
      });
    }

    console.log('[Orchestrator] Intenção identificada:', intentResult.content);

    // Executar tarefa baseada na intenção
    try {
      const intent = JSON.parse(intentResult.content || '{}');
      
      return await this.executeTask({
        task: intent.task || message,
        requiresReasoning: intent.requiresReasoning || false,
        requiresDesktopAccess: intent.requiresDesktopAccess || false,
        requiresWebSearch: intent.requiresWebSearch || false
      });
    } catch (error) {
      // Se não conseguir parsear JSON, executar tarefa simples
      return await this.executeTask({
        task: message,
        requiresReasoning: false,
        requiresDesktopAccess: false,
        requiresWebSearch: false
      });
    }
  }
}

// Exportar instância padrão
export const orchestrator = new IntelligentOrchestrator();
