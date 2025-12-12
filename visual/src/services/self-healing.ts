import { AutonomousAgent } from '../agents/autonomous-agent';

export class SelfHealingOrchestrator {
    private agent: AutonomousAgent;
    private failureCount: number = 0;
    private readonly MAX_FAILURES = 3;
    private checkInterval: NodeJS.Timeout | null = null;
    private isRecovering: boolean = false;

    constructor(agent: AutonomousAgent) {
        this.agent = agent;
    }

    public startMonitoring() {
        console.log('[SELF-HEALING] Monitoramento iniciado.');
        this.checkInterval = setInterval(() => this.checkHealth(), 30000); // Checa a cada 30s
    }

    public stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    public reportFailure(error: any) {
        this.failureCount++;
        console.warn(`[SELF-HEALING] Falha detectada (${this.failureCount}/${this.MAX_FAILURES}):`, error);
        
        if (this.failureCount >= this.MAX_FAILURES && !this.isRecovering) {
            this.triggerFailover();
        }
    }

    public reportSuccess() {
        if (this.failureCount > 0) {
            this.failureCount = 0;
            console.log('[SELF-HEALING] Sistema estável. Contador de falhas zerado.');
        }
    }

    private async triggerFailover() {
        this.isRecovering = true;
        const currentMode = this.agent.getMode();
        
        console.error(`[SELF-HEALING] 🚨 LIMITE DE FALHAS ATINGIDO NO MODO ${currentMode}! INICIANDO PROTOCOLO DE RECUPERAÇÃO.`);

        if (currentMode === 'LOCAL') {
            // Failover: Tentar mudar para Browserbase (Nuvem)
            console.log('[SELF-HEALING] 🔄 Tentando migrar para Browserbase (Cloud)...');
            const success = this.agent.setMode('CLOUD');
            
            if (success) {
                console.log('[SELF-HEALING] ✅ Migração para Browserbase concluída com sucesso.');
                this.failureCount = 0;
            } else {
                console.error('[SELF-HEALING] ❌ Falha na migração (Sem credenciais?). Tentando reiniciar agente local.');
                await this.restartAgent();
            }
        } else {
            // Failback: Se Browserbase falhar, voltar para Local
            console.log('[SELF-HEALING] 🔄 Browserbase instável. Voltando para Railway (Local)...');
            this.agent.setMode('LOCAL');
            await this.restartAgent();
            this.failureCount = 0;
        }

        this.isRecovering = false;
    }

    private async restartAgent() {
        console.log('[SELF-HEALING] ♻️ Reiniciando Agente...');
        await this.agent.stop();
        setTimeout(() => this.agent.start(), 5000);
    }

    private checkHealth() {
        // Lógica proativa: verificar uso de memória, ping, etc.
        // Por enquanto, baseada em reportFailure passivo do agente
        console.log(`[SELF-HEALING] Status Check: Modo=${this.agent.getMode()} | Falhas=${this.failureCount}`);
    }
}
