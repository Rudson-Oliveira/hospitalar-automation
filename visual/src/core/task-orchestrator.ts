import { Intent, Task, ActionStep, IntentType } from './types';
import { v4 as uuidv4 } from 'uuid';

class TaskOrchestrator {

  /**
   * Planeja uma tarefa baseada na intenção
   */
  public planTask(intent: Intent): Task {
    const taskId = uuidv4();
    let steps: ActionStep[] = [];
    let taskName = 'Tarefa Desconhecida';

    switch (intent.type) {
      case 'NAVIGATE':
        return this.planNavigate(taskId, intent);

      case 'CREATE_PURCHASE_ORDER':
        return this.planCreatePurchaseOrder(taskId, intent);

      case 'LIST_DEMANDS':
        return this.planListDemands(taskId, intent);

      case 'GENERATE_REPORT':
        return this.planGenerateReport(taskId, intent);

      case 'FILL_FORM':
        return this.planFillForm(taskId, intent);

      case 'EXTRACT_DATA':
        return this.planExtractData(taskId, intent);

      case 'OPEN_APP':
        return this.planOpenApp(taskId, intent);

      case 'CHECK_STATUS':
        return this.planCheckStatus(taskId, intent);

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

  /**
   * Planeja navegação
   */
  private planNavigate(taskId: string, intent: Intent): Task {
    const steps: ActionStep[] = [
      {
        id: 'nav-1',
        type: 'NAVIGATE',
        value: intent.params.url,
        description: `Acessar URL: ${intent.params.url}`
      }
    ];

    return {
      id: taskId,
      name: `Navegar para ${intent.params.url}`,
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja criação de pedido de compra
   */
  private planCreatePurchaseOrder(taskId: string, intent: Intent): Task {
    const { quantity = 1, item = 'item' } = intent.params;

    const steps: ActionStep[] = [
      {
        id: 'po-1',
        type: 'NAVIGATE',
        value: process.env.PROCUREMENT_URL || 'https://dev.hospitalarsaude.app.br/compras/novo',
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
        selector: 'input[name="item"]',
        value: item,
        description: `Preencher item: ${item}`,
        optional: true
      },
      {
        id: 'po-4',
        type: 'TYPE',
        selector: 'input[name="quantity"]',
        value: String(quantity),
        description: `Preencher quantidade: ${quantity}`,
        optional: true
      },
      {
        id: 'po-5',
        type: 'CLICK',
        selector: 'button[type="submit"]',
        description: 'Enviar pedido',
        optional: true
      },
      {
        id: 'po-6',
        type: 'WAIT',
        value: '2000',
        description: 'Aguardar confirmação'
      }
    ];

    return {
      id: taskId,
      name: `Pedido de Compra: ${quantity}x ${item}`,
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja listagem de demandas
   */
  private planListDemands(taskId: string, intent: Intent): Task {
    const { department } = intent.params;

    const steps: ActionStep[] = [
      {
        id: 'ld-1',
        type: 'NAVIGATE',
        value: process.env.DEMANDS_URL || 'https://dev.hospitalarsaude.app.br/demandas',
        description: 'Acessar página de demandas'
      },
      {
        id: 'ld-2',
        type: 'WAIT',
        value: '1000',
        description: 'Aguardar carregamento'
      }
    ];

    // Se houver departamento, filtrar
    if (department) {
      steps.push(
        {
          id: 'ld-3',
          type: 'SELECT',
          selector: 'select[name="department"]',
          value: department,
          description: `Filtrar por departamento: ${department}`,
          optional: true
        },
        {
          id: 'ld-4',
          type: 'CLICK',
          selector: 'button#filter-btn',
          description: 'Aplicar filtro',
          optional: true
        },
        {
          id: 'ld-5',
          type: 'WAIT',
          value: '2000',
          description: 'Aguardar resultado do filtro'
        }
      );
    }

    steps.push({
      id: 'ld-6',
      type: 'EXTRACT_DATA',
      selector: 'table#demands-table',
      description: 'Extrair dados das demandas',
      optional: true
    });

    return {
      id: taskId,
      name: `Listar Demandas${department ? ` - ${department}` : ''}`,
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja geração de relatório
   */
  private planGenerateReport(taskId: string, intent: Intent): Task {
    const { period } = intent.params;

    const steps: ActionStep[] = [
      {
        id: 'gr-1',
        type: 'NAVIGATE',
        value: process.env.REPORTS_URL || 'https://dev.hospitalarsaude.app.br/relatorios',
        description: 'Acessar página de relatórios'
      },
      {
        id: 'gr-2',
        type: 'WAIT',
        value: '1000',
        description: 'Aguardar carregamento'
      },
      {
        id: 'gr-3',
        type: 'CLICK',
        selector: 'button#report-purchases',
        description: 'Selecionar relatório de compras',
        optional: true
      }
    ];

    // Se houver período, definir
    if (period) {
      steps.push({
        id: 'gr-4',
        type: 'TYPE',
        selector: 'input[name="period"]',
        value: period,
        description: `Definir período: ${period}`,
        optional: true
      });
    }

    steps.push(
      {
        id: 'gr-5',
        type: 'CLICK',
        selector: 'button#generate-report',
        description: 'Gerar relatório',
        optional: true
      },
      {
        id: 'gr-6',
        type: 'WAIT',
        value: '3000',
        description: 'Aguardar geração do relatório'
      },
      {
        id: 'gr-7',
        type: 'EXTRACT_DATA',
        selector: 'div#report-data',
        description: 'Extrair dados do relatório',
        optional: true
      }
    );

    return {
      id: taskId,
      name: `Gerar Relatório de Compras${period ? ` - ${period}` : ''}`,
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja preenchimento de formulário
   */
  private planFillForm(taskId: string, intent: Intent): Task {
    const steps: ActionStep[] = [
      {
        id: 'ff-1',
        type: 'WAIT',
        value: '1000',
        description: 'Aguardar formulário'
      }
    ];

    return {
      id: taskId,
      name: 'Preencher Formulário',
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja abertura de aplicativo
   */
  private planOpenApp(taskId: string, intent: Intent): Task {
    const { appName } = intent.params;
    const steps: ActionStep[] = [
      {
        id: 'oa-1',
        type: 'OPEN_APP',
        value: appName,
        description: `Abrir aplicativo: ${appName}`
      }
    ];

    return {
      id: taskId,
      name: `Abrir App: ${appName}`,
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja verificação de status
   */
  private planCheckStatus(taskId: string, intent: Intent): Task {
    // Tarefa dummy apenas para feedback visual, pois o status é retornado via chat
    const steps: ActionStep[] = [
      {
        id: 'cs-1',
        type: 'WAIT',
        value: '500',
        description: 'Verificando sistemas...'
      }
    ];

    return {
      id: taskId,
      name: 'Verificar Status do Agente',
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Planeja extração de dados
   */
  private planExtractData(taskId: string, intent: Intent): Task {
    const steps: ActionStep[] = [
      {
        id: 'ed-1',
        type: 'EXTRACT_DATA',
        selector: intent.params.selector || 'body',
        description: 'Extrair dados da página',
        optional: true
      }
    ];

    return {
      id: taskId,
      name: 'Extrair Dados',
      steps,
      status: 'PENDING',
      currentStepIndex: 0
    };
  }

  /**
   * Obtém descrição da tarefa
   */
  public getTaskDescription(task: Task): string {
    return `${task.name} (${task.status}) - Passo ${task.currentStepIndex + 1}/${task.steps.length}`;
  }

  /**
   * Verifica se tarefa foi concluída
   */
  public isTaskCompleted(task: Task): boolean {
    return task.status === 'COMPLETED';
  }

  /**
   * Verifica se tarefa falhou
   */
  public isTaskFailed(task: Task): boolean {
    return task.status === 'FAILED';
  }

  /**
   * Obtém próximo passo
   */
  public getNextStep(task: Task): ActionStep | null {
    if (task.currentStepIndex < task.steps.length) {
      return task.steps[task.currentStepIndex];
    }
    return null;
  }
}

const taskOrchestratorInstance = new TaskOrchestrator();
export { TaskOrchestrator };
export default taskOrchestratorInstance;
