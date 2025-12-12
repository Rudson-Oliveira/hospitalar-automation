# 🚀 Guia de Deploy - Hospitalar AI

Este guia explica como colocar o sistema em produção usando serviços de nuvem modernos.

---

## Opção 1: Railway (Recomendado)

O Railway é a opção mais fácil pois detecta automaticamente o projeto Node.js.

1.  Crie uma conta em [railway.app](https://railway.app)
2.  Clique em **New Project** > **Deploy from GitHub repo**
3.  Selecione o repositório `hospitalar-automation`
4.  Vá em **Settings** > **Root Directory** e defina como `/visual`
5.  Vá em **Variables** e adicione:
    *   `HOSPITAL_URL`: `https://dev.hospitalarsaude.app.br`
    *   `HOSPITAL_USER`: (Seu email)
    *   `HOSPITAL_PASS`: (Sua senha)
    *   `OPENAI_API_KEY`: (Sua chave)
6.  O Railway vai fazer o build e deploy automaticamente.

---

## Opção 2: Render

1.  Crie uma conta em [render.com](https://render.com)
2.  Clique em **New** > **Web Service**
3.  Conecte seu GitHub e escolha o repositório
4.  Configure:
    *   **Root Directory:** `visual`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
5.  Adicione as variáveis de ambiente na aba **Environment**.

---

## ⚙️ Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta do servidor (Automático na nuvem) | `3002` |
| `HOSPITAL_URL` | URL da API Hospitalar | `https://dev.hospitalarsaude.app.br` |
| `OPENAI_API_KEY` | Chave da OpenAI | `sk-...` |

---

## 🔒 Segurança e Permissões

O sistema possui um middleware básico de autenticação (`src/middleware/auth.ts`).
*   **Admin:** Acesso total (Dashboard, Settings, Metrics)
*   **Collaborator:** Acesso restrito (Copilot, Onboarding)

Para produção real, recomenda-se integrar com o sistema de login da Hospitalar via JWT.
