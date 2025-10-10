Write-Host "========================================" -ForegroundColor Green
Write-Host "   EJECUTANDO TESTS OPTIMIZADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "[1/2] Ejecutando test de Documentos..." -ForegroundColor Yellow
Set-Location frontend
node test-documentos-optimizado.js

Write-Host ""
Write-Host "[2/2] Ejecutando test de Procesos..." -ForegroundColor Yellow
node test-procesos-optimizado.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   TESTS COMPLETADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green







