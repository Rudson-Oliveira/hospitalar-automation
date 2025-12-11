@echo off
TITLE Correcao de Erros - Robo Hospitalar
COLOR 0E

echo ==========================================
echo      MODO DE CORRECAO E DIAGNOSTICO
echo ==========================================
echo.
echo 1. Entrando na pasta do sistema...
cd visual

echo.
echo 2. Forcando instalacao dos navegadores...
echo (Isso pode demorar um pouco se sua internet estiver lenta)
call npx playwright install
IF %ERRORLEVEL% NEQ 0 (
    echo ERRO NA INSTALACAO DOS NAVEGADORES.
) ELSE (
    echo Navegadores instalados com sucesso.
)

echo.
echo 3. Tentando rodar o robo manualmente...
echo Observe se aparece alguma mensagem de erro abaixo.
echo.
call npx ts-node src/index.ts demo

echo.
echo ==========================================
echo      TESTE FINALIZADO
echo ==========================================
echo Se apareceu erro vermelho acima, tire uma foto e me mande.
echo Se o navegador abriu, parabens!
echo.
pause
