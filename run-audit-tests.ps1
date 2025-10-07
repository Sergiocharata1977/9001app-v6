Write-Host "========================================================" -ForegroundColor Cyan;
Write-Host "  TESTING AUTOMATICO - MODULO DE AUDITORIAS" -ForegroundColor Cyan;
Write-Host "========================================================" -ForegroundColor Cyan;
Write-Host "";
Write-Host "Testeando modulos relacionados:" -ForegroundColor Yellow;
Write-Host "  - Auditorias (Dashboard)" -ForegroundColor White;
Write-Host "  - Hallazgos" -ForegroundColor White;
Write-Host "  - Acciones Correctivas" -ForegroundColor White;
Write-Host "  - Acciones Auditor" -ForegroundColor White;
Write-Host "";
Write-Host "========================================================" -ForegroundColor Cyan;
Write-Host "";

Set-Location -Path "frontend";
node test-auditorias-monitor.js;

Write-Host "";
Write-Host "========================================================" -ForegroundColor Green;
Write-Host "  TESTING COMPLETADO" -ForegroundColor Green;
Write-Host "========================================================" -ForegroundColor Green;
Write-Host "";
Write-Host "Abre el reporte HTML para ver resultados detallados:" -ForegroundColor Yellow;
Write-Host "frontend\test-results\auditorias\audit-test-report.html" -ForegroundColor White;
Write-Host "";

Set-Location -Path "..";
Read-Host "Presiona Enter para continuar...";


