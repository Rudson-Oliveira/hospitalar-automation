import { BoardOrchestrator } from './orchestrator';
import { HierarchyIntegrator } from './hierarchy-integration';
import { AGENTS } from './personas';

async function runHierarchySimulation() {
  const board = new BoardOrchestrator();
  const hierarchy = new HierarchyIntegrator(board);

  console.log("--- SIMULAÇÃO DE HIERARQUIA (TWINS -> BOARD) ---");

  // Cenário 1: Twin de Vendas reporta sucesso normal (Não escala)
  await hierarchy.submitDailyReport({
    employeeId: 'Vendedor_01',
    role: 'SALES',
    metrics: { tasksAutomated: 120, pendingIssues: 2, sentimentScore: 0.9 },
    topInsight: 'Clientes adoraram a nova abordagem de desconto.'
  });

  // Cenário 2: Twin de Suporte reporta crise (Escala para o Board)
  console.log("\n--- CENÁRIO DE CRISE ---");
  await hierarchy.submitDailyReport({
    employeeId: 'Suporte_05',
    role: 'SUPPORT',
    metrics: { tasksAutomated: 50, pendingIssues: 15, sentimentScore: 0.3 },
    topInsight: 'Muitas reclamações sobre lentidão no sistema hoje.'
  });

  // Verificar se a reunião foi criada
  const history = board.getHistory();
  if (history.length > 0) {
    console.log("\n--- REUNIÃO CONVOCADA PELO SISTEMA HIERÁRQUICO ---");
    history.forEach(msg => {
      console.log(`[${msg.timestamp.toLocaleTimeString()}] ${msg.from}: ${msg.content}`);
    });
  }
}

runHierarchySimulation();
