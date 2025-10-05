// Tipos principales para el sistema de gestión de procesos ISO tipo Trello

import { BreadcrumbItem } from "./ui";

import { Trello } from "lucide-react";

// Tipo base para entidades con ID de MongoDB
export interface BaseEntity {
  _id: string;
  created_at: string;
  updated_at: string;
}

// Interface para PROCESO (equivalente a Tablero de Trello)
export interface IProcess extends BaseEntity {
  organization_id: string;
  name: string;
  description?: string;
  iso_code?: string;
  category: string;
  template_id?: string;
  states: IProcessState[]; // Estados configurables para este proceso
  is_active: boolean;
  created_by: string;
  updated_by?: string;
}

// Interface para REGISTRO DE PROCESO (equivalente a Tarjeta de Trello)
export interface IProcessRecord extends BaseEntity {
  // Identificación del registro (tarjeta)
  unique_code: string;
  title: string;
  description?: string;
  
  // Relación con el proceso (tablero)
  process_id: string; // ID del proceso/tablero al que pertenece
  template_id?: string;
  
  // Estado del registro
  current_state: 'iniciado' | 'en_progreso' | 'revision' | 'aprobado' | 'completado' | 'cancelado';
  state_history: IStateHistory[];
  
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
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress_percentage: number;
  
  // Datos dinámicos según plantilla
  custom_data: Record<string, any>;
  
  // Archivos y documentos adjuntos
  files: IProcessFile[];
  
  // Checklist de tareas
  checklist_items: IChecklistItem[];
  
  // Comentarios y observaciones
  comments: IProcessComment[];
  
  // Metadatos organizacionales
  organization_id: string;
  department_id?: string;
  
  // Tags y categorización
  tags: string[];
  
  // Control de versiones y auditoría
  version: number;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by?: string;
}

// Historial de cambios de estado
export interface IStateHistory {
  state: string;
  changed_at: string;
  changed_by: string;
  comment?: string;
}

// Archivos adjuntos
export interface IProcessFile {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
}

// Items de checklist
export interface IChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
}

// Comentarios en procesos
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

// Tipos para filtros
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

// Estadísticas de procesos
export interface ProcessStats {
  total: number;
  by_state: Record<string, number>;
  by_priority: Record<string, number>;
  by_department: Record<string, number>;
}

// Tipos para vistas
export type ViewType = 'list' | 'cards' | 'kanban';

// Tipos para agrupación en vista de tarjetas
export type GroupByType = 'current_state' | 'priority' | 'responsible_user_id' | 'department_id';

// Respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: string;
}

// Tipos para usuarios (simplificado)
export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Tipos para departamentos (simplificado)
export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

// Tipos para organizaciones (simplificado)
export interface IOrganization {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

// Tipos para definiciones de procesos (completo)
export interface IProcessDefinition {
  _id: string;
  organization_id: string;
  nombre: string;
  codigo: string;
  version: string;
  descripcion?: string;
  objetivo?: string;
  alcance?: string;
  entradas?: string;
  salidas?: string;
  tipo: 'estrategico' | 'operativo' | 'apoyo';
  categoria?: string;
  nivel_critico: 'bajo' | 'medio' | 'alto';
  estado: 'activo' | 'inactivo' | 'revision' | 'obsoleto';
  owner?: string;
  
  // Configuración de registros opcionales
  hasExternalSystem?: boolean;
  hasSpecificRegistries?: boolean;
  enableRegistries?: boolean;
  
  // Campos alternativos (para compatibilidad)
  name?: string;
  code?: string;
  description?: string;
  objective?: string;
  scope?: string;
  inputs?: string[];
  outputs?: string[];
  related_documents?: string[];
  
  // Auditoría estándar
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
}

// Tipos para plantillas de procesos (simplificado)
export interface IProcessTemplate {
  _id: string;
  name: string;
  description?: string;
  fields: ITemplateField[];
}

// Campos de plantilla
export interface ITemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[]; // Para campos select
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Estados de carga para componentes
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Tipos para Pragmatic Drag and Drop
export interface DragItem {
  id: string;
  type: 'process-record';
  data: IProcessRecord;
}

export interface PragmaticDropResult {
  source: {
    element: HTMLElement;
    dropTargets: DropTarget[];
  };
  location: {
    current: {
      dropTargets: DropTarget[];
    };
    previous: {
      dropTargets: DropTarget[];
    };
  };
}

export interface DropTarget {
  element: HTMLElement;
  data: Record<string, unknown>;
}

// Tipos específicos para el sistema Kanban con Pragmatic
export interface KanbanDragData {
  recordId: string;
  sourceStateId: string;
  record: IProcessRecord;
}

export interface KanbanDropData {
  stateId: string;
  accepts: string[]; // tipos de elementos que acepta
}

// Tipos para notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Tipos para configuración de columnas en DataTable
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

// Tipos para paginación
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Tipos para ordenamiento
export interface SortInfo<T> {
  column: keyof T | null;
  direction: 'asc' | 'desc';
}

// Tipos específicos para la estructura tipo Trello

// Tipos para el ABM de Procesos (Lista de Tableros)
export interface ProcessBoardsView {
  processes: IProcess[];
  onProcessCreate: () => void;
  onProcessOpen: (process: IProcess) => void;
  onProcessEdit: (process: IProcess) => void;
  onProcessDelete: (process: IProcess) => void;
}

// Tipos para el Tablero Kanban (Interior del Proceso)
export interface ProcessKanbanView {
  process: IProcess;
  records: IProcessRecord[];
  states: IProcessState[];
  onRecordCreate: (stateId: string) => void;
  onRecordMove: (recordId: string, newStateId: string) => void;
  onRecordEdit: (record: IProcessRecord) => void;
  onRecordDelete: (record: IProcessRecord) => void;
}

// Tipos para Estados de Proceso (Columnas del Kanban)
export interface IProcessState extends BaseEntity {
  process_id: string; // Pertenece a un proceso específico
  organization_id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  is_initial: boolean;
  is_final: boolean;
  allowed_transitions: string[]; // IDs de estados permitidos
  required_fields: string[]; // Campos obligatorios para esta transición
}

// Tipos para navegación tipo Trello
export interface TrelloNavigation {
  currentView: 'boards' | 'kanban' | 'record-detail';
  currentProcess?: IProcess;
  currentRecord?: IProcessRecord;
  breadcrumbs: BreadcrumbItem[];
}

// Tipos para acciones tipo Trello
export interface TrelloActions {
  // Acciones de Proceso (Tablero)
  createProcess: (data: ProcessFormData) => Promise<IProcess>;
  updateProcess: (id: string, data: Partial<ProcessFormData>) => Promise<IProcess>;
  deleteProcess: (id: string) => Promise<void>;
  
  // Acciones de Registro (Tarjeta)
  createRecord: (processId: string, data: ProcessRecordFormData) => Promise<IProcessRecord>;
  updateRecord: (id: string, data: Partial<ProcessRecordFormData>) => Promise<IProcessRecord>;
  moveRecord: (recordId: string, newStateId: string, comment?: string) => Promise<IProcessRecord>;
  deleteRecord: (id: string) => Promise<void>;
  
  // Acciones de Estado (Columna)
  createState: (processId: string, data: ProcessStateFormData) => Promise<IProcessState>;
  updateState: (id: string, data: Partial<ProcessStateFormData>) => Promise<IProcessState>;
  deleteState: (id: string) => Promise<void>;
}

// Tipos para formularios específicos
export interface ProcessFormData {
  name: string;
  description?: string;
  iso_code?: string;
  category: string;
  template_id?: string;
  organization_id: string;
}

export interface ProcessRecordFormData {
  title: string;
  description?: string;
  process_id: string;
  responsible_user_id: string;
  assigned_users?: string[];
  start_date?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  custom_data?: Record<string, any>;
  tags?: string[];
  parent_record_id?: string;
}

export interface ProcessStateFormData {
  name: string;
  description?: string;
  color: string;
  order: number;
  is_initial?: boolean;
  is_final?: boolean;
  process_id: string;
}

// Tipos para vistas específicas del sistema Trello
export interface ProcessBoardCard {
  process: IProcess;
  recordCount: number;
  completedCount: number;
  overdueCount: number;
  lastActivity: string;
}

export interface KanbanColumn {
  state: IProcessState;
  records: IProcessRecord[];
  recordCount: number;
  canAddRecord: boolean;
}

export interface RecordCard {
  record: IProcessRecord;
  showDetails: boolean;
  isDragging: boolean;
  canEdit: boolean;
  canMove: boolean;
}