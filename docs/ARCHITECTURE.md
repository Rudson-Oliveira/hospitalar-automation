# Arquitetura do Sistema de Automação Hospitalar

Este documento serve como a "Fonte da Verdade" (Single Source of Truth) para o desenvolvimento e manutenção do projeto. Qualquer agente de IA ou desenvolvedor deve consultar este arquivo antes de realizar alterações.

## 1. Visão Geral
O projeto visa automatizar processos no sistema **Hospitalar Saúde** (ambiente DEV: `https://dev.hospitalarsaude.app.br/`), utilizando uma abordagem híbrida que combina automação visual (frontend) para demonstração/auditoria e automação via API/Banco (backend) para performance.

## 2. Estrutura de Diretórios
A estrutura foi desenhada para modularidade estrita:

```
hospitalar-automation/
├── visual/                 # Módulo Frontend (Node.js + Playwright)
│   ├── src/
│   │   ├── robots/         # Scripts de automação (ex: login.ts, navigation.ts)
│   │   └── utils/          # Utilitários (ex: human-mouse.ts)
│   ├── tests/              # Testes E2E
│   └── package.json
│
├── core/                   # Módulo Backend (Python)
│   ├── api/                # Clientes de API (Requests)
│   ├── db/                 # Conectores de Banco (SQLAlchemy/MySQL)
│   ├── services/           # Lógica de negócio
│   └── requirements.txt
│
├── docs/                   # Base de Conhecimento (Anti-Alucinação)
│   ├── ARCHITECTURE.md     # Este arquivo
│   ├── API_MAP.md          # Mapeamento de Endpoints (Descobertos)
│   └── DB_SCHEMA.md        # Esquema do Banco de Dados (Quando disponível)
│
└── knowledge-base/         # Contexto para Agentes LLM futuros
    └── system_context.md   # Resumo do sistema para prompt de IA
```

## 3. Tecnologias e Decisões
*   **Frontend Automation**: Playwright.
    *   *Motivo*: Suporte nativo a seletores modernos, execução headless/headed robusta e capacidade de interceptar requisições de rede.
*   **Backend Automation**: Python.
    *   *Motivo*: Ecossistema rico para dados (Pandas, SQLAlchemy) e facilidade de integração com IA.
*   **Banco de Dados**: MySQL.
    *   *Status*: Acesso pendente. O código deve ser preparado para injeção de dependência da string de conexão.

## 4. Padrões de Desenvolvimento
*   **Separação de Responsabilidades**: O módulo `/visual` **NUNCA** deve acessar o banco de dados diretamente. O módulo `/core` **NUNCA** deve abrir um navegador.
*   **Humanização**: Scripts visuais devem implementar delays aleatórios e curvas de Bezier no movimento do mouse para simular humanos.
*   **Idempotência**: Scripts devem ser capazes de rodar múltiplas vezes sem duplicar dados ou causar erros (verificar estado antes de agir).

## 5. Integração Futura
Para integrar com o sistema da empresa:
1.  O Agente LLM lerá o `knowledge-base/system_context.md` para entender o contexto.
2.  Ele acionará scripts do `/core` para buscar dados.
3.  Ele acionará scripts do `/visual` apenas se interação humana for estritamente necessária ou solicitada para demonstração.
