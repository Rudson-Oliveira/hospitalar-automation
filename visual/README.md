# Sistema Multi-Agente Autônomo - Hospitalar Automation

Este projeto implementa um ecossistema de Inteligência Artificial Multi-Agente ("The Board") capaz de gerenciar processos empresariais, tomar decisões estratégicas e automatizar tarefas operacionais com mínima intervenção humana.

## 🚀 Funcionalidades Principais

1.  **The Board (Conselho de IA):** 5 Agentes especializados (CEO, CMO, CFO, CTO, COO) que debatem e resolvem problemas autonomamente.
2.  **Motor de Decisão AHP:** Tomada de decisão baseada em critérios matemáticos (ROI, Risco, Velocidade).
3.  **AI Twins (Gêmeos Digitais):** Assistentes pessoais para cada colaborador que aprendem padrões e automatizam tarefas.
4.  **Dashboard em Tempo Real:** Interface visual para acompanhar as "reuniões" das IAs e métricas de autonomia.

## 🛠️ Instalação

1.  Certifique-se de ter o Node.js instalado.
2.  Instale as dependências:
    ```bash
    npm install
    ```

## 🤖 Como Executar

### 1. Simulações de Teste
Execute os cenários pré-configurados para validar a lógica dos agentes:

*   **Simulação Básica (Crise de Conversão):**
    ```bash
    npm run sim:basic
    ```
*   **Simulação Avançada (Com Aprendizado e Memória):**
    ```bash
    npm run sim:advanced
    ```
*   **Simulação Completa (Estratégia + Vendas + Financeiro):**
    ```bash
    npm run sim:full
    ```
*   **Simulação de AI Twin (Aprendizado do Colaborador):**
    ```bash
    npm run sim:twin
    ```
*   **Simulação de Hierarquia (Reporte para o Conselho):**
    ```bash
    npm run sim:hierarchy
    ```

### 2. Dashboard Web (Produção)
Para iniciar o servidor do dashboard e visualizar o sistema em funcionamento:

```bash
npm run dashboard
```

Acesse no navegador:
*   **Painel do CEO:** `http://localhost:3002/`
*   **Copilot do Colaborador:** `http://localhost:3002/copilot`
*   **Métricas de Autonomia:** `http://localhost:3002/autonomy`

## 📂 Estrutura do Projeto

*   `src/agents/`: Código fonte dos agentes e lógica de IA.
    *   `personas.ts`: Definição das personalidades (Alpha, Growth, Ledger, etc).
    *   `orchestrator.ts`: Gerenciador da sala de reuniões.
    *   `decision-engine.ts`: Motor matemático de decisão (AHP).
    *   `memory-system.ts`: Sistema de memória de longo prazo.
    *   `ai-twin-learning.ts`: Motor de aprendizado por observação (Shadow Mode).
*   `src/web-interface/`: Arquivos do Frontend e Servidor do Dashboard.

## 🧠 Arquitetura de Decisão

O sistema utiliza o método **AHP (Analytic Hierarchy Process)** para ponderar opções.
Exemplo:
*   **ROI:** Peso 35%
*   **Risco:** Peso 25%
*   **Velocidade:** Peso 20%
*   **Esforço:** Peso 20%

As IAs calculam o score de cada proposta e escolhem matematicamente a melhor opção para o negócio.

---
**Desenvolvido por Manus AI para Hospitalar Automation**
