@echo off
echo ===================================
echo 9001app MVP - Ejecutando tests...
echo ===================================

cd frontend

echo Instalando dependencias...
call npm install

echo.
echo Ejecutando tests MVP...
call npx playwright test tests/e2e/mvp/ --config=tests/playwright.config.js

echo.
echo Tests completados!
pause