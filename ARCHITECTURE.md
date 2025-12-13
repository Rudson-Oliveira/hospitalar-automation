# Arquitetura do Sistema de Automação Hospitalar & Obsidian

Este documento define a separação estratégica e técnica entre os dois módulos principais do projeto, conforme diretrizes do Product Owner.

## 1. Obsidian (Agente Pessoal)
**Objetivo:** Assistente pessoal desktop estilo "Comet".
**Escopo:** Controle da máquina local do usuário.
**Características:**
- **Execução:** Local (Desktop do Usuário).
- **Interface:** Headful (Navegador visível).
- **Interação:** Move o mouse, clica, digita, "vê" a tela junto com o usuário.
- **Foco:** Produtividade pessoal e auxílio na navegação.

## 2. Sistema Autônomo Hospitalar (Enterprise)
**Objetivo:** Automação inteligente integrada ao ERP Hospitalar.
**Escopo:** `dev.hospitalarsaude.app.br` e processos de backend.
**Modos de Operação Híbridos:**

### A. Modo Frontend (Assistido)
- **Quando:** Usuário está ativo no sistema.
- **Ação:** O agente opera via navegador (Playwright), auxiliando no preenchimento de formulários e navegação.
- **Comportamento:** Visual, educativo, "copiloto".

### B. Modo Backend (Autônomo)
- **Quando:** Tarefas agendadas, processamento em lote ou quando o usuário não está presente.
- **Ação:** O agente opera via API (HTTP Requests) e Banco de Dados (SQL).
- **Vantagem:** Muito mais rápido, robusto e não ocupa a tela.

## Estrutura de Código Sugerida

```
src/
├── agents/
│   ├── obsidian/           # Lógica específica do Agente Pessoal
│   │   └── desktop-controller.ts
│   └── hospitalar/         # Lógica do Sistema Enterprise
│       ├── frontend-agent.ts  (Playwright)
│       └── backend-agent.ts   (API/DB)
├── core/
│   ├── brain/              # IA Compartilhada (NLP)
│   └── orchestrator/       # Decide qual agente ativar
└── shared/                 # Utilitários comuns
```

## Próximos Passos de Implementação
1. Configurar script `npm run obsidian` para rodar em modo Desktop (Headful).
2. Implementar `BackendExecutor` para realizar tarefas via API.
3. Criar seletor de modo no `autonomous-agent.ts`.
