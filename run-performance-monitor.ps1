Set-Location -Path "frontend";
Write-Host "================================================" -ForegroundColor Cyan;
Write-Host "  MONITOREO DE RENDIMIENTO - 9001app v6" -ForegroundColor Cyan;
Write-Host "================================================" -ForegroundColor Cyan;
Write-Host "";
Write-Host "Iniciando analisis automatico de velocidad..." -ForegroundColor Yellow;
Write-Host "";

node test-performance-monitor.js;

Write-Host "";
Write-Host "================================================" -ForegroundColor Green;
Write-Host "  MONITOREO COMPLETADO" -ForegroundColor Green;
Write-Host "================================================" -ForegroundColor Green;
Write-Host "";
Write-Host "Abre el archivo HTML para ver el reporte detallado:" -ForegroundColor Yellow;
Write-Host "frontend\test-results\performance\performance-report.html" -ForegroundColor White;
Write-Host "";

Set-Location -Path "..";
Read-Host "Presiona Enter para continuar...";


