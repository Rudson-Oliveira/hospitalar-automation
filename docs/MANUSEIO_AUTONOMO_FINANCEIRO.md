# Manuseio Autonomo - Modulo Financeiro

## Resumo
Guia para operacao autonoma do sistema Hospitalar - Modulo Financeiro.

**Sistema:** https://hospitalarsaude.app.br
**Data:** 21/01/2026

---

## URLs do Sistema

| Funcao | URL |
|--------|-----|
| Financeiro | `/#/dashboard/financeiro` |
| Contas a Pagar | `/#/dashboard/financeiro/contas-pagar/para-pagar` |
| Contas a Receber | `/#/dashboard/financeiro/contas-receber` |

---

## Dashboard - Dados em Tempo Real

Ao acessar Contas a Pagar:
- **Vencidas:** Quantidade e valor total
- **Vencendo Hoje:** Quantidade e valor total
- **Grafico:** Proximos 5 dias

---

## Filtros

| Campo | Ref | Formato |
|-------|-----|--------|
| Data Inicio | ref_444 | YYYY-MM-DD |
| Data Fim | ref_462 | YYYY-MM-DD |
| Credor | ref_467 | Texto |
| Limpar | ref_618 | Botao |

---

## Exclusoes Obrigatorias

**SEMPRE EXCLUIR:**
- ISS PARCELADO (impostos renegociacao)
- Credores com "ISS" + "PARCELADO"

---

## Fluxo Autonomo

1. Acessar sistema
2. Ler dashboard
3. Filtrar por data
4. Listar contas (excluindo impostos)
5. Calcular totais
6. Enviar email com DADOS REAIS
7. Aguardar autorizacao
8. Executar pagamentos
9. Registrar

---

## Capacidades

**Autonomas:**
- Navegar, ler, filtrar, calcular, gerar relatorios, enviar emails

**Requer Autorizacao:**
- Pagamentos, alteracoes, exclusoes

---

| Data | Rev | Descricao |
|------|-----|----------|
| 21/01/2026 | 01 | Criacao |
