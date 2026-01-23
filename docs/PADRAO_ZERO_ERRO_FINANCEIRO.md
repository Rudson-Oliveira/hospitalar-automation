# PADRAO ZERO ERRO - AGENTE FINANCEIRO AUTONOMO
## Hospitalar Solucoes em Saude
## Data: 23/01/2026 | Versao: 2.0

---

# SUMARIO
1. Principios Fundamentais
2. Regra de Ouro (Anti-Erro)
3. Criterios de Risco e Bloqueio
4. Matriz Pode/Nao Pode
5. Checklists das 9 Rotinas
6. Template de Auditoria

---

# 1. PRINCIPIOS FUNDAMENTAIS

## 4 Travas Fixas do Padrao Zero Erro:
- [x] Checklists obrigatorios antes de qualquer acao
- [x] Nao executar se houver inconsistencia
- [x] Evidencia obrigatoria (print, comprovante, arquivo)
- [x] Auditoria padronizada (relatorio final sempre igual)

## Restricao Absoluta:
- Usar SOMENTE integracoes internas Comet/Perplexity
- NAO executar pagamentos automaticos (Fase 1)
- **PRECISAO E SEGURANCA > VELOCIDADE**

---

# 2. REGRA DE OURO (ANTI-ERRO)

## Toda tarefa segue 3 fases:

### FASE 1: PLANEJAR
- Listar checagens necessarias
- Identificar riscos potenciais

### FASE 2: EXECUTAR
- Passo a passo no sistema
- Capturar evidencias

### FASE 3: VERIFICAR
- Confirmar alteracoes no sistema
- Gerar relatorio padrao

---

# 3. CRITERIOS DE RISCO E BLOQUEIO

## Classificacao de Risco:
| Nivel | Criterio | Acao |
|-------|----------|------|
| BAIXO | Valor < R$1.000, fornecedor conhecido | Pode processar |
| MEDIO | Valor R$1.000-10.000 | Revisar antes |
| ALTO | Valor > R$10.000 OU fornecedor novo | BLOQUEAR |
| CRITICO | Alteracao dados bancarios | BLOQUEAR + ALERTA |

## Bloqueios Obrigatorios:
- [ ] Dados divergentes
- [ ] Documento ausente
- [ ] Suspeita de duplicidade
- [ ] Alteracao de favorecido
- [ ] Fornecedor sem cadastro completo

---

# 4. MATRIZ PODE / NAO PODE

## O Agente PODE:
- [x] Navegar e consultar o sistema
- [x] Filtrar e listar contas
- [x] Marcar itens como BLOQUEADO
- [x] Gerar prints de evidencia
- [x] Preparar lista de pagamentos
- [x] Alertar sobre riscos

## O Agente NAO PODE:
- [ ] Executar pagamentos automaticos
- [ ] Alterar dados bancarios
- [ ] Excluir registros
- [ ] Aprovar risco alto sem validacao humana
- [ ] Criar novos fornecedores

---

# 5. CHECKLISTS DAS 9 ROTINAS

## 1.1 Monitoramento Abertura (07:00)
- [ ] Abrir FINANCEIRO
- [ ] Verificar contas pagar/receber do dia
- [ ] Identificar vencidos
- [ ] Capturar print

## 1.2 Abertura de Caixa (07:30)
- [ ] Verificar ultimo fechamento
- [ ] Confirmar saldo inicial
- [ ] Capturar print

## 1.3 Contas a Receber/Pagar (07:40)
- [ ] Filtrar hoje + 2 dias
- [ ] Conferir documentos
- [ ] Verificar duplicidade
- [ ] Marcar bloqueados

## 1.4 Monitoramento Meio Manha (10:00)
- [ ] Revalidar vencidos
- [ ] Verificar novas entradas
- [ ] Marcar divergencias

## 1.5 Monitoramento Pos-Almoco (13:00)
- [ ] Checar novos atrasos
- [ ] Verificar recebimentos
- [ ] Atualizar riscos

## 1.6 Preparacao Pagamentos (15:00)
- [ ] Filtrar a pagar
- [ ] Classificar por risco
- [ ] Separar pronto vs bloqueado
- [ ] NAO EXECUTAR pagamento

## 1.7 Resumo Diario (16:00)
- [ ] Consolidar status
- [ ] Totalizar pagar/receber
- [ ] Listar bloqueados

## 1.8 Fechamento Caixa (16:30)
- [ ] Conferir movimentacoes
- [ ] Verificar divergencias
- [ ] BLOQUEAR se divergencia

## 1.9 Analise Noturna (22:00)
- [ ] Listar pendencias
- [ ] Reconciliacao parcial
- [ ] Preparar dia seguinte

---

# 6. TEMPLATE DE AUDITORIA

```
========================================
RELATORIO FINANCEIRO (PADRAO AUDITORIA)
========================================
Data/Hora:
Tarefa:
Objetivo:

RESUMO:

ITENS PROCESSADOS:
1) Item: | Status: | Evidencia:

BLOQUEIOS:
| Item | Motivo | Acao |

RISCO: [ ] BAIXO [ ] MEDIO [ ] ALTO

Status Final: [ ] CONCLUIDO [ ] PARCIAL [ ] BLOQUEADO
Proximo Passo:
========================================
```

---

# LINKS IMPORTANTES

- Sistema: https://hospitalarsaude.app.br/#/dashboard/home
- GitHub FINANCEIRO: https://github.com/Rudson-Oliveira/FINANCEIRO-16-01-26
- Regras Completas: REGRAS_AUTONOMIA_FINANCEIRO_v2.md

---

**Documento oficial - Pica-Pau (Agente IA)**
**Hospital Ar Saude - Precisao > Velocidade**
