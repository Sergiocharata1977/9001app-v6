import { Kanban } from 'lucide-react';
import { Kanban } from 'lucide-react';
import { z } from 'zod';

// Esquema para validar ObjectId de MongoDB
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

// Esquema para fechas ISO
const dateSchema = z.string().datetime().optional();

// Esquema para prioridades
const prioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

// Esquema para valores de estados de proceso
const processStateEnum = z.enum(['iniciado', 'en_progreso', 'revision', 'aprobado', 'completado', 'cancelado']);

// Esquema para archivos adjuntos
export const processFileSchema = z.object({
  filename: z.string().min(1, 'El nombre del archivo es obligatorio'),
  original_name: z.string().min(1, 'El nombre original es obligatorio'),
  mime_type: z.string().min(1, 'El tipo MIME es obligatorio'),
  size: z.number().min(0, 'El tamaño debe ser positivo'),
  uploaded_at: z.string().datetime(),
  uploaded_by: objectIdSchema
});

// Esquema para items de checklist
export const checklistItemSchema = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  description: z.string()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  completed: z.boolean().default(false),
  completed_at: dateSchema,
  completed_by: objectIdSchema.optional()
});

// Esquema para comentarios
export const processCommentSchema = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  content: z.string()
    .min(1, 'El contenido es obligatorio')
    .max(1000, 'El comentario no puede exceder 1000 caracteres'),
  created_at: z.string().datetime(),
  created_by: objectIdSchema,
  mentions: z.array(objectIdSchema).default([])
});

// Esquema para historial de estados
export const stateHistorySchema = z.object({
  state: z.string().min(1, 'El estado es obligatorio'),
  changed_at: z.string().datetime(),
  changed_by: objectIdSchema,
  comment: z.string().max(500, 'El comentario no puede exceder 500 caracteres').optional()
});

// Esquema para proceso (tablero tipo Trello)
export const processSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .trim(),
  
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .trim()
    .optional(),
  
  iso_code: z.string()
    .max(20, 'El código ISO no puede exceder 20 caracteres')
    .optional(),
  
  category: z.string()
    .min(1, 'La categoría es obligatoria')
    .max(100, 'La categoría no puede exceder 100 caracteres'),
  
  template_id: objectIdSchema.optional(),
  organization_id: objectIdSchema
});

// Esquema principal para registro de proceso (según diseño de migración)
export const processRecordSchema = z.object({
  organization_id: objectIdSchema,
  template_id: objectIdSchema,
  unique_code: z.string()
    .min(1, 'El código único es obligatorio')
    .max(50, 'El código único no puede exceder 50 caracteres'),
  base_code: z.string()
    .min(1, 'El código base es obligatorio')
    .max(20, 'El código base no puede exceder 20 caracteres'),
  level: z.number().min(0).default(0),
  parent_record_id: objectIdSchema.optional(),
  title: z.string()
    .min(1, 'El título es obligatorio')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .trim()
    .optional(),
  current_state_id: objectIdSchema,
  state_history: z.array(z.object({
    state_id: objectIdSchema,
    changed_by: objectIdSchema,
    changed_at: z.date(),
    comment: z.string().max(500, 'El comentario no puede exceder 500 caracteres').optional()
  })).default([]),
  responsible_user_id: objectIdSchema,
  assigned_users: z.array(objectIdSchema).default([]),
  start_date: z.date().optional(),
  due_date: z.date().optional(),
  priority: prioritySchema.default('medium'),
  custom_data: z.record(z.any()).default({}),
  files: z.array(processFileSchema).default([]),
  progress_percentage: z.number().min(0).max(100).default(0),
  tags: z.array(z.string().trim().min(1)).default([]),
  is_active: z.boolean().default(true),
  is_archived: z.boolean().default(false)
});

// Esquema para crear proceso (tablero)
export const createProcessSchema = processSchema.pick({
  name: true,
  description: true,
  iso_code: true,
  category: true,
  template_id: true,
  organization_id: true
});

// Esquema para crear registro de proceso (tarjeta)
export const createProcessRecordSchema = processRecordSchema.pick({
  organization_id: true,
  template_id: true,
  title: true,
  description: true,
  responsible_user_id: true,
  assigned_users: true,
  start_date: true,
  due_date: true,
  priority: true,
  custom_data: true,
  tags: true,
  parent_record_id: true
});

// Esquemas para actualización
export const updateProcessSchema = processSchema.partial().extend({
  updated_by: objectIdSchema
});

export const updateProcessRecordSchema = processRecordSchema.partial().extend({
  updated_by: objectIdSchema
});

// Esquema para cambio de estado
export const changeStateSchema = z.object({
  new_state: processStateEnum,
  changed_by: objectIdSchema,
  comment: z.string()
    .max(500, 'El comentario no puede exceder 500 caracteres')
    .trim()
    .optional()
});

// Esquema para filtros de búsqueda
export const processFiltersSchema = z.object({
  search: z.string().trim().optional(),
  current_state_id: objectIdSchema.optional(),
  priority: prioritySchema.optional(),
  responsible_user_id: objectIdSchema.optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  due_date_from: z.date().optional(),
  due_date_to: z.date().optional()
}).partial();

// Esquema para paginación
export const paginationSchema = z.object({
  page: z.number().min(1, 'La página debe ser mayor a 0').default(1),
  limit: z.number().min(1, 'El límite debe ser mayor a 0').max(100, 'El límite no puede exceder 100').default(20)
});

// Esquema para ordenamiento
export const sortSchema = z.object({
  column: z.string().min(1, 'La columna es obligatoria'),
  direction: z.enum(['asc', 'desc']).default('asc')
});

// Esquemas para campos de plantilla
export const templateFieldSchema = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  type: z.enum(['text', 'number', 'date', 'select', 'file', 'checkbox', 'textarea']),
  required: z.boolean().default(false),
  options: z.array(z.string().trim().min(1)).optional(),
  validation_rules: z.object({
    min_length: z.number().optional(),
    max_length: z.number().optional(),
    min_date: z.string().optional(),
    max_date: z.string().optional(),
    pattern: z.string().optional()
  }).optional(),
  order: z.number().min(0).default(0)
});

// Esquema para plantillas de proceso
export const processTemplateSchema = z.object({
  organization_id: objectIdSchema,
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  iso_code: z.string()
    .max(20, 'El código ISO no puede exceder 20 caracteres')
    .optional(),
  category: z.string()
    .min(1, 'La categoría es obligatoria')
    .max(100, 'La categoría no puede exceder 100 caracteres'),
  fields: z.array(templateFieldSchema).default([]),
  default_states: z.array(objectIdSchema).default([]),
  is_active: z.boolean().default(true),
  version: z.number().min(1).default(1)
});

// Esquema para estados de proceso
export const processStateSchema = z.object({
  organization_id: objectIdSchema,
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color debe ser un hex válido'),
  order: z.number().min(0, 'El orden debe ser positivo'),
  is_initial: z.boolean().default(false),
  is_final: z.boolean().default(false),
  allowed_transitions: z.array(objectIdSchema).default([]),
  required_fields: z.array(z.string()).default([])
});

// Esquema para usuarios (simplificado)
export const userSchema = z.object({
  _id: objectIdSchema,
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  avatar: z.string().url().optional()
});

// Esquema para departamentos
export const departmentSchema = z.object({
  _id: objectIdSchema,
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  code: z.string()
    .min(1, 'El código es obligatorio')
    .max(20, 'El código no puede exceder 20 caracteres')
    .transform(val => val.toUpperCase()),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
});

// Esquema para definiciones de proceso
export const processDefinitionSchema = z.object({
  _id: objectIdSchema,
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  codigo: z.string()
    .min(1, 'El código es obligatorio')
    .max(20, 'El código no puede exceder 20 caracteres')
    .transform(val => val.toUpperCase()),
  descripcion: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  tipo_proceso: z.enum(['estrategico', 'operativo', 'apoyo'])
});

// Esquemas para respuestas de API
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    count: z.number().optional()
  });

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.string().optional()
});

// Tipos inferidos de los esquemas
export type ProcessFormData = z.infer<typeof createProcessSchema>;
export type ProcessRecordFormData = z.infer<typeof createProcessRecordSchema>;
export type ProcessUpdateData = z.infer<typeof updateProcessSchema>;
export type ProcessRecordUpdateData = z.infer<typeof updateProcessRecordSchema>;
export type ProcessFilters = z.infer<typeof processFiltersSchema>;
export type ChangeStateData = z.infer<typeof changeStateSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type SortData = z.infer<typeof sortSchema>;
export type TemplateFieldData = z.infer<typeof templateFieldSchema>;
export type ProcessTemplateData = z.infer<typeof processTemplateSchema>;
export type ProcessStateData = z.infer<typeof processStateSchema>;
export type UserData = z.infer<typeof userSchema>;
export type DepartmentData = z.infer<typeof departmentSchema>;
export type ProcessDefinitionData = z.infer<typeof processDefinitionSchema>;

// Funciones de validación helper
export const validateProcessForm = (data: unknown) => {
  return createProcessSchema.safeParse(data);
};

export const validateProcessRecordForm = (data: unknown) => {
  return createProcessRecordSchema.safeParse(data);
};

export const validateProcessUpdate = (data: unknown) => {
  return updateProcessSchema.safeParse(data);
};

export const validateProcessRecordUpdate = (data: unknown) => {
  return updateProcessRecordSchema.safeParse(data);
};

export const validateFilters = (data: unknown) => {
  return processFiltersSchema.safeParse(data);
};

export const validateStateChange = (data: unknown) => {
  return changeStateSchema.safeParse(data);
};

export const validateProcessTemplate = (data: unknown) => {
  return processTemplateSchema.safeParse(data);
};

export const validateProcessState = (data: unknown) => {
  return processStateSchema.safeParse(data);
};

export const validateTemplateField = (data: unknown) => {
  return templateFieldSchema.safeParse(data);
};

// Validaciones personalizadas
export const isValidObjectId = (id: string): boolean => {
  return objectIdSchema.safeParse(id).success;
};

export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const isValidDate = (date: string): boolean => {
  return z.string().datetime().safeParse(date).success;
};

// Constantes para validación
export const VALIDATION_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMMENT_LENGTH: 500,
  MAX_TAG_LENGTH: 50,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
} as const;
