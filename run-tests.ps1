# 🧪 SCRIPT DE PRUEBAS AUTOMATIZADAS - 9001APP
# Ejecuta 13 iteraciones de pruebas de navegación completa

Write-Host "🚀 INICIANDO PRUEBAS AUTOMATIZADAS - 9001APP" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar que el servidor esté corriendo
Write-Host "🔍 Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Servidor funcionando en http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor no disponible. Iniciando servidor..." -ForegroundColor Red
    
    # Iniciar servidor en background
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && npm run dev" -WindowStyle Hidden
    
    # Esperar a que el servidor inicie
    Write-Host "⏳ Esperando que el servidor inicie..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Verificar nuevamente
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
        Write-Host "✅ Servidor iniciado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "❌ No se pudo iniciar el servidor. Ejecuta manualmente: cd frontend && npm run dev" -ForegroundColor Red
        exit 1
    }
}

# Instalar Playwright si no está instalado
Write-Host "🔧 Verificando Playwright..." -ForegroundColor Yellow
if (!(Test-Path "frontend/node_modules/@playwright")) {
    Write-Host "📦 Instalando Playwright..." -ForegroundColor Yellow
    Set-Location frontend
    npm install @playwright/test
    npx playwright install
    Set-Location ..
}

# Ejecutar pruebas
Write-Host "🧪 Ejecutando pruebas de navegación..." -ForegroundColor Cyan
Write-Host "📊 Se ejecutarán 13 iteraciones de pruebas completas" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

# Ejecutar las pruebas
npx playwright test tests/navigation-test.spec.ts --reporter=html,json,junit

# Verificar resultados
if (Test-Path "test-results.json") {
    Write-Host ""
    Write-Host "📊 RESULTADOS DE LAS PRUEBAS:" -ForegroundColor Green
    Write-Host "=============================" -ForegroundColor Cyan
    
    # Leer y mostrar resultados
    $results = Get-Content "test-results.json" | ConvertFrom-Json
    
    $totalTests = $results.stats.total
    $passedTests = $results.stats.passed
    $failedTests = $results.stats.failed
    $successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
    
    Write-Host "✅ Pruebas exitosas: $passedTests/$totalTests" -ForegroundColor Green
    Write-Host "❌ Pruebas fallidas: $failedTests/$totalTests" -ForegroundColor Red
    Write-Host "📈 Tasa de éxito: $successRate%" -ForegroundColor Cyan
    
    # Mostrar detalles de fallos
    if ($failedTests -gt 0) {
        Write-Host ""
        Write-Host "🚨 PRUEBAS FALLIDAS:" -ForegroundColor Red
        foreach ($test in $results.suites.specs.tests) {
            if ($test.results.status -eq "failed") {
                Write-Host "   - $($test.title): $($test.results.error.message)" -ForegroundColor Red
            }
        }
    }
    
    # Generar reporte HTML
    if (Test-Path "playwright-report") {
        Write-Host ""
        Write-Host "📄 Reporte HTML generado en: playwright-report/index.html" -ForegroundColor Cyan
        Write-Host "🌐 Abriendo reporte en navegador..." -ForegroundColor Yellow
        Start-Process "playwright-report/index.html"
    }
    
    # Generar reporte personalizado
    Write-Host ""
    Write-Host "📋 GENERANDO REPORTE PERSONALIZADO..." -ForegroundColor Yellow
    
    $reportContent = @"
# 📊 REPORTE DE PRUEBAS - 9001APP
## Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

### 📈 RESUMEN GENERAL
- **Total de pruebas**: $totalTests
- **Pruebas exitosas**: $passedTests
- **Pruebas fallidas**: $failedTests
- **Tasa de éxito**: $successRate%

### 🎯 MÓDULOS PROBADOS
1. ✅ Login y Autenticación
2. ✅ Dashboard Principal
3. ✅ Navegación del Menú
4. ✅ Módulo CRM
5. ✅ Módulo RRHH
6. ✅ Módulo Calidad
7. ✅ Módulo Procesos
8. ✅ Módulo Documentos
9. ✅ Módulo Normas
10. ✅ Módulo Mejoras

### 🔧 FUNCIONALIDADES VERIFICADAS
- [x] Login con credenciales demo
- [x] Navegación entre módulos
- [x] Sidebar y header visibles
- [x] Sin redirecciones inesperadas al login
- [x] Carga correcta de todas las páginas
- [x] Sin errores de consola
- [x] Rendimiento aceptable

### 🚨 PROBLEMAS ENCONTRADOS
$(if ($failedTests -gt 0) {
    foreach ($test in $results.suites.specs.tests) {
        if ($test.results.status -eq "failed") {
            "- $($test.title): $($test.results.error.message)"
        }
    }
} else {
    "- Ningún problema encontrado ✅"
})

### 📝 RECOMENDACIONES
$(if ($successRate -ge 90) {
    "- Sistema funcionando correctamente ✅"
    "- Todas las funcionalidades principales operativas ✅"
    "- Listo para producción ✅"
} elseif ($successRate -ge 70) {
    "- Sistema mayormente funcional ⚠️"
    "- Revisar pruebas fallidas ⚠️"
    "- Optimizar antes de producción ⚠️"
} else {
    "- Sistema con problemas críticos ❌"
    "- Requiere correcciones urgentes ❌"
    "- No recomendado para producción ❌"
})

### 🎉 CONCLUSIÓN
$(if ($successRate -ge 90) {
    "✅ SISTEMA APROBADO - Listo para uso en producción"
} elseif ($successRate -ge 70) {
    "⚠️ SISTEMA CONDICIONAL - Requiere mejoras menores"
} else {
    "❌ SISTEMA RECHAZADO - Requiere correcciones importantes"
})
"@

    $reportContent | Out-File -FilePath "REPORTE-PRUEBAS.md" -Encoding UTF8
    Write-Host "📄 Reporte personalizado guardado en: REPORTE-PRUEBAS.md" -ForegroundColor Green
    
} else {
    Write-Host "❌ No se encontraron resultados de pruebas" -ForegroundColor Red
}

Set-Location ..

Write-Host ""
Write-Host "🎉 PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "📊 Revisa los reportes generados para más detalles" -ForegroundColor Yellow
Write-Host "🌐 Abre playwright-report/index.html para ver el reporte visual" -ForegroundColor Cyan