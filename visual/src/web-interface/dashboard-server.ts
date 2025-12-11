import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { BoardOrchestrator } from '../agents/orchestrator';
import { AGENTS } from '../agents/personas';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3002; // Porta diferente do sistema principal para evitar conflito

// Servir arquivos estáticos (HTML do Dashboard)
app.use(express.static(path.join(__dirname, '.')));

// Instância do Board
const board = new BoardOrchestrator();

// WebSocket Connection
wss.on('connection', (ws) => {
  console.log('Cliente conectado ao Dashboard');

  // Enviar estado inicial
  ws.send(JSON.stringify({
    type: 'HISTORY',
    data: board.getHistory()
  }));

  // Simulação de eventos em tempo real para demonstração
  const interval = setInterval(async () => {
    if (Math.random() > 0.7) {
      const agents = Object.values(AGENTS);
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const messages = [
        "Monitorando KPIs...",
        "Analisando tráfego de rede...",
        "Verificando novas vendas...",
        "Calculando ROI da campanha...",
        "Nenhuma anomalia detectada."
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      // Adicionar ao board (apenas log, sem iniciar reunião completa para não poluir)
      // Em produção, isso viria do evento real
      
      const msgObj = {
        from: randomAgent.name,
        content: randomMsg,
        timestamp: new Date()
      };

      ws.send(JSON.stringify({
        type: 'NEW_MESSAGE',
        data: msgObj
      }));
    }
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Cliente desconectado');
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/copilot', (req, res) => {
  res.sendFile(path.join(__dirname, 'copilot-sidebar.html'));
});

app.get('/autonomy', (req, res) => {
  res.sendFile(path.join(__dirname, 'autonomy-dashboard.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 Dashboard Server rodando em http://localhost:${PORT}`);
  console.log(`   - CEO Dashboard: http://localhost:${PORT}/`);
  console.log(`   - Copilot Sidebar: http://localhost:${PORT}/copilot`);
  console.log(`   - Autonomy Metrics: http://localhost:${PORT}/autonomy`);
});
