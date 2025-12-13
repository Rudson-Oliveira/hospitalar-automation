/**
 * Screen Streamer Service
 * Transmite a tela do navegador do agente em tempo real com o cursor
 */

import { Page, Browser } from 'playwright';
import { EventEmitter } from 'events';

export interface ScreenFrame {
  screenshot: string; // Base64
  cursor: {
    x: number;
    y: number;
    visible: boolean;
  };
  timestamp: number;
  action?: string;
  status?: string;
}

export interface StreamConfig {
  fps?: number; // Frames por segundo (padrão: 2)
  quality?: number; // Qualidade da imagem (1-100, padrão: 80)
  includeAnnotations?: boolean; // Mostrar anotações de ações
}

class ScreenStreamer extends EventEmitter {
  private page: Page | null = null;
  private isStreaming = false;
  private config: StreamConfig;
  private lastCursorPosition = { x: 0, y: 0 };
  private frameInterval: NodeJS.Timeout | null = null;
  private actionLog: string[] = [];

  constructor(config: StreamConfig = {}) {
    super();
    this.config = {
      fps: config.fps || 2,
      quality: config.quality || 80,
      includeAnnotations: config.includeAnnotations !== false,
    };
  }

  /**
   * Inicia o streaming da tela
   */
  async startStreaming(page: Page): Promise<void> {
    if (this.isStreaming) {
      console.log('[ScreenStreamer] Streaming já está ativo');
      return;
    }

    this.page = page;
    this.isStreaming = true;
    console.log('[ScreenStreamer] Iniciando streaming de tela');

    // Injetar script para rastrear movimento do cursor
    await this.injectCursorTracker();

    // Iniciar captura de frames
    const frameInterval = 1000 / (this.config.fps || 2);
    this.frameInterval = setInterval(() => this.captureFrame(), frameInterval);
  }

  /**
   * Para o streaming
   */
  stopStreaming(): void {
    if (this.frameInterval) {
      clearInterval(this.frameInterval);
      this.frameInterval = null;
    }
    this.isStreaming = false;
    console.log('[ScreenStreamer] Streaming parado');
  }

  /**
   * Injeta script para rastrear cursor
   */
  private async injectCursorTracker(): Promise<void> {
    if (!this.page) return;

    try {
      await this.page.addInitScript(() => {
        // Rastrear posição do cursor globalmente
        (window as any).__cursorPosition = { x: 0, y: 0, visible: true };

        document.addEventListener('mousemove', (e) => {
          (window as any).__cursorPosition = {
            x: e.clientX,
            y: e.clientY,
            visible: true,
          };
        });

        document.addEventListener('mouseleave', () => {
          (window as any).__cursorPosition.visible = false;
        });

        document.addEventListener('mouseenter', () => {
          (window as any).__cursorPosition.visible = true;
        });
      });
    } catch (error) {
      console.error('[ScreenStreamer] Erro ao injetar rastreador de cursor:', error);
    }
  }

  /**
   * Captura um frame da tela
   */
  private async captureFrame(): Promise<void> {
    if (!this.page || !this.isStreaming) return;

    try {
      // Capturar screenshot
      const screenshot = await this.page.screenshot({
        type: 'jpeg',
        quality: this.config.quality,
      });

      const base64 = screenshot.toString('base64');

      // Obter posição do cursor
      const cursorPosition = await this.page.evaluate(() => {
        return (window as any).__cursorPosition || { x: 0, y: 0, visible: true };
      });

      // Criar frame
      const frame: ScreenFrame = {
        screenshot: `data:image/jpeg;base64,${base64}`,
        cursor: cursorPosition,
        timestamp: Date.now(),
        action: this.actionLog[this.actionLog.length - 1],
        status: this.isStreaming ? 'streaming' : 'idle',
      };

      // Emitir frame
      this.emit('frame', frame);
    } catch (error) {
      console.error('[ScreenStreamer] Erro ao capturar frame:', error);
    }
  }

  /**
   * Registra uma ação do agente
   */
  logAction(action: string): void {
    this.actionLog.push(action);
    console.log(`[ScreenStreamer] Ação: ${action}`);

    // Manter apenas as últimas 10 ações
    if (this.actionLog.length > 10) {
      this.actionLog.shift();
    }

    // Emitir evento de ação
    this.emit('action', { action, timestamp: Date.now() });
  }

  /**
   * Simula movimento do cursor para uma posição
   */
  async moveCursor(x: number, y: number): Promise<void> {
    if (!this.page) return;

    try {
      await this.page.mouse.move(x, y);
      this.lastCursorPosition = { x, y };
      this.logAction(`Moveu cursor para (${x}, ${y})`);
    } catch (error) {
      console.error('[ScreenStreamer] Erro ao mover cursor:', error);
    }
  }

  /**
   * Simula clique do cursor
   */
  async clickCursor(x: number, y: number): Promise<void> {
    if (!this.page) return;

    try {
      await this.page.mouse.move(x, y);
      await this.page.mouse.click(x, y);
      this.logAction(`Clicou em (${x}, ${y})`);
    } catch (error) {
      console.error('[ScreenStreamer] Erro ao clicar:', error);
    }
  }

  /**
   * Obtém o histórico de ações
   */
  getActionHistory(): string[] {
    return [...this.actionLog];
  }

  /**
   * Limpa o histórico de ações
   */
  clearActionHistory(): void {
    this.actionLog = [];
  }

  /**
   * Verifica se está transmitindo
   */
  isActive(): boolean {
    return this.isStreaming;
  }
}

// Singleton instance
let instance: ScreenStreamer | null = null;

export function getScreenStreamer(config?: StreamConfig): ScreenStreamer {
  if (!instance) {
    instance = new ScreenStreamer(config);
  }
  return instance;
}

export default ScreenStreamer;
