@echo off
echo ========================================
echo    EJECUTANDO TESTS OPTIMIZADOS
echo ========================================

echo.
echo [1/2] Ejecutando test de Documentos...
cd frontend
node test-documentos-optimizado.js

echo.
echo [2/2] Ejecutando test de Procesos...
node test-procesos-optimizado.js

echo.
echo ========================================
echo    TESTS COMPLETADOS
echo ========================================
pause

