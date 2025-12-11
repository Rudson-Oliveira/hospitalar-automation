# 🖱️ Como Ver o Robô em Ação (Modo Demonstração)

Este guia explica como rodar o Agente Visual no seu computador e assistir ele controlando o mouse e navegando no sistema hospitalar.

## Pré-requisitos

1.  Ter **Node.js** instalado.
2.  Ter clonado este repositório.

## Passo a Passo

### 1. Configuração Inicial (Faça apenas uma vez)

Abra o terminal na pasta `hospitalar-automation/visual` e instale as dependências:

```bash
cd hospitalar-automation/visual
npm install
npx playwright install chromium
```

### 2. Configurar Credenciais e Modo Visual

Crie ou edite o arquivo `.env` na pasta `visual` e certifique-se de que `HEADLESS` está como `false`. Isso é o que faz o navegador aparecer na tela.

Arquivo `.env`:
```env
HOSPITAL_URL=https://dev.hospitalarsaude.app.br
HOSPITAL_USER=seu_usuario_real
HOSPITAL_PASS=sua_senha_real
HEADLESS=false
```

### 3. Executar a Demonstração

Rode o seguinte comando:

```bash
npx ts-node src/index.ts demo
```

### 🚀 O que vai acontecer?

1.  Uma janela do navegador Chromium vai abrir.
2.  O robô vai digitar seu usuário e senha.
3.  Após o login, você verá o **cursor do mouse se movendo sozinho** (graças à biblioteca `ghost-cursor`).
4.  Ele vai passar o mouse sobre menus e botões para demonstrar que está "vivo" e analisando a página.
5.  Ao final, o navegador fechará automaticamente.

---

**Dica:** Se quiser apenas testar o login sem a navegação extra, rode sem o argumento `demo`:
```bash
npx ts-node src/index.ts
```
