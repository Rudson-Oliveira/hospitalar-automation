/**
 * WebSocket Handler
 * Gerencia conexões WebSocket para streaming de tela do agente
 */

import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
// import { ScreenStreamer } from './services/screen-streamer';
type ScreenStreamer = any;

export interface StreamClient {
  id: string;
  ws: WebSocket;
  connected: boolean;
}

class WebSocketHandler {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, StreamClient> = new Map();
  private screenStreamer: ScreenStreamer | null = null;

  /**
   * Inicializa o servidor WebSocket
   */
  initialize(httpServer: Server, screenStreamer: ScreenStreamer): void {
    this.wss = new WebSocketServer({ server: httpServer, path: '/agent/stream' });
    this.screenStreamer = screenStreamer;

    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = Math.random().toString(36).substring(7);
      console.log(`[WebSocket] Cliente conectado: ${clientId}`);

      const client: StreamClient = {
        id: clientId,
        ws,
        connected: true,
      };

      this.clients.set(clientId, client);

      // Enviar frames para este cliente
      if (this.screenStreamer) {
        this.screenStreamer.on('frame', (frame: any) => {
          if (client.connected && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify(frame));
            } catch (error) {
              console.error(`[WebSocket] Erro ao enviar frame para ${clientId}:`, error);
            }
          }
        });

        this.screenStreamer.on('action', (action: any) => {
          if (client.connected && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify(action));
            } catch (error) {
              console.error(`[WebSocket] Erro ao enviar ação para ${clientId}:`, error);
            }
          }
        });
      }

      // Mensagens do cliente
      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data);
          console.log(`[WebSocket] Mensagem de ${clientId}:`, message);

          // Processar comandos do cliente
          if (message.type === 'command') {
            // Aqui você pode processar comandos do cliente
            console.log(`[WebSocket] Comando: ${message.command}`);
          }
        } catch (error) {
          console.error(`[WebSocket] Erro ao processar mensagem:`, error);
        }
      });

      // Desconexão
      ws.on('close', () => {
        console.log(`[WebSocket] Cliente desconectado: ${clientId}`);
        client.connected = false;
        this.clients.delete(clientId);
      });

      // Erro
      ws.on('error', (error) => {
        console.error(`[WebSocket] Erro do cliente ${clientId}:`, error);
      });
    });

    console.log('[WebSocket] Servidor WebSocket inicializado');
  }

  /**
   * Envia mensagem para todos os clientes
   */
  broadcast(data: any): void {
    const message = JSON.stringify(data);
    this.clients.forEach((client) => {
      if (client.connected && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(message);
        } catch (error) {
          console.error(`[WebSocket] Erro ao fazer broadcast:`, error);
        }
      }
    });
  }

  /**
   * Envia mensagem para um cliente específico
   */
  send(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (client && client.connected && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error(`[WebSocket] Erro ao enviar para ${clientId}:`, error);
      }
    }
  }

  /**
   * Obtém número de clientes conectados
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Fecha todas as conexões
   */
  close(): void {
    this.clients.forEach((client) => {
      if (client.connected) {
        client.ws.close();
      }
    });
    this.clients.clear();

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    console.log('[WebSocket] Servidor WebSocket fechado');
  }
}

// Singleton instance
let instance: WebSocketHandler | null = null;

export function getWebSocketHandler(): WebSocketHandler {
  if (!instance) {
    instance = new WebSocketHandler();
  }
  return instance;
}

export default WebSocketHandler;
