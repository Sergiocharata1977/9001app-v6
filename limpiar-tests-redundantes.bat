@echo off
echo ========================================
echo LIMPIEZA DE TESTS REDUNDANTES
echo ========================================
echo.
echo Eliminando tests duplicados y manteniendo solo los esenciales...
echo.

echo Eliminando tests RRHH individuales...
if exist "test-rrhh-competencias-optimizado.js" del "test-rrhh-competencias-optimizado.js"
if exist "test-rrhh-evaluaciones-optimizado.js" del "test-rrhh-evaluaciones-optimizado.js"
if exist "test-rrhh-capacitaciones-optimizado.js" del "test-rrhh-capacitaciones-optimizado.js"
if exist "test-rrhh-departamentos-optimizado.js" del "test-rrhh-departamentos-optimizado.js"
if exist "test-rrhh-personal-optimizado.js" del "test-rrhh-personal-optimizado.js"
if exist "test-rrhh-puestos-optimizado.js" del "test-rrhh-puestos-optimizado.js"

echo Eliminando scripts de ejecución RRHH individuales...
if exist "run-rrhh-competencias-tests.bat" del "run-rrhh-competencias-tests.bat"
if exist "run-rrhh-competencias-tests.ps1" del "run-rrhh-competencias-tests.ps1"

echo Eliminando tests de performance individuales...
if exist "test-performance-monitor.js" del "test-performance-monitor.js"
if exist "test-auditorias-monitor.js" del "test-auditorias-monitor.js"
if exist "test-documentos-optimizado.js" del "test-documentos-optimizado.js"
if exist "test-procesos-optimizado.js" del "test-procesos-optimizado.js"

echo Eliminando tests duplicados...
if exist "test-normas-auto.bat" del "test-normas-auto.bat"

echo.
echo ========================================
echo TESTS MANTENIDOS (ESENCIALES)
echo ========================================
echo.
echo ✅ test-sistema-completo.js - Test unificado principal
echo ✅ run-test-sistema-completo.bat - Ejecutor Windows
echo ✅ run-test-sistema-completo.ps1 - Ejecutor PowerShell
echo ✅ run-all-tests.bat - Suite completa (actualizada)
echo ✅ run-all-tests.ps1 - Suite completa PowerShell
echo ✅ run-rrhh-tests.bat - Tests RRHH (actualizado)
echo ✅ run-rrhh-tests.ps1 - Tests RRHH PowerShell
echo ✅ run-tests.bat - Tests funcionales básicos
echo ✅ run-tests.ps1 - Tests funcionales PowerShell
echo ✅ run-audit-tests.bat - Tests auditorías
echo ✅ run-audit-tests.ps1 - Tests auditorías PowerShell
echo ✅ run-performance-monitor.bat - Monitoreo rendimiento
echo ✅ run-performance-monitor.ps1 - Monitoreo rendimiento PowerShell
echo ✅ run-performance-monitor-continuous.ps1 - Monitoreo continuo
echo ✅ run-single-test.bat - Test individual
echo ✅ run-dev.bat - Desarrollo
echo ✅ run-dev.ps1 - Desarrollo PowerShell
echo.
echo ========================================
echo LIMPIEZA COMPLETADA
echo ========================================
echo.
echo Tests redundantes eliminados. Sistema optimizado.
echo.
pause







