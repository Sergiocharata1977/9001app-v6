# Script para renombrar archivos UI de PascalCase a kebab-case
Write-Host "Renombrando archivos UI a kebab-case..." -ForegroundColor Green

Set-Location "c:\Users\Usuario\Documents\Proyectos\ISO -conjunto\9001app-v6\frontend\src\components\ui"

# Mapa de renombramientos necesarios
$renameMap = @{
    "DataTable.tsx" = "data-table.tsx"
    "DonCandidoAnimation.tsx" = "don-candido-animation.tsx"
    "DonCandidoButton.tsx" = "don-candido-button.tsx"
    "Dropdown.tsx" = "dropdown.tsx"
    "ErrorMessage.tsx" = "error-message.tsx"
    "KanbanCard.tsx" = "kanban-card.tsx"
    "KanbanColumn.tsx" = "kanban-column.tsx"
    "LoadingSpinner.tsx" = "loading-spinner.tsx"
    "Logo.tsx" = "logo.tsx"
    "LogoutButton.tsx" = "logout-button.tsx"
    "Modal.tsx" = "modal.tsx"
    "NotFoundMessage.tsx" = "not-found-message.tsx"
    "ProcessBoardCard.tsx" = "process-board-card.tsx"
    "TrelloCard.tsx" = "trello-card.tsx"
    "UnifiedKanban.tsx" = "unified-kanban.tsx"
    "UnifiedKanbanBoard.tsx" = "unified-kanban-board.tsx"
    "ViewToggle.tsx" = "view-toggle.tsx"
}

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    
    if (Test-Path $oldName) {
        Write-Host "Renombrando: $oldName -> $newName" -ForegroundColor Yellow
        Rename-Item -Path $oldName -NewName $newName -Force
        Write-Host "✓ Completado: $newName" -ForegroundColor Green
    } else {
        Write-Host "⚠ No encontrado: $oldName" -ForegroundColor Red
    }
}

Write-Host "Renombramiento completado!" -ForegroundColor Green