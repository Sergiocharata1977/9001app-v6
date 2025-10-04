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
export { default as Modal } from './Modal';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorMessage } from './ErrorMessage';
export { default as EmptyState } from './empty-state';
export { default as NotFoundMessage } from './NotFoundMessage';
export { default as DataTable } from './DataTable';
export { default as Dropdown } from './Dropdown';
export { default as ViewToggle } from './ViewToggle';
export { default as Logo } from './Logo';

// Componentes Kanban
export { default as KanbanCard } from './KanbanCard';
export { default as KanbanColumn } from './KanbanColumn';
export { default as ProcessBoardCard } from './ProcessBoardCard';
export { default as TrelloCard } from './TrelloCard';
export { default as UnifiedKanbanBoard } from './UnifiedKanbanBoard';
export { default as UnifiedKanban } from './UnifiedKanban';

// Componentes Don Candido
export { DonCandidoAnimation, useDonCandido } from './DonCandidoAnimation';
export { DonCandidoButton, DonCandidoFloatingButton } from './DonCandidoButton';