@echo off
echo ��� 䠩� ������� �� ��� �������� ����室��� ���䨪�� � ������� ��⠭��騪. �த������? [Y/n]
CHOICE /T 10 /C YN /D Y>nul
if %errorLevel% == 1 (
  goto :checkadmin
) else if %errorLevel% == 2 (
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
@REM echo ���������� ���䨪��...
@REM certutil.exe -addstore trustedpeople easylauncher.cer

echo ����� ��⠭��騪�...
Start "" easylauncher.appx

:exit
pause
