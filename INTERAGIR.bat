@echo off
chcp 65001
echo ========================================================
echo      ROBO HOSPITALAR - MODO INTERATIVO (COM VISAO)
echo ========================================================
echo.
echo Iniciando o cerebro do robo...
echo.

cd visual
call npm run interact

echo.
echo Sessao encerrada.
pause
