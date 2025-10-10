@echo off
echo ========================================
echo TEST SISTEMA COMPLETO - 9001app v6
echo ========================================
echo.
echo Iniciando test unificado del sistema...
echo.

cd frontend

echo Creando directorio de resultados...
if not exist "test-results\sistema-completo" mkdir "test-results\sistema-completo"

echo.
echo ========================================
echo EJECUTANDO TEST SISTEMA COMPLETO
echo ========================================
node test-sistema-completo.js

echo.
echo ========================================
echo TEST COMPLETADO
echo ========================================
echo.
echo Resultados guardados en: test-results\sistema-completo\
echo.
pause

