@echo off
cd /d C:\spiral_icons

for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set timestamp=%%i

echo Adding changes...
git add .

echo Checking for staged changes...
git diff --cached --quiet
if %errorlevel% neq 0 (
  echo Committing as "Auto-update %timestamp%"...
  git commit -m "Auto-update %timestamp%"
) else (
  echo No changes to commit.
)

echo Pushing to GitHub...
git push origin main

pause