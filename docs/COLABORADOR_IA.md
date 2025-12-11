# Arquitetura: Colaborador como Assistente IA (AI Twin)

## 1. Conceito Central
Cada colaborador humano da Hospitalar recebe um "Gêmeo Digital" (AI Twin). O objetivo não é substituir o humano, mas **elevar** sua função. O humano deixa de ser um "executor de tarefas" para se tornar um "gerente de IA" e focar exclusivamente em relacionamento e estratégia.

## 2. As 3 Fases da Evolução

### Fase 1: Shadow Mode (O Aprendiz)
*   **Autonomia:** 0% (Apenas Observação)
*   **Comportamento:** A IA roda em segundo plano, registrando cliques, textos digitados e decisões tomadas pelo humano.
*   **Output:** Relatórios de sugestão. *"Notei que você envia este mesmo e-mail de cobrança todo dia às 09:00. Quer que eu automatize?"*

### Fase 2: Copilot (O Parceiro)
*   **Autonomia:** 50% (Humano Valida)
*   **Comportamento:** A IA prepara o trabalho e pede o "OK" final.
*   **Exemplo:** A IA rascunha o e-mail de resposta para o cliente, anexa o boleto e notifica o humano: *"E-mail pronto. Enviar?"* (Botão de 1 clique).

### Fase 3: Autopilot (O Especialista)
*   **Autonomia:** 90% (Supervisão por Exceção)
*   **Comportamento:** A IA executa o processo ponta-a-ponta. O humano só é acionado se a IA tiver baixa confiança (<80%) ou se o cliente demonstrar insatisfação (análise de sentimento).
*   **Foco do Humano:** Ligar para clientes VIP, negociar parcerias complexas, criar novas estratégias que a IA depois aprenderá.

## 3. Arquitetura Técnica do AI Twin

### 3.1. Perfil de Aprendizado
Cada AI Twin possui um banco de dados vetorial próprio (`EmployeeMemory`) contendo:
*   **Estilo de Escrita:** A IA aprende o tom de voz do colaborador (formal, amigável, técnico).
*   **Padrões de Decisão:** *"O João sempre dá 5% de desconto para clientes antigos, mas nega para novos."*
*   **Horários de Pico:** A IA aprende quando não interromper.

### 3.2. Interface de Validação Rápida (1-Click)
Um painel lateral (sidebar) no sistema onde a IA coloca as tarefas "pré-mastigadas".
*   [Enviar Proposta X] -> Botão ✅ ou ❌
*   [Agendar Reunião Y] -> Botão ✅ ou ❌

### 3.3. Métricas de Sucesso (KPIs do Twin)
*   **Taxa de Automação:** % de tarefas executadas sem edição humana.
*   **Tempo Economizado:** Horas/homem devolvidas para atividades nobres.
*   **Nível de Confiança:** Quão precisa a IA está em suas previsões.

## 4. Integração com "The Board"
Os AI Twins reportam para os Agentes do Conselho.
*   O **AI Twin do Vendedor** reporta resultados para o **Agente Growth (CMO)**.
*   O **AI Twin do Financeiro** reporta fluxo de caixa para o **Agente Ledger (CFO)**.

Isso cria uma hierarquia onde a IA Estratégica gerencia as IAs Operacionais, e os Humanos supervisionam o todo e cuidam das pessoas.
