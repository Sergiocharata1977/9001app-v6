# Script PowerShell para ejecutar migracion completa
Write-Host "Iniciando migracion completa de colecciones faltantes..." -ForegroundColor Green

# Navegar al directorio backend
Set-Location "backend"

# Compilar TypeScript
Write-Host "Compilando TypeScript..." -ForegroundColor Yellow
npx tsc src/scripts/completeMigration.ts --outDir dist --target es2020 --module commonjs --esModuleInterop --skipLibCheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilacion exitosa" -ForegroundColor Green
    
    # Ejecutar migracion
    Write-Host "Ejecutando migracion completa..." -ForegroundColor Yellow
    node dist/scripts/completeMigration.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migracion completa exitosa!" -ForegroundColor Green
    } else {
        Write-Host "Error durante la migracion" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error de compilacion" -ForegroundColor Red
    exit 1
}

# Volver al directorio raiz
Set-Location ".."
Write-Host "Script completado" -ForegroundColor Green
