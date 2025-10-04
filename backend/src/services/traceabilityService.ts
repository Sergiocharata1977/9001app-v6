/**
 * Servicio de Trazabilidad para ISO 9001
 * Genera números únicos y trazables para Auditorías, Hallazgos y Acciones
 */

import mongoose, { Schema, Document } from 'mongoose';

interface ICounter extends Document {
  _id: string; // e.g., "audit_2024", "finding_AUDIT-2024-001", "action_AUDIT-2024-001-HALL-001"
  seq: number;
  organization_id: string;
}

const CounterSchema: Schema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
  organization_id: { type: String, required: true }
});

const Counter = mongoose.model<ICounter>('Counter', CounterSchema);

export class TraceabilityService {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  /**
   * Genera el siguiente número en secuencia para un prefijo
   */
  private async generateNextNumber(prefix: string): Promise<string> {
    const counterId = `${prefix}_${this.organizationId}`;
    const counter = await Counter.findByIdAndUpdate(
      counterId,
      { 
        $inc: { seq: 1 },
        organization_id: this.organizationId
      },
      { new: true, upsert: true }
    );
    return counter.seq.toString().padStart(3, '0'); // e.g., 001, 002
  }

  /**
   * Genera número de auditoría: AUDIT-2024-001
   */
  async generateAuditNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const seq = await this.generateNextNumber(`audit_${year}`);
    return `AUDIT-${year}-${seq}`;
  }

  /**
    * Genera número de hallazgo basado en el origen
    */
   async generateFindingNumber(sourceType: 'audit' | 'employee' | 'customer' | 'inspection' | 'supplier', sourceId?: string): Promise<string> {
    const year = new Date().getFullYear();
    let prefix: string;

    switch (sourceType) {
      case 'audit':
        prefix = sourceId || `AUDIT-${year}`;
        break;
      case 'employee':
        prefix = `EMP-${year}`;
        break;
      case 'customer':
        prefix = `CLI-${year}`;
        break;
      case 'inspection':
        prefix = `INS-${year}`;
        break;
      case 'supplier':
        prefix = `SUP-${year}`;
        break;
      default:
        throw new Error('Tipo de origen no válido');
    }

    const seq = await this.generateNextNumber(`finding_${prefix}`);
    return `${prefix}-HALL-${seq}`;
  }

  /**
   * Genera número de acción basado en el hallazgo
   */
  async generateActionNumber(findingNumber: string): Promise<string> {
    const seq = await this.generateNextNumber(`action_${findingNumber}`);
    return `${findingNumber}-ACC-${seq}`;
  }

  /**
   * Genera número para declaración de empleado: EMP-2024-001
   */
  async generateEmployeeDeclarationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const seq = await this.generateNextNumber(`employee_${year}`);
    return `EMP-${year}-${seq}`;
  }

  /**
   * Genera número para encuesta de cliente: CLI-2024-001
   */
  async generateCustomerSurveyNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const seq = await this.generateNextNumber(`customer_${year}`);
    return `CLI-${year}-${seq}`;
  }

  /**
   * Valida y parsea un número de trazabilidad
   */
  static parseTraceabilityNumber(number: string): {
    type: 'audit' | 'finding' | 'action' | 'employee' | 'customer';
    year: number;
    sequence: number;
    source?: string;
  } | null {
    const patterns = {
      audit: /^AUDIT-(\d{4})-(\d{3})$/,
      finding: /^(.+)-HALL-(\d{3})$/,
      action: /^(.+)-ACC-(\d{3})$/,
      employee: /^EMP-(\d{4})-(\d{3})$/,
      customer: /^CLI-(\d{4})-(\d{3})$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      const match = number.match(pattern);
      if (match) {
        return {
          type: type as any,
          year: parseInt(match[1]),
          sequence: parseInt(match[2]),
          source: type === 'finding' || type === 'action' ? match[1] : undefined
        };
      }
    }

    return null;
  }

  /**
   * Obtiene la cadena de trazabilidad completa
   */
  static getTraceabilityChain(actionNumber: string): string[] {
    const parsed = this.parseTraceabilityNumber(actionNumber);
    if (!parsed || parsed.type !== 'action') return [];

    const chain: string[] = [];
    
    // Extraer hallazgo del número de acción
    const findingMatch = actionNumber.match(/^(.+)-ACC-\d{3}$/);
    if (findingMatch) {
      const findingNumber = findingMatch[1];
      chain.push(findingNumber);
      
      // Extraer auditoría del número de hallazgo
      const auditMatch = findingNumber.match(/^(.+)-HALL-\d{3}$/);
      if (auditMatch) {
        const auditNumber = auditMatch[1];
        chain.push(auditNumber);
      }
    }

    return chain.reverse(); // [audit, finding, action]
  }
}

export default TraceabilityService;



