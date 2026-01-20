# Fluxo de Orcamento Particular

## Sistema de Automacao Hospitalar Saude

Documentacao completa do fluxo de orcamentos particulares baseado no manual operacional da HospitaLar.

**URL do Sistema:** https://hospitalarsaude.app.br

---

## Sobre a Empresa

- **Nome:** HospitaLar Solucoes em Saude
- **CNPJ:** 09.053.436/0001-13
- **Localizacao:** Pouso Alegre - MG (desde 2007)
- **Especializacao:** Home Care / Assistencia Domiciliar
- **Contatos:** 35 3423-7389 | 35 3422-8174 | Ouvidoria: 35 98883-0425

### Missao
Promover o bem-estar fisico, psiquico, social e emocional com a atencao voltada a domicilios.

### Visao
Ser referencia em assistencia domiciliar humanizada no Estado de Minas Gerais.

---

## Servicos Oferecidos

1. Aplicacao de medicamento
2. Enfermagem
3. Fisioterapia
4. Fonoaudiologia
5. Nutricao
6. Psicologia
7. Remocao
8. Cobertura de eventos
9. Home care tecnico (cuidadores)
   - 6h (07h-13h ou 13h-19h)
   - 12h diurno (07h-19h)
   - 12h noturno (19h-07h)
   - 24h (07h-07h)

---

## ETAPA 1 - Coleta de Informacoes

### Mensagem Padrao de Apresentacao

```
Bom dia/boa tarde/boa noite, tudo bem?
Me chamo [NOME], sou da empresa HospitaLar do setor [SETOR].

Nossos servicos sao os seguintes:
1. Aplicacao de medicamento
2. Enfermagem
3. Fisioterapia
4. Fonoaudiologia
5. Nutricao
6. Psicologia
7. Remocao
8. Cobertura de eventos
9. Home care tecnico

Qual servico melhor atenderia?
```

### Dados Necessarios do Paciente

| Campo | Obrigatorio |
|-------|-------------|
| Nome do Paciente | Sim |
| Data de nascimento | Sim |
| CPF | Sim |
| Etnia/cor | Sim |
| Endereco completo | Sim |
| Bairro | Sim |
| CEP | Sim |
| Cidade | Sim |
| Telefone (2 opcoes) | Sim |
| Nome do Responsavel | Sim |
| CPF do Responsavel | Sim |
| Telefone Responsavel | Sim |
| Parentesco | Sim |
| Onde conheceu a HospitaLar | Sim |
| Foto Relatorio Medico | Sim |

---

## ETAPA 2 - Cadastro no Sistema

### Acesso
1. Acessar `hospitalarsaude.app.br/#/dashboard`
2. Menu lateral: **PACIENTES**

### Verificacao
Verificar nas 3 abas se paciente ja existe:
- Ativo com internacao
- Ativo sem internacao
- Inativo

### Novo Cadastro
1. Clicar **ADICIONAR PACIENTE** (botao azul)
2. Preencher informacoes basicas
3. Clicar **SALVAR**

---

## ETAPA 3 - Atualizacao Cadastral

Na ficha do paciente, atualizar as seguintes abas:

### Dados Pessoais
- Nome completo
- CPF
- Email
- Celular e Telefone
- Endereco completo
- Data nascimento
- Sexo e Etnia

### Responsavel
- Nome
- CPF
- Parentesco
- Email
- Celular e Telefone

### Convenio
- Tipo: PARTICULAR
- Numero do Convenio: CPF do paciente

---

## ETAPA 4 - Confeccao do Orcamento

### Criar Novo Orcamento
1. Ficha do Paciente → aba **Orcamentos**
2. Clicar **NOVO ORCAMENTO**
3. Configurar:
   - **Tipo:** CAPTACAO
   - **Pagamento:** PARTICULAR
   - **Data inicio/fim:** periodo do atendimento
   - **Origem:** (Clinica, Convenio, Hospital, Indicacao, etc.)

### Adicionar Itens

Tipos de produtos disponiveis:

| Tipo | Descricao |
|------|------------|
| Diarias, taxas e gases | Diarias de cuidador, taxas contratuais |
| Equipamentos | Equipamentos medicos |
| Procedimentos | Procedimentos TUSS |
| Dietas | Nutricao enteral/parenteral |
| Medicamentos | Busca por codigo TUSS |
| Materiais e OPME | Materiais hospitalares |
| Remocoes | Servicos de remocao |

### Para cada item:
1. Selecionar **Tipo de Produto**
2. Buscar **Descricao** ou codigo TUSS
3. Definir **Quantidade**
4. Definir **Periodicidade** (Diario, Semanal, etc.)
5. Clicar **ADICIONAR**

---

## ETAPA 5 - Ajustes de Valores

### Desconto/Acrescimo Individual
- Clicar no item
- Informar valor positivo (+R$) para acrescimo
- Informar valor negativo (-R$) para desconto
- Clicar **ATUALIZAR**

### Desconto Geral
1. Clicar em **Desconto**
2. Escolher tipo:
   - Por **Porcentagem** (%)
   - Por **Valor** (R$)
3. Clicar **ATUALIZAR**

---

## ETAPA 6 - Gerar PDF do Orcamento

1. Voltar ao painel do paciente
2. Localizar orcamento na lista
3. Clicar no icone **impressora**
4. Selecionar tipo:
   - Orcamento
   - Fatura
   - Plano de cuidados
   - Espelho fiscal
5. Selecionar formato: **PDF** ou XLS
6. Clicar **DOWNLOAD**
7. Enviar ao familiar/responsavel

---

## ETAPA 7 - Aprovacao e Pagamento

### Formas de Pagamento

| Forma | Dados |
|-------|-------|
| PIX | Chave: 09053436000113 |
| Transferencia | Banco Unicred 136, Ag 5931, CC 2201-2 |
| Cartao Credito | Via maquininha |
| Cartao Debito | Via maquininha |
| Dinheiro | Presencial |

### Atualizar Status no Sistema
1. Acessar orcamento
2. Clicar **Editar**
3. Alterar status: AGUARDANDO → **APROVADO**
4. Clicar **ATUALIZAR**

### Registrar Condicoes de Pagamento
1. Clicar **CONDICOES DE PAGAMENTO**
2. Selecionar pagador: **Paciente** ou **Responsavel**
3. Clicar **ADICIONAR FORMA DE PAGAMENTO**
4. Selecionar forma de pagamento
5. Informar valor e quantidade de parcelas
6. Definir data de vencimento
7. Clicar **CADASTRAR**

---

## ETAPA 8 - Internacao do Paciente

Apos aprovacao do orcamento:

1. Aba **INTERNACOES** → **NOVA INTERNACAO**
2. Preencher:
   - Data de inicio
   - Tipo de internacao: Atendimento Domiciliar
   - Modalidade: Assistencia domiciliar
   - Diagnostico Principal (CID)
   - Diagnostico Secundario (opcional)
   - Observacoes (opcional)
3. Clicar **ATUALIZAR**

---

## URLs do Sistema

| Ambiente | URL |
|----------|-----|
| Producao | https://hospitalarsaude.app.br |
| Desenvolvimento | https://dev.hospitalarsaude.app.br |
| Dashboard Orcamentos | /#/dashboard/orcamentos |
| Pacientes | /#/dashboard/pacientes |

---

## Fluxo de Emails - Automacao Perplexity

```
ENTRADA: orcamentos@hospitalarsaude.com.br
    ↓
[ANALISE COM RACIOCINIO]
    ↓
    ├──→ orcamentos@hospitalarsaude.com.br (Analises do setor)
    └──→ rud.pa@hotmail.com (Relatorio Gerencial)
```

---

## Checklist Orcamento Particular

- [ ] Coletar dados do paciente
- [ ] Verificar se paciente existe no sistema
- [ ] Cadastrar/atualizar paciente
- [ ] Criar novo orcamento (tipo CAPTACAO)
- [ ] Adicionar todos os itens
- [ ] Aplicar descontos se necessario
- [ ] Gerar PDF e enviar ao responsavel
- [ ] Aguardar aprovacao
- [ ] Registrar forma de pagamento
- [ ] Atualizar status para APROVADO
- [ ] Criar internacao

---

*Ultima atualizacao: 20/01/2026*
