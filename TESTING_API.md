# Guia de Testes - API REST do Agente Autônomo Comet

## 📍 URL Base

```
https://hospitalar-automation-production.up.railway.app
```

## 🏥 Endpoints Disponíveis

### 1. Health Check
Verifica se o servidor está online e operacional.

**Endpoint:**
```
GET /health
```

**Exemplo com curl:**
```bash
curl https://hospitalar-automation-production.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-12T10:30:45.123Z",
  "uptime": 3600.5,
  "browserActive": false
}
```

---

### 2. Informações do Agente
Obtém informações sobre o agente Comet.

**Endpoint:**
```
GET /agent/info
```

**Exemplo com curl:**
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/info
```

**Resposta esperada:**
```json
{
  "name": "Comet",
  "version": "2.0.0",
  "model": "gpt-4-turbo-preview",
  "capabilities": [
    "Criar pedidos de compra",
    "Listar demandas",
    "Gerar relatórios",
    "Navegação automática",
    "Preenchimento de formulários",
    "Extração de dados"
  ],
  "status": "active",
  "hasOpenAI": true
}
```

---

### 3. Processar Mensagem
Envia uma mensagem em linguagem natural para o agente processar.

**Endpoint:**
```
POST /agent/message
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Crie um pedido de compra para 10 luvas cirúrgicas",
  "userId": "user123",
  "context": {}
}
```

**Exemplo com curl:**
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Crie um pedido de compra para 10 luvas cirúrgicas",
    "userId": "user123"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "response": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "messageId": "550e8400-e29b-41d4-a716-446655440001",
    "content": "Tarefa executada: Pedido de Compra: 10x luvas cirúrgicas. Status: COMPLETED",
    "actions": [...],
    "status": "success",
    "timestamp": "2024-12-12T10:30:45.123Z",
    "executionTime": 5000
  },
  "task": {...}
}
```

---

### 4. Listar Testes Disponíveis
Lista os testes pré-configurados que podem ser executados.

**Endpoint:**
```
GET /agent/tests
```

**Exemplo com curl:**
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/tests
```

**Resposta esperada:**
```json
{
  "tests": [
    {
      "id": 1,
      "command": "Crie um pedido de compra para 10 luvas cirúrgicas",
      "description": "Testa criação de pedido de compra"
    },
    {
      "id": 2,
      "command": "Mostre as demandas abertas do setor administrativo",
      "description": "Testa listagem de demandas filtradas"
    },
    {
      "id": 3,
      "command": "Gere um relatório de compras do mês",
      "description": "Testa geração de relatório"
    },
    {
      "id": 4,
      "command": "Navegar para https://google.com",
      "description": "Testa navegação simples"
    },
    {
      "id": 5,
      "command": "Crie 5 pedidos para 100 máscaras cada",
      "description": "Testa criação em lote"
    }
  ],
  "total": 5
}
```

---

### 5. Executar Teste por ID
Executa um dos testes pré-configurados.

**Endpoint:**
```
POST /agent/tests/:id/run
```

**Exemplo com curl (Teste 1):**
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/tests/1/run
```

**Resposta esperada:**
```json
{
  "success": true,
  "testId": "1",
  "command": "Crie um pedido de compra para 10 luvas cirúrgicas",
  "intent": {
    "type": "CREATE_PURCHASE_ORDER",
    "confidence": 0.85,
    "params": {
      "quantity": "10",
      "item": "luvas cirúrgicas"
    },
    "originalQuery": "Crie um pedido de compra para 10 luvas cirúrgicas"
  },
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Pedido de Compra: 10x luvas cirúrgicas",
    "steps": [...],
    "status": "PENDING",
    "currentStepIndex": 0
  }
}
```

---

### 6. Obter Histórico de Conversa
Retorna o histórico de conversas do agente.

**Endpoint:**
```
GET /agent/history
```

**Exemplo com curl:**
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/history
```

**Resposta esperada:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Crie um pedido de compra para 10 luvas cirúrgicas"
    },
    {
      "role": "assistant",
      "content": "Entendi sua solicitação. Vou criar um pedido de compra para 10 luvas cirúrgicas."
    }
  ],
  "count": 2
}
```

---

### 7. Limpar Histórico
Limpa o histórico de conversas do agente.

**Endpoint:**
```
POST /agent/history/clear
```

**Exemplo com curl:**
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/history/clear
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Histórico limpo com sucesso"
}
```

---

### 8. Obter Status de Tarefa
Obtém o status de uma tarefa específica.

**Endpoint:**
```
GET /agent/task/:id
```

**Exemplo com curl:**
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/task/550e8400-e29b-41d4-a716-446655440000
```

**Resposta esperada:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pedido de Compra: 10x luvas cirúrgicas",
  "steps": [...],
  "status": "COMPLETED",
  "currentStepIndex": 6,
  "executionTime": 5000
}
```

---

### 9. Obter Resposta Anterior
Obtém uma resposta anterior do agente pelo ID.

**Endpoint:**
```
GET /agent/response/:id
```

**Exemplo com curl:**
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/response/550e8400-e29b-41d4-a716-446655440001
```

---

### 10. Inicializar Navegador
Inicializa o navegador Playwright para automação.

**Endpoint:**
```
POST /browser/init
```

**Exemplo com curl:**
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/browser/init
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Navegador inicializado"
}
```

---

### 11. Fechar Navegador
Fecha o navegador Playwright.

**Endpoint:**
```
POST /browser/close
```

**Exemplo com curl:**
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/browser/close
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Navegador fechado"
}
```

---

## 🧪 Sequência de Testes Recomendada

### Teste 1: Verificar Saúde do Sistema
```bash
curl https://hospitalar-automation-production.up.railway.app/health
```

### Teste 2: Obter Informações do Agente
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/info
```

### Teste 3: Listar Testes Disponíveis
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/tests
```

### Teste 4: Executar Teste 1 (Criar Pedido)
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/tests/1/run
```

### Teste 5: Executar Teste 2 (Listar Demandas)
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/tests/2/run
```

### Teste 6: Executar Teste 3 (Gerar Relatório)
```bash
curl -X POST https://hospitalar-automation-production.up.railway.app/agent/tests/3/run
```

### Teste 7: Verificar Histórico
```bash
curl https://hospitalar-automation-production.up.railway.app/agent/history
```

---

## 📊 Exemplos com Python

### Teste Health Check
```python
import requests

response = requests.get('https://hospitalar-automation-production.up.railway.app/health')
print(response.json())
```

### Enviar Mensagem
```python
import requests

data = {
    "content": "Crie um pedido de compra para 10 luvas cirúrgicas",
    "userId": "user123"
}

response = requests.post(
    'https://hospitalar-automation-production.up.railway.app/agent/message',
    json=data
)
print(response.json())
```

### Executar Teste
```python
import requests

response = requests.post(
    'https://hospitalar-automation-production.up.railway.app/agent/tests/1/run'
)
print(response.json())
```

---

## 📊 Exemplos com JavaScript/Node.js

### Teste Health Check
```javascript
fetch('https://hospitalar-automation-production.up.railway.app/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Enviar Mensagem
```javascript
const data = {
  content: "Crie um pedido de compra para 10 luvas cirúrgicas",
  userId: "user123"
};

fetch('https://hospitalar-automation-production.up.railway.app/agent/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔍 Troubleshooting

### Erro: "Cannot GET /health"
- Verifique se o servidor está online
- Aguarde alguns minutos após o deploy

### Erro: "browserActive: false"
- O navegador não está inicializado
- Execute `POST /browser/init` antes de executar tarefas

### Erro: "OPENAI_API_KEY not configured"
- Configure a variável de ambiente no Railway
- O agente funcionará com fallback (regex) sem OpenAI

### Erro: "Timeout"
- Aumente o timeout da requisição
- Verifique a conectividade com o servidor

---

## 📝 Notas Importantes

1. **Primeira Execução**: A primeira requisição pode demorar alguns segundos enquanto o servidor inicia
2. **Histórico**: O histórico é mantido em memória e será perdido ao reiniciar o servidor
3. **Navegador**: O navegador consome recursos; feche-o quando não estiver em uso
4. **Rate Limiting**: Não há rate limiting configurado; use com moderação
5. **Logs**: Verifique os logs do Railway para debug detalhado

---

**Última atualização**: 2024-12-12
**Versão da API**: 2.0.0
