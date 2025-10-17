# Script para corregir imports UI con mayúsculas → minúsculas

$archivos = @(
    "frontend/src/app/mejoras/page.tsx",
    "frontend/src/components/common/UnifiedHeader.tsx",
    "frontend/src/components/process/EditorCamposEtapa.tsx",
    "frontend/src/components/process/ConfiguracionEtapas.tsx",
    "frontend/src/app/procesos/nuevo/page.tsx",
    "frontend/src/app/auditorias/[id]/kanban/page.tsx",
    "frontend/src/app/diseno-producto/page.tsx",
    "frontend/src/app/puestos/page.tsx",
    "frontend/src/app/productos/[id]/kanban/page.tsx",
    "frontend/src/app/productos/page.tsx",
    "frontend/src/app/hallazgos/[id]/kanban/page.tsx",
    "frontend/src/app/indicadores/page.tsx",
    "frontend/src/app/objetivos/page.tsx",
    "frontend/src/app/procesos/[id]/kanban/page.tsx",
    "frontend/src/app/procesos-documentos/page.tsx",
    "frontend/src/components/common/UnifiedCard.tsx",
    "frontend/src/app/procesos/[id]/registros/[recordId]/page.tsx",
    "frontend/src/components/normas/NormaSingle.tsx",
    "frontend/src/app/normas/[id]/page.tsx",
    "frontend/src/components/process/ProcesoRegistroKanbanTab.tsx",
    "frontend/src/components/process/ProcesoDocumentoTab.tsx"
)

$cambios = @{
    "@/components/ui/Badge" = "@/components/ui/badge"
    "@/components/ui/Button" = "@/components/ui/button"
    "@/components/ui/Card" = "@/components/ui/card"
    "@/components/ui/Input" = "@/components/ui/input"
    "@/components/ui/Select" = "@/components/ui/select"
    "@/components/ui/Textarea" = "@/components/ui/textarea"
}

Write-Host "🔧 Corrigiendo imports UI..." -ForegroundColor Cyan

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        $contenido = Get-Content $archivo -Raw
        $modificado = $false
        
        foreach ($viejo in $cambios.Keys) {
            $nuevo = $cambios[$viejo]
            if ($contenido -match [regex]::Escape($viejo)) {
                $contenido = $contenido -replace [regex]::Escape($viejo), $nuevo
                $modificado = $true
            }
        }
        
        if ($modificado) {
            Set-Content $archivo -Value $contenido -NoNewline
            Write-Host "✅ $archivo" -ForegroundColor Green
        }
    }
}

Write-Host "✅ Corrección completada!" -ForegroundColor Green
