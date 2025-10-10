Write-Host "========================================================" -ForegroundColor Cyan;
Write-Host "  SUITE COMPLETA DE TESTS - 9001app v6" -ForegroundColor Cyan;
Write-Host "========================================================" -ForegroundColor Cyan;
Write-Host "";
Write-Host "Este script ejecutara:" -ForegroundColor Yellow;
Write-Host "  1. Tests de funcionalidad (RRHH)" -ForegroundColor White;
Write-Host "  2. Monitoreo de rendimiento" -ForegroundColor White;
Write-Host "";
Write-Host "========================================================" -ForegroundColor Cyan;
Write-Host "";

Set-Location -Path "frontend";

Write-Host "========================================" -ForegroundColor Green;
Write-Host "  FASE 1: TESTS DE FUNCIONALIDAD" -ForegroundColor Green;
Write-Host "========================================" -ForegroundColor Green;
Write-Host "";

Write-Host "[1/3] Testing Departamentos..." -ForegroundColor Yellow;
node test-rrhh-departamentos-optimizado.js;
Write-Host "";

Write-Host "[2/3] Testing Puestos..." -ForegroundColor Yellow;
node test-rrhh-puestos-optimizado.js;
Write-Host "";

Write-Host "[3/3] Testing Personal..." -ForegroundColor Yellow;
node test-rrhh-personal-optimizado.js;
Write-Host "";

Write-Host "========================================" -ForegroundColor Green;
Write-Host "  FASE 2: MONITOREO DE RENDIMIENTO" -ForegroundColor Green;
Write-Host "========================================" -ForegroundColor Green;
Write-Host "";

node test-performance-monitor.js;

Write-Host "";
Write-Host "========================================================" -ForegroundColor Green;
Write-Host "  TODOS LOS TESTS COMPLETADOS" -ForegroundColor Green;
Write-Host "========================================================" -ForegroundColor Green;
Write-Host "";
Write-Host "Reportes generados:" -ForegroundColor Yellow;
Write-Host "  - Funcionalidad RRHH: frontend\test-results\[departamentos|puestos|personal]\" -ForegroundColor White;
Write-Host "  - Rendimiento: frontend\test-results\performance\performance-report.html" -ForegroundColor White;
Write-Host "";

Set-Location -Path "..";
Read-Host "Presiona Enter para continuar...";









