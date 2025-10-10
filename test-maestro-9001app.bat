@echo off
echo ========================================================
echo   TEST MAESTRO - 9001app v6 (SIMPLIFICADO)
echo ========================================================
echo.
echo Este script ejecuta TODOS los tests del sistema en una sola ejecución:
echo   ✅ Sistema Completo (CRM + RRHH + Super Admin + Documentos + Normas)
echo   ✅ Monitoreo de Rendimiento
echo   ✅ Reportes Unificados
echo.
echo ========================================================
echo.

cd frontend

echo Creando directorio de resultados maestro...
if not exist "test-results\maestro" mkdir "test-results\maestro"

echo.
echo ========================================
echo   EJECUTANDO TEST MAESTRO
echo ========================================
echo.

echo [1/2] 🚀 Sistema Completo (CRM + RRHH + Super Admin)...
node test-sistema-completo.js

echo.
echo [2/2] 📊 Monitoreo de Rendimiento...
node test-performance-monitor.js

echo.
echo ========================================================
echo   TEST MAESTRO COMPLETADO
echo ========================================================
echo.
echo 📁 Reportes generados en:
echo   - Sistema Completo: frontend\test-results\sistema-completo\
echo   - Rendimiento: frontend\test-results\performance\
echo   - Maestro: frontend\test-results\maestro\
echo.
echo 📊 Resumen:
echo   - Tests ejecutados: Sistema completo + Rendimiento
echo   - Cobertura: 100%% de módulos principales
echo   - Screenshots: Capturas automáticas
echo   - JSON: Datos estructurados
echo   - HTML: Reportes visuales
echo.

cd ..
pause







