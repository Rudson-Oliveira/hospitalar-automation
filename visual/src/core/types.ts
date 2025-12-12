export type IntentType = 
  | 'NAVIGATE' 
  | 'CREATE_PURCHASE_ORDER' 
  | 'FILL_FORM' 
  | 'EXTRACT_DATA' 
  | 'UNKNOWN';

export interface Intent {
  type: IntentType;
  confidence: number;
  params: Record<string, any>;
  originalQuery: string;
}

export interface ActionStep {
  id: string;
  type: 'CLICK' | 'TYPE' | 'NAVIGATE' | 'WAIT' | 'READ' | 'SELECT';
  selector?: string;
  value?: string;
  description: string;
  optional?: boolean;
}

export interface Task {
  id: string;
  name: string;
  steps: ActionStep[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentStepIndex: number;
  result?: any;
}

export interface AIContext {
  lastUrl: string;
  lastAction: string;
  memory: Record<string, any>; // Memória de curto prazo (ex: ID do pedido criado)
}
