# Script SIMPLE - Corregir imports case-sensitivity
# Sin complejidades, solo lo esencial

Write-Host "Iniciando corrección de imports..." -ForegroundColor Green
Write-Host ""

# Mapeo de correcciones
$corrections = @(
    @{Old="@/components/ui/logout-button"; New="@/components/ui/LogoutButton"},
    @{Old="@/components/ui/loading-spinner"; New="@/components/ui/LoadingSpinner"},
    @{Old="@/components/ui/error-message"; New="@/components/ui/ErrorMessage"},
    @{Old="@/components/ui/not-found-message"; New="@/components/ui/NotFoundMessage"},
    @{Old="@/components/ui/data-table"; New="@/components/ui/DataTable"},
    @{Old="@/components/ui/dropdown"; New="@/components/ui/Dropdown"},
    @{Old="@/components/ui/view-toggle"; New="@/components/ui/ViewToggle"},
    @{Old="@/components/ui/logo"; New="@/components/ui/Logo"},
    @{Old="@/components/ui/modal"; New="@/components/ui/Modal"},
    @{Old="@/components/ui/kanban-card"; New="@/components/ui/KanbanCard"},
    @{Old="@/components/ui/kanban-column"; New="@/components/ui/KanbanColumn"},
    @{Old="@/components/ui/process-board-card"; New="@/components/ui/ProcessBoardCard"},
    @{Old="@/components/ui/trello-card"; New="@/components/ui/TrelloCard"},
    @{Old="@/components/ui/unified-kanban-board"; New="@/components/ui/UnifiedKanbanBoard"},
    @{Old="@/components/ui/unified-kanban"; New="@/components/ui/UnifiedKanban"},
    @{Old="@/components/ui/don-candido-animation"; New="@/components/ui/DonCandidoAnimation"},
    @{Old="@/components/ui/don-candido-button"; New="@/components/ui/DonCandidoButton"},
    @{Old="@/components/RRHH/"; New="@/components/rrhh/"},
    @{Old="@/components/CRM/"; New="@/components/crm/"}
)

$count = 0

# Procesar archivos
Get-ChildItem -Path "frontend\src" -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    $modified = $false
    
    foreach ($correction in $corrections) {
        if ($content -like "*$($correction.Old)*") {
            $content = $content -replace [regex]::Escape($correction.Old), $correction.New
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file -Value $content -NoNewline
        $count++
        Write-Host "Corregido: $($_.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Archivos modificados: $count" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm install react-is" -ForegroundColor White
Write-Host "  npm run build" -ForegroundColor White
Write-Host ""

