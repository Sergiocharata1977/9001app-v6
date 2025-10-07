@echo off
echo ========================================================
echo   TESTING AUTOMATICO - MODULO DE AUDITORIAS
echo ========================================================
echo.
echo Testeando modulos relacionados:
echo   - Auditorias (Dashboard)
echo   - Hallazgos
echo   - Acciones Correctivas
echo   - Acciones Auditor
echo.
echo ========================================================
echo.

cd frontend
node test-auditorias-monitor.js

echo.
echo ========================================================
echo   TESTING COMPLETADO
echo ========================================================
echo.
echo Abre el reporte HTML para ver resultados detallados:
echo frontend\test-results\auditorias\audit-test-report.html
echo.
pause


