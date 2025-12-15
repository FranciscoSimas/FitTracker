@echo off
REM ============================================================
REM  Script simples de backup para o repositório FitTracker
REM  - git add .
REM  - git commit -m "Backup - <data e hora atual>"
REM  - git push origin main
REM ============================================================

REM Ir para a pasta do script (raiz do projeto)
cd /d "%~dp0"

echo ============================================================
echo  FitTracker - Backup para o branch main
echo ============================================================
echo.

REM Mostrar estado atual (apenas informativo)
git status
echo.

REM Mensagem de commit com data/hora do sistema
set "COMMIT_MSG=Backup - %DATE% %TIME%"
echo Mensagem de commit: %COMMIT_MSG%
echo.

REM Adicionar tudo
git add .

REM Criar commit (se não houver alterações, o git avisa e segue)
git commit -m "%COMMIT_MSG%"

REM Fazer push para origin/main
git push origin main

echo.
echo Operacao de backup terminada.
echo.
pause


