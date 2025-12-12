# Usar imagem oficial do Playwright (já tem navegadores e dependências)
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para tsc)
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta (Railway injeta PORT, mas bom documentar)
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
