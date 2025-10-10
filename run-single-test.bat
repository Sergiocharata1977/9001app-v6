@echo off
echo ========================================
echo    EJECUTAR TEST INDIVIDUAL
echo ========================================

if "%1"=="documentos" (
    echo Ejecutando test de Documentos...
    cd frontend
    node test-documentos-optimizado.js
) else if "%1"=="procesos" (
    echo Ejecutando test de Procesos...
    cd frontend
    node test-procesos-optimizado.js
) else if "%1"=="normas" (
    echo Ejecutando test de Puntos de Norma...
    cd frontend
    node test-puntos-norma.js
) else (
    echo Uso: run-single-test.bat [documentos^|procesos^|normas]
    echo.
    echo Ejemplos:
    echo   run-single-test.bat documentos
    echo   run-single-test.bat procesos
    echo   run-single-test.bat normas
)

echo.
pause








