export type UserLevel = 'BEGINNER_TOTAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

interface UserMetrics {
  tasksCompleted: number;
  helpRequestedCount: number;
  errorCount: number;
  avgTaskTimeSeconds: number;
  loginCount: number;
}

export class UserProfiler {
  private metrics: UserMetrics;
  private currentLevel: UserLevel;

  constructor(initialLevel: UserLevel = 'BEGINNER_TOTAL') {
    this.currentLevel = initialLevel;
    this.metrics = {
      tasksCompleted: 0,
      helpRequestedCount: 0,
      errorCount: 0,
      avgTaskTimeSeconds: 0,
      loginCount: 0
    };
  }

  // Atualiza métricas e recalcula nível
  public updateMetrics(newMetrics: Partial<UserMetrics>) {
    this.metrics = { ...this.metrics, ...newMetrics };
    this.recalculateLevel();
  }

  // Lógica de Gamificação / Evolução de Nível
  private recalculateLevel() {
    const { tasksCompleted, helpRequestedCount, errorCount } = this.metrics;

    // Regras de Evolução (Simplificadas)
    if (tasksCompleted > 100 && errorCount < 5) {
      this.currentLevel = 'EXPERT';
    } else if (tasksCompleted > 50 && helpRequestedCount < 10) {
      this.currentLevel = 'ADVANCED';
    } else if (tasksCompleted > 20) {
      this.currentLevel = 'INTERMEDIATE';
    } else if (tasksCompleted > 5) {
      this.currentLevel = 'BEGINNER';
    } else {
      this.currentLevel = 'BEGINNER_TOTAL';
    }
  }

  public getLevel(): UserLevel {
    return this.currentLevel;
  }

  public getInstructionStyle(): string {
    switch (this.currentLevel) {
      case 'BEGINNER_TOTAL':
        return 'EXTREMELY_DETAILED_WITH_IMAGES_AND_VIDEOS';
      case 'BEGINNER':
        return 'DETAILED_WITH_TOOLTIPS';
      case 'INTERMEDIATE':
        return 'NORMAL_INSTRUCTIONS';
      case 'ADVANCED':
      case 'EXPERT':
        return 'MINIMALIST_QUICK_ACTIONS';
      default:
        return 'DETAILED_WITH_TOOLTIPS';
    }
  }
}
