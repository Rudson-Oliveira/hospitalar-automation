# MAPEAMENTO MODULO FINANCEIRO - HOSPITALAR

**Atualizado:** 21/01/2026  
**Producao:** https://hospitalarsaude.app.br  
**Dev:** https://dev.hospitalarsaude.app.br

---

## MENUS E URLS

### CONTAS
| Funcao | URL |
|--------|-----|
| Contas Bancarias (28 contas) | /financeiro/contas/contas-bancarias |
| Transferencias | /financeiro/contas/transferencias |

### CONTAS A PAGAR
| Funcao | URL |
|--------|-----|
| A Pagar | /financeiro/contas-pagar/para-pagar |
| Pagas | /financeiro/contas-pagar/pagas |

**Status Atual:**
- Vencidas: 57 contas = R$ 1.146.855,62
- Vencendo Hoje: 7 contas = R$ 22.148,06

### CONTAS A RECEBER
| Funcao | URL |
|--------|-----|
| A Receber | /financeiro/contas-receber/receber |
| Recebidas | /financeiro/contas-receber/recebidas |

**Status Atual:**
- Vencidas: 53 contas = R$ 102.992,36

### TABELAS
- Formas de Pagamento
- Cartao de credito
- Centro de Custo
- Tipos de Pagamento
- Plano de contas (Financeiro/Contabil)

### REQUERIMENTOS
- Emitidos | Reprovados | Aprovados | Pagos

### RELATORIOS (16 tipos)
- Requerimentos (pagar/pagos por periodo)
- Contas a pagar/pagas por periodo
- Contas a receber/recebidas por periodo
- Transferencias entre contas
- Extrato conta/Conta Garantida
- Media valores por especialidade

---

## INTEGRACAO BANCARIA
- **Banco Inter** - API ativa
- **Sicoob** - API ativa

---

## REGRAS
1. **IMPOSTOS:** Em renegociacao - NAO PAGAR
2. **Emails:** rud.pa@hotmail.com + financeiro02@hospitalarsaude.com.br
3. **Horario:** Envios a partir 07:30
4. **Autorizacao:** OBRIGATORIA antes de pagamentos
