# 📘 GUIA DEFINITIVO: Instalação e Validação do Sistema Hospitalar AI

Este documento é o manual oficial para instalar, configurar e validar o **Sistema Multi-Agente Autônomo** da Hospitalar. Siga cada passo exatamente como descrito.

---

## 1️⃣ PRÉ-REQUISITOS (O que você precisa ter)

Antes de começar, verifique se seu computador tem estes programas instalados. Se não tiver, clique nos links para baixar.

| Ferramenta | Versão Mínima | Link de Download |
| :--- | :--- | :--- |
| **Node.js** | v18.0.0 ou superior | [Baixar Node.js (LTS)](https://nodejs.org/) |
| **Git** | Qualquer versão | [Baixar Git](https://git-scm.com/downloads) |
| **VS Code** | Opcional (Recomendado) | [Baixar VS Code](https://code.visualstudio.com/) |
| **Navegador** | Chrome, Edge ou Firefox | Já vem no computador |

---

## 2️⃣ INSTALAÇÃO PASSO A PASSO (Tempo estimado: 5 min)

### Passo 1: Baixar o Sistema (Clonar)
Abra o terminal (Prompt de Comando ou PowerShell) e digite:

```bash
git clone https://github.com/Rudson-Oliveira/hospitalar-automation.git
cd hospitalar-automation/visual
```

### Passo 2: Instalação Automática (1-Clique)

**👉 Se você usa Windows:**
1. Abra a pasta `hospitalar-automation/visual` no Explorador de Arquivos.
2. Dê **dois cliques** no arquivo `setup.bat`.
3. Uma janela preta vai abrir e instalar tudo sozinha. Aguarde até aparecer "TUDO PRONTO!".

**👉 Se você usa Linux ou Mac:**
No terminal, digite:
```bash
chmod +x setup.sh
./setup.sh
```

---

## 3️⃣ VALIDAÇÃO DE CADA COMPONENTE

Agora vamos testar se tudo está funcionando. Marque o checklist conforme for validando.

### ✅ Teste 1: Interface Web (Dashboard)
1. O navegador deve ter aberto automaticamente em `http://localhost:3002`.
2. Se não abriu, digite esse endereço manualmente.
3. **O que deve aparecer:** Uma tela preta com gráficos ("Saúde Financeira", "Risco de Churn") e um chat no meio.

### ✅ Teste 2: Painel de Configuração
1. No menu lateral esquerdo, clique em **Configurações** (ou vá para `http://localhost:3002/settings`).
2. Preencha os campos:
   *   **URL do Sistema:** `https://dev.hospitalarsaude.app.br`
   *   **Usuário:** (Seu e-mail de admin)
   *   **Senha:** (Sua senha)
3. Clique em **Salvar e Conectar**.
4. **Validação:** Os ícones de status no topo devem ficar VERDES ("Online").

### ✅ Teste 3: Sistema Multi-Agente (Simulação)
1. Volte para o Dashboard (`http://localhost:3002`).
2. No topo da tela, verifique se o botão está em **SIMULAÇÃO** (Cinza).
3. Abra um novo terminal na pasta do projeto e digite:
   ```bash
   npm run sim:full
   ```
4. **Validação:** No navegador, você deve ver mensagens aparecendo sozinhas no chat: `[CEO]`, `[CFO]`, `[CMO]` conversando entre si.

### ✅ Teste 4: Integração Real (Hospitalar App)
1. No Dashboard, clique no botão **SIMULAÇÃO** para mudar para **REAL DATA** (Verde).
2. Observe o chat.
3. **Validação:** O Agente Scout deve enviar uma mensagem como:
   > *"Conectado ao Hospitalar App. Detectei X novos leads e Y agendamentos para hoje."*

### ✅ Teste 5: Sistema Educador (Onboarding)
1. Acesse `http://localhost:3002/onboarding`.
2. Siga o passo a passo como se fosse um funcionário novo.
3. Escolha o nível "Iniciante".
4. **Validação:** Ao terminar, vá para o Dashboard e passe o mouse sobre os botões. Devem aparecer balões explicativos (Tooltips).

---

## 4️⃣ TROUBLESHOOTING (Resolução de Problemas)

| Problema | Solução |
| :--- | :--- |
| **Erro: "Node não reconhecido"** | Você não instalou o Node.js (Passo 1). Instale e reinicie o computador. |
| **Tela branca no navegador** | Verifique se o terminal onde você rodou o `setup` ainda está aberto. Não feche ele! |
| **Status "Offline" nas Configurações** | Verifique se a URL `https://dev.hospitalarsaude.app.br` está acessível no seu navegador. Se o site estiver fora, a IA não conecta. |
| **Agentes não falam nada** | Certifique-se de rodar `npm run sim:full` em um SEGUNDO terminal. O primeiro terminal serve apenas o site. |

---

## 5️⃣ CHECKLIST FINAL DE VALIDAÇÃO

Imprima ou copie esta lista e marque cada item:

- [ ] O instalador (`setup.bat`) rodou sem erros vermelhos?
- [ ] O Dashboard abriu no navegador?
- [ ] Consegui salvar minhas senhas no painel `/settings`?
- [ ] Vi os agentes conversando no chat?
- [ ] O botão "Modo Real" ficou verde?
- [ ] O Assistente Virtual (robô no canto) apareceu?
- [ ] O botão "Verificar Atualizações" funcionou?

---

## 6️⃣ PRÓXIMOS PASSOS

Se você marcou todos os itens acima, o sistema está **VALIDADO E PRONTO PARA USO!** 🚀

### O que fazer agora?
1.  **Treinar a Equipe:** Peça para cada funcionário acessar `/onboarding` e fazer o treinamento.
2.  **Deixar Rodando:** Mantenha o terminal do servidor (`npm run dashboard`) aberto em um computador dedicado (servidor) para que a IA trabalhe 24/7.
3.  **Acompanhar:** Entre no Dashboard uma vez por dia para ver o que o "Conselho de IA" decidiu.

**Dúvidas?** Clique no botão SOS do Assistente Virtual na tela.
