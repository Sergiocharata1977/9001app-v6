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
export { Modal } from './Modal';
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorMessage } from './ErrorMessage';
export { EmptyState, EmptyProcesses, EmptyRecords } from './empty-state';
export { NotFoundMessage } from './NotFoundMessage';
export { DataTable } from './DataTable';
export { Dropdown } from './Dropdown';
export { ViewToggle } from './ViewToggle';
export { Logo } from './Logo';
export { LogoutButton } from './LogoutButton';

// Componentes Kanban
export { KanbanCard } from './KanbanCard';
export { KanbanColumn } from './KanbanColumn';
export { ProcessBoardCard } from './ProcessBoardCard';
export { TrelloCard } from './TrelloCard';
export { UnifiedKanbanBoard } from './UnifiedKanbanBoard';
export { default as UnifiedKanban } from './UnifiedKanban';

// Componentes Don Candido
export { DonCandidoAnimation, useDonCandido } from './DonCandidoAnimation';
export { DonCandidoButton, DonCandidoFloatingButton } from './DonCandidoButton';
