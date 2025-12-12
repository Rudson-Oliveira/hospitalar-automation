#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===================================================${NC}"
echo -e "${GREEN}     HOSPITALAR AUTOMATION AI - INSTALADOR         ${NC}"
echo -e "${GREEN}===================================================${NC}"
echo ""

# 1. Verificar Node.js
echo -e "[1/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERRO] Node.js não encontrado!${NC}"
    echo "Por favor, instale o Node.js antes de continuar."
    exit 1
fi
echo -e "${GREEN}[OK] Node.js detectado: $(node -v)${NC}"
echo ""

# 2. Instalar Dependências
echo -e "[2/4] Instalando dependências do sistema..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERRO] Falha ao instalar dependências.${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Dependências instaladas.${NC}"
echo ""

# 3. Configurar Ambiente
echo -e "[3/4] Configurando ambiente..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}[OK] Arquivo .env criado a partir do exemplo.${NC}"
    else
        touch .env
        echo -e "${GREEN}[OK] Arquivo .env vazio criado.${NC}"
    fi
else
    echo -e "${GREEN}[OK] Arquivo .env já existe.${NC}"
fi
echo ""

# 4. Iniciar Sistema
echo -e "[4/4] Iniciando o sistema..."
echo ""
echo -e "${GREEN}===================================================${NC}"
echo -e "${GREEN}      TUDO PRONTO! INICIANDO DASHBOARD...          ${NC}"
echo -e "${GREEN}===================================================${NC}"
echo ""
echo "O navegador abrirá automaticamente em alguns segundos..."
echo ""

# Abrir navegador baseado no OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3002
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3002 > /dev/null 2>&1 &
fi

npm run dashboard
