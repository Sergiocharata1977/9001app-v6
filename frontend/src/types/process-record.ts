// Tipos TypeScript para registros de procesos (frontend)
// Basados en el modelo ProcessRecord del backend

export interface ProcessRecord {
  _id: string;
  
  // Identificación del registro
  unique_code: string;
  title: string;
  description?: string;
  
  // Relación con proceso base
  process_definition_id: string;
  template_id?: string;
  
  // Estado del registro
  current_state: ProcessState;
  state_history: StateHistoryItem[];
  
  // Jerarquía de registros
  parent_record_id?: string;
  level: number;
  
  // Responsabilidades
  responsible_user_id: string;
  assigned_users: string[];
  
  // Fechas y plazos
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  
  // Prioridad y progreso
  priority: ProcessPriority;
  progress_percentage: number;
  
  // Datos dinámicos
  custom_data: Record<string, any>;
  
  // Archivos adjuntos
  files: ProcessFile[];
  
  // Checklist
  checklist_items: ChecklistItem[];
  
  // Comentarios
  comments: ProcessComment[];
  
  // Metadatos organizacionales
  organization_id: string;
  department_id?: string;
  
  // Tags
  tags: string[];
  
  // Control de versiones
  version: number;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export type ProcessState = 
  | 'iniciado' 
  | 'en_progreso' 
  | 'revision' 
  | 'aprobado' 
  | 'completado' 
  | 'cancelado';

export type ProcessPriority = 'low' | 'medium' | 'high' | 'critical';

export interface StateHistoryItem {
  state: ProcessState;
  changed_at: string;
  changed_by: string;
  comment?: string;
}

export interface ProcessFile {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
}

export interface ProcessComment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  mentions: string[];
}

// Tipos para formularios
export interface ProcessRecordFormData {
  title: string;
  description?: string;
  process_definition_id: string;
  template_id?: string;
  responsible_user_id: string;
  assigned_users?: string[];
  start_date?: string;
  due_date?: string;
  priority: ProcessPriority;
  custom_data?: Record<string, any>;
  tags?: string[];
}

export interface ProcessRecordUpdateData {
  title?: string;
  description?: string;
  responsible_user_id?: string;
  assigned_users?: string[];
  start_date?: string;
  due_date?: string;
  priority?: ProcessPriority;
  progress_percentage?: number;
  custom_data?: Record<string, any>;
  tags?: string[];
}

// Tipos para filtros
export interface ProcessRecordFilters {
  search?: string;
  current_state?: ProcessState;
  priority?: ProcessPriority;
  responsible_user_id?: string;
  start_date_from?: string;
  start_date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  tags?: string[];
  is_archived?: boolean;
}

// Tipos para vistas
export interface ProcessRecordStats {
  total: number;
  by_state: Record<ProcessState, number>;
  by_priority: Record<ProcessPriority, number>;
  overdue: number;
  completed_this_month: number;
  avg_completion_time: number;
}

export interface ProcessRecordListResponse {
  success: boolean;
  data: ProcessRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProcessRecordResponse {
  success: boolean;
  data: ProcessRecord;
  message?: string;
}

// Tipos para Kanban
export interface KanbanColumn {
  id: ProcessState;
  title: string;
  color: string;
  records: ProcessRecord[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  total_records: number;
}

// Tipos para drag & drop
export interface DragDropResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

// Constantes para estados
export const PROCESS_STATES: Record<ProcessState, { label: string; color: string }> = {
  iniciado: { label: 'Iniciado', color: 'bg-gray-100 text-gray-800' },
  en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  revision: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' },
  aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
};

// Constantes para prioridades
export const PROCESS_PRIORITIES: Record<ProcessPriority, { label: string; color: string }> = {
  low: { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Media', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-800' }
};

// Utilidades de tipo
export type ProcessRecordKeys = keyof ProcessRecord;
export type ProcessRecordFormKeys = keyof ProcessRecordFormData;