# Script para renombrar componentes UI con case-sensitivity
# Convierte nombres en PascalCase a kebab-case

$uiPath = "src/components/ui"
cd $uiPath

# Archivos a renombrar (PascalCase -> kebab-case)
$renameMap = @{
    "Logo.tsx" = "logo.tsx"
    "LogoutButton.tsx" = "logout-button.tsx"
    "LoadingSpinner.tsx" = "loading-spinner.tsx"
    "ErrorMessage.tsx" = "error-message.tsx"
    "NotFoundMessage.tsx" = "not-found-message.tsx"
    "DonCandidoAnimation.tsx" = "don-candido-animation.tsx"
    "DonCandidoButton.tsx" = "don-candido-button.tsx"
    "UnifiedKanban.tsx" = "unified-kanban.tsx"
    "UnifiedKanbanBoard.tsx" = "unified-kanban-board.tsx"
    "KanbanCard.tsx" = "kanban-card.tsx"
    "KanbanColumn.tsx" = "kanban-column.tsx"
    "DataTable.tsx" = "data-table.tsx"
    "Dropdown.tsx" = "dropdown.tsx"
    "Modal.tsx" = "modal.tsx"
    "ProcessBoardCard.tsx" = "process-board-card.tsx"
    "TrelloCard.tsx" = "trello-card.tsx"
    "ViewToggle.tsx" = "view-toggle.tsx"
}

Write-Host "🔄 Renombrando archivos UI a kebab-case..." -ForegroundColor Yellow

foreach ($old in $renameMap.Keys) {
    $new = $renameMap[$old]
    if (Test-Path $old) {
        Write-Host "  ✓ $old -> $new" -ForegroundColor Green
        Rename-Item $old $new -Force
    }
}

Write-Host "✅ Renombrado completado!" -ForegroundColor Green

