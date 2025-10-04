/**
 * Adaptadores de datos para normalizar entre frontend y backend
 * Garantiza compatibilidad y valores por defecto
 */

// ==================== DEPARTMENT ADAPTERS ====================

export interface DepartmentBackend {
  _id?: string;
  id?: string;
  name?: string;
  nombre?: string;
  description?: string;
  descripcion?: string;
  responsible_user_id?: string;
  responsable_id?: string;
  organization_id?: number | string;
  is_active?: boolean;
  estado?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentFrontend {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  responsable_id: string;
  ubicacion: string;
  presupuesto_anual: number;
  estado: 'activo' | 'inactivo' | 'en_reestructuracion';
  tipo_departamento: 'operativo' | 'administrativo' | 'estrategico' | 'apoyo';
}

export const adaptDepartmentFromBackend = (data: DepartmentBackend): Partial<DepartmentFrontend> => ({
  id: data._id || data.id || '',
  codigo: data.id || data._id || '',
  nombre: data.name || data.nombre || '',
  descripcion: data.description || data.descripcion || '',
  responsable_id: data.responsible_user_id || data.responsable_id || '',
  estado: (data.is_active || data.estado === 'activo') ? 'activo' : 'inactivo',
  ubicacion: '',
  presupuesto_anual: 0,
  tipo_departamento: 'operativo'
});

export const adaptDepartmentToBackend = (data: Partial<DepartmentFrontend>) => ({
  name: data.nombre || '',
  description: data.descripcion || '',
  responsible_user_id: data.responsable_id || '',
  is_active: data.estado === 'activo'
});

// ==================== PERSONNEL ADAPTERS ====================

export interface PersonnelBackend {
  _id?: string;
  id?: string;
  numero_empleado?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
  cargo?: string;
  departamento_id?: string;
  estado?: string;
  fecha_ingreso?: string;
  telefono?: string;
  [key: string]: any;
}

export interface PersonnelFrontend {
  id: string;
  numero_empleado: string;
  nombres: string;
  apellidos: string;
  email: string;
  cargo: string;
  departamento_id: string;
  estado: 'activo' | 'inactivo' | 'vacaciones' | 'licencia';
  fecha_ingreso: string;
  telefono: string;
}

export const adaptPersonnelFromBackend = (data: PersonnelBackend): PersonnelFrontend => ({
  id: data._id || data.id || '',
  numero_empleado: data.numero_empleado || '',
  nombres: data.nombres || '',
  apellidos: data.apellidos || '',
  email: data.email || '',
  cargo: data.cargo || '',
  departamento_id: data.departamento_id || '',
  estado: (data.estado as any) || 'activo',
  fecha_ingreso: data.fecha_ingreso || new Date().toISOString(),
  telefono: data.telefono || ''
});

export const adaptPersonnelArrayFromBackend = (dataArray: PersonnelBackend[]): PersonnelFrontend[] => {
  if (!Array.isArray(dataArray)) {
    console.warn('adaptPersonnelArrayFromBackend: data is not an array', dataArray);
    return [];
  }
  
  return dataArray.map(adaptPersonnelFromBackend);
};

// ==================== POSITION ADAPTERS ====================

export interface PositionBackend {
  _id?: string;
  id?: string;
  nombre?: string;
  descripcion_responsabilidades?: string;
  requisitos_experiencia?: string;
  requisitos_formacion?: string;
  departamento_id?: string;
  reporta_a_id?: string;
  [key: string]: any;
}

export interface PositionFrontend {
  id: string;
  nombre: string;
  descripcion_responsabilidades: string;
  requisitos_experiencia: string;
  requisitos_formacion: string;
  departamento_id: string;
  departamento_nombre?: string;
  reporta_a_id?: string;
  reporta_a_nombre?: string;
  cantidad_empleados?: number;
  nivel_jerarquico?: string;
  salario_rango?: string;
}

export const adaptPositionFromBackend = (data: PositionBackend): PositionFrontend => ({
  id: data._id || data.id || '',
  nombre: data.nombre || '',
  descripcion_responsabilidades: data.descripcion_responsabilidades || '',
  requisitos_experiencia: data.requisitos_experiencia || '',
  requisitos_formacion: data.requisitos_formacion || '',
  departamento_id: data.departamento_id || '',
  reporta_a_id: data.reporta_a_id,
  cantidad_empleados: 0,
  nivel_jerarquico: 'Operativo',
  salario_rango: ''
});

// ==================== GENERIC ARRAY ADAPTER ====================

export const adaptArrayFromBackend = <T, R>(
  dataArray: T[] | undefined | null,
  adapter: (item: T) => R
): R[] => {
  if (!dataArray) {
    return [];
  }
  
  if (!Array.isArray(dataArray)) {
    console.warn('adaptArrayFromBackend: data is not an array', dataArray);
    return [];
  }
  
  return dataArray.map(adapter);
};

// ==================== SAFE DATA HANDLER ====================

/**
 * Maneja datos de API de forma segura
 * @param data Datos del backend
 * @param defaultValue Valor por defecto si data es inválido
 * @returns Datos normalizados o valor por defecto
 */
export const safeDataHandler = <T>(data: any, defaultValue: T): T => {
  if (data === null || data === undefined) {
    return defaultValue;
  }
  
  if (Array.isArray(defaultValue) && !Array.isArray(data)) {
    console.warn('Expected array but got:', typeof data);
    return defaultValue;
  }
  
  return data;
};

/**
 * Normaliza campo de texto con valor por defecto
 */
export const safeString = (value: any, defaultValue: string = ''): string => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
};

/**
 * Normaliza campo numérico con valor por defecto
 */
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Normaliza campo booleano con valor por defecto
 */
export const safeBoolean = (value: any, defaultValue: boolean = false): boolean => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
};



