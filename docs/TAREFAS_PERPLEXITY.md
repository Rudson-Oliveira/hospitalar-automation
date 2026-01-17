# Tarefas Agendadas - Perplexity Tasks

## Sistema de Automacao Hospitalar Saude

Documentacao das tarefas automatizadas configuradas no Perplexity Tasks para monitoramento e gestao financeira do Hospital Ar Saude.

**URL do Sistema:** https://hospitalarsaude.app.br

---

## FINANCEIRO

### Ciclo Matinal

| Horario | Tarefa | Descricao |
|---------|--------|-----------|
| 07:00 | Monitoramento - Abertura | Verificacao inicial do sistema financeiro |
| 07:30 | Abertura de Caixa | Conferencia de caixa e saldos iniciais |
| 07:40 | Contas a Receber e Pagar | Analise de titulos vencidos e a vencer |

### Ciclo Diurno

| Horario | Tarefa | Descricao |
|---------|--------|-----------|
| 10:00 | Monitoramento 10h00 | Verificacao e acompanhamento |
| 13:00 | Monitoramento 13h00 | Analise Pos-Almoco |
| 15:00 | Preparacao de Pagamentos | Preparacao para autorizacao |

### Ciclo Vespertino/Noturno

| Horario | Tarefa | Descricao |
|---------|--------|-----------|
| 16:00 | Resumo Financeiro Diario | Consolidacao do dia |
| 16:30 | Fechamento de Caixa | Conferencia final e fechamento |
| 22:00 | Analise Noturna e Aprendizado | Processamento de dados e ML |

---

## ORCAMENTO

### Verificacoes Periodicas

| Horario | Tarefa | Descricao |
|---------|--------|-----------|
| 07:00 | Relatorio Matinal | USA - Relatorio completo |
| 07:00 | Monitoramento | Monitoramento inicial |
| 08:00 | Verificacao 08:00 | Verificacao diaria |
| 09:00 | Verificacao 09:00 | Verificacao diaria |
| 10:00 | Verificacao 10:00 | Verificacao e e-mails |
| 12:00 | Previa 12h00 | Verificacao diretoria |
| 16:00 | Resumo Diario | USAR RAC - Resumo consolidado |

---

## COMPRAS

### Ciclo Matinal

| Horario | Tarefa | Descricao |
|---------|--------|----------|
| 07:00 | Monitoramento - Abertura e Demandas | Novas demandas, pedidos pendentes, urgencias >R$5.000 |

### Ciclo Diurno

| Horario | Tarefa | Descricao |
|---------|--------|----------|
| 10:00 | Monitoramento - Cotacoes Bionexo | Cotacoes, comparativo de precos, economia >10% |
| 13:00 | Monitoramento - Analise de Entregas | Status entregas, atrasos >24h, notas fiscais |

### Ciclo Vespertino

| Horario | Tarefa | Descricao |
|---------|--------|----------|
| 16:00 | Monitoramento - Fechamento Diario | Consolidacao financeira, pedidos processados |

### Tarefas Periodicas

| Frequencia | Tarefa | Horario |
|------------|--------|----------|
| Semanal | Relatorio Semanal - Economia e Performance | Sexta 15:00 |
| Mensal | Auditoria Mensal - Fornecedores e Contratos | Dia 31, 17:00 |

---

## RELATORIOS EXECUTIVOS

| Frequencia | Tarefa | Horario |
|------------|--------|----------|
| Diario | Brief Executivo Diario: Saude & IA | 07:00 |
| Semanal | Relatorio Inteligencia Competitiva | Quartas 18:00 |
| Mensal | Dashboard Executivo Mensal | Dia 1, 02:00 |

---

## Configuracao

Todas as tarefas estao configuradas como **Diario** (exceto relatorios especiais) e executam automaticamente nos horarios especificados.

### Proximos Passos

- [ ] Monitorar execucao das tarefas
- [ ] Ajustar prompts conforme necessidade
- [ ] Integrar com n8n para processamento

---

*Ultima atualizacao: 17/01/2026*
