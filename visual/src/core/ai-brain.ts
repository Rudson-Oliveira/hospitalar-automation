import { Intent, IntentType } from './types';

export class AIBrain {
    
    public interpret(query: string): Intent {
        const normalizedQuery = query.toLowerCase().trim();
        
        // 1. Navegação Simples
        if (normalizedQuery.startsWith('ver ') || normalizedQuery.startsWith('navegar ') || normalizedQuery.startsWith('ir para ')) {
            const url = query.split(' ').slice(1).join(' '); // Pega o resto da string preservando case
            let targetUrl = url;
            if (!url.startsWith('http')) targetUrl = `https://${url}`;
            
            return {
                type: 'NAVIGATE',
                confidence: 0.95,
                params: { url: targetUrl },
                originalQuery: query
            };
        }

        // 2. Criar Pedido de Compra (Ex: "comprar 10 luvas" ou "pedido de 50 seringas")
        if (normalizedQuery.includes('comprar') || normalizedQuery.includes('pedido')) {
            const quantityMatch = normalizedQuery.match(/(\d+)/);
            const itemMatch = normalizedQuery.match(/(?:de|para)\s+(.+)/); // Pega tudo depois de "de" ou "para"

            if (quantityMatch && itemMatch) {
                return {
                    type: 'CREATE_PURCHASE_ORDER',
                    confidence: 0.85,
                    params: {
                        quantity: quantityMatch[1],
                        item: itemMatch[1].trim()
                    },
                    originalQuery: query
                };
            }
        }

        // 3. Preencher Formulário (Genérico)
        if (normalizedQuery.includes('preencher') || normalizedQuery.includes('cadastrar')) {
             return {
                type: 'FILL_FORM',
                confidence: 0.7,
                params: {},
                originalQuery: query
            };
        }

        return {
            type: 'UNKNOWN',
            confidence: 0,
            params: {},
            originalQuery: query
        };
    }
}
