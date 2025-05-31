@echo off
cd /d C:\spiral_icons

REM Generate timestamp with PowerShell
for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set timestamp=%%i

git add .
git diff --cached --quiet || git commit -m "Auto-update %timestamp%"
git push origin main
pause
