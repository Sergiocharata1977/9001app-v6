@echo off
echo ================================================
echo   MONITOREO DE RENDIMIENTO - 9001app v6
echo ================================================
echo.
echo Iniciando analisis automatico de velocidad...
echo.

cd frontend
node test-performance-monitor.js

echo.
echo ================================================
echo   MONITOREO COMPLETADO
echo ================================================
echo.
echo Abre el archivo HTML para ver el reporte detallado:
echo frontend\test-results\performance\performance-report.html
echo.
pause


