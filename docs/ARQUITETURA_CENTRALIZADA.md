# Arquitetura do Sistema Centralizado Hospitalar (Hospitalar OS)

## 1. Visão Geral
O **Hospitalar OS** é uma plataforma unificada projetada para centralizar a comunicação, automação e inteligência de dados do ambiente hospitalar. O objetivo é eliminar silos de informação, reduzir custos com SaaS de terceiros e garantir a soberania dos dados para alimentar agentes de IA de alta precisão.

## 2. Diagrama de Arquitetura (Conceitual)

```mermaid
graph TD
    subgraph "Canais de Entrada (Sources)"
        WA[WhatsApp (Twilio)] -->|Webhook| API_GW
        EM[Email Server] -->|IMAP/SMTP| API_GW
        SOC[Redes Sociais] -->|API| API_GW
        ROBO[Robô Web (Automação)] -->|WebSocket/JSON| API_GW
    end

    subgraph "Núcleo do Sistema (The Core)"
        API_GW[API Gateway / Event Bus]
        ORCH[Orquestrador de Agentes]
        KNOW[Gestão de Conhecimento]
    end

    subgraph "Camada de Dados (Memory)"
        DB[(PostgreSQL - Dados Estruturados)]
        VEC[(ChromaDB - Vetorial/RAG)]
        REDIS[Redis - Filas & Cache]
    end

    subgraph "Inteligência Artificial (The Brain)"
        LLM[LLM Engine (GPT-4 / Local Llama)]
        AGENT_A[Agente de Triagem]
        AGENT_B[Agente Financeiro]
        AGENT_C[Agente de Agendamento]
    end

    subgraph "Interface Unificada (Frontend)"
        DASH[Dashboard Omnichannel]
    end

    API_GW <--> ORCH
    ORCH <--> DB
    ORCH <--> VEC
    ORCH <--> LLM
    ORCH <--> REDIS
    ORCH --> DASH
    ROBO <--> REDIS
```

## 3. Componentes Principais

### 3.1. O Núcleo (Core Backend)
*   **Tecnologia Sugerida:** Python (FastAPI) ou Node.js (NestJS).
*   **Função:** Receber eventos de todos os canais, normalizar os dados e encaminhar para os agentes de IA ou filas de processamento.
*   **Diferencial:** Possui um "Barramento de Eventos" onde uma mensagem de WhatsApp é tratada da mesma forma técnica que um alerta do robô web.

### 3.2. O Robô Web (Integração Legada)
*   **Status:** Já existente (`hospitalar-automation`).
*   **Evolução:** Deixará de ser uma ferramenta isolada para se tornar um **Microserviço de Coleta**.
*   **Integração:** Em vez de apenas salvar JSONs locais, o robô enviará os dados extraídos (relatórios, KPIs) diretamente para o Banco de Dados Central via API ou Fila (Redis), alimentando os Agentes em tempo real.

### 3.3. Banco de Conhecimento (RAG)
*   **Estrutura:** Armazena não apenas logs, mas "conhecimento".
*   **Exemplo:** Quando o robô baixa um PDF de "Protocolo de Atendimento", esse PDF é lido, vetorizado e salvo no ChromaDB. Quando um atendente (ou IA) no WhatsApp precisa responder sobre o protocolo, a informação é recuperada instantaneamente.

### 3.4. Interface Omnichannel
*   **Tecnologia:** React / Next.js.
*   **Visão:** Uma única tela onde o operador vê:
    *   Chat do WhatsApp com o paciente.
    *   Dados financeiros desse paciente (trazidos pelo Robô Web).
    *   Histórico de emails trocados.
    *   Sugestões de resposta da IA baseadas no histórico.

## 4. Fluxo de Dados Exemplo

1.  **Evento:** Paciente pergunta no WhatsApp: "Meu relatório financeiro já saiu?"
2.  **Ingestão:** Twilio envia Webhook -> API Gateway recebe.
3.  **Processamento:**
    *   O **Agente de Triagem** analisa a intenção ("Consulta Financeira").
    *   O Agente consulta o **Banco de Dados Central**: "Temos o relatório do paciente X?"
    *   *Cenário A (Tem):* Recupera o dado e responde.
    *   *Cenário B (Não tem):* O Agente posta uma tarefa na fila do **Robô Web**: "Baixar relatório do paciente X agora".
4.  **Ação do Robô:** O robô (que está online) recebe o comando, navega, baixa o PDF, extrai o valor e devolve para o sistema.
5.  **Resposta:** O Agente recebe a confirmação e responde no WhatsApp: "Acabou de sair, aqui está o resumo...".

## 5. Benefícios da Centralização
*   **Custo:** Elimina necessidade de Zapsign, CRMs caros ou ferramentas de automação de terceiros (Zapier/Make), pois o orquestrador interno faz isso.
*   **Inteligência:** A IA não alucina pois tem acesso direto aos dados "frescos" coletados pelo robô.
*   **Propriedade:** Todo o histórico e inteligência ficam no seu servidor, não na nuvem de terceiros.
