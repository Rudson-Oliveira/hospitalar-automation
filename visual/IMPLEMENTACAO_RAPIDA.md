# 🚀 IMPLEMENTAÇÃO IMEDIATA - Sistema Multi-Agente Hospitalar

Este guia foi desenhado para você sair do zero e ter IAs rodando em **menos de 10 minutos**. Sem teoria, apenas execução.

---

## 1️⃣ SETUP INICIAL (3 Minutos)

Abra seu terminal e cole os comandos abaixo em sequência:

### Passo 1: Instalar Dependências
```bash
cd hospitalar-automation/visual
npm install
```
*Isso baixa tudo que seus agentes precisam para "pensar" e "agir".*

### Passo 2: Verificar Instalação
```bash
npm run sim:basic
```
*Se você ver uma mensagem `[BOARD] Reunião iniciada...`, parabéns! Seu núcleo de IA está vivo.*

---

## 2️⃣ PRIMEIRA EXECUÇÃO (Teste Real)

Vamos ver seus agentes trabalhando. Abra **dois terminais**:

### Terminal 1: O Cérebro (Dashboard Server)
```bash
npm run dashboard
```
*Mantenha este terminal aberto. Ele é o servidor que conecta tudo.*

### Terminal 2: A Ação (Simulação)
```bash
npm run sim:full
```
*Isso dispara uma crise simulada onde o CEO, CFO e CMO debatem uma estratégia de retenção.*

### 👀 Onde ver?
Abra seu navegador em:
👉 **http://localhost:3002** (Painel do CEO - Veja a conversa em tempo real)
👉 **http://localhost:3002/copilot** (Visão do Funcionário)

---

## 3️⃣ INTEGRAÇÃO COM HOSPITALAR (Próximos Passos)

Para conectar esses agentes ao seu sistema real (`dev.hospitalarsaude.app.br`), você precisa configurar as credenciais.

1. Crie um arquivo `.env` na pasta `visual/`:
   ```bash
   cp .env.example .env
   ```
   *(Se não tiver exemplo, crie um arquivo novo)*

2. Adicione estas chaves no `.env`:
   ```env
   # Acesso ao Sistema Hospitalar
   HOSPITAL_URL=https://dev.hospitalarsaude.app.br
   HOSPITAL_USER=seu_usuario_admin
   HOSPITAL_PASS=sua_senha_admin

   # Integrações (Futuro)
   OPENAI_API_KEY=sk-... (Sua chave aqui)
   WHATSAPP_API_TOKEN=...
   ```

3. **Onde o código toca o sistema real?**
   Edite `src/agents/scout-integration.ts` (será criado na Fase 2) para usar essas variáveis e fazer login real.

---

## 4️⃣ TROUBLESHOOTING RÁPIDO

| Problema | Solução Rápida |
| :--- | :--- |
| **Erro `ts-node: command not found`** | Rode `npm install -g ts-node typescript` |
| **Erro de Import (`Cannot use import statement`)** | Verifique se `package.json` NÃO tem `"type": "module"` (nós removemos para compatibilidade) |
| **Dashboard não conecta (WebSocket Error)** | Garanta que o **Terminal 1** (`npm run dashboard`) está rodando antes de abrir o navegador |
| **Porta 3002 em uso** | Edite `src/web-interface/dashboard-server.ts` e mude `PORT` para 3003 |

---

## 5️⃣ QUICK WINS (Resultados em 24h)

Para gerar valor imediato, foque nestas 3 vitórias rápidas:

### 🥇 Vitória 1: O "Vigia Noturno" (Agente Scout)
*   **O que faz:** Monitora se o site `dev.hospitalarsaude.app.br` está no ar a cada 5 min.
*   **Como ativar:** Implementaremos um script simples de *ping* no próximo passo.
*   **Valor:** Você dorme tranquilo sabendo que a IA te acorda se o servidor cair.

### 🥈 Vitória 2: O "Copiloto de Vendas" (Agente Growth)
*   **O que faz:** Lê a última mensagem do cliente e sugere "Oferecer 5% de desconto" se detectar objeção de preço.
*   **Como ativar:** Use a simulação `npm run sim:twin` para treinar com seus logs de chat antigos.
*   **Valor:** Padroniza o atendimento da sua equipe comercial.

### 🥉 Vitória 3: Relatório Matinal Automático (Agente Alpha)
*   **O que faz:** Resume os KPIs de ontem e manda no seu WhatsApp às 08:00.
*   **Como ativar:** Conectar o Agente Alpha ao banco de dados (leitura apenas).
*   **Valor:** Você começa o dia sabendo tudo sem abrir 10 abas.

---
**Pronto para começar? Execute o Passo 1 agora!** 🚀
