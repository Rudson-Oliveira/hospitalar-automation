import { BoardOrchestrator } from './orchestrator';
import { AGENTS } from './personas';

// Interface de Reporte do AI Twin
interface TwinReport {
  employeeId: string;
  role: 'SALES' | 'FINANCE' | 'SUPPORT';
  metrics: {
    tasksAutomated: number;
    pendingIssues: number;
    sentimentScore: number;
  };
  topInsight: string;
}

export class HierarchyIntegrator {
  private board: BoardOrchestrator;

  constructor(board: BoardOrchestrator) {
    this.board = board;
  }

  // O AI Twin envia o relatório diário para o Agente Superior
  public async submitDailyReport(report: TwinReport) {
    console.log(`[HIERARCHY] Recebendo relatório de ${report.employeeId} (${report.role})...`);

    let targetAgentId = '';
    
    // Roteamento Hierárquico
    switch (report.role) {
      case 'SALES':
        targetAgentId = AGENTS.GROWTH.id;
        break;
      case 'FINANCE':
        targetAgentId = AGENTS.LEDGER.id;
        break;
      case 'SUPPORT':
        targetAgentId = AGENTS.SCOUT.id;
        break;
    }

    if (targetAgentId) {
      // O Agente Superior processa o relatório e decide se leva ao Conselho
      await this.processReport(targetAgentId, report);
    }
  }

  private async processReport(agentId: string, report: TwinReport) {
    // Lógica de Filtro: Só escala se houver anomalia ou insight valioso
    if (report.metrics.sentimentScore < 0.5) {
      // Sentimento ruim -> Escalar para o Conselho como Crise
      this.board.startMeeting(`Alerta de Qualidade: Equipe ${report.role} com sentimento negativo`, AGENTS.SCOUT.name);
      await this.board.processTurn(agentId, `Recebi um relatório preocupante do Twin de ${report.employeeId}. Insight: "${report.topInsight}". Precisamos agir.`);
    } else if (report.metrics.tasksAutomated > 100) {
      // Alta produtividade -> Escalar como Sucesso/Aprendizado
      console.log(`[HIERARCHY] ${agentId} registrou alta performance de ${report.employeeId}. Salvando padrão no Banco de Conhecimento.`);
    }
  }
}
