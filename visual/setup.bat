@echo off
title Instalador Hospitalar Automation AI
color 0A

echo ===================================================
echo      HOSPITALAR AUTOMATION AI - INSTALADOR
echo ===================================================
echo.
echo [1/4] Verificando Node.js...

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    echo Apos instalar, execute este arquivo novamente.
    pause
    exit
)

echo [OK] Node.js detectado.
echo.
echo [2/4] Instalando dependencias do sistema...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias.
    pause
    exit
)

echo [OK] Dependencias instaladas.
echo.
echo [3/4] Configurando ambiente...
if not exist .env (
    copy .env.example .env >nul
    echo [OK] Arquivo .env criado.
) else (
    echo [OK] Arquivo .env ja existe.
)

echo.
echo [4/4] Iniciando o sistema...
echo.
echo ===================================================
echo      TUDO PRONTO! INICIANDO DASHBOARD...
echo ===================================================
echo.
echo O navegador abrira automaticamente em alguns segundos...
echo.

start http://localhost:3002
call npm run dashboard

pause
