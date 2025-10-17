// Exportaciones centralizadas de componentes UI base
export { Button } from './button'
export { Input } from './input'
export { Label } from './label'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
export { Textarea } from './textarea'
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'

// Componentes adicionales ahora disponibles
export { Badge } from './badge'
export { Progress } from './progress'
export { Checkbox } from './checkbox'
export { Alert, AlertTitle, AlertDescription } from './alert'
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

// Componentes personalizados existentes
export { Modal } from './modal';
export { LoadingSpinner } from './loading-spinner';
export { ErrorMessage } from './error-message';
export { EmptyState, EmptyProcesses, EmptyRecords } from './empty-state';
export { NotFoundMessage } from './not-found-message';
export { DataTable } from './data-table';
export { Dropdown } from './dropdown';
export { ViewToggle } from './view-toggle';
export { Logo } from './logo';
export { LogoutButton } from './logout-button';

// Componentes Kanban
export { KanbanCard } from './kanban-card';
export { KanbanColumn } from './kanban-column';
export { ProcessBoardCard } from './process-board-card';
export { TrelloCard } from './trello-card';
export { UnifiedKanbanBoard } from './unified-kanban-board';
export { default as UnifiedKanban } from './unified-kanban';

// Componentes Don Candido
export { DonCandidoAnimation, useDonCandido } from './don-candido-animation';
export { DonCandidoButton, DonCandidoFloatingButton } from './don-candido-button';
