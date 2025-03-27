@REM CP 866 encoding !!!

@echo off
cd /d %~dp0
echo ��� 䠩� ������� �� ��� �������� ����室��� ���䨪�� � ������� ��⠭��騪. �த������? [Y/n]
choice /T 10 /C YN /D Y>nul
echo.
if %errorLevel% == 1 (
    goto :checkadmin
) else if %errorLevel% == 2 (
    pause
    goto :exit
) else (
    echo �������⭠� �訡��.
    goto :exit
)

:checkadmin
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :exec
) else (
    echo �ॡ����� �ࠢ� �����������. ��१������ �ਯ� � �ࠢ��� �����������.
    goto :exit
)

:exec
echo [1/2] ���������� ���䨪��...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher.cer') do set cert=%%a
certutil.exe -addstore trustedpeople "%cert%">nul
if %errorLevel% == 0 (
    echo [1/2] ����䨪�� �ᯥ譮 ��������!
) else (
    echo [1/2] �� 㤠���� �������� ���䨪��.
    goto :exit
)
echo.

echo [2/2] ����� ��⠭��騪�...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher *.appx ^| findstr /E /r "\\easylauncher [0-9]*\.[0-9]*\.[0-9]*\.appx" ') do set "found=%%a"
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher *.msi ^| findstr /E /r "\\easylauncher [0-9]*\.[0-9]*\.[0-9]*\.msi" ') do set "found=%%a"
if NOT [%found%] == [] (
    echo [2/2] ��⠭��騪 ����饭!
    start "" "%found%"
) else (
    echo [2/2] �� 㤠���� ���� 䠩� ��⠭��騪�. ��������, �� � ����� � �ਯ⮬ ���� 䠩� "easylauncher x.x.x.msi", ��� x - �� ���.
    goto :exit
)

:exit
echo.
echo ������ ���� �������, �⮡� ���...
pause >nul
