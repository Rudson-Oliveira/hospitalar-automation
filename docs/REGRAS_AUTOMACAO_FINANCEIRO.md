# Regras de Automacao Financeira - Hospitalar Saude

## Visao Geral
Documento com regras claras para automacao financeira via IA (Comet/Perplexity).

**Sistema:** https://hospitalarsaude.app.br/#/dashboard/financeiro
**Data:** 19/01/2026

---

## 1. EMAILS DE DESTINO

### Autorizacao de Pagamentos:
| Tipo | Email | Funcao |
|------|-------|--------|
| **Gestor** | rud.pa@hotmail.com | Autoriza pagamentos |
| **Financeiro** | financeiro02@hospitalarsaude.com.br | Arquivo/controle |

---

## 2. REGRAS DE EXCLUSAO

### Excluir das listas de pagamento:
- **ISS PARCELADO** - Impostos em renegociacao
- Contas com "IMPOSTO" ou "TRIBUTO" em renegociacao

---

## 3. FORMATO EMAIL AUTORIZACAO

### Assunto:
```
[AUTORIZACAO] Pagamentos Pendentes - DD/MM/AAAA - Hospitalar Saude
```

### Corpo:
1. RESUMO EXECUTIVO (Data, Qtd Contas, Valor Total)
2. CONTAS PENDENTES por prioridade
3. ALERTAS (vencidas, observacoes)
4. PROXIMOS 5 DIAS
5. Solicitacao AUTORIZACAO

---

## 4. PRIORIDADES

| Prioridade | Prazo | Exemplos |
|------------|-------|----------|
| **ALTA** | Mesmo dia | Plantoes, emergencias |
| **MEDIA** | 3 dias | Prestadores atrasados |
| **BAIXA** | 7 dias | Demais |

---

## 5. HORARIOS ROTINAS

| Tarefa | Hora | Freq |
|--------|------|------|
| Abertura | 07:00 | Diario |
| Verificacao | 10:00 | Diario |
| Analise | 13:00 | Diario |
| Pagamentos | 15:00 | Diario |
| Noturna | 22:00 | Diario |

---

## 6. URLS SISTEMA

- **Principal:** https://hospitalarsaude.app.br
- **Financeiro:** /#/dashboard/financeiro
- **Contas Pagar:** /#/dashboard/financeiro/contas-pagar/para-pagar

---

## 7. PROTOCOLO PAGAMENTO

1. IA lista contas (excluindo impostos)
2. IA envia email solicitando AUTORIZACAO
3. Gestor autoriza
4. IA executa pagamentos
5. IA registra confirmacao

**IMPORTANTE:** Nenhum pagamento sem autorizacao explicita.

---

## Historico

| Data | Rev | Descricao |
|------|-----|----------|
| 19/01/2026 | 01 | Criacao |
