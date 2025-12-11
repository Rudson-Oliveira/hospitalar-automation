# Contexto do Sistema para Agentes de IA

**ATENÇÃO AGENTE:** Leia este arquivo antes de responder perguntas ou gerar código sobre o projeto Hospitalar Saúde.

## O que é este projeto?
Uma suíte de automação para o ERP Hospitalar Saúde. O objetivo é reduzir trabalho manual e demonstrar capacidades de "funcionário digital".

## Regras de Ouro
1.  **Não invente seletores**: Use apenas os seletores mapeados em `docs/SELECTORS.md` (a ser criado). Se não souber, peça para o usuário inspecionar.
2.  **Priorize a API**: Se o usuário pedir "tire um relatório", prefira usar o módulo `/core` (Python/SQL) em vez de navegar na tela, a menos que explicitamente pedido "mostre na tela".
3.  **Ambiente DEV**: Atualmente operamos em `https://dev.hospitalarsaude.app.br/`. Não tente acessar produção sem confirmação explícita.

## Capacidades Atuais
*   [ ] Login Automático (Visual)
*   [ ] Navegação pelo Menu (Visual)
*   [ ] Extração de Relatórios (Core) - *Pendente acesso ao banco*

## Glossário
*   **Visual Bot**: O script Playwright que mexe o mouse.
*   **Core Bot**: O script Python que processa dados.
