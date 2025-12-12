# 🧠 PROJECT_CONTEXT.md - Memória do Projeto Hospitalar AI

**Data da Última Atualização:** 12/12/2025
**Status:** Pronto para Produção (v2.0)
**Repositório:** `Rudson-Oliveira/hospitalar-automation`

---

## 1. Visão Geral do Projeto
O **Hospitalar AI** é um ecossistema de automação multi-agente projetado para gerenciar autonomamente processos críticos da empresa Hospitalar. O sistema utiliza uma arquitetura de "Conselho de IAs" (The Board) para tomada de decisão estratégica e "Gêmeos Digitais" (AI Twins) para automação operacional.

### Objetivos Principais
1.  **Autonomia:** Reduzir a dependência humana em tarefas repetitivas em 90%.
2.  **Inteligência:** Tomar decisões baseadas em dados reais (Leads, Financeiro, Churn) em tempo real.
3.  **Acessibilidade:** Permitir que usuários leigos operem o sistema através de interfaces adaptativas.

---

## 2. Arquitetura Técnica

### Estrutura de Diretórios
```
hospitalar-automation/
├── docs/                   # Documentação Estratégica (Arquitetura, Roadmap)
├── visual/                 # Aplicação Principal (Node.js + TypeScript)
│   ├── src/
│   │   ├── agents/         # Cérebro das IAs (Orquestrador, Personas, Motor de Decisão)
│   │   ├── web-interface/  # Frontend (Dashboard, Settings, Copilot)
│   │   ├── services/       # Conectores (Hospitalar API, WhatsApp)
│   │   └── middleware/     # Segurança e Autenticação
│   ├── setup.bat           # Instalador Windows
│   ├── setup.sh            # Instalador Linux/Mac
│   └── Procfile            # Configuração de Deploy (Railway/Render)
```

### Componentes Chave
*   **The Board (Orchestrator):** O núcleo que gerencia as reuniões entre os agentes (CEO, CMO, CFO, CTO).
*   **AI Twins:** Módulos que aprendem com o comportamento dos colaboradores (Shadow Mode).
*   **HospitalarService:** Conector que integra o sistema à API legada (`dev.hospitalarsaude.app.br`).
*   **Dashboard Server:** Servidor Express que serve a interface web e gerencia WebSockets.

---

## 3. Estado Atual das Funcionalidades

| Funcionalidade | Status | Descrição |
| :--- | :--- | :--- |
| **Sistema Multi-Agente** | ✅ Pronto | Agentes debatem e tomam decisões autônomas. |
| **Dashboard Executivo** | ✅ Pronto | Interface visual com chat em tempo real e KPIs. |
| **Integração Real** | ✅ Pronto | Conecta com API da Hospitalar (Leads/Financeiro). |
| **Instalador 1-Clique** | ✅ Pronto | Scripts `.bat` e `.sh` funcionais. |
| **Sistema Educador** | ✅ Pronto | Onboarding adaptativo e Assistente Virtual. |
| **Deploy na Nuvem** | ✅ Pronto | Configurado para Railway/Render via `npm start`. |

---

## 4. Guia de Continuidade (Para Desenvolvedores)

### Como Rodar o Projeto
1.  **Instalar:** `npm install` (dentro de `/visual`)
2.  **Rodar:** `npm start` (Inicia servidor na porta 3000 ou definida por PORT)
3.  **Simular:** `npm run sim:full` (Roda simulação no terminal)

### Variáveis de Ambiente (.env)
O sistema depende das seguintes variáveis (configuráveis via `/settings`):
*   `HOSPITAL_URL`: URL da API do ERP.
*   `HOSPITAL_USER` / `HOSPITAL_PASS`: Credenciais de admin.
*   `OPENAI_API_KEY`: Chave para inteligência dos agentes.
*   `WHATSAPP_API_TOKEN`: Token da Twilio/Meta.

### Pontos de Atenção
*   **Axios:** O projeto usa um patch de tipagem no `hospitalar-api.ts` devido a uma incompatibilidade de versão. Não remova o `@ts-ignore`.
*   **WebSocket:** O dashboard usa WS para atualizações em tempo real. Em produção (Railway), certifique-se que o WS está habilitado.

---

## 5. Próximos Passos (Roadmap)

1.  **Fase de Produção:** Realizar deploy no Railway e conectar ao banco de dados de produção.
2.  **Treinamento de IA:** Alimentar o Vector DB com PDFs e manuais da Hospitalar (RAG).
3.  **Expansão dos Twins:** Criar perfis específicos para cada departamento (RH, Jurídico).

---

**Este arquivo deve ser mantido na raiz do projeto para garantir que qualquer nova instância de IA ou desenvolvedor entenda imediatamente o contexto.**
