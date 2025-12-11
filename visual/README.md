# Módulo de Automação Visual (RPA)

Este módulo utiliza **Playwright** e **Ghost Cursor** para realizar automações visuais no sistema hospitalar, simulando o comportamento humano (movimentos de mouse naturais) para evitar detecção e realizar tarefas que exigem interação com a interface gráfica.

## Estrutura

- `src/actions/`: Scripts de ações específicas (ex: login, agendamento, cadastro).
- `src/utils/`: Utilitários compartilhados (configuração do browser, helpers).
- `src/index.ts`: Ponto de entrada para execução dos agentes.
- `results/`: Armazena screenshots e logs de execução.

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz deste diretório (use `.env.example` como base) e preencha:
   ```env
   HOSPITAL_URL=https://seu-ambiente-local-ou-dev.com.br
   HOSPITAL_USER=seu_usuario
   HOSPITAL_PASS=sua_senha
   HEADLESS=false # true para rodar sem interface gráfica
   ```

## Execução

Para rodar o teste de login:

```bash
npx ts-node src/index.ts
```

## Notas sobre o Ambiente Local

Como o ambiente de desenvolvimento local ainda está sendo configurado pelo TI, este script foi testado preliminarmente contra `dev.hospitalarsaude.app.br`. 

Quando o ambiente local estiver pronto:
1. Atualize a `HOSPITAL_URL` no arquivo `.env`.
2. Se os seletores CSS mudarem, ajuste-os em `src/actions/login.ts`.
