@echo off
echo 🚀 INICIANDO PRUEBAS AUTOMATIZADAS - 9001APP
echo ===============================================

echo 🔍 Verificando servidor...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Servidor no disponible. Iniciando servidor...
    start /min cmd /c "cd frontend && npm run dev"
    echo ⏳ Esperando que el servidor inicie...
    timeout /t 10 /nobreak >nul
)

echo 🔧 Verificando Playwright...
if not exist "frontend\node_modules\@playwright" (
    echo 📦 Instalando Playwright...
    cd frontend
    npm install @playwright/test
    npx playwright install
    cd ..
)

echo 🧪 Ejecutando pruebas de navegación...
echo 📊 Se ejecutarán 13 iteraciones de pruebas completas
echo.

cd frontend
npx playwright test tests/navigation-test.spec.ts --reporter=html,json,junit

if exist "test-results.json" (
    echo.
    echo 📊 RESULTADOS DE LAS PRUEBAS:
    echo =============================
    echo ✅ Revisa los archivos generados:
    echo    - playwright-report/index.html (reporte visual)
    echo    - test-results.json (datos JSON)
    echo    - test-results.xml (formato JUnit)
    echo.
    echo 🌐 Abriendo reporte en navegador...
    start playwright-report/index.html
) else (
    echo ❌ No se encontraron resultados de pruebas
)

cd ..

echo.
echo 🎉 PRUEBAS COMPLETADAS
echo =====================
echo 📊 Revisa los reportes generados para más detalles
pause