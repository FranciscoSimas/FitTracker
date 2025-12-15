@echo off
REM ============================================================
REM  Script de backup automático para o repositório FitTracker
REM  - Cria commit com mensagem "Backup - <data e hora atual>"
REM  - Faz push para o branch main
REM ============================================================

REM Ir para a pasta do script (raiz do projeto)
cd /d "%~dp0"

echo ============================================================
echo  FitTracker - Backup automático para o branch main
echo ============================================================
echo.

REM Verificar se git está disponível
git --version >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Git não encontrado no PATH. Instala o Git ou abre este script num Git Bash / terminal com Git configurado.
  pause
  goto :eof
)

REM Mostrar estado atual do repositório
echo Estado atual do repositório:
echo ------------------------------------------------------------
git status
echo ------------------------------------------------------------
echo.

REM Construir data/hora para mensagem de commit
set "NOW=%DATE% %TIME%"
REM Substituir caracteres inválidos em mensagens/nomes (/, :, .) por -
set "NOW=%NOW:/=-%"
set "NOW=%NOW::=-%"
set "NOW=%NOW:.=-%"

set "COMMIT_MSG=Backup - %NOW%"

echo Mensagem de commit a usar:
echo   "%COMMIT_MSG%"
echo.

REM Adicionar ficheiros alterados
echo A adicionar ficheiros alterados...
git add .

REM Criar commit (se houver alterações)
echo A criar commit...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo.
  echo [AVISO] Nao foi criado commit (possivelmente nao ha alteracoes para commitar).
  echo A sair sem fazer push.
  pause
  goto :eof
)

REM Fazer push para o branch main
echo.
echo A fazer push para origin main...
git push origin main
if errorlevel 1 (
  echo.
  echo [ERRO] Ocorreu um erro ao fazer push para origin main.
  echo Verifica a ligacao a internet ou configuracao do remoto.
  pause
  goto :eof
)

echo.
echo ============================================================
echo  Backup concluido com sucesso!
echo  Commit: %COMMIT_MSG%
echo ============================================================
echo.
pause


