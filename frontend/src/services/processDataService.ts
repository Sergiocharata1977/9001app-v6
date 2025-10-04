'use client';

import { IProcessRecord } from '@/types/process';

// Interface for Process Board (Tablero)
export interface ProcessBoard {
  _id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  owner: string;
  createdAt: string;
  updatedAt: string;
  recordsCount: number;
  color: string;
  lastActivity: string;
  teamMembers: number;
  organization_id: string;
  iso_code?: string;
}

// Mock data for process boards
const mockProcessBoards: ProcessBoard[] = [
  {
    _id: 'proc-001',
    name: 'Control de Calidad',
    description: 'Proceso para el control de calidad de productos según ISO 9001',
    category: 'Calidad',
    status: 'active',
    owner: 'Juan Pérez',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-02-20T14:30:00.000Z',
    recordsCount: 45,
    color: '#3B82F6',
    lastActivity: '2 horas',
    teamMembers: 8,
    organization_id: 'org-001',
    iso_code: '9.1.3'
  },
  {
    _id: 'proc-002',
    name: 'Gestión de Inventario',
    description: 'Control y seguimiento del inventario de materiales',
    category: 'Logística',
    status: 'active',
    owner: 'María García',
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2024-02-18T16:45:00.000Z',
    recordsCount: 128,
    color: '#10B981',
    lastActivity: '1 día',
    teamMembers: 12,
    organization_id: 'org-001',
    iso_code: '7.1.3'
  },
  {
    _id: 'proc-003',
    name: 'Evaluación de Proveedores',
    description: 'Proceso de evaluación y selección de proveedores',
    category: 'Compras',
    status: 'draft',
    owner: 'Carlos López',
    createdAt: '2024-02-01T11:00:00.000Z',
    updatedAt: '2024-02-15T13:20:00.000Z',
    recordsCount: 12,
    color: '#F59E0B',
    lastActivity: '3 días',
    teamMembers: 5,
    organization_id: 'org-001',
    iso_code: '8.4.1'
  },
  {
    _id: 'proc-004',
    name: 'Auditorías Internas',
    description: 'Planificación y ejecución de auditorías internas del SGC',
    category: 'Auditoría',
    status: 'active',
    owner: 'Ana Rodríguez',
    createdAt: '2024-01-05T08:00:00.000Z',
    updatedAt: '2024-02-22T10:15:00.000Z',
    recordsCount: 23,
    color: '#8B5CF6',
    lastActivity: '5 horas',
    teamMembers: 6,
    organization_id: 'org-001',
    iso_code: '9.2.2'
  },
  {
    _id: 'proc-005',
    name: 'Capacitación del Personal',
    description: 'Programa de capacitación y desarrollo del personal',
    category: 'Recursos Humanos',
    status: 'active',
    owner: 'Luis Martínez',
    createdAt: '2024-01-20T14:00:00.000Z',
    updatedAt: '2024-02-25T09:30:00.000Z',
    recordsCount: 67,
    color: '#EF4444',
    lastActivity: '1 hora',
    teamMembers: 15,
    organization_id: 'org-001',
    iso_code: '7.2'
  },
  {
    _id: 'proc-006',
    name: 'Mejora Continua',
    description: 'Procesos de mejora continua del sistema de gestión',
    category: 'Mejora',
    status: 'active',
    owner: 'Sofia Hernández',
    createdAt: '2024-02-10T12:00:00.000Z',
    updatedAt: '2024-02-28T11:45:00.000Z',
    recordsCount: 34,
    color: '#06B6D4',
    lastActivity: '6 horas',
    teamMembers: 9,
    organization_id: 'org-001',
    iso_code: '10.3'
  }
];

// Mock data for process records (simplified for boards view)
const mockProcessRecords: IProcessRecord[] = [
  // Records for Control de Calidad (proc-001)
  {
    _id: 'rec-001-001',
    organization_id: 'org-001',
    template_id: 'proc-001',
    unique_code: 'REG-2024-001',
    base_code: 'CC-001',
    level: 1,
    title: 'Control Calidad Lote A-2024',
    description: 'Inspección de calidad del lote de producción A-2024',
    current_state_id: 'state-in-progress',
    state_history: [],
    responsible_user_id: 'user-001',
    assigned_users: ['user-001', 'user-002'],
    start_date: new Date('2024-02-15'),
    due_date: new Date('2024-03-01'),
    priority: 'high',
    custom_data: {},
    files: [],
    progress_percentage: 75,
    tags: ['calidad', 'produccion'],
    is_active: true,
    is_archived: false,
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-25')
  },
  {
    _id: 'rec-001-002',
    organization_id: 'org-001',
    template_id: 'proc-001',
    unique_code: 'REG-2024-002',
    base_code: 'CC-002',
    level: 1,
    title: 'Auditoría de Calidad Q1',
    description: 'Auditoría interna de procesos de calidad primer trimestre',
    current_state_id: 'state-review',
    state_history: [],
    responsible_user_id: 'user-002',
    assigned_users: ['user-002', 'user-003'],
    start_date: new Date('2024-01-15'),
    due_date: new Date('2024-03-31'),
    priority: 'medium',
    custom_data: {},
    files: [],
    progress_percentage: 60,
    tags: ['auditoria', 'calidad'],
    is_active: true,
    is_archived: false,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-02-20')
  },
  // Add more records for other processes...
];

// Simulación de delay para APIs
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processDataService = {
  // Obtener todos los tableros de procesos
  async getAllBoards(organizationId: string): Promise<ProcessBoard[]> {
    await delay(500);
    console.log('🔍 ProcessDataService.getAllBoards - organizationId:', organizationId);
    return mockProcessBoards.filter(board => board.organization_id === organizationId);
  },

  // Obtener un tablero por ID
  async getBoardById(id: string): Promise<ProcessBoard | null> {
    await delay(300);
    console.log('🔍 ProcessDataService.getBoardById - id:', id);
    const board = mockProcessBoards.find(board => board._id === id);
    return board || null;
  },

  // Obtener registros de un proceso específico
  async getRecordsByProcessId(processId: string): Promise<IProcessRecord[]> {
    await delay(400);
    console.log('🔍 ProcessDataService.getRecordsByProcessId - processId:', processId);
    return mockProcessRecords.filter(record => record.template_id === processId);
  },

  // Obtener un registro específico
  async getRecordById(id: string): Promise<IProcessRecord | null> {
    await delay(300);
    console.log('🔍 ProcessDataService.getRecordById - id:', id);
    const record = mockProcessRecords.find(record => record._id === id);
    return record || null;
  },

  // Crear un nuevo tablero
  async createBoard(boardData: Partial<ProcessBoard>): Promise<ProcessBoard> {
    await delay(600);
    console.log('✨ ProcessDataService.createBoard - data:', boardData);

    const newBoard: ProcessBoard = {
      _id: `proc-${Date.now()}`,
      name: boardData.name || 'Nuevo Proceso',
      description: boardData.description || '',
      category: boardData.category || 'General',
      status: boardData.status || 'draft',
      owner: boardData.owner || 'Usuario Actual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordsCount: 0,
      color: boardData.color || '#6B7280',
      lastActivity: 'Ahora',
      teamMembers: 1,
      organization_id: boardData.organization_id || 'org-001',
      iso_code: boardData.iso_code
    };

    mockProcessBoards.push(newBoard);
    return newBoard;
  },

  // Crear un nuevo registro en un proceso
  async createRecord(processId: string, recordData: Partial<IProcessRecord>): Promise<IProcessRecord> {
    await delay(600);
    console.log('✨ ProcessDataService.createRecord - processId:', processId, 'data:', recordData);

    const board = await this.getBoardById(processId);
    if (!board) {
      throw new Error('Proceso no encontrado');
    }

    const newRecord: IProcessRecord = {
      _id: `rec-${processId}-${Date.now()}`,
      organization_id: recordData.organization_id || 'org-001',
      template_id: processId,
      unique_code: recordData.unique_code || `REG-${Date.now()}`,
      base_code: `REC-${Date.now()}`,
      level: 1,
      title: recordData.title || 'Nuevo Registro',
      description: recordData.description || '',
      current_state_id: recordData.current_state_id || 'state-started',
      state_history: [],
      responsible_user_id: recordData.responsible_user_id || 'user-001',
      assigned_users: recordData.assigned_users || [],
      start_date: recordData.start_date,
      due_date: recordData.due_date,
      priority: recordData.priority || 'medium',
      custom_data: recordData.custom_data || {},
      files: recordData.files || [],
      progress_percentage: recordData.progress_percentage || 0,
      tags: recordData.tags || [],
      is_active: true,
      is_archived: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    mockProcessRecords.push(newRecord);

    // Update board records count
    board.recordsCount += 1;
    board.updatedAt = new Date().toISOString();

    return newRecord;
  },

  // Actualizar un registro
  async updateRecord(id: string, recordData: Partial<IProcessRecord>): Promise<IProcessRecord> {
    await delay(500);
    console.log('📝 ProcessDataService.updateRecord - id:', id, 'data:', recordData);

    const index = mockProcessRecords.findIndex(record => record._id === id);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    const existingRecord = mockProcessRecords[index];
    const updatedRecord: IProcessRecord = {
      ...existingRecord,
      ...recordData,
      _id: id,
      updated_at: new Date()
    };

    mockProcessRecords[index] = updatedRecord;
    return updatedRecord;
  },

  // Eliminar un registro
  async deleteRecord(id: string): Promise<void> {
    await delay(400);
    console.log('🗑️ ProcessDataService.deleteRecord - id:', id);

    const index = mockProcessRecords.findIndex(record => record._id === id);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    const record = mockProcessRecords[index];
    mockProcessRecords.splice(index, 1);

    // Update board records count
    const board = mockProcessBoards.find(b => b._id === record.template_id);
    if (board) {
      board.recordsCount = Math.max(0, board.recordsCount - 1);
    }
  },

  // Cambiar estado de un registro
  async changeRecordState(id: string, newStateId: string): Promise<IProcessRecord> {
    await delay(400);
    console.log('🔄 ProcessDataService.changeRecordState - id:', id, 'newStateId:', newStateId);

    return this.updateRecord(id, {
      current_state_id: newStateId,
      updated_at: new Date()
    });
  },

  // Obtener estadísticas de procesos
  async getProcessStats(organizationId: string): Promise<any> {
    await delay(300);
    console.log('📊 ProcessDataService.getProcessStats - organizationId:', organizationId);

    const boards = await this.getAllBoards(organizationId);
    const records = mockProcessRecords.filter(r => r.organization_id === organizationId);

    return {
      totalBoards: boards.length,
      activeBoards: boards.filter(b => b.status === 'active').length,
      draftBoards: boards.filter(b => b.status === 'draft').length,
      totalRecords: records.length,
      recordsByState: records.reduce((acc, record) => {
        acc[record.current_state_id] = (acc[record.current_state_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recordsByPriority: records.reduce((acc, record) => {
        acc[record.priority] = (acc[record.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
};