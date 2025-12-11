# Planejamento de Integração de Canais

## 1. WhatsApp (Via Twilio) - *Canal Crítico*
Como já está em uso, a estratégia é **migrar a lógica** do fluxo atual para o novo Orquestrador Central, mantendo o número e a API.

*   **Estado Atual:** Provavelmente conectado a um fluxo simples ou plataforma de terceiro.
*   **Estado Futuro:** O Webhook do Twilio apontará para o nosso `API Gateway`.
*   **Funcionalidades Nativas a Implementar:**
    *   **Fila de Atendimento:** Distribuição automática de conversas para atendentes humanos quando a IA não resolver.
    *   **Disparo Ativo (HSM):** O Robô Web detecta "Exame Pronto" -> O Sistema dispara template WhatsApp automaticamente.
    *   **Mídia:** Recebimento e envio de fotos/PDFs (ex: foto da carteirinha do convênio) que são processados via OCR imediatamente.

## 2. E-mail Corporativo (SMTP/IMAP)
Integração direta com o servidor de e-mail do hospital (Exchange, Gmail, Office365 ou Postfix).

*   **Monitoramento (IMAP):** O sistema lerá caixas de entrada específicas (ex: `financeiro@hospital.com`, `agendamento@hospital.com`).
*   **Classificação Automática:** A IA lê o corpo do e-mail, classifica a urgência e cria um "Ticket" no sistema central.
*   **Resposta Automática Inteligente:** Para perguntas frequentes, o sistema gera o rascunho da resposta ou responde sozinho (se configurado).

## 3. Redes Sociais (Instagram/Facebook)
Centralização do SAC 2.0.

*   **API Oficial (Meta Graph API):** Conexão para receber DMs e Comentários.
*   **Unificação de Contexto:** Se o paciente "João" reclama no Instagram e depois chama no WhatsApp, o sistema (via CPF ou telefone) unifica os perfis e mostra ao atendente: *"Atenção: Este paciente fez uma reclamação no Instagram há 2 horas"*.

## 4. O Robô Web (Agente de Campo)
O robô que criamos (`hospitalar-automation`) é tratado como um canal de **entrada de dados** e **saída de ações**.

*   **Entrada:** Ele "fala" com o sistema enviando JSONs de relatórios que extraiu.
*   **Saída:** Ele "ouve" o sistema aguardando ordens de navegação.
*   **Protocolo:** WebSocket seguro. O robô mantém uma conexão persistente com o servidor central, pronto para agir em milissegundos.

## Tabela de Protocolos de Integração

| Canal | Protocolo | Tipo de Dados | Frequência | Prioridade |
| :--- | :--- | :--- | :--- | :--- |
| **WhatsApp** | Webhook (HTTP POST) | Texto, Áudio, Imagem, Loc | Tempo Real | Alta |
| **E-mail** | IMAP / SMTP | Texto Rico, Anexos | Polling (1-5 min) | Média |
| **Robô Web** | WebSocket / REST | JSON, Screenshots, Comandos | Tempo Real | Alta |
| **Instagram** | Webhook (Meta) | Texto, Mídia | Tempo Real | Média |
| **Legado (ERP)** | Banco de Dados (SQL) | Dados Estruturados | Batch / Diário | Baixa |
