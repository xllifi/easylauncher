@echo off
echo Этот файл добавит на ваш компьютер необходимый сертификат и запустит установщик. Продолжить? [Y/n]
CHOICE /T 10 /C YN /D Y>nul
if %errorLevel% == 1 (
  goto :checkadmin
) else if %errorLevel% == 2 (
  goto :exit
) else (
  echo Неизвестная ошибка.
  goto :exit
)

:checkadmin
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :exec
) else (
    echo Требуются права администратора. Перезапустите скрипт с правами администратора.
    goto :exit
)

:exec
@REM echo Добавление сертификата...
@REM certutil.exe -addstore trustedpeople easylauncher.cer

echo Запуск установщика...
Start "" easylauncher.appx

:exit
pause
