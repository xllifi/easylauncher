@REM CP 866 encoding !!!

@echo off
cd /d %~dp0
echo Этот файл добавит на ваш компьютер необходимый сертификат и запустит установщик. Продолжить? [Y/n]
choice /T 10 /C YN /D Y>nul
echo.
if %errorLevel% == 1 (
    goto :checkadmin
) else if %errorLevel% == 2 (
    pause
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
echo [1/2] Добавление сертификата...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher.cer') do set cert=%%a
certutil.exe -addstore trustedpeople "%cert%">nul
if %errorLevel% == 0 (
    echo [1/2] Сертификат успешно добавлен!
) else (
    echo [1/2] Не удалось добавить сертификат.
    goto :exit
)
echo.

echo [2/2] Запуск установщика...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher *.appx ^| findstr /E /r "\\easylauncher [0-9]*\.[0-9]*\.[0-9]*\.appx" ') do set "found=%%a"
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher *.msi ^| findstr /E /r "\\easylauncher [0-9]*\.[0-9]*\.[0-9]*\.msi" ') do set "found=%%a"
if NOT [%found%] == [] (
    echo [2/2] Установщик запущен!
    start "" "%found%"
) else (
    echo [2/2] Не удалось найти файл установщика. Убедитесь, что в папке со скриптом есть файл "easylauncher x.x.x.msi", где x - это цифра.
    goto :exit
)

:exit
echo.
echo Нажмите любую клавишу, чтобы выйти...
pause >nul
