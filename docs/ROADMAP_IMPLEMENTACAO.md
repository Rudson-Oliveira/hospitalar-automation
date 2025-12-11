# Roadmap de Implementação

Este documento define o cronograma estratégico para transformar a automação atual em um ecossistema hospitalar completo.

## Fase 1: Fundação (Semanas 1-4)
**Objetivo:** Preparar o terreno para a centralização.
*   [ ] **Infraestrutura:** Configurar servidor central (Node.js/NestJS ou Python/FastAPI) e Banco de Dados (PostgreSQL).
*   [ ] **API Gateway:** Criar o ponto único de entrada para todos os webhooks.
*   [ ] **Autenticação:** Implementar sistema de login único (SSO) para administradores.
*   [ ] **Migração do Robô:** Adaptar o script atual (`hospitalar-automation`) para aceitar comandos via WebSocket do novo servidor.

## Fase 2: Integração de Canais (Semanas 5-8)
**Objetivo:** Conectar o mundo externo ao sistema.
*   [ ] **WhatsApp:** Conectar API do Twilio ao Gateway. Criar fluxos básicos de triagem.
*   [ ] **E-mail:** Configurar monitoramento IMAP para caixas prioritárias.
*   [ ] **Painel Unificado (v1):** Criar interface web onde atendentes veem mensagens de WhatsApp e E-mail na mesma tela.

## Fase 3: Inteligência & RAG (Semanas 9-12)
**Objetivo:** Dar "cérebro" ao sistema.
*   [ ] **Vector DB:** Subir instância do ChromaDB.
*   [ ] **Ingestão:** Processar PDFs de manuais e protocolos do hospital.
*   [ ] **Agente de Triagem:** Implementar IA que sugere respostas aos atendentes com base no RAG.

## Fase 4: Autonomia Supervisionada (Semanas 13-16)
**Objetivo:** Deixar a IA trabalhar sozinha com supervisão.
*   [ ] **Respostas Automáticas:** Permitir que a IA responda perguntas de baixa complexidade (ex: "qual horário de visita?") sem aprovação humana.
*   [ ] **Ações Ativas:** O Robô Web detecta "Exame Pronto" e o Agente WhatsApp avisa o paciente automaticamente.

## Fase 5: Expansão & Otimização (Contínuo)
**Objetivo:** Melhoria contínua.
*   [ ] **Analytics:** Dashboards de tempo de resposta, satisfação do paciente, volume por canal.
*   [ ] **Novos Canais:** Integrar Instagram/Facebook.
*   [ ] **Voz:** Implementar atendimento telefônico via IA (Voice AI).
