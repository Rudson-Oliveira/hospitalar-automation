import { Intent, Task, ActionStep } from './types';
import { v4 as uuidv4 } from 'uuid';

export class TaskOrchestrator {

    public planTask(intent: Intent): Task {
        const taskId = uuidv4();
        let steps: ActionStep[] = [];
        let taskName = 'Tarefa Desconhecida';

        switch (intent.type) {
            case 'NAVIGATE':
                taskName = `Navegar para ${intent.params.url}`;
                steps = [
                    {
                        id: 'nav-1',
                        type: 'NAVIGATE',
                        value: intent.params.url,
                        description: `Acessar URL: ${intent.params.url}`
                    }
                ];
                break;

            case 'CREATE_PURCHASE_ORDER':
                taskName = `Pedido de Compra: ${intent.params.quantity}x ${intent.params.item}`;
                // Workflow simulado de compra hospitalar
                steps = [
                    {
                        id: 'po-1',
                        type: 'NAVIGATE',
                        value: 'https://dev.hospitalarsaude.app.br/compras/novo', // URL hipotética
                        description: 'Acessar módulo de compras'
                    },
                    {
                        id: 'po-2',
                        type: 'WAIT',
                        value: '2000',
                        description: 'Aguardar carregamento do formulário'
                    },
                    {
                        id: 'po-3',
                        type: 'TYPE',
                        selector: 'input[name="item"]', // Seletor hipotético
                        value: intent.params.item,
                        description: `Preencher item: ${intent.params.item}`,
                        optional: true // Opcional pois o seletor pode não existir na demo
                    },
                    {
                        id: 'po-4',
                        type: 'TYPE',
                        selector: 'input[name="quantity"]',
                        value: intent.params.quantity,
                        description: `Preencher quantidade: ${intent.params.quantity}`,
                        optional: true
                    },
                    {
                        id: 'po-5',
                        type: 'CLICK',
                        selector: 'button[type="submit"]',
                        description: 'Enviar pedido',
                        optional: true
                    }
                ];
                break;
            
            default:
                taskName = 'Ação não mapeada';
                steps = [];
        }

        return {
            id: taskId,
            name: taskName,
            steps: steps,
            status: 'PENDING',
            currentStepIndex: 0
        };
    }
}
