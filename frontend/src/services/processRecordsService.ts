'use client';

import { ProcessRecord } from '@/types/process-record';

// Mock data para desarrollo
const mockProcessRecords: ProcessRecord[] = [
  {
    _id: '1',
    title: 'Auditoría Interna Q1 2024',
    description: 'Auditoría interna del primer trimestre según ISO 9001',
    unique_code: 'REG-2024-001',
    process_definition_id: 'proc-audit-001',
    organization_id: 'org-001',
    responsible_user_id: 'user-001',
    assigned_users: ['user-001', 'user-002'],
    current_state: 'en_progreso',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2024-03-31T23:59:59.000Z',
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-02-20T14:30:00.000Z',
    created_by: 'user-001',
    updated_by: 'user-001',
    tags: ['auditoria', 'calidad', 'iso9001'],
    custom_data: {
      auditor_principal: 'Juan Pérez',
      areas_auditadas: ['Producción', 'Calidad', 'Ventas']
    },
    comments: [],
    attachments: [],
    task_checklist: [
      { id: '1', description: 'Planificar auditoría', completed: true },
      { id: '2', description: 'Ejecutar auditoría', completed: false },
      { id: '3', description: 'Generar informe', completed: false }
    ],
    state_history: [
      {
        state: 'iniciado',
        changed_at: '2024-01-15T10:00:00.000Z',
        changed_by: 'user-001',
        comment: 'Proceso iniciado'
      },
      {
        state: 'en_progreso',
        changed_at: '2024-02-01T09:00:00.000Z',
        changed_by: 'user-001',
        comment: 'Iniciando ejecución'
      }
    ],
    parent_record_id: null,
    child_records: []
  },
  {
    _id: '2',
    title: 'Revisión de Documentos ISO',
    description: 'Revisión anual de documentos del sistema de gestión de calidad',
    unique_code: 'REG-2024-002',
    process_definition_id: 'proc-doc-review-001',
    organization_id: 'org-001',
    responsible_user_id: 'user-002',
    assigned_users: ['user-002', 'user-003'],
    current_state: 'revision',
    priority: 'medium',
    progress_percentage: 80,
    due_date: '2024-04-15T23:59:59.000Z',
    created_at: '2024-01-20T11:00:00.000Z',
    updated_at: '2024-02-25T16:45:00.000Z',
    created_by: 'user-002',
    updated_by: 'user-002',
    tags: ['documentos', 'revision', 'iso9001'],
    custom_data: {
      documentos_revisados: 15,
      documentos_pendientes: 3
    },
    comments: [],
    attachments: [],
    task_checklist: [
      { id: '1', description: 'Identificar documentos', completed: true },
      { id: '2', description: 'Revisar contenido', completed: true },
      { id: '3', description: 'Aprobar cambios', completed: false }
    ],
    state_history: [
      {
        state: 'iniciado',
        changed_at: '2024-01-20T11:00:00.000Z',
        changed_by: 'user-002',
        comment: 'Proceso iniciado'
      },
      {
        state: 'en_progreso',
        changed_at: '2024-02-05T10:00:00.000Z',
        changed_by: 'user-002',
        comment: 'Iniciando revisión'
      },
      {
        state: 'revision',
        changed_at: '2024-02-25T16:45:00.000Z',
        changed_by: 'user-002',
        comment: 'Enviado a revisión'
      }
    ],
    parent_record_id: null,
    child_records: []
  },
  {
    _id: '3',
    title: 'Capacitación Personal Nuevo',
    description: 'Programa de capacitación para personal de nuevo ingreso',
    unique_code: 'REG-2024-003',
    process_definition_id: 'proc-training-001',
    organization_id: 'org-001',
    responsible_user_id: 'user-003',
    assigned_users: ['user-003', 'user-004'],
    current_state: 'completado',
    priority: 'low',
    progress_percentage: 100,
    due_date: '2024-02-28T23:59:59.000Z',
    created_at: '2024-01-10T09:00:00.000Z',
    updated_at: '2024-02-28T17:00:00.000Z',
    created_by: 'user-003',
    updated_by: 'user-003',
    tags: ['capacitacion', 'personal', 'rrhh'],
    custom_data: {
      participantes: 5,
      horas_capacitacion: 40
    },
    comments: [],
    attachments: [],
    task_checklist: [
      { id: '1', description: 'Planificar capacitación', completed: true },
      { id: '2', description: 'Ejecutar capacitación', completed: true },
      { id: '3', description: 'Evaluar resultados', completed: true }
    ],
    state_history: [
      {
        state: 'iniciado',
        changed_at: '2024-01-10T09:00:00.000Z',
        changed_by: 'user-003',
        comment: 'Proceso iniciado'
      },
      {
        state: 'en_progreso',
        changed_at: '2024-01-15T08:00:00.000Z',
        changed_by: 'user-003',
        comment: 'Iniciando capacitación'
      },
      {
        state: 'completado',
        changed_at: '2024-02-28T17:00:00.000Z',
        changed_by: 'user-003',
        comment: 'Capacitación completada exitosamente'
      }
    ],
    parent_record_id: null,
    child_records: []
  },
  {
    _id: '4',
    title: 'Mejora Continua Proceso Producción',
    description: 'Implementación de mejoras en el proceso de producción',
    unique_code: 'REG-2024-004',
    process_definition_id: 'proc-improvement-001',
    organization_id: 'org-001',
    responsible_user_id: 'user-004',
    assigned_users: ['user-004', 'user-005'],
    current_state: 'iniciado',
    priority: 'critical',
    progress_percentage: 25,
    due_date: '2024-05-30T23:59:59.000Z',
    created_at: '2024-02-01T08:00:00.000Z',
    updated_at: '2024-02-15T12:00:00.000Z',
    created_by: 'user-004',
    updated_by: 'user-004',
    tags: ['mejora-continua', 'produccion', 'eficiencia'],
    custom_data: {
      area_impacto: 'Producción',
      ahorro_estimado: 15000
    },
    comments: [],
    attachments: [],
    task_checklist: [
      { id: '1', description: 'Analizar proceso actual', completed: true },
      { id: '2', description: 'Identificar oportunidades', completed: false },
      { id: '3', description: 'Implementar mejoras', completed: false }
    ],
    state_history: [
      {
        state: 'iniciado',
        changed_at: '2024-02-01T08:00:00.000Z',
        changed_by: 'user-004',
        comment: 'Proceso iniciado'
      }
    ],
    parent_record_id: null,
    child_records: []
  },
  {
    _id: '5',
    title: 'Control de Calidad Lote 2024-A',
    description: 'Control de calidad del lote de producción 2024-A',
    unique_code: 'REG-2024-005',
    process_definition_id: 'proc-qc-001',
    organization_id: 'org-001',
    responsible_user_id: 'user-005',
    assigned_users: ['user-005'],
    current_state: 'aprobado',
    priority: 'high',
    progress_percentage: 90,
    due_date: '2024-03-15T23:59:59.000Z',
    created_at: '2024-02-10T10:00:00.000Z',
    updated_at: '2024-03-01T14:00:00.000Z',
    created_by: 'user-005',
    updated_by: 'user-005',
    tags: ['control-calidad', 'produccion', 'lote'],
    custom_data: {
      lote: '2024-A',
      unidades_inspeccionadas: 1000,
      defectos_encontrados: 2
    },
    comments: [],
    attachments: [],
    task_checklist: [
      { id: '1', description: 'Inspección visual', completed: true },
      { id: '2', description: 'Pruebas funcionales', completed: true },
      { id: '3', description: 'Documentar resultados', completed: false }
    ],
    state_history: [
      {
        state: 'iniciado',
        changed_at: '2024-02-10T10:00:00.000Z',
        changed_by: 'user-005',
        comment: 'Proceso iniciado'
      },
      {
        state: 'en_progreso',
        changed_at: '2024-02-12T09:00:00.000Z',
        changed_by: 'user-005',
        comment: 'Iniciando inspecciones'
      },
      {
        state: 'aprobado',
        changed_at: '2024-03-01T14:00:00.000Z',
        changed_by: 'user-005',
        comment: 'Lote aprobado para distribución'
      }
    ],
    parent_record_id: null,
    child_records: []
  }
];

// Simulación de delay para APIs
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processRecordsService = {
  // Obtener todos los registros de procesos
  async getAll(organizationId: string): Promise<ProcessRecord[]> {
    await delay(500); // Simular latencia de red
    console.log('🔍 ProcessRecordsService.getAll - organizationId:', organizationId);
    return mockProcessRecords.filter(record => record.organization_id === organizationId);
  },

  // Obtener un registro por ID
  async getById(id: string): Promise<ProcessRecord | null> {
    await delay(300);
    console.log('🔍 ProcessRecordsService.getById - id:', id);
    const record = mockProcessRecords.find(record => record._id === id);
    return record || null;
  },

  // Crear un nuevo registro
  async create(recordData: Partial<ProcessRecord>): Promise<ProcessRecord> {
    await delay(800);
    console.log('✨ ProcessRecordsService.create - data:', recordData);
    
    const newRecord: ProcessRecord = {
      _id: `mock-${Date.now()}`,
      title: recordData.title || 'Nuevo Registro',
      description: recordData.description || '',
      unique_code: recordData.unique_code || `REG-${Date.now()}`,
      process_definition_id: recordData.process_definition_id || 'proc-default',
      organization_id: recordData.organization_id || 'org-001',
      responsible_user_id: recordData.responsible_user_id || 'user-001',
      assigned_users: recordData.assigned_users || [],
      current_state: recordData.current_state || 'iniciado',
      priority: recordData.priority || 'medium',
      progress_percentage: recordData.progress_percentage || 0,
      due_date: recordData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: recordData.created_by || 'user-001',
      updated_by: recordData.updated_by || 'user-001',
      tags: recordData.tags || [],
      custom_data: recordData.custom_data || {},
      comments: recordData.comments || [],
      attachments: recordData.attachments || [],
      task_checklist: recordData.task_checklist || [],
      state_history: [
        {
          state: recordData.current_state || 'iniciado',
          changed_at: new Date().toISOString(),
          changed_by: recordData.created_by || 'user-001',
          comment: 'Registro creado'
        }
      ],
      parent_record_id: recordData.parent_record_id || null,
      child_records: recordData.child_records || []
    };

    mockProcessRecords.push(newRecord);
    return newRecord;
  },

  // Actualizar un registro existente
  async update(id: string, recordData: Partial<ProcessRecord>): Promise<ProcessRecord> {
    await delay(600);
    console.log('📝 ProcessRecordsService.update - id:', id, 'data:', recordData);
    
    const index = mockProcessRecords.findIndex(record => record._id === id);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    const existingRecord = mockProcessRecords[index];
    const updatedRecord: ProcessRecord = {
      ...existingRecord,
      ...recordData,
      _id: id, // Mantener el ID original
      updated_at: new Date().toISOString(),
      updated_by: recordData.updated_by || existingRecord.updated_by
    };

    // Si cambió el estado, agregar al historial
    if (recordData.current_state && recordData.current_state !== existingRecord.current_state) {
      updatedRecord.state_history = [
        ...existingRecord.state_history,
        {
          state: recordData.current_state,
          changed_at: new Date().toISOString(),
          changed_by: recordData.updated_by || existingRecord.updated_by,
          comment: `Estado cambiado a ${recordData.current_state}`
        }
      ];
    }

    mockProcessRecords[index] = updatedRecord;
    return updatedRecord;
  },

  // Eliminar un registro
  async delete(id: string): Promise<void> {
    await delay(400);
    console.log('🗑️ ProcessRecordsService.delete - id:', id);
    
    const index = mockProcessRecords.findIndex(record => record._id === id);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    mockProcessRecords.splice(index, 1);
  },

  // Cambiar estado de un registro
  async changeState(id: string, newState: string, comment?: string): Promise<ProcessRecord> {
    await delay(500);
    console.log('🔄 ProcessRecordsService.changeState - id:', id, 'newState:', newState);
    
    const record = await this.getById(id);
    if (!record) {
      throw new Error('Registro no encontrado');
    }

    return this.update(id, {
      current_state: newState as any,
      updated_at: new Date().toISOString()
    });
  },

  // Obtener estadísticas
  async getStats(organizationId: string): Promise<any> {
    await delay(300);
    console.log('📊 ProcessRecordsService.getStats - organizationId:', organizationId);
    
    const records = await this.getAll(organizationId);
    
    const stats = {
      total: records.length,
      byState: records.reduce((acc, record) => {
        acc[record.current_state] = (acc[record.current_state] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: records.reduce((acc, record) => {
        acc[record.priority] = (acc[record.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      overdue: records.filter(record => 
        record.due_date && 
        new Date(record.due_date) < new Date() && 
        !['completado', 'cancelado'].includes(record.current_state)
      ).length
    };

    return stats;
  }
};