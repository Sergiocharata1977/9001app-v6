# Script mejorado para corregir TODOS los imports UI

Write-Host "🔧 Buscando y corrigiendo TODOS los imports UI..." -ForegroundColor Cyan

$cambios = @{
    "'@/components/ui/Badge'" = "'@/components/ui/badge'"
    "'@/components/ui/Button'" = "'@/components/ui/button'"
    "'@/components/ui/Card'" = "'@/components/ui/card'"
    "'@/components/ui/Input'" = "'@/components/ui/input'"
    "'@/components/ui/Select'" = "'@/components/ui/select'"
    "'@/components/ui/Textarea'" = "'@/components/ui/textarea'"
    '"@/components/ui/Badge"' = '"@/components/ui/badge"'
    '"@/components/ui/Button"' = '"@/components/ui/button"'
    '"@/components/ui/Card"' = '"@/components/ui/card"'
    '"@/components/ui/Input"' = '"@/components/ui/input"'
    '"@/components/ui/Select"' = '"@/components/ui/select"'
    '"@/components/ui/Textarea"' = '"@/components/ui/textarea"'
}

# Buscar todos los archivos .tsx en frontend
$archivos = Get-ChildItem -Path "frontend/src" -Recurse -Filter "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

$corregidos = 0

foreach ($archivo in $archivos) {
    $contenido = Get-Content $archivo.FullName -Raw -ErrorAction SilentlyContinue
    if ($contenido) {
        $modificado = $false
        
        foreach ($viejo in $cambios.Keys) {
            $nuevo = $cambios[$viejo]
            if ($contenido -match [regex]::Escape($viejo)) {
                $contenido = $contenido -replace [regex]::Escape($viejo), $nuevo
                $modificado = $true
            }
        }
        
        if ($modificado) {
            Set-Content $archivo.FullName -Value $contenido -NoNewline
            Write-Host "✅ $($archivo.FullName)" -ForegroundColor Green
            $corregidos++
        }
    }
}

Write-Host "`n✅ Correccion completada! $corregidos archivos modificados" -ForegroundColor Green
