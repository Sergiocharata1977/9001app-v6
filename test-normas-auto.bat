@echo off
echo =========================================
echo  Testing Automatizado - Puntos de Norma
echo =========================================
echo.

cd frontend

echo Instalando Playwright Chromium...
call npx playwright install chromium

echo.
echo Ejecutando pruebas automatizadas...
call node test-puntos-norma.js

echo.
echo Abriendo reporte de pruebas...
start test-results\test-report.html

pause

