# Arquitetura do Sistema Centralizado Hospitalar (Master Plan)

## 1. Visão Geral
Este documento define a arquitetura técnica e estratégica para a centralização de todos os processos de comunicação e automação do hospital. O objetivo é substituir ferramentas fragmentadas por um **Ecossistema Unificado** proprietário, reduzindo custos e aumentando a inteligência operacional.

## 2. O Conceito de "Hub Central"
O sistema funcionará como um **Orquestrador Inteligente**, posicionado entre o mundo externo (pacientes, parceiros) e os sistemas internos (ERP Hospitalar, Robôs de Automação).

### Diagrama de Arquitetura (Conceitual)

```mermaid
graph TD
    subgraph "Canais de Entrada (Omnichannel)"
        WA[WhatsApp / Twilio]
        EM[E-mail Corporativo]
        IG[Instagram / Facebook]
        WEB[Portal do Paciente]
    end

    subgraph "Núcleo do Sistema (O Cérebro)"
        API[API Gateway & Webhooks]
        ORCH[Orquestrador de Tarefas]
        AUTH[Autenticação & Segurança]
        
        subgraph "Agentes de IA"
            AG_TRI[Agente de Triagem]
            AG_FIN[Agente Financeiro]
            AG_AGE[Agente de Agendamento]
        end
    end

    subgraph "Banco de Conhecimento (Memória)"
        DB_SQL[(PostgreSQL - Dados)]
        DB_VEC[(ChromaDB - Vetores)]
        RAG[Motor RAG]
    end

    subgraph "Execução & Legado"
        ROBO[Robô Web (Playwright)]
        ERP[Sistema Hospitalar (Legado)]
    end

    WA --> API
    EM --> API
    IG --> API
    WEB --> API

    API --> ORCH
    ORCH --> AG_TRI
    ORCH --> AG_FIN
    ORCH --> AG_AGE

    AG_TRI <--> RAG
    RAG <--> DB_VEC

    ORCH --> ROBO
    ROBO <--> ERP
```

## 3. Componentes Principais

### 3.1. API Gateway & Webhooks
Ponto único de entrada. Recebe mensagens do WhatsApp, e-mails e interações sociais. Normaliza tudo para um formato padrão JSON antes de passar para o orquestrador.

### 3.2. Orquestrador de Tarefas
O "gerente" do sistema. Decide quem deve tratar cada solicitação:
*   É uma dúvida simples? -> Envia para **Agente de IA**.
*   É uma solicitação de relatório? -> Envia para **Robô Web**.
*   É um caso complexo/humano? -> Envia para **Fila de Atendimento Humano**.

### 3.3. Agentes de IA Especializados
Em vez de uma única IA genérica, teremos especialistas:
*   **Agente de Triagem:** Identifica a intenção do paciente.
*   **Agente Financeiro:** Consulta tabelas de convênios e preços.
*   **Agente de Agendamento:** Verifica disponibilidade na agenda.

### 3.4. Robô Web (Agente de Campo)
O sistema atual (`hospitalar-automation`) evolui para ser o "braço mecânico" do sistema. Ele não toma mais decisões estratégicas; ele recebe ordens do Orquestrador para executar ações no ERP legado que não possui API.

## 4. Tecnologias Sugeridas

*   **Backend:** Node.js (NestJS) ou Python (FastAPI) - *Recomendado Python pela facilidade com IA.*
*   **Banco de Dados:** PostgreSQL (Relacional) + Redis (Filas/Cache).
*   **Vector DB:** ChromaDB ou PGVector (para o RAG).
*   **Fila de Mensagens:** RabbitMQ ou BullMQ (para garantir que nenhuma mensagem se perca).
*   **Frontend:** React/Vite (já em uso no painel de controle).

## 5. Documentação Complementar
Para detalhes específicos de cada área, consulte os documentos anexos:

1.  [Integração de Canais (WhatsApp, Email, Social)](./INTEGRACAO_CANAIS.md)
2.  [Banco de Conhecimento & RAG](./BANCO_CONHECIMENTO.md)
3.  [Roadmap de Implementação](./ROADMAP_IMPLEMENTACAO.md)
4.  [Estratégia de Migração e Custos](./MIGRACAO_CUSTOS.md)
