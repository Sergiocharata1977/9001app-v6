// Tipos para el sistema de relaciones Norma-Proceso-Documento

export interface NormProcessDocRelation {
  _id: string;
  norm_point_id: NormPointSummary;
  process_id: ProcessSummary;
  document_ids: ProcessDocumentSummary[];
  compliance_status: 'completo' | 'parcial' | 'pendiente' | 'no_aplica';
  compliance_percentage: number;
  evidence_description?: string;
  evidence_files?: string[];
  responsible_user_id?: UserSummary;
  verification_date?: string;
  next_review_date?: string;
  audit_comments?: AuditComment[];
  organization_id: string;
  is_active: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NormPointSummary {
  _id: string;
  code: string;
  title: string;
  description?: string;
  chapter: number;
  section: string;
  category: 'contexto' | 'liderazgo' | 'planificacion' | 'apoyo' | 'operacion' | 'evaluacion' | 'mejora';
}

export interface ProcessSummary {
  _id: string;
  id: string;
  name: string;
  description?: string;
  owner?: string;
  codigo?: string;
  tipo: 'estratégico' | 'operativo' | 'apoyo';
  estado: 'activo' | 'inactivo' | 'revision' | 'obsoleto';
}

export interface ProcessDocumentSummary {
  _id: string;
  titulo: string;
  descripcion?: string;
  tipo_documento: string;
  version: string;
  estado: string;
}

export interface UserSummary {
  _id: string;
  name: string;
  email?: string;
}

export interface AuditComment {
  _id: string;
  date: string;
  auditor_id: UserSummary;
  comment: string;
  status: 'conforme' | 'no_conforme' | 'observacion';
}

// Tipos para el dashboard de cumplimiento
export interface ComplianceDashboard {
  summary: {
    total_norm_points: number;
    covered_points: number;
    uncovered_points: number;
    compliance_percentage: number;
  };
  compliance_by_chapter: ChapterCompliance[];
  critical_gaps: CriticalGap[];
  upcoming_reviews: UpcomingReview[];
}

export interface ChapterCompliance {
  chapter: number;
  title: string;
  total_points: number;
  covered: number;
  percentage: number;
}

export interface CriticalGap {
  norm_point: {
    code: string;
    title: string;
    chapter: number;
    priority: 'alta' | 'media' | 'baja';
  };
  risk_level: 'alto' | 'medio' | 'bajo';
}

export interface UpcomingReview {
  relation_id: string;
  norm_point: {
    _id: string;
    code: string;
    title: string;
  };
  process: {
    _id: string;
    name: string;
  };
  next_review_date: string;
  days_until_review: number;
}

// Tipos para formularios
export interface CreateRelationData {
  norm_point_id: string;
  process_id: string;
  document_ids?: string[];
  compliance_status: 'completo' | 'parcial' | 'pendiente' | 'no_aplica';
  compliance_percentage: number;
  evidence_description?: string;
  evidence_files?: string[];
  responsible_user_id?: string;
  verification_date?: string;
  next_review_date?: string;
  organization_id: string;
  created_by: string;
}

export interface UpdateRelationData extends Partial<CreateRelationData> {
  updated_by: string;
}

// Tipos para filtros y búsqueda
export interface RelationFilters {
  compliance_status?: string;
  chapter?: number;
  process_type?: string;
  search?: string;
}

// Estados de UI
export interface RelationState {
  relations: NormProcessDocRelation[];
  dashboard: ComplianceDashboard | null;
  isLoading: boolean;
  error: string | null;
  filters: RelationFilters;
}