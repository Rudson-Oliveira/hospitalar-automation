import axios from 'axios';
import { Intent } from './types';

export class BackendExecutor {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string = 'https://api.hospitalarsaude.app.br') {
        this.baseUrl = baseUrl;
    }

    public setAuthToken(token: string) {
        this.token = token;
    }

    public async executeIntent(intent: Intent): Promise<any> {
        console.log(`[BACKEND] Executando intenção via API: ${intent.type}`);

        try {
            switch (intent.type) {
                case 'CREATE_PURCHASE_ORDER':
                    return await this.createPurchaseOrder(intent.params);
                
                case 'EXTRACT_DATA':
                    // Exemplo: Buscar relatório JSON direto
                    return { data: 'Relatório extraído via API' };

                default:
                    console.log('[BACKEND] Intenção não suportada via API. Requer Frontend.');
                    return null; // Retorna null para indicar que deve usar Frontend
            }
        } catch (error) {
            console.error('[BACKEND] Erro na execução API:', error);
            throw error;
        }
    }

    private async createPurchaseOrder(params: any) {
        // Simulação de chamada POST
        console.log('[BACKEND] POST /api/v1/purchase-orders', params);
        
        // Em produção, descomentar:
        /*
        const response = await axios.post(`${this.baseUrl}/purchase-orders`, params, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        return response.data;
        */
       
        return { id: 'PO-9999', status: 'CREATED_VIA_API' };
    }
}
