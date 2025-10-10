Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SISTEMA COMPLETO - 9001app v6" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando test unificado del sistema..." -ForegroundColor Green
Write-Host ""

Set-Location frontend

Write-Host "Creando directorio de resultados..." -ForegroundColor Yellow
if (!(Test-Path "test-results\sistema-completo")) {
    New-Item -ItemType Directory -Path "test-results\sistema-completo" -Force
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EJECUTANDO TEST SISTEMA COMPLETO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
node test-sistema-completo.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "TEST COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Resultados guardados en: test-results\sistema-completo\" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para continuar"







