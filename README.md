# Hospitalar Automation Suite 🏥🤖

Suíte de automação corporativa para o sistema Hospitalar Saúde. Este projeto utiliza uma arquitetura híbrida para garantir robustez e visibilidade.

## 🏗️ Arquitetura Modular

O projeto está dividido em dois módulos principais que operam de forma integrada, mas independente:

### 1. Módulo Visual (`/visual`)
*   **Tecnologia**: Playwright (TypeScript/Node.js)
*   **Objetivo**: Simular a interação humana (cliques, digitação, movimento do mouse).
*   **Uso**: Demonstrações, auditoria visual e tarefas que exigem renderização de tela.
*   **Destaque**: Cursor humanizado para evitar detecção de bot e mostrar progresso aos usuários.

### 2. Módulo Core (`/core`)
*   **Tecnologia**: Python (Requests, SQLAlchemy)
*   **Objetivo**: Processamento de dados em massa e integração direta.
*   **Uso**: Relatórios pesados, inserção de dados no banco, webhooks.
*   **Conexão**: Acesso direto à API do sistema e Banco de Dados MySQL (quando disponível).

## 🚀 Como Usar

### Pré-requisitos
*   Node.js v18+
*   Python 3.10+
*   Acesso ao repositório

### Instalação
Consulte o `README.md` dentro de cada módulo para instruções específicas.

## 🔒 Segurança
*   Credenciais nunca são commitadas (uso de `.env`).
*   Logs sensíveis são sanitizados.

---
**Desenvolvido para Hospitalar Saúde**
