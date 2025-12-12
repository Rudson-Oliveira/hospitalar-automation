import { UserLevel } from './user-profiler';

interface TutorialStep {
  id: string;
  content: {
    [key in UserLevel]: {
      text: string;
      media?: string; // URL de imagem ou vídeo
      actionRequired?: string;
    };
  };
}

export class AdaptiveTutorial {
  private tutorials: Map<string, TutorialStep>;

  constructor() {
    this.tutorials = new Map();
    this.loadDefaultTutorials();
  }

  private loadDefaultTutorials() {
    // Exemplo: Tutorial de Login
    this.tutorials.set('LOGIN_STEP_1', {
      id: 'LOGIN_STEP_1',
      content: {
        'BEGINNER_TOTAL': {
          text: "Passo 1: Veja este campo branco onde está escrito 'E-mail'? Clique dentro dele com o mouse e digite seu e-mail.",
          media: "/assets/tutorials/login-click-demo.gif"
        },
        'BEGINNER': {
          text: "Clique no campo de e-mail e digite seu endereço.",
          media: "/assets/tutorials/login-highlight.png"
        },
        'INTERMEDIATE': {
          text: "Insira suas credenciais de acesso.",
        },
        'ADVANCED': {
          text: "Login",
        },
        'EXPERT': {
          text: "", // Expert não precisa de texto, só o campo
        }
      }
    });
  }

  public getContent(stepId: string, userLevel: UserLevel) {
    const step = this.tutorials.get(stepId);
    if (!step) return null;

    // Fallback para níveis mais baixos se não houver conteúdo específico
    return step.content[userLevel] || step.content['BEGINNER'];
  }
}
