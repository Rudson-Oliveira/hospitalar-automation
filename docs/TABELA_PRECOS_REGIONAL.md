# Tabela de Precos Regional e Logica de Precificacao

## Sistema de Automacao Hospitalar Saude

Documentacao das tabelas de precos por regiao e logica de calculo para orcamentos.

**IMPORTANTE:** Fase de aprendizado - NAO ENVIAR orcamentos automaticamente. Daniel e responsavel pela checagem final.

---

## Logica de Precificacao para Pacientes de Outros Estados

Quando o paciente e de localidade diferente (outros estados/cidades distantes), aplicar a seguinte logica:

### Fatores de Analise

1. **Localidade**
   - Distancia do paciente ate a base
   - Zona urbana vs rural
   - Acesso rodoviario

2. **Logistica (Entrega de Materiais)**
   - Custo de frete
   - Tempo de entrega
   - Frequencia de reposicao necessaria
   - Custo-beneficio de envio vs compra local

3. **Rede de Apoio Local**
   - Farmacias disponiveis na regiao
   - Lojas medicas proximas
   - Hospitais de referencia
   - Fornecedores locais parceiros

4. **Realidade Local**
   - Custo de vida da regiao
   - Disponibilidade de profissionais
   - Infraestrutura de saude local

5. **Preco Final ao Consumidor**
   - Pesquisa de mercado local
   - Comparativo com concorrentes
   - **Adicionar margem de 20%**

### Formula de Calculo

```
PRECO_FINAL = (PRECO_BASE + CUSTOS_LOGISTICA + AJUSTE_REGIONAL) * 1.20
```

---

## Tabelas de Precos por Regiao

### POUSO ALEGRE (PA) - Base Principal

#### Diarias e Taxas

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 30000026 | Diaria Internacao Alta Complexidade - Enf 24h | 892,50 |
| 30000025 | Diaria Internacao Media Noite - Enf 12h | 493,88 |
| 30000024 | Diaria Internacao Media Dia - Enf 12h | 442,00 |
| 30000023 | Diaria Internacao Baixa Complexidade - Enf 6h | 341,16 |
| 23230024 | Diaria Cuidador 24h | 433,05 |
| 23230051 | Diaria Cuidador 12h Diurno | 274,27 |
| 23230052 | Diaria Cuidador 12h Noturno | 410,79 |
| 23230050 | Diaria Cuidador 6h | 180,03 |

#### Procedimentos

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 30000002 | Aplicacao Medicamento EV Domicilio | 56,26 |
| 30000016 | Banho Domicilio (Unidade) | 70,33 |
| 30000017 | Banho Domicilio (Pacote Mensal) | 1.810,00 |
| 50000535 | Consulta Domiciliar Enfermagem | 134,25 |
| 23230025 | Acompanhamento Enf Exames/Consultas | 182,85 |

#### Consultas

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 10101020 | Consulta Domiciliar Medico | 450,00 |
| 23230005 | Consulta Domiciliar Neurologista | 683,15 |
| 50000578 | Consulta Domiciliar Nutricionista | 150,00 |
| 500000579 | Consulta Domiciliar Fisioterapia | 98,32 |

#### Soroterapia

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 30000005 | Soroterapia Domiciliar ate 3h | 178,90 |
| 30000006 | Soroterapia 03 a 06h | 233,13 |
| 30000007 | Soroterapia 06 a 09h | 266,30 |
| 30000008 | Soroterapia 09 a 12h | 394,52 |
| 30000009 | Soroterapia 12 a 15h | 466,25 |
| 30000010 | Soroterapia 15 a 18h | 573,00 |

#### Remocoes

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 18000030 | Remocao Ambulancia Simples - Ida | 350,00 |
| 60034777 | Remocao Ambulancia Simples - Ida e Volta | 700,00 |
| 60002139 | Remocao UTI Movel - Ida (ate 50km) | 1.000,00 |
| 60009832 | Remocao UTI Movel - Ida e Volta | 2.500,00 |
| 18000032 | Remocao UTI com Medico | 1.600,00 |
| 60018909 | Remocao Fora Perimetro - KM Rodado | 10,00 |
| 60002135 | Remocao UTI Fora Perimetro - KM Rodado | 14,00 |

#### Fisioterapia

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 23232351 | Fisioterapia Gerontologia | 95,00 |
| 50000268 | Fisioterapia Domiciliar Sessao | 132,51 |
| 23232352 | Fisioterapia Respiratoria | 196,91 |

---

### DIVINOPOLIS - Tabela Regional

#### Diarias e Taxas

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 30000026 | Diaria Internacao Alta Complexidade - Enf 24h | 942,50 |
| 30000025 | Diaria Internacao Media Noite - Enf 12h | 493,88 |
| 30000024 | Diaria Internacao Media Dia - Enf 12h | 456,20 |
| 30000023 | Diaria Internacao Baixa Complexidade - Enf 6h | 391,16 |
| 23230024 | Diaria Cuidador 24h | 682,45 |
| 23230051 | Diaria Cuidador 12h Diurno | 386,79 |
| 23230052 | Diaria Cuidador 12h Noturno | 410,79 |
| 23230050 | Diaria Cuidador 6h | 294,11 |

#### Consultas

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 10101020 | Consulta Domiciliar Medico | 575,00 |
| 97870838 | Consulta Domiciliar Medico Especialista | 1.255,73 |
| 50000578 | Consulta Domiciliar Nutricionista | 185,00 |
| 500000579 | Consulta Domiciliar Fisioterapia | 145,00 |
| 50000624 | Fonoaudiologia Domiciliar Sessao | 295,00 |
| 50000098 | Terapia Ocupacional Domiciliar | 298,00 |

#### Procedimentos

| Codigo | Descricao | Preco (R$) |
|--------|-----------|------------|
| 0060034343 | Administracao Medicamento Domicilio | 118,70 |
| 30000020 | Curativo Domicilio | 125,53 |
| 50000535 | Consulta Domiciliar Enfermagem | 213,39 |

---

## Materiais de Enfermagem (Codigos TUSS)

### Soro Fisiologico

| Codigo | Descricao | Uso |
|--------|-----------|-----|
| 90072294 | SF 0,9% 10ml | Diluicao/Salinizacao |
| 90123115 | SF 0,9% 100ml | Diluicao |
| 90019865 | SF 0,9% 250ml | Hidratacao |
| 90123093 | SF 0,9% 500ml | Hidratacao |
| 90019822 | SF 0,9% 1000ml | Hidratacao |

### Materiais Basicos

| Codigo | Descricao | Troca |
|--------|-----------|-------|
| 0000000069 | Abocath 22 | 72h |
| 70139040 | Abocath 22 (alt) | 72h |
| 0000259527 | Equipo Macro | 1/dia |
| 0000026996 | Fita Micropore | Conforme uso |
| 0000159142 | Agulha 40x12 | Por aplicacao |
| 0000097046 | Agulha 25x7 | Por aplicacao |
| 0000117131 | Seringa 10ml | Por aplicacao |
| 0000117132 | Seringa 20ml | Por aplicacao |
| 0000000024 | Luva Procedimento | Por aplicacao |
| 0000266647 | Swab Alcool | 72h |
| 0000045521 | Algodao Bola | 72h |
| 0000111132 | Tree Way | 72h |
| 0000153078 | Scalp | Aplicacao unica |
| 90007131 | ABD 10ml | Diluicao |

### Sondagem

| Codigo | Descricao |
|--------|-----------||
| 0000276232 | SVA (Sonda Vesical Alivio) |
| 0000108968 | SVD (Sonda Vesical Demora) |
| 90257570 | Xylocaina |
| 0000177361 | Luva Esteril |
| 0000018481 | Gaze (pacote) |
| 0006260230 | Clorexidina Aquosa |
| 0000104838 | Clorexidina Degermante |

---

## Regras de Negocio - Automacao

### Status do Orcamento

```
1. CRIADO -> Orcamento gerado pela IA
2. AGUARDANDO_CHECAGEM -> Enviado para Daniel revisar
3. APROVADO_INTERNO -> Daniel aprovou
4. ENVIADO_CLIENTE -> Liberado para envio
5. APROVADO_CLIENTE -> Cliente aceitou
6. REPROVADO -> Recusado
```

### Fluxo Atual (Fase Aprendizado)

```
Solicitacao recebida
    |
    v
IA analisa e cria orcamento
    |
    v
Status: AGUARDANDO_CHECAGEM
    |
    v
Daniel revisa e aprova/ajusta
    |
    v
Envio ao cliente (MANUAL)
```

### Proxima Fase (Automatizado)

```
Solicitacao recebida
    |
    v
IA analisa perfil + localidade + historico
    |
    v
Calcula preco com ajustes regionais
    |
    v
Gera orcamento personalizado
    |
    v
Envia automaticamente ao cliente
    |
    v
Acompanha resposta e feedback
```

---

## Checklist Orcamento Regional

- [ ] Identificar localidade do paciente
- [ ] Verificar se e regiao atendida
- [ ] Selecionar tabela de precos correta (PA ou Divinopolis)
- [ ] Se outro estado: aplicar logica de +20%
- [ ] Analisar logistica de entrega de materiais
- [ ] Verificar rede de apoio local
- [ ] Calcular preco final
- [ ] Criar orcamento no sistema
- [ ] Marcar como AGUARDANDO_CHECAGEM
- [ ] Notificar Daniel para revisao
- [ ] NUNCA enviar sem aprovacao

---

## Contatos Importantes

- **Orcamentos (setor):** orcamentos@hospitalarsaude.com.br
- **Relatorios gerenciais:** rud.pa@hotmail.com
- **Checagem:** Daniel (responsavel)

---

*Ultima atualizacao: 20/01/2026*
*Fase: APRENDIZADO - Envio manual apos checagem*
