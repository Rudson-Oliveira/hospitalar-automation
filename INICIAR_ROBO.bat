@echo off
TITLE Agente Hospitalar - Automação
COLOR 0A

echo ==========================================
echo      AGENTE DE AUTOMACAO HOSPITALAR
echo ==========================================
echo.

echo [1/3] Verificando atualizacoes do sistema...
git pull origin main
IF %ERRORLEVEL% NEQ 0 (
    echo FALHA AO ATUALIZAR. Verifique sua internet ou se o git esta instalado.
    echo Continuando com a versao atual...
) ELSE (
    echo Sistema atualizado com sucesso!
)
echo.

echo [2/3] Verificando dependencias...
cd visual
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Erro ao instalar dependencias.
    pause
    exit /b
)
echo.

echo [3/3] INICIANDO O ROBO...
echo O navegador vai abrir e controlar o mouse. Por favor, nao mexa no mouse enquanto ele trabalha.
echo.
call npx ts-node src/index.ts demo

echo.
echo ==========================================
echo      TAREFA CONCLUIDA
echo ==========================================
pause
