// Sistema de Memória de Longo Prazo (Simulação de Vector DB)

interface MemoryEntry {
  id: string;
  context: string;
  action: string;
  result: 'SUCCESS' | 'FAILURE';
  metrics: Record<string, number>; // ex: { roi: 1.5, conversion_lift: 0.2 }
  timestamp: Date;
}

export class MemorySystem {
  private memories: MemoryEntry[] = [];

  public addMemory(context: string, action: string, result: 'SUCCESS' | 'FAILURE', metrics: any) {
    this.memories.push({
      id: Math.random().toString(36).substring(7),
      context,
      action,
      result,
      metrics,
      timestamp: new Date()
    });
    console.log(`[MEMORY] Aprendizado registrado: ${action} -> ${result}`);
  }

  public findSimilarContext(context: string): MemoryEntry | null {
    // Em produção, isso seria uma busca vetorial (cosine similarity)
    // Aqui faremos uma busca simples por palavra-chave
    return this.memories.find(m => m.context.includes(context)) || null;
  }

  public getBestActionForContext(context: string): string | null {
    const similar = this.findSimilarContext(context);
    if (similar && similar.result === 'SUCCESS') {
      return `Baseado no histórico, a ação '${similar.action}' teve sucesso em situação similar.`;
    }
    if (similar && similar.result === 'FAILURE') {
      return `ALERTA: A ação '${similar.action}' falhou anteriormente nesta situação. Evitar.`;
    }
    return null;
  }
}
