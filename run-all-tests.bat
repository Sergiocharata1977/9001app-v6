@echo off
echo ========================================================
echo   SUITE COMPLETA DE TESTS - 9001app v6
echo ========================================================
echo.
echo Este script ejecutara:
echo   1. Tests de funcionalidad (RRHH)
echo   2. Monitoreo de rendimiento
echo.
echo ========================================================
echo.

cd frontend

echo ========================================
echo   FASE 1: TESTS DE FUNCIONALIDAD
echo ========================================
echo.

echo [1/3] Testing Departamentos...
node test-rrhh-departamentos-optimizado.js
echo.

echo [2/3] Testing Puestos...
node test-rrhh-puestos-optimizado.js
echo.

echo [3/3] Testing Personal...
node test-rrhh-personal-optimizado.js
echo.

echo ========================================
echo   FASE 2: CRM - SISTEMA COMPLETO
echo ========================================
echo.

echo [4/4] Testing Sistema Completo (CRM + RRHH + Super Admin)...
node test-sistema-completo.js
echo.

echo ========================================
echo   FASE 3: MONITOREO DE RENDIMIENTO
echo ========================================
echo.

node test-performance-monitor.js

echo.
echo ========================================================
echo   TODOS LOS TESTS COMPLETADOS
echo ========================================================
echo.
echo Reportes generados:
echo   - Funcionalidad RRHH: frontend\test-results\[departamentos^|puestos^|personal]\
echo   - Rendimiento: frontend\test-results\performance\performance-report.html
echo.

cd ..
pause


