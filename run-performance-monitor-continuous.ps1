# Configuración
$intervalMinutes = 15  # Ejecutar cada 15 minutos
$maxIterations = 96    # 96 * 15 min = 24 horas

Write-Host "================================================" -ForegroundColor Cyan;
Write-Host "  MONITOREO CONTINUO DE RENDIMIENTO" -ForegroundColor Cyan;
Write-Host "================================================" -ForegroundColor Cyan;
Write-Host "";
Write-Host "Configuracion:" -ForegroundColor Yellow;
Write-Host "  - Intervalo: cada $intervalMinutes minutos" -ForegroundColor White;
Write-Host "  - Duracion maxima: 24 horas (96 iteraciones)" -ForegroundColor White;
Write-Host "  - Presiona Ctrl+C para detener en cualquier momento" -ForegroundColor White;
Write-Host "";
Write-Host "================================================" -ForegroundColor Cyan;
Write-Host "";

$iteration = 0;

while ($iteration -lt $maxIterations) {
    $iteration++;
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss";
    
    Write-Host "";
    Write-Host "[$timestamp] Iteracion $iteration de $maxIterations" -ForegroundColor Green;
    Write-Host "================================================" -ForegroundColor Cyan;
    
    Set-Location -Path "frontend";
    node test-performance-monitor.js;
    Set-Location -Path "..";
    
    if ($iteration -lt $maxIterations) {
        $nextRun = (Get-Date).AddMinutes($intervalMinutes).ToString("HH:mm:ss");
        Write-Host "";
        Write-Host "Proximo analisis: $nextRun" -ForegroundColor Yellow;
        Write-Host "Esperando $intervalMinutes minutos..." -ForegroundColor Gray;
        Write-Host "";
        
        Start-Sleep -Seconds ($intervalMinutes * 60);
    }
}

Write-Host "";
Write-Host "================================================" -ForegroundColor Green;
Write-Host "  MONITOREO CONTINUO FINALIZADO" -ForegroundColor Green;
Write-Host "================================================" -ForegroundColor Green;
Write-Host "";
Write-Host "Total de iteraciones: $iteration" -ForegroundColor White;
Write-Host "Reportes guardados en: frontend\test-results\performance\" -ForegroundColor Yellow;
Write-Host "";
Read-Host "Presiona Enter para salir...";









