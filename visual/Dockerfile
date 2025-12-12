# Usar imagem oficial do Playwright v1.41.0 (mesma versão do package.json)
# A imagem 'jammy' é baseada no Ubuntu 22.04 LTS
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências do projeto
RUN npm ci

# Instalar dependências do sistema para o Playwright (garantia extra)
# O comando 'npx playwright install-deps' garante que tudo que o navegador precisa esteja lá
RUN npx playwright install-deps chromium

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
