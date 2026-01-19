# Protocolo de Pagamentos - Hospitalar Saude

## Visao Geral

Este documento define o protocolo de autorizacao de pagamentos entre a IA (Comet/Perplexity) e o gestor financeiro.

**Sistema:** https://hospitalarsaude.app.br/#/dashboard/financeiro
**Data:** 19/01/2026

---

## Fluxo de Autorizacao

```
[IA Lista Pagamentos] -> [Gestor Analisa] -> [Gestor Autoriza] -> [IA Executa Pagamento]
```

### Regras Fundamentais

1. **A IA NUNCA realiza pagamentos sem autorizacao explicita do gestor**
2. **Impostos em renegociacao sao EXCLUIDOS automaticamente**
3. **Cada lote de pagamento requer confirmacao individual**

---

## Rotina Diaria - 15:00

### Passo 1: Coleta de Dados

```
1. Acessar /financeiro/contas-pagar/para-pagar
2. Filtrar contas vencendo HOJE e proximos dias
3. EXCLUIR da lista:
   - ISS PARCELADO (em renegociacao)
   - INSS PARCELADO (em renegociacao)
   - FGTS PARCELADO (em renegociacao)
   - Outros impostos marcados como renegociacao
```

### Passo 2: Classificacao

| Prioridade | Criterio | Acao |
|------------|----------|------|
| ALTA | Vence HOJE ate 16h | Pagar imediatamente |
| MEDIA | Vence em 1-3 dias | Programar pagamento |
| BAIXA | Vence em 4-7 dias | Aguardar proximo ciclo |

| Tipo | Criterio |
|------|----------|
| PROGRAMADA | Inserida ha mais de 48h |
| NAO PROGRAMADA | Inserida ha menos de 48h |

### Passo 3: Preparar Resumo

```markdown
## PAGAMENTOS PARA AUTORIZACAO - [DATA]

### Resumo
- Total de contas: X
- Valor total: R$ X.XXX,XX
- Saldo disponivel: R$ X.XXX,XX

### Contas ALTA Prioridade (Vence Hoje)
| ID | Credor | Descricao | Valor |
|----|--------|-----------|-------|

### Contas MEDIA Prioridade
| ID | Credor | Descricao | Valor |
|----|--------|-----------|-------|

### Alertas
- [Lista de alertas de risco]
```

### Passo 4: Solicitar Autorizacao

Enviar resumo para:
- rud.pa@hotmail.com
- financeiro02@hospitalarsaude.com.br

**Aguardar resposta: "AUTORIZADO" ou "RECUSADO"**

---

## Execucao de Pagamentos

### Apos Autorizacao

```
1. Acessar /financeiro/contas-pagar/para-pagar
2. Selecionar contas AUTORIZADAS
3. Clicar "PAGAMENTO EM LOTE"
4. Confirmar valores
5. Registrar comprovante
```

### Confirmacao ao Gestor

```markdown
## PAGAMENTOS EXECUTADOS - [DATA]

- Quantidade: X contas
- Valor total: R$ X.XXX,XX
- Status: CONCLUIDO
- Comprovantes: [anexos]
```

---

## Impostos em Renegociacao (NAO PAGAR)

| Imposto | Status | Valor Mensal |
|---------|--------|-------------|
| ISS PARCELADO | 60x - Em renegociacao | ~R$ 7.980 |

**NOTA:** Estes impostos estao sendo renegociados e NAO devem ser incluidos na rotina de pagamentos regular.

---

## Contatos

| Funcao | Nome | Email |
|--------|------|-------|
| Gestor Financeiro | Rudson Oliveira | rud.pa@hotmail.com |
| Financeiro | Equipe | financeiro02@hospitalarsaude.com.br |

---

## Historico de Atualizacoes

| Data | Alteracao |
|------|----------|
| 19/01/2026 | Criacao do protocolo |

---

*Documento oficial - Hospitalar Solucoes em Saude*
