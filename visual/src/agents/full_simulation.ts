import { BoardOrchestrator } from './orchestrator';
import { AGENTS } from './personas';
import { DecisionEngine } from './decision-engine';
import { MemorySystem } from './memory-system';
import { SalesStrategyModule } from './sales-strategy';

async function runFullSimulation() {
  const board = new BoardOrchestrator();
  const decisionEngine = new DecisionEngine();
  const memory = new MemorySystem();
  const sales = new SalesStrategyModule();

  console.log("--- INICIANDO SIMULAÇÃO COMPLETA (ESTRATÉGIA + VENDAS + MEMÓRIA) ---");

  // Cenário: Análise Trimestral Automática
  board.startMeeting("Planejamento Estratégico Q4 - Foco em Retenção", AGENTS.ALPHA.name);

  // 1. Scout traz dados de Churn
  const customerSample = { id: '123', segment: 'HIGH_TICKET', lastPurchase: new Date('2023-01-01'), ltv: 5000 } as any;
  const churnRisk = sales.predictChurn(customerSample);
  await board.processTurn(AGENTS.SCOUT.id, `Detectei risco de churn de ${(churnRisk*100)}% em clientes High Ticket.`);

  // 2. Growth propõe ação baseada no módulo de vendas
  const action = sales.generateRetentionAction(churnRisk);
  await board.processTurn(AGENTS.GROWTH.id, `O Módulo de Vendas sugere: "${action}".`);

  // 3. Ledger valida financeiramente
  await board.processTurn(AGENTS.LEDGER.id, "Ligar para High Ticket custa R$ 5,00/cliente. O LTV é R$ 5.000. O ROI potencial é de 1000x. Aprovado.");

  // 4. Alpha decide e registra na memória
  await board.processTurn(AGENTS.ALPHA.id, "Executar plano de retenção High Ticket imediatamente.");
  
  memory.addMemory(
    "Risco Churn High Ticket > 80%",
    "Ligar + Oferta VIP",
    "SUCCESS", // Assumindo sucesso futuro para o exemplo
    { predicted_roi: 1000 }
  );

  console.log("\n--- ATA DA REUNIÃO ---");
  board.getHistory().forEach(msg => {
    console.log(`[${msg.timestamp.toLocaleTimeString()}] ${msg.from}: ${msg.content}`);
  });
}

runFullSimulation();
