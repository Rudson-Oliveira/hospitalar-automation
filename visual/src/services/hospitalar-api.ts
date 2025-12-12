import axios from 'axios';
// @ts-ignore
type AxiosInstance = any;
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../../.env') });

export class HospitalarService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = process.env.HOSPITAL_URL || 'https://dev.hospitalarsaude.app.br';
    
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptor para adicionar token
    this.api.interceptors.request.use((config: any) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  public async authenticate(): Promise<boolean> {
    try {
      const email = process.env.HOSPITAL_USER;
      const password = process.env.HOSPITAL_PASS;

      if (!email || !password) {
        console.error('[API] Credenciais não configuradas no .env');
        return false;
      }

      // Ajustar endpoint conforme a API real da Hospitalar
      // Assumindo /api/login ou /api/auth/token
      const response = await this.api.post('/api/login', { email, password });
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        console.log('[API] Autenticado com sucesso na Hospitalar');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[API] Falha na autenticação:', error instanceof Error ? error.message : error);
      return false;
    }
  }

  public async getLeads(limit: number = 10) {
    return this.safeRequest('get', `/api/leads?limit=${limit}`);
  }

  public async getAppointments(date: string) {
    return this.safeRequest('get', `/api/appointments?date=${date}`);
  }

  public async getFinancialSummary() {
    return this.safeRequest('get', '/api/financial/summary');
  }

  private async safeRequest(method: 'get' | 'post', url: string, data?: any) {
    if (!this.token) {
      const authSuccess = await this.authenticate();
      if (!authSuccess) throw new Error('Não foi possível autenticar na API');
    }

    try {
      const response = await this.api.request({ method, url, data });
      return response.data;
    } catch (error) {
      console.error(`[API] Erro em ${method.toUpperCase()} ${url}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }
}
