# Script completo para corregir problemas de case-sensitivity
Write-Host "Iniciando corrección completa de case-sensitivity..." -ForegroundColor Green

# Cambiar al directorio del proyecto
Set-Location "c:\Users\Usuario\Documents\Proyectos\ISO -conjunto\9001app-v6"

# 1. Renombrar archivos UI de PascalCase a kebab-case
Write-Host "Renombrando archivos UI..." -ForegroundColor Yellow

$uiPath = "frontend\src\components\ui"
$renameMap = @{
    "DataTable.tsx" = "data-table.tsx"
    "DonCandidoAnimation.tsx" = "don-candido-animation.tsx"
    "DonCandidoButton.tsx" = "don-candido-button.tsx"
    "DonCandidoFloatingButton.tsx" = "don-candido-floating-button.tsx"
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
    $oldPath = Join-Path $uiPath $oldName
    $newPath = Join-Path $uiPath $renameMap[$oldName]
    
    if (Test-Path $oldPath) {
        Rename-Item -Path $oldPath -NewName $renameMap[$oldName]
        Write-Host "Renombrado: $oldName -> $($renameMap[$oldName])" -ForegroundColor Cyan
    }
}

# 2. Corregir imports absolutos (@/components/ui/...)
Write-Host "Corrigiendo imports absolutos..." -ForegroundColor Yellow

$importReplacements = @{
    '@/components/ui/Modal' = '@/components/ui/modal'
    '@/components/ui/LoadingSpinner' = '@/components/ui/loading-spinner'
    '@/components/ui/ErrorMessage' = '@/components/ui/error-message'
    '@/components/ui/NotFoundMessage' = '@/components/ui/not-found-message'
    '@/components/ui/DataTable' = '@/components/ui/data-table'
    '@/components/ui/Dropdown' = '@/components/ui/dropdown'
    '@/components/ui/ViewToggle' = '@/components/ui/view-toggle'
    '@/components/ui/Logo' = '@/components/ui/logo'
    '@/components/ui/KanbanCard' = '@/components/ui/kanban-card'
    '@/components/ui/KanbanColumn' = '@/components/ui/kanban-column'
    '@/components/ui/ProcessBoardCard' = '@/components/ui/process-board-card'
    '@/components/ui/TrelloCard' = '@/components/ui/trello-card'
    '@/components/ui/UnifiedKanban' = '@/components/ui/unified-kanban'
    '@/components/ui/UnifiedKanbanBoard' = '@/components/ui/unified-kanban-board'
    '@/components/ui/DonCandidoAnimation' = '@/components/ui/don-candido-animation'
    '@/components/ui/DonCandidoButton' = '@/components/ui/don-candido-button'
    '@/components/ui/DonCandidoFloatingButton' = '@/components/ui/don-candido-floating-button'
    '@/components/CRM/EmpresasForm' = '@/components/crm/EmpresasForm'
}

Get-ChildItem -Path "frontend\src" -Recurse -Include "*.tsx", "*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    foreach ($oldImport in $importReplacements.Keys) {
        $newImport = $importReplacements[$oldImport]
        if ($content -match [regex]::Escape($oldImport)) {
            $content = $content -replace [regex]::Escape($oldImport), $newImport
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content
        Write-Host "Corregido: $($_.Name)" -ForegroundColor Cyan
    }
}

# 3. Corregir imports relativos
Write-Host "Corrigiendo imports relativos..." -ForegroundColor Yellow

$relativeReplacements = @{
    './Modal' = './modal'
    './LoadingSpinner' = './loading-spinner'
    './ErrorMessage' = './error-message'
    './NotFoundMessage' = './not-found-message'
    './DataTable' = './data-table'
    './Dropdown' = './dropdown'
    './ViewToggle' = './view-toggle'
    './Logo' = './logo'
    './KanbanCard' = './kanban-card'
    './KanbanColumn' = './kanban-column'
    './ProcessBoardCard' = './process-board-card'
    './TrelloCard' = './trello-card'
    './UnifiedKanban' = './unified-kanban'
    './UnifiedKanbanBoard' = './unified-kanban-board'
    './DonCandidoAnimation' = './don-candido-animation'
    './DonCandidoButton' = './don-candido-button'
    './DonCandidoFloatingButton' = './don-candido-floating-button'
    '../ui/Modal' = '../ui/modal'
    '../ui/LoadingSpinner' = '../ui/loading-spinner'
    '../ui/ErrorMessage' = '../ui/error-message'
    '../ui/NotFoundMessage' = '../ui/not-found-message'
    '../ui/DataTable' = '../ui/data-table'
    '../ui/Dropdown' = '../ui/dropdown'
    '../ui/ViewToggle' = '../ui/view-toggle'
    '../ui/Logo' = '../ui/logo'
    '../ui/KanbanCard' = '../ui/kanban-card'
    '../ui/KanbanColumn' = '../ui/kanban-column'
    '../ui/ProcessBoardCard' = '../ui/process-board-card'
    '../ui/TrelloCard' = '../ui/trello-card'
    '../ui/UnifiedKanban' = '../ui/unified-kanban'
    '../ui/UnifiedKanbanBoard' = '../ui/unified-kanban-board'
    '../ui/DonCandidoAnimation' = '../ui/don-candido-animation'
    '../ui/DonCandidoButton' = '../ui/don-candido-button'
    '../ui/DonCandidoFloatingButton' = '../ui/don-candido-floating-button'
    '../../ui/Modal' = '../../ui/modal'
    '../../ui/LoadingSpinner' = '../../ui/loading-spinner'
    '../../ui/ErrorMessage' = '../../ui/error-message'
    '../../ui/NotFoundMessage' = '../../ui/not-found-message'
    '../../ui/DataTable' = '../../ui/data-table'
    '../../ui/Dropdown' = '../../ui/dropdown'
    '../../ui/ViewToggle' = '../../ui/view-toggle'
    '../../ui/Logo' = '../../ui/logo'
    '../../ui/KanbanCard' = '../../ui/kanban-card'
    '../../ui/KanbanColumn' = '../../ui/kanban-column'
    '../../ui/ProcessBoardCard' = '../../ui/process-board-card'
    '../../ui/TrelloCard' = '../../ui/trello-card'
    '../../ui/UnifiedKanban' = '../../ui/unified-kanban'
    '../../ui/UnifiedKanbanBoard' = '../../ui/unified-kanban-board'
    '../../ui/DonCandidoAnimation' = '../../ui/don-candido-animation'
    '../../ui/DonCandidoButton' = '../../ui/don-candido-button'
    '../../ui/DonCandidoFloatingButton' = '../../ui/don-candido-floating-button'
    '../../../ui/Modal' = '../../../ui/modal'
    '../../../ui/LoadingSpinner' = '../../../ui/loading-spinner'
    '../../../ui/ErrorMessage' = '../../../ui/error-message'
    '../../../ui/NotFoundMessage' = '../../../ui/not-found-message'
    '../../../ui/DataTable' = '../../../ui/data-table'
    '../../../ui/Dropdown' = '../../../ui/dropdown'
    '../../../ui/ViewToggle' = '../../../ui/view-toggle'
    '../../../ui/Logo' = '../../../ui/logo'
    '../../../ui/KanbanCard' = '../../../ui/kanban-card'
    '../../../ui/KanbanColumn' = '../../../ui/kanban-column'
    '../../../ui/ProcessBoardCard' = '../../../ui/process-board-card'
    '../../../ui/TrelloCard' = '../../../ui/trello-card'
    '../../../ui/UnifiedKanban' = '../../../ui/unified-kanban'
    '../../../ui/UnifiedKanbanBoard' = '../../../ui/unified-kanban-board'
    '../../../ui/DonCandidoAnimation' = '../../../ui/don-candido-animation'
    '../../../ui/DonCandidoButton' = '../../../ui/don-candido-button'
    '../../../ui/DonCandidoFloatingButton' = '../../../ui/don-candido-floating-button'
    '../../../../ui/Modal' = '../../../../ui/modal'
    '../../../../ui/LoadingSpinner' = '../../../../ui/loading-spinner'
    '../../../../ui/ErrorMessage' = '../../../../ui/error-message'
    '../../../../ui/NotFoundMessage' = '../../../../ui/not-found-message'
    '../../../../ui/DataTable' = '../../../../ui/data-table'
    '../../../../ui/Dropdown' = '../../../../ui/dropdown'
    '../../../../ui/ViewToggle' = '../../../../ui/view-toggle'
    '../../../../ui/Logo' = '../../../../ui/logo'
    '../../../../ui/KanbanCard' = '../../../../ui/kanban-card'
    '../../../../ui/KanbanColumn' = '../../../../ui/kanban-column'
    '../../../../ui/ProcessBoardCard' = '../../../../ui/process-board-card'
    '../../../../ui/TrelloCard' = '../../../../ui/trello-card'
    '../../../../ui/UnifiedKanban' = '../../../../ui/unified-kanban'
    '../../../../ui/UnifiedKanbanBoard' = '../../../../ui/unified-kanban-board'
    '../../../../ui/DonCandidoAnimation' = '../../../../ui/don-candido-animation'
    '../../../../ui/DonCandidoButton' = '../../../../ui/don-candido-button'
    '../../../../ui/DonCandidoFloatingButton' = '../../../../ui/don-candido-floating-button'
}

Get-ChildItem -Path "frontend\src" -Recurse -Include "*.tsx", "*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    foreach ($oldImport in $relativeReplacements.Keys) {
        $newImport = $relativeReplacements[$oldImport]
        if ($content -match [regex]::Escape($oldImport)) {
            $content = $content -replace [regex]::Escape($oldImport), $newImport
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content
        Write-Host "Corregido imports relativos: $($_.Name)" -ForegroundColor Cyan
    }
}

# 4. Verificar y crear useABM hook si no existe
Write-Host "Verificando hook useABM..." -ForegroundColor Yellow

$useABMPath = "frontend\src\hooks\useABM.ts"
if (-not (Test-Path $useABMPath)) {
    Write-Host "Creando hook useABM..." -ForegroundColor Yellow
    
    $useABMContent = @"
import { useState, useCallback } from 'react';

export interface ABMState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  selectedItem: T | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'delete' | null;
}

export interface ABMActions<T> {
  setItems: (items: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openCreateModal: () => void;
  openEditModal: (item: T) => void;
  openDeleteModal: (item: T) => void;
  closeModal: () => void;
  handleCreate: (item: Omit<T, 'id'>) => Promise<void>;
  handleUpdate: (id: string | number, item: Partial<T>) => Promise<void>;
  handleDelete: (id: string | number) => Promise<void>;
}

export interface UseABMOptions<T> {
  initialItems?: T[];
  onCreate?: (item: Omit<T, 'id'>) => Promise<T>;
  onUpdate?: (id: string | number, item: Partial<T>) => Promise<T>;
  onDelete?: (id: string | number) => Promise<void>;
  onError?: (error: string) => void;
}

export function useABM<T extends { id: string | number }>(
  options: UseABMOptions<T> = {}
): [ABMState<T>, ABMActions<T>] {
  const {
    initialItems = [],
    onCreate,
    onUpdate,
    onDelete,
    onError
  } = options;

  const [state, setState] = useState<ABMState<T>>({
    items: initialItems,
    loading: false,
    error: null,
    selectedItem: null,
    isModalOpen: false,
    modalMode: null,
  });

  const setItems = useCallback((items: T[]) => {
    setState(prev => ({ ...prev, items }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
    if (error && onError) {
      onError(error);
    }
  }, [onError]);

  const openCreateModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      modalMode: 'create',
      selectedItem: null,
    }));
  }, []);

  const openEditModal = useCallback((item: T) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      modalMode: 'edit',
      selectedItem: item,
    }));
  }, []);

  const openDeleteModal = useCallback((item: T) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      modalMode: 'delete',
      selectedItem: item,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      modalMode: null,
      selectedItem: null,
    }));
  }, []);

  const handleCreate = useCallback(async (item: Omit<T, 'id'>) => {
    if (!onCreate) return;

    try {
      setLoading(true);
      setError(null);
      const newItem = await onCreate(item);
      setState(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        isModalOpen: false,
        modalMode: null,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear el elemento');
    } finally {
      setLoading(false);
    }
  }, [onCreate, setLoading, setError]);

  const handleUpdate = useCallback(async (id: string | number, item: Partial<T>) => {
    if (!onUpdate) return;

    try {
      setLoading(true);
      setError(null);
      const updatedItem = await onUpdate(id, item);
      setState(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === id ? updatedItem : i),
        isModalOpen: false,
        modalMode: null,
        selectedItem: null,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el elemento');
    } finally {
      setLoading(false);
    }
  }, [onUpdate, setLoading, setError]);

  const handleDelete = useCallback(async (id: string | number) => {
    if (!onDelete) return;

    try {
      setLoading(true);
      setError(null);
      await onDelete(id);
      setState(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== id),
        isModalOpen: false,
        modalMode: null,
        selectedItem: null,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar el elemento');
    } finally {
      setLoading(false);
    }
  }, [onDelete, setLoading, setError]);

  const actions: ABMActions<T> = {
    setItems,
    setLoading,
    setError,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleCreate,
    handleUpdate,
    handleDelete,
  };

  return [state, actions];
}

export default useABM;
"@

    Set-Content -Path $useABMPath -Value $useABMContent
    Write-Host "Hook useABM creado exitosamente" -ForegroundColor Green
} else {
    Write-Host "Hook useABM ya existe" -ForegroundColor Green
}

Write-Host "Corrección completa de case-sensitivity finalizada!" -ForegroundColor Green
Write-Host "Archivos procesados:" -ForegroundColor Cyan
Write-Host "- Archivos UI renombrados a kebab-case" -ForegroundColor White
Write-Host "- Imports absolutos corregidos" -ForegroundColor White
Write-Host "- Imports relativos corregidos" -ForegroundColor White
Write-Host "- Hook useABM verificado/creado" -ForegroundColor White
Write-Host ""
Write-Host "El proyecto ahora debería ser compatible con sistemas Linux/Unix" -ForegroundColor Green