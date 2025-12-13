import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import { BoardOrchestrator } from '../agents/orchestrator';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { AGENTS } from '../agents/personas';
import { AutonomousAgent } from '../agents/autonomous-agent';
import { SelfHealingOrchestrator } from '../services/self-healing';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3002;

// Resolução robusta de caminhos estáticos
// Tenta encontrar onde estão os arquivos HTML (pode variar entre dev/ts-node e prod/build)
let staticPath = path.join(__dirname, '.');
if (!fs.existsSync(path.join(staticPath, 'dashboard.html'))) {
    // Tentar subir um nível se estiver dentro de dist/
    staticPath = path.join(__dirname, '../web-interface');
}
if (!fs.existsSync(path.join(staticPath, 'dashboard.html'))) {
    // Fallback para raiz do projeto visual/src/web-interface
    staticPath = path.join(process.cwd(), 'src/web-interface');
}

console.log(`[SERVER] Servindo arquivos estáticos de: ${staticPath}`);
app.use(express.static(staticPath));

// Instância do Board
const board = new BoardOrchestrator();

// Iniciar Agente Autônomo e Self-Healing
setTimeout(() => {
  const autonomousAgent = new AutonomousAgent(`ws://localhost:${PORT}`);
  const healer = new SelfHealingOrchestrator(autonomousAgent);
  
  healer.startMonitoring();
  autonomousAgent.start().catch(err => {
    console.error(err);
    healer.reportFailure(err);
  });

  (global as any).agent = autonomousAgent;
  (global as any).healer = healer;
}, 5000);

// WebSocket Connection
wss.on('connection', (ws) => {
  console.log('Cliente conectado ao Dashboard');

  ws.send(JSON.stringify({
    type: 'HISTORY',
    data: board.getHistory()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'screenshot' || data.type === 'log' || data.type === 'AGENT_CONNECT') {
        if (data.type !== 'screenshot') {
            console.log(`[BROADCAST] Recebido do Agente: ${data.type} - Retransmitindo...`);
        }
        
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      }
      
      if (data.type === 'command' || data.type === 'click_coordinate') {
         console.log(`[COMMAND] Recebido do Dashboard: ${data.type} - Retransmitindo para Agente...`);
         wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message.toString());
            }
          });
      }

    } catch (e) {
      console.error('Erro ao processar mensagem WS:', e);
    }
  });

  // Simulação reduzida
  const interval = setInterval(async () => {
    if (Math.random() > 0.95) { 
      const agents = Object.values(AGENTS);
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const messages = [
        "Monitorando KPIs...",
        "Analisando tráfego...",
        "Sistema estável."
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
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
  }, 15000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Cliente desconectado');
  });
});

// API Routes
app.get('/api/settings', authMiddleware, requireAdmin, (req, res) => {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    res.json(envConfig);
  } else {
    res.json({});
  }
});

app.post('/api/settings', authMiddleware, requireAdmin, express.json(), (req, res) => {
  const envPath = path.join(__dirname, '../../.env');
  const newConfig = req.body;
  let envContent = '';
  for (const [key, value] of Object.entries(newConfig)) {
    envContent += `${key}=${value}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  res.sendStatus(200);
});

app.post('/api/mode', express.json(), (req, res) => {
  const { mode } = req.body;
  if (board) {
    board.setLiveMode(mode === 'LIVE');
    res.json({ message: `Modo alterado para ${mode}` });
  } else {
    res.status(500).json({ error: 'Orquestrador não inicializado' });
  }
});

app.post('/api/update', (req, res) => {
  exec('git pull origin main', (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: 'Falha na atualização', details: stderr });
    }
    res.json({ message: 'Sistema atualizado com sucesso!', output: stdout });
  });
});

app.post('/api/chaos/crash', (req, res) => {
  const agent = (global as any).agent;
  const healer = (global as any).healer;
  if (agent && healer) {
    healer.reportFailure(new Error('Simulação de Crash Manual (Chaos Testing)'));
    res.json({ message: 'Falha simulada com sucesso!' });
  } else {
    res.status(500).json({ error: 'Agente ou Healer não inicializados.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Rotas de Arquivos Estáticos com Fallback Seguro
const serveFile = (filename: string, res: express.Response) => {
    const filePath = path.join(staticPath, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.error(`[404] Arquivo não encontrado: ${filePath}`);
        res.status(404).send(`Arquivo ${filename} não encontrado no servidor.`);
    }
};

app.get('/', (req, res) => serveFile('dashboard.html', res));
app.get('/copilot', (req, res) => serveFile('copilot-sidebar.html', res));
app.get('/autonomy', (req, res) => serveFile('autonomy-dashboard.html', res));
app.get('/settings', (req, res) => serveFile('settings.html', res));
app.get('/virtual-assistant.html', (req, res) => serveFile('virtual-assistant.html', res));
app.get('/onboarding', (req, res) => serveFile('onboarding-wizard.html', res));
app.get('/nav-menu.js', (req, res) => serveFile('nav-menu.js', res));

server.listen(PORT, () => {
  console.log(`🚀 Dashboard Server rodando em http://localhost:${PORT}`);
});
