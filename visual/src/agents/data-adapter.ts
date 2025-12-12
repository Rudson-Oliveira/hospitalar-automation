import { HospitalarService } from '../services/hospitalar-api';

// Interface unificada para dados que os agentes consomem
export interface AgentData {
  leads: any[];
  appointments: any[];
  financials: any;
  systemStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
}

export class DataAdapter {
  private api: HospitalarService;
  private useMock: boolean;

  constructor(useMock: boolean = true) {
    this.api = new HospitalarService();
    this.useMock = useMock;
  }

  public async fetchRealData(): Promise<AgentData> {
    if (this.useMock) {
      return this.getMockData();
    }

    try {
      const [leads, appointments, financials] = await Promise.all([
        this.api.getLeads(20),
        this.api.getAppointments(new Date().toISOString().split('T')[0]),
        this.api.getFinancialSummary()
      ]);

      return {
        leads,
        appointments,
        financials,
        systemStatus: 'ONLINE'
      };
    } catch (error) {
      console.warn('[Adapter] Falha ao buscar dados reais, usando mock de fallback.');
      return { ...this.getMockData(), systemStatus: 'OFFLINE' };
    }
  }

  private getMockData(): AgentData {
    return {
      leads: [
        { id: 1, name: 'João Silva', status: 'NEW', interest: 'Cardiologia' },
        { id: 2, name: 'Maria Souza', status: 'CONTACTED', interest: 'Pediatria' }
      ],
      appointments: [
        { id: 101, patient: 'Carlos', time: '10:00', doctor: 'Dr. House' }
      ],
      financials: {
        dailyRevenue: 15000,
        pendingPayments: 3
      },
      systemStatus: 'ONLINE'
    };
  }

  public setMode(real: boolean) {
    this.useMock = !real;
  }
}
