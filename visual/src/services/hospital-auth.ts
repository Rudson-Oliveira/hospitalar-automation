/**
 * Hospital Authentication Service
 * Gerencia autenticação e integração com o sistema hospitalar
 */

import axios from 'axios';
type AxiosInstance = any;
import { Page, Browser } from 'playwright';

export interface HospitalAuthConfig {
  url: string;
  username: string;
  password: string;
  headless?: boolean;
}

export interface AuthSession {
  authenticated: boolean;
  cookies?: any[];
  token?: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

class HospitalAuthService {
  private config: HospitalAuthConfig;
  private axiosInstance: AxiosInstance;
  private session: AuthSession = { authenticated: false };
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(config: HospitalAuthConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.url,
      timeout: 30000,
      validateStatus: () => true, // Aceitar qualquer status
    });
  }

  /**
   * Testa conectividade com o servidor hospitalar
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/');
      console.log(`[HospitalAuth] Conexão testada: ${response.status}`);
      return response.status === 200;
    } catch (error) {
      console.error('[HospitalAuth] Erro ao testar conexão:', error);
      return false;
    }
  }

  /**
   * Realiza autenticação no sistema hospitalar
   */
  async authenticate(): Promise<AuthSession> {
    try {
      console.log('[HospitalAuth] Iniciando autenticação...');
      
      // Teste 1: Verificar conectividade
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error('Não foi possível conectar ao servidor hospitalar');
      }

      // Teste 2: Tentar fazer login via API (se disponível)
      const loginResponse = await this.tryAPILogin();
      if (loginResponse.authenticated) {
        this.session = loginResponse;
        console.log('[HospitalAuth] ✅ Autenticação bem-sucedida via API');
        return this.session;
      }

      // Teste 3: Tentar fazer login via navegador (Playwright)
      const browserAuth = await this.tryBrowserLogin();
      if (browserAuth.authenticated) {
        this.session = browserAuth;
        console.log('[HospitalAuth] ✅ Autenticação bem-sucedida via navegador');
        return this.session;
      }

      throw new Error('Falha em todos os métodos de autenticação');
    } catch (error) {
      console.error('[HospitalAuth] Erro na autenticação:', error);
      this.session = { authenticated: false };
      return this.session;
    }
  }

  /**
   * Tenta autenticação via API
   */
  private async tryAPILogin(): Promise<AuthSession> {
    try {
      console.log('[HospitalAuth] Tentando autenticação via API...');
      
      // Tenta diferentes endpoints de login
      const loginEndpoints = [
        '/api/auth/login',
        '/api/login',
        '/auth/login',
        '/login',
      ];

      for (const endpoint of loginEndpoints) {
        try {
          const response = await this.axiosInstance.post(endpoint, {
            email: this.config.username,
            password: this.config.password,
          });

          if (response.status === 200 && response.data) {
            console.log(`[HospitalAuth] Login bem-sucedido em ${endpoint}`);
            return {
              authenticated: true,
              token: response.data.token || response.data.access_token,
              user: response.data.user,
              cookies: response.headers['set-cookie'],
            };
          }
        } catch (err) {
          // Continuar para próximo endpoint
        }
      }

      return { authenticated: false };
    } catch (error) {
      console.error('[HospitalAuth] Erro na autenticação via API:', error);
      return { authenticated: false };
    }
  }

  /**
   * Tenta autenticação via navegador (Playwright)
   */
  private async tryBrowserLogin(): Promise<AuthSession> {
    try {
      console.log('[HospitalAuth] Tentando autenticação via navegador...');
      
      // Importar Playwright dinamicamente
      const { chromium } = await import('playwright');

      // Iniciar navegador
      this.browser = await chromium.launch({ headless: this.config.headless !== false });
      this.page = await this.browser.newPage();

      // Navegar para o sistema
      await this.page.goto(this.config.url, { waitUntil: 'networkidle' });
      console.log('[HospitalAuth] Página carregada');

      // Procurar por campos de login
      const emailInput = await this.page.$('input[type="email"]') || 
                        await this.page.$('input[name="email"]') ||
                        await this.page.$('input[name="username"]');

      if (!emailInput) {
        console.log('[HospitalAuth] Campos de login não encontrados');
        return { authenticated: false };
      }

      // Preencher credenciais
      await emailInput.fill(this.config.username);
      console.log('[HospitalAuth] Email preenchido');

      const passwordInput = await this.page.$('input[type="password"]');
      if (passwordInput) {
        await passwordInput.fill(this.config.password);
        console.log('[HospitalAuth] Senha preenchida');
      }

      // Clicar em login
      const loginButton = await this.page.$('button[type="submit"]') ||
                         await this.page.$('button:has-text("Login")') ||
                         await this.page.$('button:has-text("Entrar")');

      if (loginButton) {
        await loginButton.click();
        console.log('[HospitalAuth] Botão de login clicado');

        // Aguardar redirecionamento
        await this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      }

      // Verificar se autenticado
      const currentURL = this.page.url();
      const isAuthenticated = !currentURL.includes('login') && !currentURL.includes('auth');

      if (isAuthenticated) {
        console.log('[HospitalAuth] ✅ Autenticação bem-sucedida');
        
        // Obter cookies
        const cookies = await this.page.context().cookies();
        
        return {
          authenticated: true,
          cookies,
          user: {
            name: 'Usuário Hospitalar',
            email: this.config.username,
            role: 'admin',
          },
        };
      }

      return { authenticated: false };
    } catch (error) {
      console.error('[HospitalAuth] Erro na autenticação via navegador:', error);
      return { authenticated: false };
    }
  }

  /**
   * Obtém a sessão atual
   */
  getSession(): AuthSession {
    return this.session;
  }

  /**
   * Verifica se está autenticado
   */
  isAuthenticated(): boolean {
    return this.session.authenticated;
  }

  /**
   * Fecha a sessão e limpa recursos
   */
  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    this.session = { authenticated: false };
  }

  /**
   * Faz uma requisição autenticada
   */
  async request(method: string, path: string, data?: any): Promise<any> {
    try {
      const config: any = {
        method,
        url: path,
      };

      if (this.session.token) {
        config.headers = {
          Authorization: `Bearer ${this.session.token}`,
        };
      }

      if (data) {
        config.data = data;
      }

      const response = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      console.error(`[HospitalAuth] Erro na requisição ${method} ${path}:`, error);
      throw error;
    }
  }
}

// Singleton instance
let instance: HospitalAuthService | null = null;

export function getHospitalAuthService(config?: HospitalAuthConfig): HospitalAuthService {
  if (!instance && config) {
    instance = new HospitalAuthService(config);
  }
  return instance!;
}

export default HospitalAuthService;
