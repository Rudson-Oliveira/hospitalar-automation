import { AiTwinLearningEngine } from './ai-twin-learning';

async function runTwinSimulation() {
  const twin = new AiTwinLearningEngine();
  const userId = "colaborador_joao";

  console.log("--- FASE 1: SHADOW MODE (OBSERVAÇÃO) ---");

  // Simula o humano trabalhando (respondendo e-mails e dando descontos)
  twin.observeAction(userId, 'DISCOUNT_GIVEN', "Cliente quer pagar à vista no pix", "Concedido 5% desconto");
  twin.observeAction(userId, 'DISCOUNT_GIVEN', "Pagamento à vista tem desconto?", "Sim, 5% off");
  twin.observeAction(userId, 'DISCOUNT_GIVEN', "Vou fazer o pix à vista agora", "Ok, aplicado 5%");

  console.log("\n--- FASE 2: COPILOT (SUGESTÃO) ---");

  // Novo evento chega
  const newEmail = "Olá, gostaria de fechar o pacote. Qual o valor à vista?";
  console.log(`Novo E-mail: "${newEmail}"`);

  const suggestion = twin.suggestAction(newEmail);

  if (suggestion) {
    console.log(`\n🤖 AI TWIN SUGERE:`);
    console.log(`Ação: ${suggestion.suggestedAction}`);
    console.log(`Confiança: ${(suggestion.confidence * 100)}%`);
    console.log(`Motivo: Detectei esse padrão ${suggestion.frequency} vezes no seu histórico.`);
  } else {
    console.log("Nenhum padrão conhecido detectado. Aguardando decisão humana.");
  }
}

runTwinSimulation();
