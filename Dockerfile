# Usar imagem oficial do Playwright (versão exata para evitar conflitos)
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Definir diretório de trabalho
WORKDIR /app

# Variáveis de ambiente críticas para Playwright no Docker
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_ENV=production

# Copiar arquivos de dependência da pasta visual/
COPY visual/package*.json ./

# Instalar dependências (incluindo TypeScript)
RUN npm install

# Copiar código fonte da pasta visual/
COPY visual/ .

# Build do projeto (compilar TS e copiar assets)
RUN npm run build

# Expor porta do servidor
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
