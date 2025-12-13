# 💎 Guia de Uso: Obsidian Desktop Agent

O **Obsidian** é seu agente pessoal autônomo. Ele roda na sua máquina, controla seu mouse e navegador, e executa tarefas visualmente (estilo Comet).

## 🚀 Como Iniciar (Modo Desktop)

Para ver o agente "ganhar vida" na sua tela:

1.  Abra o terminal na pasta do projeto:
    ```bash
    cd hospitalar-automation/visual
    ```

2.  Execute o comando mágico:
    ```bash
    npm run obsidian
    ```

3.  **O que vai acontecer:**
    *   Um navegador Chromium será aberto (não feche!).
    *   O agente assumirá o controle.
    *   Você verá ele navegando e clicando sozinho.

## 🏢 Sistema Autônomo Hospitalar (Enterprise)

Para o sistema da empresa (que roda no servidor/nuvem), o funcionamento é híbrido:

*   **Modo Frontend:** Quando você está logado, ele te ajuda visualmente.
*   **Modo Background:** Quando você sai, ele continua trabalhando via API (super rápido e invisível) para processar pedidos e relatórios.

---
*Desenvolvido por Manus AI para Hospitalar Automação.*
