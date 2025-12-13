import axios from 'axios';

export class BrowserbaseClient {
    private apiKey: string;
    private projectId: string;
    private baseUrl: string = 'https://api.browserbase.com/v1';

    constructor(apiKey: string, projectId: string) {
        this.apiKey = apiKey;
        this.projectId = projectId;
    }

    public async createSession() {
        try {
            console.log('[BROWSERBASE] Criando nova sessão...');
            
            const response = await axios.post(`${this.baseUrl}/sessions`, {
                projectId: this.projectId
            }, {
                headers: {
                    'x-bb-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            const { id, connectUrl } = response.data as { id: string; connectUrl: string };
            console.log(`[BROWSERBASE] Sessão criada: ${id}`);
            return { id, connectUrl };

        } catch (error) {
            console.error('[BROWSERBASE] Erro ao criar sessão:', error);
            throw error;
        }
    }

    public async getSessionUrl(sessionId: string) {
        return `https://browserbase.com/sessions/${sessionId}`;
    }
}
