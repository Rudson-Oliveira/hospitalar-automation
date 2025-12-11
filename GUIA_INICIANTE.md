# 📘 Guia Passo a Passo: Como Ligar Seu Robô Hospitalar

Este guia foi feito para quem nunca mexeu com programação. Siga os passos abaixo com calma.

---

## Passo 1: Instalar as Ferramentas (Só precisa fazer uma vez)

Para o robô funcionar no seu computador, ele precisa de dois programas instalados. É igual instalar o Word ou Excel.

1.  **Baixe e Instale o Node.js:**
    *   Clique neste link: [Download Node.js (LTS)](https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi)
    *   Baixe o arquivo e instale clicando em "Next" (Próximo) até terminar.

2.  **Baixe e Instale o Git:**
    *   Clique neste link: [Download Git](https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe)
    *   Baixe e instale clicando em "Next" até terminar.

---

## Passo 2: Baixar o Robô para seu Computador

Agora vamos pegar os arquivos que eu criei e colocar no seu computador.

1.  Crie uma pasta na sua Área de Trabalho (Desktop) chamada `RoboHospital`.
2.  Abra essa pasta.
3.  Clique com o botão **direito** do mouse dentro da pasta (no espaço em branco) e escolha a opção **"Open Git Bash Here"** (ou "Abrir Git Bash aqui"). Vai abrir uma janelinha preta.
4.  Copie e cole este comando na janelinha preta e aperte ENTER:
    ```bash
    git clone https://github.com/Rudson-Oliveira/hospitalar-automation.git
    ```
5.  Vai aparecer uma nova pasta chamada `hospitalar-automation`. Entre nela.

---

## Passo 3: Configurar sua Senha

O robô precisa saber seu login e senha para entrar no site do hospital.

1.  Entre na pasta `visual`.
2.  Procure um arquivo chamado `.env` (ou `.env.example`).
3.  Abra ele com o **Bloco de Notas**.
4.  Onde está escrito `HOSPITAL_USER=...`, apague o que está depois do igual e coloque seu email.
5.  Onde está escrito `HOSPITAL_PASS=...`, coloque sua senha.
6.  Salve o arquivo e feche.
    *   *Importante:* Se o arquivo se chamar `.env.example`, renomeie ele para apenas `.env` (tire o .example do final).

---

## Passo 4: Ligar o Robô! 🚀

Agora é a parte fácil.

1.  Volte para a pasta principal `hospitalar-automation`.
2.  Procure o arquivo chamado **`INICIAR_ROBO.bat`**.
3.  Dê **dois cliques** nele.

**O que vai acontecer:**
*   Uma janela preta vai abrir e carregar algumas coisas (pode demorar um pouco na primeira vez).
*   Depois, o navegador (Google Chrome ou similar) vai abrir sozinho.
*   **NÃO MEXA NO MOUSE!** O robô vai assumir o controle, digitar a senha e navegar. Apenas assista.

---

## Dúvidas Comuns

*   **"Deu erro vermelho na tela preta!"**
    *   Tire uma foto e mande para o suporte (eu). Geralmente é falta de instalar o Node.js (Passo 1).

*   **"O navegador abriu e fechou rápido."**
    *   Verifique se sua senha no Passo 3 está correta.
