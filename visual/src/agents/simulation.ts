import { BoardOrchestrator } from './orchestrator';
import { AGENTS } from './personas';

// Simulação de um cenário de crise
async function runSimulation() {
  const board = new BoardOrchestrator();

  console.log("--- INICIANDO SIMULAÇÃO DO CONSELHO ---");

  // 1. Scout detecta problema
  board.startMeeting("Queda de 15% na conversão de leads do WhatsApp", AGENTS.SCOUT.name);

  // 2. Tech analisa
  await board.processTurn(AGENTS.TECH.id, "Analisei os logs. O bot está respondendo normalmente, sem erros técnicos. O tempo de resposta está abaixo de 2s.");

  // 3. Growth propõe hipótese
  await board.processTurn(AGENTS.GROWTH.id, "Se não é técnico, é comportamental. Mudamos o script de abordagem ontem. A nova mensagem pode estar muito agressiva.");

  // 4. Ledger avalia custo
  await board.processTurn(AGENTS.LEDGER.id, "A queda de 15% representa uma perda estimada de R$ 2.000/dia. Reverter o script tem custo zero. Aprovo a reversão imediata.");

  // 5. Alpha decide
  await board.processTurn(AGENTS.ALPHA.id, "Consenso formado. O risco financeiro de manter o script é alto. Tech, reverta para a versão anterior imediatamente. Growth, prepare um teste A/B para a próxima tentativa.");

  console.log("\n--- ATA DA REUNIÃO ---");
  board.getHistory().forEach(msg => {
    console.log(`[${msg.timestamp.toLocaleTimeString()}] ${msg.from}: ${msg.content}`);
  });
}

runSimulation();
