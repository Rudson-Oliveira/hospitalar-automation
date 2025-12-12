# Usar imagem oficial do Playwright (versão exata para evitar conflitos)
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Definir diretório de trabalho
WORKDIR /app

# Variáveis de ambiente críticas para Playwright no Docker
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_ENV=production

# Copiar a pasta do projeto 'visual' para dentro do container
COPY visual/ ./visual/

# Mudar para o diretório do projeto
WORKDIR /app/visual

# Instalar dependências
RUN npm install

# Build do projeto
RUN npm run build

# Expor porta do servidor
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
