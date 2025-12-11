import { BoardOrchestrator } from './orchestrator';
import { AGENTS } from './personas';
import { DecisionEngine } from './decision-engine';
import { MemorySystem } from './memory-system';

async function runAdvancedSimulation() {
  const board = new BoardOrchestrator();
  const decisionEngine = new DecisionEngine();
  const memory = new MemorySystem();

  console.log("--- INICIANDO SIMULAÇÃO AVANÇADA (COM APRENDIZADO) ---");

  // 0. Injetar memória prévia (Simulando aprendizado passado)
  memory.addMemory(
    "Queda de conversão WhatsApp",
    "Reverter Script Agressivo",
    "SUCCESS",
    { recovered_sales: 15000 }
  );

  // 1. Scout detecta problema similar
  board.startMeeting("Queda de 10% na conversão de leads hoje", AGENTS.SCOUT.name);

  // 2. Alpha consulta memória
  const memoryInsight = memory.getBestActionForContext("Queda de conversão WhatsApp");
  if (memoryInsight) {
    await board.processTurn(AGENTS.ALPHA.id, `Memória do Sistema: ${memoryInsight}`);
  }

  // 3. Growth propõe opções
  await board.processTurn(AGENTS.GROWTH.id, "Tenho duas propostas: A) Reverter script (Seguro) ou B) Oferecer desconto de 5% (Agressivo).");

  // 4. Ledger avalia opções para o Motor de Decisão
  const options = [
    { 
      id: 'A', 
      name: 'Reverter Script', 
      scores: { ROI: 5, RISK: 10, SPEED: 10, EFFORT: 10 } // Risco baixo = nota alta em segurança
    },
    { 
      id: 'B', 
      name: 'Dar Desconto 5%', 
      scores: { ROI: 8, RISK: 4, SPEED: 8, EFFORT: 9 } 
    }
  ];

  // 5. Motor de Decisão calcula
  const result = decisionEngine.evaluateOptions(options);
  await board.processTurn(AGENTS.ALPHA.id, `Análise AHP: ${decisionEngine.explainDecision(result.winner)}`);

  // 6. Decisão Final
  await board.processTurn(AGENTS.ALPHA.id, `Decisão tomada: Executar opção ${result.winner.name}. Tech, proceda.`);

  console.log("\n--- ATA DA REUNIÃO ---");
  board.getHistory().forEach(msg => {
    console.log(`[${msg.timestamp.toLocaleTimeString()}] ${msg.from}: ${msg.content}`);
  });
}

runAdvancedSimulation();
