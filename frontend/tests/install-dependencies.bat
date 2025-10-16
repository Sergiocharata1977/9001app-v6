@echo off
echo ========================================
echo    📦 INSTALANDO DEPENDENCIAS DE TESTS
echo ========================================

echo.
echo Instalando Playwright para testing...
npm install playwright

echo.
echo Instalando navegadores de Playwright...
npx playwright install

echo.
echo ========================================
echo    ✅ DEPENDENCIAS INSTALADAS
echo ========================================
echo.
echo Ahora puedes ejecutar los tests con:
echo    run-tests.bat
echo    run-tests.ps1
echo.
pause














