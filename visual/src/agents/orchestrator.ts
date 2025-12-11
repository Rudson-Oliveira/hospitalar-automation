import { AGENTS, AgentPersona } from './personas';

interface Message {
  from: string;
  content: string;
  timestamp: Date;
}

interface MeetingContext {
  topic: string;
  status: 'OPEN' | 'VOTING' | 'RESOLVED' | 'ESCALATED';
  history: Message[];
  decisions: string[];
}

export class BoardOrchestrator {
  private context: MeetingContext;

  constructor() {
    this.context = {
      topic: '',
      status: 'OPEN',
      history: [],
      decisions: []
    };
  }

  public startMeeting(topic: string, initiator: string) {
    this.context = {
      topic,
      status: 'OPEN',
      history: [],
      decisions: []
    };
    this.logMessage(initiator, `Convoco reunião para discutir: ${topic}`);
    console.log(`[BOARD] Reunião iniciada por ${initiator}: ${topic}`);
  }

  public async processTurn(agentId: string, input: string): Promise<string> {
    // Simulação de processamento de LLM (aqui entraria a chamada real à API)
    // Na implementação real, usaremos a API do OpenAI/Anthropic para gerar a resposta baseada na Persona
    
    const agent = Object.values(AGENTS).find(a => a.id === agentId);
    if (!agent) throw new Error('Agente não encontrado');

    this.logMessage(agent.name, input);
    return input; // Retorna o que foi "dito"
  }

  private logMessage(from: string, content: string) {
    this.context.history.push({
      from,
      content,
      timestamp: new Date()
    });
  }

  public getHistory(): Message[] {
    return this.context.history;
  }

  public getStatus(): string {
    return this.context.status;
  }
}
