Write-Host "===================================" -ForegroundColor Cyan
Write-Host "9001app MVP - Ejecutando tests..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Cambiar al directorio frontend
Set-Location -Path .\frontend

Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "`nEjecutando tests MVP..." -ForegroundColor Green
npx playwright test tests/e2e/mvp/ --config=tests/playwright.config.js

Write-Host "`nTests completados!" -ForegroundColor Cyan

# Mantener la ventana abierta
Write-Host "`nPresiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")