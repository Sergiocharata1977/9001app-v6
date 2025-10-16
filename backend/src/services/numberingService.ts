import { Audit } from '../models/Audit';
import { Hallazgos } from '../models/hallazgos';
import { Acciones } from '../models/acciones';

export class NumberingService {
  /**
   * Genera número de auditoría: AUDIT-YYYY-XXX
   * @param organizationId ID de la organización
   * @returns Número de auditoría único
   */
  static async generateAuditNumber(organizationId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `AUDIT-${year}`;
    
    // Buscar el último número de auditoría del año
    const lastAudit = await Audit.findOne({
      organization_id: organizationId,
      auditNumber: { $regex: `^${prefix}` }
    }).sort({ auditNumber: -1 });
    
    let sequence = 1;
    if (lastAudit) {
      const lastNumber = lastAudit.auditNumber.split('-')[2];
      sequence = parseInt(lastNumber) + 1;
    }
    
    return `${prefix}-${sequence.toString().padStart(3, '0')}`;
  }

  /**
   * Genera número de hallazgo basado en el origen
   * @param source Origen del hallazgo (audit, employee, customer, etc.)
   * @param sourceId ID del origen
   * @param organizationId ID de la organización
   * @returns Número de hallazgo único
   */
  static async generateFindingNumber(
    source: string, 
    sourceId: string, 
    organizationId: string
  ): Promise<string> {
    let sourcePrefix = '';
    let sourceNumber = '';
    
    switch (source) {
      case 'audit':
        sourcePrefix = 'AUDIT';
        // Obtener el número de auditoría
        const audit = await Audit.findOne({ 
          organization_id: organizationId, 
          id: sourceId 
        });
        if (!audit) {
          throw new Error('Auditoría no encontrada');
        }
        sourceNumber = audit.auditNumber.split('-')[2]; // Obtener secuencia
        break;
        
      case 'employee':
        sourcePrefix = 'EMP';
        sourceNumber = sourceId.split('-').pop() || '001';
        break;
        
      case 'customer':
        sourcePrefix = 'CLI';
        sourceNumber = sourceId.split('-').pop() || '001';
        break;
        
      case 'inspection':
        sourcePrefix = 'INS';
        sourceNumber = sourceId.split('-').pop() || '001';
        break;
        
      case 'supplier':
        sourcePrefix = 'SUP';
        sourceNumber = sourceId.split('-').pop() || '001';
        break;
        
      default:
        throw new Error('Origen de hallazgo no válido');
    }
    
    // Buscar el último hallazgo para este origen
    const lastFinding = await Hallazgos.findOne({
      organization_id: organizationId,
      origen: source,
      origenId: sourceId,
      numeroHallazgo: { $regex: `^${sourcePrefix}-${sourceNumber}-HALL` }
    }).sort({ numeroHallazgo: -1 });
    
    let sequence = 1;
    if (lastFinding) {
      const parts = lastFinding.numeroHallazgo.split('-');
      const lastSequence = parts[parts.length - 1];
      sequence = parseInt(lastSequence) + 1;
    }
    
    return `${sourcePrefix}-${sourceNumber}-HALL-${sequence.toString().padStart(3, '0')}`;
  }

  /**
   * Genera número de acción basado en el hallazgo
   * @param findingId ID del hallazgo
   * @param organizationId ID de la organización
   * @returns Número de acción único
   */
  static async generateActionNumber(
    findingId: string, 
    organizationId: string
  ): Promise<string> {
    // Obtener el hallazgo para extraer su número
    const finding = await Hallazgos.findOne({ 
      organization_id: organizationId, 
      id: findingId 
    });
    
    if (!finding) {
      throw new Error('Hallazgo no encontrado');
    }
    
    // Buscar la última acción para este hallazgo
    const lastAction = await Acciones.findOne({
      organization_id: organizationId,
      hallazgoId: findingId,
      numeroAccion: { $regex: `^${finding.numeroHallazgo}-ACC` }
    }).sort({ numeroAccion: -1 });
    
    let sequence = 1;
    if (lastAction) {
      const parts = lastAction.numeroAccion.split('-');
      const lastSequence = parts[parts.length - 1];
      sequence = parseInt(lastSequence) + 1;
    }
    
    return `${finding.numeroHallazgo}-ACC-${sequence.toString().padStart(3, '0')}`;
  }

  /**
   * Valida que un número sea único en la organización
   * @param number Número a validar
   * @param organizationId ID de la organización
   * @param type Tipo de entidad (audit, finding, action)
   * @returns true si es único, false si ya existe
   */
  static async isNumberUnique(
    number: string, 
    organizationId: string, 
    type: 'audit' | 'finding' | 'action'
  ): Promise<boolean> {
    let exists = false;
    
    switch (type) {
      case 'audit':
        exists = !!(await Audit.findOne({ 
          organization_id: organizationId, 
          auditNumber: number 
        }));
        break;
        
      case 'finding':
        exists = !!(await Hallazgos.findOne({ 
          organization_id: organizationId, 
          numeroHallazgo: number 
        }));
        break;
        
      case 'action':
        exists = !!(await Acciones.findOne({ 
          organization_id: organizationId, 
          numeroAccion: number 
        }));
        break;
    }
    
    return !exists;
  }

  /**
   * Obtiene estadísticas de numeración para una organización
   * @param organizationId ID de la organización
   * @returns Estadísticas de numeración
   */
  static async getNumberingStats(organizationId: string) {
    const currentYear = new Date().getFullYear();
    
    const auditCount = await Audit.countDocuments({
      organization_id: organizationId,
      auditNumber: { $regex: `^AUDIT-${currentYear}` }
    });
    
    const findingCount = await Hallazgos.countDocuments({
      organization_id: organizationId,
      identifiedDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lt: new Date(`${currentYear + 1}-01-01`)
      }
    });
    
    const actionCount = await Acciones.countDocuments({
      organization_id: organizationId,
      fecha_identificacion: {
        $gte: new Date(`${currentYear}-01-01`),
        $lt: new Date(`${currentYear + 1}-01-01`)
      }
    });
    
    return {
      year: currentYear,
      audits: auditCount,
      findings: findingCount,
      actions: actionCount,
      nextAuditNumber: `AUDIT-${currentYear}-${(auditCount + 1).toString().padStart(3, '0')}`
    };
  }
}




