// Tipos unificados para el sistema Kanban con Pragmatic Drag & Drop

export interface UnifiedKanbanProps {
  columns: KanbanColumn[];
  items: KanbanItem[];
  onItemMove: (itemId: string, sourceColumn: string, targetColumn: string, newIndex: number) => void;
  onItemClick?: (item: KanbanItem) => void;
  onItemEdit?: (item: KanbanItem) => void;
  onItemDelete?: (item: KanbanItem) => void;
  loading?: boolean;
  error?: string;
  readOnly?: boolean;
  showActions?: boolean;
  customCardRenderer?: (item: KanbanItem) => React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  maxItems?: number;
  allowDrop?: boolean;
  count?: number;
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  customData?: Record<string, any>;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para drag and drop
export interface DragData {
  itemId: string;
  columnId: string;
  item: KanbanItem;
}

export interface DropData {
  columnId: string;
  column: KanbanColumn;
}

// Estados del Kanban
export interface KanbanState {
  columns: KanbanColumn[];
  items: KanbanItem[];
  loading: boolean;
  error: string | null;
}

// Props para componentes individuales
export interface KanbanColumnProps {
  column: KanbanColumn;
  items: KanbanItem[];
  onItemClick?: (item: KanbanItem) => void;
  onItemEdit?: (item: KanbanItem) => void;
  onItemDelete?: (item: KanbanItem) => void;
  onDropItem?: (itemId: string, columnId: string) => void;
  readOnly?: boolean;
  showActions?: boolean;
}

export interface KanbanCardProps {
  item: KanbanItem;
  onClick?: (item: KanbanItem) => void;
  onEdit?: (item: KanbanItem) => void;
  onDelete?: (item: KanbanItem) => void;
  readOnly?: boolean;
  showActions?: boolean;
  customRenderer?: (item: KanbanItem) => React.ReactNode;
}

// Configuraciones de prioridad
export const priorityConfig = {
  low: { label: 'Baja', color: 'bg-green-100 text-green-800', value: 'low' },
  medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-800', value: 'medium' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800', value: 'high' },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-800', value: 'critical' }
} as const;

// Estados por defecto del proceso
export const defaultProcessStates = [
  { id: 'iniciado', title: 'Iniciado', color: '#3B82F6' },
  { id: 'en-progreso', title: 'En Progreso', color: '#F59E0B' },
  { id: 'en-revision', title: 'En Revisión', color: '#8B5CF6' },
  { id: 'aprobado', title: 'Aprobado', color: '#10B981' },
  { id: 'completado', title: 'Completado', color: '#6B7280' }
] as const;