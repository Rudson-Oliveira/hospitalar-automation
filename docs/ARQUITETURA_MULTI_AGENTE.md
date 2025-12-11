# Arquitetura do Sistema Multi-Agente Autônomo (The Board)

## 1. Visão Geral
O sistema "The Board" consiste em um conselho diretor virtual composto por 5 Agentes de IA especializados que operam 24/7. Eles monitoram a empresa, debatem estratégias em uma "Sala de Reunião Virtual" e executam ações autônomas, escalando para o CEO humano (Rudson) apenas decisões de alto risco ou impacto financeiro crítico.

## 2. Os Agentes (O Conselho)

Cada agente possui uma *Persona* (personalidade e diretrizes), *Ferramentas* (acesso a dados) e *Objetivos*.

| Agente | Função | Foco Principal | Ferramentas Chave |
| :--- | :--- | :--- | :--- |
| **Alpha (Estratégico)** | CEO-IA / Chair | Visão macro, arbitragem de conflitos, alinhamento com objetivos do Rudson. | Acesso a todos os relatórios, diretrizes do CEO humano. |
| **Growth (Marketing)** | CMO-IA | Aquisição de clientes, funil de vendas, campanhas, parcerias. | Integração Meta Ads, CRM, Google Analytics, Email Mkt. |
| **Ledger (Financeiro)** | CFO-IA | Custos, ROI, fluxo de caixa, aprovação de orçamentos. | Acesso ao ERP Financeiro, Extratos, Planilhas de Custo. |
| **Tech (Técnico)** | CTO-IA | Infraestrutura, estabilidade do sistema, novas features, automação. | Logs do servidor, Status do GitHub, Monitoramento de API. |
| **Scout (Qualidade)** | COO-IA | Operação diária, satisfação do cliente, detecção de anomalias. | Tickets de suporte, NPS, Feedbacks, Logs de Erro. |

## 3. O Fluxo de Trabalho Autônomo (The Loop)

O sistema opera em um ciclo contínuo de 4 etapas:

### 3.1. Monitoramento (Sense)
*   Os agentes **Scout** e **Tech** varrem os dados em tempo real (banco de dados, logs, e-mails).
*   *Exemplo:* Scout detecta que o tempo de resposta no WhatsApp subiu 20% na última hora.

### 3.2. A "Reunião" (Think & Discuss)
*   Um agente convoca uma reunião na **Sala Virtual** (um chat persistente entre as IAs).
*   **Scout:** "Atenção Board, tempo de resposta crítico."
*   **Tech:** "Não há erros no servidor. Parece ser alto volume."
*   **Growth:** "Lançamos uma campanha nova hoje, isso explica o volume."
*   **Alpha:** "Precisamos de solução imediata. Sugestões?"

### 3.3. Proposta de Solução (Plan)
*   **Tech:** "Posso aumentar a agressividade do bot de triagem para filtrar mais casos."
*   **Growth:** "Cuidado para não perder leads qualificados."
*   **Ledger:** "Aumentar o bot tem custo zero. Contratar humano demora. Aprovo a solução do Tech."

### 3.4. Execução ou Escalonamento (Act)
*   **Alpha (Decisor):** Avalia o risco.
    *   *Baixo Risco:* Autoriza Tech a executar o comando de reconfiguração.
    *   *Alto Risco:* Envia notificação para o Rudson: "Detectamos alta demanda. Sugerimos ativar Modo Turbo na triagem. Autoriza? (Sim/Não)".

## 4. Arquitetura Técnica

### 4.1. Framework de Orquestração
Utilizaremos **LangGraph** (baseado em grafos) para definir o fluxo de conversa. Isso evita loops infinitos e garante que a "reunião" tenha começo, meio e fim.

### 4.2. Memória Compartilhada
*   **Short-term:** Contexto da reunião atual.
*   **Long-term (Vector DB):** Histórico de decisões passadas ("Já tivemos esse problema mês passado e a solução X funcionou").

### 4.3. Interface de Monitoramento (O Dashboard)
Uma tela onde o Rudson pode ver:
*   "Reuniões" acontecendo em tempo real (chat das IAs).
*   Lista de Decisões Autônomas tomadas hoje.
*   Lista de Pendências que exigem aprovação humana.

## 5. Protocolo de Segurança
Para evitar caos, implementaremos "Guardrails":
*   **Limite de Gastos:** O Agente Financeiro bloqueia qualquer ação que custe > R$ X sem aval humano.
*   **Imutabilidade:** Agentes não podem deletar dados críticos, apenas sugerir arquivamento.
*   **Botão de Pânico:** O Rudson pode "pausar" o Conselho a qualquer momento, assumindo controle manual.
