@echo off
echo ==========================================
echo       Uploading to GitHub...
echo ==========================================
echo.

echo 1. Adding files...
git add .

echo 2. Committing changes...
git commit -m "Auto update: %date% %time%"

echo 3. Pushing to GitHub...
git push origin main

echo.
echo ==========================================
if %errorlevel% equ 0 (
    echo       Upload Success!
) else (
    echo       Upload Failed. Please check internet or login.
)
echo ==========================================
pause
