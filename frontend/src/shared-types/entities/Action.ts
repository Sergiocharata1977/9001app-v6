// Tipos compartidos de Acciones para el frontend (forma cliente)

export type ActionType =
  | 'corrective'
  | 'preventive'
  | 'improvement'
  | 'containment'
  | 'investigation'
  | 'monitoring';

export type ActionCategory =
  | 'process'
  | 'training'
  | 'documentation'
  | 'equipment'
  | 'system'
  | 'procedure'
  | 'policy'
  | 'infrastructure'
  | 'supplier'
  | 'customer';

export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ImplementationStep {
  title: string;
  description?: string;
  responsibleId?: string;
  deadline?: string; // ISO string
  status?: 'pending' | 'in_progress' | 'completed';
  evidence?: string;
}

export interface Action {
  id: string;
  actionNumber: string;
  title: string;
  description?: string;

  // Estado y atributos principales usados en tablas/kanban
  status: 'pending' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: ActionPriority;
  type: string; // ej. 'corrective' | 'preventive' | 'improvement'
  assignedTo?: string;
  assignedToId?: string;
  dueDate?: string; // ISO string
  progress?: number;

  // Campos usados por ActionFormV2 (opcionales para compatibilidad)
  findingId?: string;
  actionType?: ActionType;
  actionCategory?: ActionCategory;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  implementationSteps?: ImplementationStep[];
  implementationPlan?: string;
  verificationMethod?: string;
  verificationCriteria?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  estimatedHours?: number;
  estimatedCost?: number;
  actualHours?: number;
  actualCost?: number;
  verificationMethods?: string[];
  rootCauseAnalysis?: string;
  preventiveActions?: string[];

  // Metadatos generales opcionales
  organization_id?: string;
  organizationId?: string;
  sourceType?: 'audit' | 'employee' | 'customer' | 'finding';
  sourceId?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

