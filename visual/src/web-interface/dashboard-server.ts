import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
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

// Servir arquivos estáticos (HTML do Dashboard)
// Agora os arquivos são copiados para dist/web-interface no build
const staticPath = path.join(__dirname, '.');
app.use(express.static(staticPath));

// Instância do Board
const board = new BoardOrchestrator();

// Iniciar Agente Autônomo e Self-Healing
// Aguarda um pouco para garantir que o servidor WS esteja de pé
setTimeout(() => {
  const autonomousAgent = new AutonomousAgent(`ws://localhost:${PORT}`);
  const healer = new SelfHealingOrchestrator(autonomousAgent);
  
  // Iniciar monitoramento
  healer.startMonitoring();
  autonomousAgent.start().catch(err => {
    console.error(err);
    healer.reportFailure(err);
  });

  // Expor para debug/controle manual se necessário
  (global as any).agent = autonomousAgent;
  (global as any).healer = healer;
}, 5000);

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

// API: Ler Configurações (Protegido)
app.get('/api/settings', authMiddleware, requireAdmin, (req, res) => {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    res.json(envConfig);
  } else {
    res.json({});
  }
});

// API: Salvar Configurações (Protegido)
app.post('/api/settings', authMiddleware, requireAdmin, express.json(), (req, res) => {
  const envPath = path.join(__dirname, '../../.env');
  const newConfig = req.body;
  
  let envContent = '';
  for (const [key, value] of Object.entries(newConfig)) {
    envContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('Configurações atualizadas via Painel Web');
  res.sendStatus(200);
});

// API: Alterar Modo (Simulação vs Real)
app.post('/api/mode', express.json(), (req, res) => {
  const { mode } = req.body;
  if (board) {
    board.setLiveMode(mode === 'LIVE');
    res.json({ message: `Modo alterado para ${mode}` });
  } else {
    res.status(500).json({ error: 'Orquestrador não inicializado' });
  }
});

// API: Atualizar Sistema (Git Pull)
app.post('/api/update', (req, res) => {
  exec('git pull origin main', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha na atualização', details: stderr });
    }
    console.log(stdout);
    res.json({ message: 'Sistema atualizado com sucesso!', output: stdout });
  });
});

// API: Chaos Testing (Simular Falha)
app.post('/api/chaos/crash', (req, res) => {
  const agent = (global as any).agent;
  const healer = (global as any).healer;

  if (agent && healer) {
    console.warn('[CHAOS] 💥 Simulando falha crítica no agente...');
    // Forçar erro reportado ao healer
    healer.reportFailure(new Error('Simulação de Crash Manual (Chaos Testing)'));
    res.json({ message: 'Falha simulada com sucesso! Verifique os logs para ver o Self-Healing em ação.' });
  } else {
    res.status(500).json({ error: 'Agente ou Healer não inicializados.' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'dashboard.html'));
});

app.get('/copilot', (req, res) => {
  res.sendFile(path.join(staticPath, 'copilot-sidebar.html'));
});

app.get('/autonomy', (req, res) => {
  res.sendFile(path.join(staticPath, 'autonomy-dashboard.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(staticPath, 'settings.html'));
});

app.get('/virtual-assistant.html', (req, res) => {
  res.sendFile(path.join(staticPath, 'virtual-assistant.html'));
});

app.get('/onboarding', (req, res) => {
  res.sendFile(path.join(staticPath, 'onboarding-wizard.html'));
});

app.get('/nav-menu.js', (req, res) => {
  res.sendFile(path.join(staticPath, 'nav-menu.js'));
});

server.listen(PORT, () => {
  console.log(`🚀 Dashboard Server rodando em http://localhost:${PORT}`);
  console.log(`   - CEO Dashboard: http://localhost:${PORT}/`);
  console.log(`   - Copilot Sidebar: http://localhost:${PORT}/copilot`);
  console.log(`   - Autonomy Metrics: http://localhost:${PORT}/autonomy`);
});
