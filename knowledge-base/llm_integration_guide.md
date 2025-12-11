# Guia de Integração para Agentes LLM

Este documento define como Agentes de Inteligência Artificial (LLMs) devem interagir com os módulos de automação do Sistema Hospitalar.

## Arquitetura de Agentes

A visão é que cada "Agente Funcionário" seja uma instância de LLM especializada que utiliza as ferramentas disponíveis neste repositório para realizar tarefas.

### Tipos de Agentes

1.  **Agente Operacional (Visual):**
    *   **Função:** Realizar tarefas que exigem interação humana ou não possuem API.
    *   **Ferramenta Principal:** Módulo `/visual` (Playwright).
    *   **Comando Exemplo:** `npm run action:schedule -- --patient="João Silva" --date="2025-10-10"`
    *   **Personalidade:** Paciente, meticuloso, simula comportamento humano.

2.  **Agente Analítico (Core):**
    *   **Função:** Gerar relatórios, monitorar dados em tempo real, auditoria.
    *   **Ferramenta Principal:** Módulo `/core` (Python API/SQL).
    *   **Comando Exemplo:** `python core/reports.py --type=daily_occupancy`
    *   **Personalidade:** Rápido, preciso, focado em dados.

## Interface de Comandos (Proposta)

Para que um LLM controle o sistema, devemos expor os scripts como "Tools" (Ferramentas).

### Definição de Ferramentas (JSON Schema)

#### 1. `hospital_login_visual`
```json
{
  "name": "hospital_login_visual",
  "description": "Realiza login no sistema hospitalar via interface gráfica para iniciar sessão visual.",
  "parameters": {
    "type": "object",
    "properties": {
      "headless": { "type": "boolean", "description": "Se true, roda sem mostrar o navegador." }
    }
  }
}
```

#### 2. `hospital_get_data_api`
```json
{
  "name": "hospital_get_data_api",
  "description": "Busca dados do sistema via API (mais rápido que visual).",
  "parameters": {
    "type": "object",
    "properties": {
      "endpoint": { "type": "string", "description": "Endpoint da API (ex: /dashboard)" }
    }
  }
}
```

## Fluxo de Trabalho Autônomo

1.  **Recebimento da Tarefa:** O Agente recebe "Verificar se há vagas para Dermatologia amanhã".
2.  **Decisão:** O Agente consulta o `system_context.md` e decide:
    *   *Existe API para isso?* Se sim, usa `/core`.
    *   *Se não,* usa `/visual` para navegar até a agenda.
3.  **Execução:** O Agente invoca o script correspondente.
4.  **Observação:** O script retorna JSON ou Texto (logs).
5.  **Resposta:** O Agente processa a saída e responde ao usuário.

## Próximos Passos para Integração

1.  Criar um wrapper `agent_controller.py` que recebe comandos em linguagem natural e mapeia para os scripts existentes.
2.  Implementar endpoints de API no módulo `/core` para todas as funções de leitura.
3.  Expandir o módulo `/visual` para aceitar parâmetros de entrada via CLI (atualmente hardcoded).
