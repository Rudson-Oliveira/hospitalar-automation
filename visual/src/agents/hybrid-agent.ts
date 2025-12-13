import { AIBrain } from '../core/ai-brain';
import { ActionExecutor } from '../core/action-executor';
import { BackendExecutor } from '../core/backend-executor';
import { TaskOrchestrator } from '../core/task-orchestrator';
import { Page } from 'playwright';

export class HybridAgent {
    private brain: AIBrain;
    private frontendExecutor: ActionExecutor;
    private backendExecutor: BackendExecutor;
    private orchestrator: TaskOrchestrator;
    private mode: 'USER_PRESENT' | 'BACKGROUND' = 'USER_PRESENT';

    constructor(page: Page) {
        this.brain = new AIBrain();
        this.frontendExecutor = new ActionExecutor(page);
        this.backendExecutor = new BackendExecutor();
        this.orchestrator = new TaskOrchestrator();
    }

    public setMode(mode: 'USER_PRESENT' | 'BACKGROUND') {
        this.mode = mode;
        console.log(`[HYBRID] Modo alterado para: ${mode}`);
    }

    public async executeCommand(command: string) {
        const intent = this.brain.interpret(command);
        
        // DECISÃO HÍBRIDA INTELIGENTE
        
        // 1. Se o usuário está presente, preferir Frontend para feedback visual (efeito "Comet")
        if (this.mode === 'USER_PRESENT') {
            console.log('[HYBRID] Usuário presente -> Usando Frontend (Visual)');
            const task = this.orchestrator.planTask(intent);
            // Executar passo a passo visualmente
            for (const step of task.steps) {
                await this.frontendExecutor.executeStep(step);
            }
            return;
        }

        // 2. Se em Background, tentar API primeiro (mais rápido)
        if (this.mode === 'BACKGROUND') {
            console.log('[HYBRID] Background -> Tentando API (Rápido)');
            const apiResult = await this.backendExecutor.executeIntent(intent);
            
            if (apiResult) {
                console.log('[HYBRID] Sucesso via API:', apiResult);
                return;
            }

            // Fallback para Frontend Headless se API não suportar
            console.log('[HYBRID] API não suportada -> Fallback para Frontend Headless');
            const task = this.orchestrator.planTask(intent);
            for (const step of task.steps) {
                await this.frontendExecutor.executeStep(step);
            }
        }
    }
}
