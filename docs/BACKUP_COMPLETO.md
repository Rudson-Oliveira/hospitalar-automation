# Backup Completo e Documentação Técnica - Hospitalar Automation

**Data do Backup:** 12 de Dezembro de 2025
**Versão:** 1.0.0 (Produção)
**Autor:** Manus AI

---

## 1. Visão Geral do Sistema

O **Hospitalar Automation** é um sistema multi-agente autônomo projetado para gerenciar operações de saúde. O sistema utiliza uma arquitetura de "Board" (Conselho) onde agentes de IA (CEO, CMO, CFO, CTO, COO) colaboram para tomar decisões de negócios, monitorar KPIs e executar ações operacionais.

### Arquitetura
O sistema é composto por três camadas principais:
1.  **Camada de Agentes (Backend):** Lógica de decisão, orquestração de reuniões e integração com APIs externas.
2.  **Camada de Interface (Frontend):** Dashboard web para visualização em tempo real das conversas e decisões dos agentes.
3.  **Camada de Infraestrutura (DevOps):** Dockerização e scripts de deploy para execução em nuvem (Railway).

### Fluxo de Dados
1.  **Entrada:** Dados são coletados via `DataAdapter` (simulados ou reais da API Hospitalar).
2.  **Processamento:** O `BoardOrchestrator` inicia reuniões baseadas em tópicos críticos.
3.  **Decisão:** Agentes (`personas.ts`) debatem e geram ações.
4.  **Saída:** Decisões são enviadas via WebSocket para o Dashboard e executadas via APIs.

---

## 2. Estrutura de Arquivos

```
hospitalar-automation/
├── visual/
│   ├── src/
│   │   ├── agents/              # Lógica dos Agentes de IA
│   │   │   ├── orchestrator.ts  # Gerenciador de reuniões e fluxo
│   │   │   ├── personas.ts      # Definição dos agentes (CEO, CTO, etc.)
│   │   │   └── data-adapter.ts  # Integração com dados externos
│   │   ├── web-interface/       # Servidor Web e Frontend
│   │   │   ├── dashboard-server.ts # Servidor Express + WebSocket
│   │   │   ├── dashboard.html   # Interface do usuário
│   │   │   └── settings.html    # Painel de configuração
│   │   └── services/            # Serviços de integração (API Hospitalar)
│   ├── Dockerfile               # Configuração de container (Playwright)
│   ├── package.json             # Dependências e scripts
│   └── tsconfig.json            # Configuração TypeScript
├── docs/                        # Documentação do projeto
└── README.md                    # Guia inicial
```

---

## 3. Instruções de Deployment (Railway)

O projeto está configurado para deploy contínuo no Railway via GitHub.

### Pré-requisitos
- Conta no Railway (railway.app)
- Repositório GitHub conectado

### Passo a Passo
1.  **Conectar Repositório:** No Railway, crie um novo projeto a partir do repositório GitHub `Rudson-Oliveira/hospitalar-automation`.
2.  **Configurar Variáveis de Ambiente:**
    Adicione as seguintes variáveis no painel do Railway:
    - `PORT`: `3000` (ou deixe automático)
    - `NODE_ENV`: `production`
    - `OPENAI_API_KEY`: `sk-...` (Sua chave da OpenAI)
    - `HOSPITALAR_API_URL`: URL da API de produção
3.  **Build e Deploy:**
    - O Railway detectará automaticamente o `Dockerfile`.
    - O comando de build `npm run build` será executado.
    - O comando de start `npm start` iniciará o servidor.

### Dockerfile de Produção
O arquivo `Dockerfile` foi otimizado para suportar o Playwright (navegador headless) necessário para os agentes tirarem screenshots.

```dockerfile
# Usar imagem oficial do Playwright (já tem navegadores e dependências)
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para tsc)
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
```

---

## 4. Código Fonte Principal

### Dashboard Server (`dashboard-server.ts`)
Servidor responsável por servir a interface e gerenciar conexões WebSocket.

```typescript
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { BoardOrchestrator } from '../agents/orchestrator';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3002;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '.')));

const board = new BoardOrchestrator();

wss.on('connection', (ws) => {
  // Enviar histórico inicial
  ws.send(JSON.stringify({
    type: 'HISTORY',
    data: board.getHistory()
  }));
  
  // ... Lógica de eventos em tempo real
});

server.listen(PORT, () => {
  console.log(`🚀 Dashboard Server rodando na porta ${PORT}`);
});
```

### Orquestrador (`orchestrator.ts`)
Núcleo do sistema que gerencia o estado das reuniões e interações dos agentes.

```typescript
export class BoardOrchestrator {
  private context: MeetingContext;
  private dataAdapter: DataAdapter;

  constructor() {
    this.context = { topic: '', status: 'OPEN', history: [], decisions: [] };
    this.dataAdapter = new DataAdapter(true); // Default: Mock
  }

  public async startMeeting(topic: string, initiator: string) {
    const realData = await this.dataAdapter.fetchRealData();
    // ... Lógica de início de reunião
  }
  
  // ... Métodos de processamento e log
}
```

---

## 5. Links Importantes

| Recurso | URL |
|---------|-----|
| **Repositório GitHub** | [Rudson-Oliveira/hospitalar-automation](https://github.com/Rudson-Oliveira/hospitalar-automation) |
| **URL de Produção** | [https://hospitalar-automation-production.up.railway.app/](https://hospitalar-automation-production.up.railway.app/) |
| **Painel Railway** | [Railway Dashboard](https://railway.app/dashboard) |
| **API Hospitalar** | [dev.hospitalarsaude.app.br](https://dev.hospitalarsaude.app.br) |

---

**Nota:** Este documento deve ser atualizado sempre que houver mudanças significativas na arquitetura ou processo de deploy.
