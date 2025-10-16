Write-Host "========================================" -ForegroundColor Green
Write-Host "   🧪 EJECUTANDO TODOS LOS TESTS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "[1/3] Tests de Velocidad..." -ForegroundColor Yellow
Set-Location ..\velocidad
node test-velocidad-completo.js

Write-Host ""
Write-Host "[2/3] Tests de Super Admin..." -ForegroundColor Yellow
Set-Location ..\super-admin
node test-super-admin-completo.js

Write-Host ""
Write-Host "[3/3] Tests de Usabilidad..." -ForegroundColor Yellow
Set-Location ..\usabilidad
node test-usabilidad-completo.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ TODOS LOS TESTS COMPLETADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "📊 Reportes generados en:" -ForegroundColor Cyan
Write-Host "   - frontend/tests/reportes/velocidad/" -ForegroundColor White
Write-Host "   - frontend/tests/reportes/super-admin/" -ForegroundColor White
Write-Host "   - frontend/tests/reportes/usabilidad/" -ForegroundColor White
Write-Host ""














