# ============================================================================
# SCRIPT DEFINITIVO: Corrección Case Sensitivity 9001app-v6
# Autor: Equipo 9001app-v6
# Fecha: 17 de Octubre 2025
# Versión: 1.0 FINAL
# ============================================================================

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  CORRECCIÓN DEFINITIVA CASE-SENSITIVITY - 9001APP V6" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar directorio
if (-not (Test-Path "frontend\src")) {
    Write-Host "❌ ERROR: Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    Write-Host "   Ruta esperada: C:\Users\Usuario\Documents\Proyectos\ISO -conjunto\9001app-v6" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Directorio verificado correctamente" -ForegroundColor Green
Write-Host ""

# ============================================================================
# FASE 1: CORRECCIÓN DE IMPORTS
# ============================================================================

Write-Host "📝 FASE 1: Corrigiendo imports..." -ForegroundColor Yellow
Write-Host ""

$importCorrections = @{
    "@/components/ui/logout-button" = "@/components/ui/LogoutButton"
    "@/components/ui/loading-spinner" = "@/components/ui/LoadingSpinner"
    "@/components/ui/error-message" = "@/components/ui/ErrorMessage"
    "@/components/ui/not-found-message" = "@/components/ui/NotFoundMessage"
    "@/components/ui/data-table" = "@/components/ui/DataTable"
    "@/components/ui/dropdown" = "@/components/ui/Dropdown"
    "@/components/ui/view-toggle" = "@/components/ui/ViewToggle"
    "@/components/ui/logo" = "@/components/ui/Logo"
    "@/components/ui/modal" = "@/components/ui/Modal"
    "@/components/ui/kanban-card" = "@/components/ui/KanbanCard"
    "@/components/ui/kanban-column" = "@/components/ui/KanbanColumn"
    "@/components/ui/process-board-card" = "@/components/ui/ProcessBoardCard"
    "@/components/ui/trello-card" = "@/components/ui/TrelloCard"
    "@/components/ui/unified-kanban-board" = "@/components/ui/UnifiedKanbanBoard"
    "@/components/ui/unified-kanban" = "@/components/ui/UnifiedKanban"
    "@/components/ui/don-candido-animation" = "@/components/ui/DonCandidoAnimation"
    "@/components/ui/don-candido-button" = "@/components/ui/DonCandidoButton"
    "./KanbanCard" = "./KanbanCard"
    "./KanbanColumn" = "./KanbanColumn"
    "./LoadingSpinner" = "./LoadingSpinner"
    "./ErrorMessage" = "./ErrorMessage"
    "./Modal" = "./Modal"
    "./UnifiedKanban" = "./UnifiedKanban"
    "../../../ui/UnifiedKanban" = "@/components/ui/UnifiedKanban"
    "@/components/RRHH/" = "@/components/rrhh/"
    "@/components/CRM/" = "@/components/crm/"
}

$filesModified = 0

Get-ChildItem -Path "frontend\src" -Recurse -Include "*.ts", "*.tsx" | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileChanged = $false
    
    foreach ($oldImport in $importCorrections.Keys) {
        $newImport = $importCorrections[$oldImport]
        
        # Escapar caracteres especiales para regex
        $oldEscaped = [regex]::Escape($oldImport)
        
        if ($content -match $oldEscaped) {
            $content = $content -replace $oldEscaped, $newImport
            $fileChanged = $true
        }
    }
    
    if ($fileChanged) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesModified++
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "  📊 Archivos modificados: $filesModified" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# FASE 2: ACTUALIZAR INDEX.TS
# ============================================================================

Write-Host "📝 FASE 2: Actualizando index.ts..." -ForegroundColor Yellow
Write-Host ""

$indexPath = "frontend\src\components\ui\index.ts"

if (Test-Path $indexPath) {
    # Crear backup
    Copy-Item $indexPath "$indexPath.backup"
    Write-Host "  💾 Backup creado: index.ts.backup" -ForegroundColor Cyan
    
    $newIndexContent = @"
// ============================================================================
// EXPORTS COMPONENTES UI - 9001APP V6
// ============================================================================

// Componentes Base shadcn/ui (kebab-case)
export { Button } from './button'
export { Input } from './input'
export { Label } from './label'
export { Badge } from './badge'
export { Textarea } from './textarea'
export { Checkbox } from './checkbox'
export { Separator } from './separator'
export { Progress } from './progress'
export { Skeleton } from './skeleton'

// Componentes compuestos shadcn/ui
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'
export { Alert, AlertTitle, AlertDescription } from './alert'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog'
export { ScrollArea } from './scroll-area'
export { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from './dropdown-menu'

// Componentes Custom (PascalCase) - CORREGIDOS PARA LINUX
export { Modal } from './Modal'
export { LoadingSpinner } from './LoadingSpinner'
export { ErrorMessage } from './ErrorMessage'
export { NotFoundMessage } from './NotFoundMessage'
export { DataTable } from './DataTable'
export { Dropdown } from './Dropdown'
export { ViewToggle } from './ViewToggle'
export { default as Logo } from './Logo'
export { LogoutButton } from './LogoutButton'

// Componentes Kanban (PascalCase)
export { KanbanCard } from './KanbanCard'
export { KanbanColumn } from './KanbanColumn'
export { ProcessBoardCard } from './ProcessBoardCard'
export { TrelloCard } from './TrelloCard'
export { UnifiedKanbanBoard } from './UnifiedKanbanBoard'
export { default as UnifiedKanban } from './UnifiedKanban'

// Componentes Don Candido
export { DonCandidoAnimation, useDonCandido } from './DonCandidoAnimation'
export { DonCandidoButton, DonCandidoFloatingButton } from './DonCandidoButton'

// Empty States
export { EmptyState, EmptyProcesses, EmptyRecords } from './empty-state'

// Hooks y utilidades
export { toast, useToast } from './use-toast'
"@

    Set-Content -Path $indexPath -Value $newIndexContent
    Write-Host "  ✅ index.ts actualizado correctamente" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  index.ts no encontrado" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# FASE 3: VERIFICAR/CREAR HOOK useABM
# ============================================================================

Write-Host "📝 FASE 3: Verificando hook useABM..." -ForegroundColor Yellow
Write-Host ""

$hooksDir = "frontend\src\hooks"
$hookPath = "$hooksDir\useABM.ts"

if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
    Write-Host "  📁 Directorio hooks creado" -ForegroundColor Cyan
}

if (-not (Test-Path $hookPath)) {
    $useABMContent = @"
import { useState, useCallback } from 'react';

export interface UseABMOptions<T> {
  onAdd?: (item: T) => Promise<void> | void;
  onEdit?: (item: T) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onView?: (item: T) => Promise<void> | void;
}

export interface UseABMReturn<T> {
  isLoading: boolean;
  error: string | null;
  handleAdd: (item: T) => Promise<void>;
  handleEdit: (item: T) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleView: (item: T) => Promise<void>;
  clearError: () => void;
}

export function useABM<T = any>(options: UseABMOptions<T> = {}): UseABMReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOperation = useCallback(async (
    operation: () => Promise<void> | void,
    operationName: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      await operation();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Error en \${operationName}`;
      setError(errorMessage);
      console.error(`Error en \${operationName}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAdd = useCallback(async (item: T) => {
    await handleOperation(() => options.onAdd?.(item), 'agregar');
  }, [options.onAdd, handleOperation]);

  const handleEdit = useCallback(async (item: T) => {
    await handleOperation(() => options.onEdit?.(item), 'editar');
  }, [options.onEdit, handleOperation]);

  const handleDelete = useCallback(async (id: string) => {
    await handleOperation(() => options.onDelete?.(id), 'eliminar');
  }, [options.onDelete, handleOperation]);

  const handleView = useCallback(async (item: T) => {
    await handleOperation(() => options.onView?.(item), 'ver');
  }, [options.onView, handleOperation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    clearError
  };
}

export default useABM;
"@

    Set-Content -Path $hookPath -Value $useABMContent
    Write-Host "  ✅ Hook useABM creado" -ForegroundColor Green
} else {
    Write-Host "  ✅ Hook useABM ya existe" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# FASE 4: INSTALAR DEPENDENCIA react-is
# ============================================================================

Write-Host "📝 FASE 4: Verificando dependencias..." -ForegroundColor Yellow
Write-Host ""

$packageJsonPath = "frontend\package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

if (-not $packageJson.dependencies.'react-is') {
    Write-Host "  📦 Instalando react-is..." -ForegroundColor Cyan
    Set-Location frontend
    npm install react-is --legacy-peer-deps
    Set-Location ..
    Write-Host "  ✅ react-is instalado" -ForegroundColor Green
} else {
    Write-Host "  ✅ react-is ya está instalado" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# FASE 5: VERIFICACIÓN FINAL
# ============================================================================

Write-Host "🔍 FASE 5: Verificación final..." -ForegroundColor Yellow
Write-Host ""

# Buscar imports problemáticos restantes
$problematicPatterns = @(
    '@/components/ui/[a-z]+-[a-z]+'  # kebab-case
    '@/components/RRHH/'
    '@/components/CRM/'
)

$issuesFound = 0

foreach ($pattern in $problematicPatterns) {
    $results = Get-ChildItem -Path "frontend\src" -Recurse -Include "*.ts", "*.tsx" | 
        Select-String -Pattern $pattern |
        Where-Object { $_.Line -notmatch "(button|input|label|card|dialog|table|select|textarea|form|badge|progress|checkbox|alert|dropdown-menu|empty-state|skeleton|tabs|accordion|alert-dialog|separator|scroll-area|use-toast)" }
    
    if ($results) {
        $issuesFound++
        Write-Host "  ⚠️  Patrón encontrado: $pattern" -ForegroundColor Yellow
        $results | ForEach-Object {
            Write-Host "     $($_.Filename):$($_.LineNumber)" -ForegroundColor Gray
        }
    }
}

if ($issuesFound -eq 0) {
    Write-Host "  ✅ No se encontraron imports problemáticos" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Se encontraron $issuesFound patrones problemáticos" -ForegroundColor Yellow
    Write-Host "     Revisa los archivos listados arriba" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# RESUMEN FINAL
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Green
Write-Host "  ✅ CORRECCIÓN COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "  ✅ Archivos corregidos: $filesModified" -ForegroundColor White
Write-Host "  ✅ index.ts actualizado" -ForegroundColor White
Write-Host "  ✅ Hook useABM verificado/creado" -ForegroundColor White
Write-Host "  ✅ Dependencias verificadas" -ForegroundColor White
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "  1. Ejecutar build local: cd frontend && npm run build" -ForegroundColor White
Write-Host "  2. Si el build es exitoso:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m ""fix: corregir case sensitivity definitivo""" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host "  3. Deploy en VPS: ./deploy-fix-case-sensitivity.sh" -ForegroundColor White
Write-Host ""
Write-Host "📚 DOCUMENTACIÓN:" -ForegroundColor Cyan
Write-Host "  Consulta ESTANDARES-PROYECTO-9001APP.md para futuras referencias" -ForegroundColor White
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""
