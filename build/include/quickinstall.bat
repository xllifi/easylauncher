@echo off
cd /d %~dp0
echo Этот файл добавит на ваш компьютер необходимый сертификат и запустит установщик. Продолжить? [Y/n]
CHOICE /T 10 /C YN /D Y>nul
if %errorLevel% == 1 (
  goto :checkadmin
) else if %errorLevel% == 2 (
  pause
  goto :exit
) else (
  echo Неизвестная ошибка.
  pause >nul
  goto :exit
)

:checkadmin
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :exec
) else (
    echo Требуются права администратора. Перезапустите скрипт с правами администратора.
    pause >nul
    goto :exit
)

:exec
echo Добавление сертификата...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher.cer') do set cert=%%a
certutil.exe -addstore trustedpeople "%cert%">nul
if %errorLevel% == 0 (
    echo Сертификат успешно добавлен!
) else (
    echo Неизвестная ошибка.
    pause >nul
    goto :exit
)

echo Запуск установщика...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher *.appx ^| findstr /E /r "\\easylauncher [0-9]*\.[0-9]*\.[0-9]*\.appx" ') do set found=%%a
start "" "%found%"

:exit
pause
