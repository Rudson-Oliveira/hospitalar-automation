// Analytic Hierarchy Process (AHP) Engine para Tomada de Decisão

interface Criteria {
  name: string;
  weight: number; // 0 a 1
}

interface Option {
  id: string;
  name: string;
  scores: Record<string, number>; // Score 0 a 10 para cada critério
}

export class DecisionEngine {
  private criteria: Criteria[];

  constructor() {
    // Critérios padrão para decisões de negócio
    this.criteria = [
      { name: 'ROI', weight: 0.35 },        // Retorno sobre Investimento (Peso Alto)
      { name: 'RISK', weight: 0.25 },       // Risco (Quanto menor, melhor score)
      { name: 'SPEED', weight: 0.20 },      // Velocidade de Implementação
      { name: 'EFFORT', weight: 0.20 }      // Esforço Técnico/Operacional (Quanto menor, melhor score)
    ];
  }

  public evaluateOptions(options: Option[]): { winner: Option, ranking: any[] } {
    const ranking = options.map(option => {
      let totalScore = 0;
      
      this.criteria.forEach(criterion => {
        const score = option.scores[criterion.name] || 0;
        totalScore += score * criterion.weight;
      });

      return {
        ...option,
        finalScore: totalScore
      };
    });

    // Ordenar do maior para o menor score
    ranking.sort((a, b) => b.finalScore - a.finalScore);

    return {
      winner: ranking[0],
      ranking
    };
  }

  public explainDecision(winner: any): string {
    return `A opção '${winner.name}' foi escolhida com score ${winner.finalScore.toFixed(2)}. ` +
           `Ela obteve o melhor equilíbrio entre ROI (${winner.scores['ROI']}) e Risco (${winner.scores['RISK']}).`;
  }
}
