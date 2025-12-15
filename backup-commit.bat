@echo off
setlocal enabledelayedexpansion
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
  exit /b 1
)

REM Mostrar estado atual do repositório
echo Estado atual do repositório:
echo ------------------------------------------------------------
git status
echo ------------------------------------------------------------
echo.

REM Construir data/hora para mensagem de commit (formato mais seguro)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set "YYYY=%datetime:~0,4%"
set "MM=%datetime:~4,2%"
set "DD=%datetime:~6,2%"
set "HH=%datetime:~8,2%"
set "MIN=%datetime:~10,2%"
set "SS=%datetime:~12,2%"

set "COMMIT_MSG=Backup - %DD%-%MM%-%YYYY% %HH%-%MIN%-%SS%"

echo Mensagem de commit a usar:
echo   %COMMIT_MSG%
echo.

REM Adicionar ficheiros alterados
echo A adicionar ficheiros alterados...
git add .
if errorlevel 1 (
  echo [ERRO] Erro ao adicionar ficheiros.
  pause
  exit /b 1
)

REM Verificar se há alterações para commitar
git diff --cached --quiet
if errorlevel 1 (
  REM Há alterações, criar commit
  echo A criar commit...
  git commit -m "%COMMIT_MSG%"
  if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao criar commit.
    pause
    exit /b 1
  )
  echo Commit criado com sucesso!
) else (
  echo.
  echo [AVISO] Nao ha alteracoes para commitar.
  echo Verificando se ha commits locais para fazer push...
)

REM Verificar se há commits para fazer push
git log origin/main..HEAD --oneline >nul 2>&1
if errorlevel 1 (
  REM Não há commits locais, mas vamos tentar push mesmo assim
  echo Nao ha commits locais para fazer push.
) else (
  REM Há commits locais, fazer push
  echo.
  echo A fazer push para origin main...
  git push origin main
  if errorlevel 1 (
    echo.
    echo [ERRO] Ocorreu um erro ao fazer push para origin main.
    echo Verifica a ligacao a internet ou configuracao do remoto.
    echo.
    echo Tentando novamente com --force (se necessario)...
    git push origin main --force-with-lease
    if errorlevel 1 (
      echo [ERRO] Push falhou mesmo com --force-with-lease.
      pause
      exit /b 1
    )
  )
  echo Push concluido com sucesso!
)

echo.
echo ============================================================
echo  Backup concluido com sucesso!
echo  Commit: %COMMIT_MSG%
echo ============================================================
echo.
pause
endlocal


