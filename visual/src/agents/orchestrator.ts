import { AGENTS, AgentPersona } from './personas';
import { DataAdapter } from './data-adapter';

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
  private dataAdapter: DataAdapter;
  private isLiveMode: boolean = false;

  constructor() {
    this.context = {
      topic: '',
      status: 'OPEN',
      history: [],
      decisions: []
    };
    this.dataAdapter = new DataAdapter(true); // Default: Mock
  }

  public setLiveMode(enabled: boolean) {
    this.isLiveMode = enabled;
    this.dataAdapter.setMode(enabled);
    console.log(`[BOARD] Modo Real: ${enabled ? 'ATIVADO' : 'DESATIVADO'}`);
  }

  public async startMeeting(topic: string, initiator: string) {
    // Coletar dados reais antes de começar
    const realData = await this.dataAdapter.fetchRealData();
    const contextInfo = `
    [DADOS DO SISTEMA]:
    - Status: ${realData.systemStatus}
    - Leads: ${realData.leads.length}
    - Agendamentos: ${realData.appointments.length}
    `;

    this.context = {
      topic,
      status: 'OPEN',
      history: [],
      decisions: []
    };
    
    this.logMessage('SYSTEM', contextInfo);
    this.logMessage(initiator, `Convoco reunião para discutir: ${topic}`);
    console.log(`[BOARD] Reunião iniciada por ${initiator}: ${topic}`);
  }

  public async processTurn(agentId: string, input: string): Promise<string> {
    const agent = Object.values(AGENTS).find(a => a.id === agentId);
    if (!agent) throw new Error('Agente não encontrado');

    this.logMessage(agent.name, input);
    return input;
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
