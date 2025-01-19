@echo off
cd /d %~dp0
echo ��� 䠩� ������� �� ��� �������� ����室��� ���䨪�� � ������� ��⠭��騪. �த������? [Y/n]
CHOICE /T 10 /C YN /D Y>nul
if %errorLevel% == 1 (
  goto :checkadmin
) else if %errorLevel% == 2 (
  pause
  goto :exit
) else (
  echo �������⭠� �訡��.
  pause >nul
  goto :exit
)

:checkadmin
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :exec
) else (
    echo �ॡ����� �ࠢ� �����������. ��१������ �ਯ� � �ࠢ��� �����������.
    pause >nul
    goto :exit
)

:exec
echo ���������� ���䨪��...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher.cer') do set cert=%%a
certutil.exe -addstore trustedpeople "%cert%">nul
if %errorLevel% == 0 (
    echo ����䨪�� �ᯥ譮 ��������!
) else (
    echo �������⭠� �訡��.
    pause >nul
    goto :exit
)

echo ����� ��⠭��騪�...
for /f "delims=" %%a in ('dir /b /s /a-d easylauncher *.appx ^| findstr /E /r "\\easylauncher [0-9]*\.[0-9]*\.[0-9]*\.appx" ') do set found=%%a
start "" "%found%"

:exit
pause
