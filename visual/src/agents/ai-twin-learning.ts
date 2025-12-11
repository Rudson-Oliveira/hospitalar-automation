// Motor de Aprendizado do AI Twin (Shadow Mode)

interface UserAction {
  userId: string;
  actionType: 'EMAIL_REPLY' | 'PROPOSAL_SEND' | 'DISCOUNT_GIVEN';
  inputContext: string; // O e-mail recebido, o pedido do cliente
  outputContent: string; // O que o humano escreveu/decidiu
  timestamp: Date;
}

interface Pattern {
  trigger: string; // Palavras-chave ou contexto
  suggestedAction: string;
  confidence: number;
  frequency: number;
}

export class AiTwinLearningEngine {
  private actionLog: UserAction[] = [];
  private learnedPatterns: Pattern[] = [];

  // 1. Observação (Shadow Mode)
  public observeAction(userId: string, type: 'EMAIL_REPLY' | 'PROPOSAL_SEND' | 'DISCOUNT_GIVEN', input: string, output: string) {
    this.actionLog.push({
      userId,
      actionType: type,
      inputContext: input,
      outputContent: output,
      timestamp: new Date()
    });
    
    console.log(`[SHADOW MODE] Observando ação de ${userId}: ${type}`);
    this.analyzePatterns();
  }

  // 2. Análise de Padrões (Simplificada)
  private analyzePatterns() {
    // Em produção, isso usaria Clustering/NLP
    // Aqui, simulamos a detecção de um padrão simples: "Desconto para Pagamento à Vista"
    
    const discountActions = this.actionLog.filter(a => a.actionType === 'DISCOUNT_GIVEN');
    
    if (discountActions.length >= 3) {
      // Se o humano deu desconto 3 vezes quando a palavra "à vista" apareceu
      const hasPattern = discountActions.every(a => a.inputContext.toLowerCase().includes('à vista'));
      
      if (hasPattern) {
        this.learnedPatterns.push({
          trigger: 'à vista',
          suggestedAction: 'Aplicar 5% de desconto automaticamente',
          confidence: 0.95,
          frequency: discountActions.length
        });
        console.log(`[LEARNING] Novo padrão detectado: Cliente fala 'à vista' -> Humano dá 5% desconto.`);
      }
    }
  }

  // 3. Sugestão (Fase 2 - Copilot)
  public suggestAction(inputContext: string): Pattern | null {
    const match = this.learnedPatterns.find(p => inputContext.toLowerCase().includes(p.trigger));
    
    if (match) {
      return match;
    }
    return null;
  }
}
