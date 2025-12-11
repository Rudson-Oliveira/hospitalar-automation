// Módulo de Estratégia de Vendas e Pós-Vendas

interface CustomerProfile {
  id: string;
  segment: 'HIGH_TICKET' | 'STANDARD' | 'CHURN_RISK';
  lastPurchase: Date;
  ltv: number;
}

export class SalesStrategyModule {
  
  // Algoritmo de Predição de Churn (Simplificado)
  public predictChurn(customer: CustomerProfile): number {
    const daysSincePurchase = (new Date().getTime() - customer.lastPurchase.getTime()) / (1000 * 3600 * 24);
    
    if (daysSincePurchase > 90) return 0.9; // Risco Altíssimo
    if (daysSincePurchase > 60) return 0.6; // Risco Médio
    return 0.1; // Risco Baixo
  }

  // Gerador de Ação de Retenção
  public generateRetentionAction(churnProb: number): string {
    if (churnProb > 0.8) return "Ligar imediatamente + Oferta VIP 20% OFF";
    if (churnProb > 0.5) return "Enviar sequência de e-mail de reaquecimento";
    return "Manter newsletter padrão";
  }

  // Otimizador de Funil (A/B Testing Decision)
  public optimizeFunnel(variantA: { conversion: number }, variantB: { conversion: number }): string {
    const lift = ((variantB.conversion - variantA.conversion) / variantA.conversion) * 100;
    
    if (lift > 5) {
      return `Vencedor: Variante B (+${lift.toFixed(1)}% lift). Implementar B para 100% do tráfego.`;
    } else if (lift < -5) {
      return `Vencedor: Variante A. Variante B piorou performance. Descartar B.`;
    } else {
      return `Inconclusivo. Manter teste por mais 3 dias para significância estatística.`;
    }
  }
}
