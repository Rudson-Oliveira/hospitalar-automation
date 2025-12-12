export type IntentType = 
  | 'NAVIGATE' 
  | 'CREATE_PURCHASE_ORDER' 
  | 'LIST_DEMANDS'
  | 'GENERATE_REPORT'
  | 'FILL_FORM' 
  | 'EXTRACT_DATA' 
  | 'UNKNOWN';

export interface Intent {
  type: IntentType;
  confidence: number;
  params: Record<string, any>;
  originalQuery: string;
  entities?: Entity[];
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
}

export interface ActionStep {
  id: string;
  type: 'CLICK' | 'TYPE' | 'NAVIGATE' | 'WAIT' | 'READ' | 'SELECT' | 'SCREENSHOT' | 'EXECUTE_SCRIPT';
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
  error?: string;
  executionTime?: number;
}

export interface AIContext {
  lastUrl: string;
  lastAction: string;
  memory: Record<string, any>;
  conversationHistory: Array<{ role: string; content: string }>;
}

export interface AgentResponse {
  id: string;
  messageId: string;
  content: string;
  actions: ActionStep[];
  status: 'success' | 'partial' | 'error';
  error?: string;
  timestamp: Date;
  executionTime: number;
}

export interface UserMessage {
  id: string;
  content: string;
  timestamp: Date;
  userId?: string;
  context?: Record<string, any>;
}

export interface NLPResult {
  intent: string;
  entities: Entity[];
  confidence: number;
  requiredActions: string[];
  parameters: Record<string, any>;
}

export interface ProcurementTask {
  type: 'create_order' | 'list_demands' | 'generate_report';
  parameters: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}
