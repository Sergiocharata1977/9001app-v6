// Tipos para registros de procesos - Frontend (según diseño de migración)
export interface IProcessRecord {
  _id: string;

  // Identificación del registro
  organization_id: string;
  template_id: string;
  unique_code: string;
  base_code: string;
  level: number;
  parent_record_id?: string;
  title: string;
  description?: string;

  // Estado del registro
  current_state_id: string;
  state_history: IStateHistory[];

  // Responsabilidades
  responsible_user_id: string;
  assigned_users: string[];

  // Fechas y plazos
  start_date?: Date;
  due_date?: Date;

  // Prioridad y progreso
  priority: 'low' | 'medium' | 'high' | 'critical';
  custom_data: Record<string, any>;
  files: IProcessFile[];
  progress_percentage: number;
  tags: string[];

  // Control de estado
  is_active: boolean;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

// Interfaces auxiliares
export interface IStateHistory {
  state_id: string;
  changed_by: string;
  changed_at: Date;
  comment?: string;
}

export interface IProcessFile {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface IChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
}

export interface IProcessComment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  mentions: string[];
}

// Tipos para formularios
export interface ProcessFormData {
  title: string;
  description?: string;
  process_definition_id: string;
  template_id?: string;
  responsible_user_id: string;
  assigned_users?: string[];
  start_date?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  custom_data?: Record<string, any>;
  organization_id: string;
  department_id?: string;
  tags?: string[];
  parent_record_id?: string;
}

export interface ProcessUpdateData extends Partial<ProcessFormData> {
  updated_by: string;
}

export interface StateChangeData {
  new_state: 'iniciado' | 'en_progreso' | 'revision' | 'aprobado' | 'completado' | 'cancelado';
  changed_by: string;
  comment?: string;
}

// Tipos para filtros y búsqueda
export interface ProcessFilters {
  search?: string;
  current_state?: string;
  priority?: string;
  responsible_user_id?: string;
  department_id?: string;
  tags?: string[];
  start_date?: string;
  end_date?: string;
}

// Tipos para vistas
export interface ProcessStats {
  total: number;
  by_state: Record<string, number>;
  by_priority: Record<string, number>;
  by_department: Record<string, number>;
}

export interface ProcessListResponse {
  success: boolean;
  data: IProcessRecord[];
  count: number;
}

export interface ProcessResponse {
  success: boolean;
  data: IProcessRecord;
  message?: string;
}

export interface ProcessStatsResponse {
  success: boolean;
  data: Record<string, number>;
}

// Tipos para Kanban
export interface KanbanColumn {
  id: string;
  title: string;
  state: string;
  color: string;
  processes: IProcessRecord[];
}

export interface DragResult {
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

// Tipos para plantillas de procesos
export interface IProcessTemplate {
  _id: string;
  organization_id: string;
  name: string;
  description?: string;
  iso_code?: string;
  category: string;
  fields: ITemplateField[];
  default_states: string[];
  is_active: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface ITemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'file';
  required: boolean;
  options?: string[]; // Para campos select
  validation_rules?: {
    min_length?: number;
    max_length?: number;
    min_date?: string;
    max_date?: string;
    pattern?: string;
  };
  order: number;
}

// Tipos para estados de procesos
export interface IProcessState {
  _id: string;
  organization_id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  is_initial: boolean;
  is_final: boolean;
  allowed_transitions: string[]; // IDs de estados a los que puede transicionar
  required_fields: string[];
  created_at: Date;
  updated_at: Date;
}

// Tipos para usuarios (simplificado)
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  department_id?: string;
  is_active: boolean;
}

// Tipos para departamentos
export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  description?: string;
  organization_id: string;
  manager_id?: string;
  is_active: boolean;
}

// Tipos para organizaciones
export interface IOrganization {
  _id: string;
  name: string;
  code: string;
  description?: string;
  settings: {
    process_code_format: string;
    default_states: string[];
    allowed_file_types: string[];
    max_file_size: number;
  };
  is_active: boolean;
}

// Tipos para errores de API
export interface ApiError {
  error: string;
  message?: string;
  details?: string;
  code?: string;
}

// Tipos para respuestas de API genéricas
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para paginación
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Tipos para notificaciones
export interface INotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

// Tipos para configuración de vistas
export interface ViewConfig {
  type: 'list' | 'cards' | 'kanban';
  filters: ProcessFilters;
  sort: {
    field: keyof IProcessRecord;
    direction: 'asc' | 'desc';
  };
  columns?: string[]; // Para vista de lista
  group_by?: keyof IProcessRecord; // Para vista de tarjetas
}

// Tipos para exportación de datos
export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf';
  fields: string[];
  filters: ProcessFilters;
  include_attachments: boolean;
}

// Tipos para importación de datos
export interface ImportConfig {
  file: File;
  template_id: string;
  mapping: Record<string, string>; // Campo del archivo -> Campo del sistema
  options: {
    skip_duplicates: boolean;
    update_existing: boolean;
    validate_data: boolean;
  };
}