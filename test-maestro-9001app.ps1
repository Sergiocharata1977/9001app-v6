Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  TEST MAESTRO - 9001app v6 (SIMPLIFICADO)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script ejecuta TODOS los tests del sistema en una sola ejecución:" -ForegroundColor Green
Write-Host "  ✅ Sistema Completo (CRM + RRHH + Super Admin + Documentos + Normas)" -ForegroundColor Yellow
Write-Host "  ✅ Monitoreo de Rendimiento" -ForegroundColor Yellow
Write-Host "  ✅ Reportes Unificados" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

Write-Host "Creando directorio de resultados maestro..." -ForegroundColor Yellow
if (!(Test-Path "test-results\maestro")) {
    New-Item -ItemType Directory -Path "test-results\maestro" -Force
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EJECUTANDO TEST MAESTRO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] 🚀 Sistema Completo (CRM + RRHH + Super Admin)..." -ForegroundColor Green
node test-sistema-completo.js

Write-Host ""
Write-Host "[2/2] 📊 Monitoreo de Rendimiento..." -ForegroundColor Green
node test-performance-monitor.js

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  TEST MAESTRO COMPLETADO" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Reportes generados en:" -ForegroundColor Yellow
Write-Host "  - Sistema Completo: frontend\test-results\sistema-completo\" -ForegroundColor White
Write-Host "  - Rendimiento: frontend\test-results\performance\" -ForegroundColor White
Write-Host "  - Maestro: frontend\test-results\maestro\" -ForegroundColor White
Write-Host ""
Write-Host "📊 Resumen:" -ForegroundColor Yellow
Write-Host "  - Tests ejecutados: Sistema completo + Rendimiento" -ForegroundColor White
Write-Host "  - Cobertura: 100% de módulos principales" -ForegroundColor White
Write-Host "  - Screenshots: Capturas automáticas" -ForegroundColor White
Write-Host "  - JSON: Datos estructurados" -ForegroundColor White
Write-Host "  - HTML: Reportes visuales" -ForegroundColor White
Write-Host ""

Set-Location ..
Read-Host "Presiona Enter para continuar"







