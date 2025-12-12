# Guia de Deploy no Railway - Agente Autônomo Comet

## 📋 Pré-requisitos

- Conta no Railway (https://railway.app)
- Railway CLI instalada (`npm install -g @railway/cli`)
- Acesso ao repositório GitHub
- Token de acesso do Railway (opcional, para CI/CD)

## 🚀 Deploy Automático via Railway CLI

### 1. Autenticar no Railway

```bash
railway login
```

Isso abrirá uma janela do navegador para autenticação.

### 2. Conectar ao Projeto

```bash
cd /home/ubuntu/hospitalar-automation
railway link
```

Selecione o projeto `hospitalar-automation-production` quando solicitado.

### 3. Fazer Deploy

```bash
railway up
```

Isso fará o deploy das alterações para o Railway.

## 🔧 Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no painel do Railway:

```env
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
HOSPITAL_URL=https://dev.hospitalarsaude.app.br
HOSPITAL_USER=seu_email@exemplo.com
HOSPITAL_PASS=sua_senha_aqui
PROCUREMENT_URL=https://dev.hospitalarsaude.app.br/compras/novo
DEMANDS_URL=https://dev.hospitalarsaude.app.br/demandas
REPORTS_URL=https://dev.hospitalarsaude.app.br/relatorios
HEADLESS_BROWSER=true
BROWSER_TIMEOUT=30000
LOG_LEVEL=info
```

### Como Adicionar Variáveis no Railway

1. Acesse o painel do Railway: https://railway.app/dashboard
2. Selecione o projeto `hospitalar-automation-production`
3. Vá para a aba "Variables"
4. Clique em "Add Variable" e adicione cada variável

## 📡 URLs de Acesso

Após o deploy, o agente estará disponível em:

- **Base URL**: https://hospitalar-automation-production.up.railway.app/
- **Health Check**: https://hospitalar-automation-production.up.railway.app/health
- **Agent Info**: https://hospitalar-automation-production.up.railway.app/agent/info
- **API Docs**: https://hospitalar-automation-production.up.railway.app/agent/tests

## 🧪 Testar o Deploy

### 1. Verificar Health Check

```bash
curl https://hospitalar-automation-production.up.railway.app/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-12-12T...",
  "uptime": 123.45,
  "browserActive": false
}
```

### 2. Obter Informações do Agente

```bash
curl https://hospitalar-automation-production.up.railway.app/agent/info
```

### 3. Listar Testes Disponíveis

```bash
curl https://hospitalar-automation-production.up.railway.app/agent/tests
```

### 4. Executar um Teste

```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/tests/1/run
```

## 📊 Monitoramento

### Logs em Tempo Real

```bash
railway logs
```

### Status do Deployment

```bash
railway status
```

### Métricas

Acesse o painel do Railway para visualizar:
- CPU Usage
- Memory Usage
- Network I/O
- Deployment Status

## 🔄 Deploy Contínuo (CI/CD)

Para configurar deploy automático quando fizer push para o GitHub:

1. Acesse o painel do Railway
2. Vá para "Settings" → "GitHub"
3. Conecte seu repositório GitHub
4. Ative "Auto Deploy on Push"

## 🛠️ Troubleshooting

### Erro: "Cannot find module 'openai'"

**Solução**: Certifique-se de que `npm install` foi executado:
```bash
cd visual && npm install
```

### Erro: "Port already in use"

**Solução**: Railway atribui a porta automaticamente via variável `PORT`. Certifique-se de que o servidor usa `process.env.PORT`.

### Erro: "Playwright browser not found"

**Solução**: O Dockerfile instala o Chromium. Se o erro persistir, adicione à variável de ambiente:
```
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false
```

### Erro: "OpenAI API Key not configured"

**Solução**: O agente funciona sem OpenAI (usando regex como fallback). Para usar OpenAI, configure a variável `OPENAI_API_KEY`.

## 📝 Rollback

Para reverter para uma versão anterior:

```bash
railway rollback
```

## 🔐 Segurança

- **Nunca commite arquivos .env**: Use variáveis de ambiente do Railway
- **Credenciais sensíveis**: Configure no painel do Railway, não no código
- **Logs**: Sanitize logs sensíveis antes de fazer commit

## 📞 Suporte

Para mais informações sobre Railway:
- Documentação: https://docs.railway.app
- Status: https://status.railway.app
- Comunidade: https://discord.gg/railway

---

**Última atualização**: 2024-12-12
**Versão do Agente**: 2.0.0
