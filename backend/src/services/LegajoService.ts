import { Types } from 'mongoose';
// import Legajo, { ILegajoDocument } from '../models/Legajo'; // TODO: Implementar modelo Legajo
import {
    ICreateLegajoDTO,
    IFiscalYear,
    ILegajoFilters,
    ILegajoMetrics,
    ILegajosPaginatedResponse,
    IUpdateLegajoDTO
} from '../types/legajo.types'; // TODO: Verificar si estos tipos existen
import MetricsService from './MetricsService';

/**
 * SERVICIO DE LÓGICA DE NEGOCIO PARA LEGAJOS
 * 
 * Maneja toda la lógica de negocio relacionada con legajos:
 * - CRUD completo
 * - Validaciones de negocio
 * - Cálculo automático de métricas
 * - Búsqueda y filtrado avanzado
 */

export class LegajoService {
  
  /**
   * Crea un nuevo legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async create(
    data: ICreateLegajoDTO,
    userId?: string
  ): Promise<any> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error creando legajo: ${error.message}`);
    }
  }
  
  /**
   * Busca un legajo por ID
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async findById(
    legajoId: string,
    organizationId: string
  ): Promise<any | null> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return null;
    } catch (error: any) {
      throw new Error(`Error buscando legajo: ${error.message}`);
    }
  }
  
  /**
   * Busca un legajo por company_id
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async findByCompanyId(
    companyId: string,
    organizationId: string
  ): Promise<any | null> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return null;
    } catch (error: any) {
      throw new Error(`Error buscando legajo por empresa: ${error.message}`);
    }
  }
  
  /**
   * Actualiza un legajo existente
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async update(
    legajoId: string,
    organizationId: string,
    data: IUpdateLegajoDTO,
    userId?: string
  ): Promise<any | null> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error actualizando legajo: ${error.message}`);
    }
  }
  
  /**
   * Elimina (soft delete) un legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async delete(
    legajoId: string,
    organizationId: string,
    userId?: string
  ): Promise<boolean> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error eliminando legajo: ${error.message}`);
    }
  }
  
  /**
   * Busca legajos con filtros avanzados y paginación
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async findWithFilters(
    filters: ILegajoFilters
  ): Promise<any> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasMore: false
      };
    } catch (error: any) {
      throw new Error(`Error buscando legajos: ${error.message}`);
    }
  }
  
  /**
   * Agrega un año fiscal a un legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async addFiscalYear(
    legajoId: string,
    organizationId: string,
    fiscalYear: IFiscalYear,
    userId?: string
  ): Promise<any | null> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error agregando año fiscal: ${error.message}`);
    }
  }
  
  /**
   * Actualiza un año fiscal existente
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async updateFiscalYear(
    legajoId: string,
    organizationId: string,
    year: number,
    fiscalYearData: Partial<IFiscalYear>,
    userId?: string
  ): Promise<any | null> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error actualizando año fiscal: ${error.message}`);
    }
  }
  
  /**
   * Recalcula ratios de todos los años fiscales
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async recalculateAllRatios(
    legajoId: string,
    organizationId: string
  ): Promise<any | null> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error recalculando ratios: ${error.message}`);
    }
  }
  
  /**
   * Calcula métricas agregadas del legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async calculateMetrics(
    legajoId: string,
    organizationId: string
  ): Promise<any> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error calculando métricas: ${error.message}`);
    }
  }
  
  /**
   * Obtiene estadísticas generales de legajos por organización
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async getOrganizationStats(organizationId: string): Promise<any> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return {
        total: 0,
        conDatosFinancieros: 0,
        conActivos: 0,
        conAnalisisRiesgo: 0,
        promedioScore: null
      };
    } catch (error: any) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }
  
  /**
   * Valida si un legajo está completo (tiene todos los datos necesarios)
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async validateCompleteness(
    legajoId: string,
    organizationId: string
  ): Promise<{ isComplete: boolean; missingFields: string[] }> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return {
        isComplete: false,
        missingFields: ['Funcionalidad deshabilitada']
      };
    } catch (error: any) {
      throw new Error(`Error validando completitud: ${error.message}`);
    }
  }
  
  /**
   * Verifica si una empresa ya tiene un legajo activo
   * Útil para evitar duplicados y aplicar regla de negocio: 1 Empresa → 1 Legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async hasLegajo(
    companyId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return false;
    } catch (error: any) {
      throw new Error(`Error verificando legajo existente: ${error.message}`);
    }
  }
  
  // TODO: Función duplicada - eliminar cuando se implemente el modelo Legajo
  // /**
  //  * Obtiene el legajo de una empresa (si existe)
  //  */
  // static async findByCompanyId(
  //   companyId: string,
  //   organizationId: string
  // ): Promise<ILegajoDocument | null> {
  //   try {
  //     const legajo = await Legajo.findOne({
  //       company_id: companyId,
  //       organization_id: organizationId,
  //       is_active: true
  //     })
  //     .populate('company_id', 'razon_social cuit zona_geografica')
  //     .populate('risk_links.risk_analysis_id', 'nivel_riesgo_general puntuacion_total fecha_analisis');
  //     
  //     return legajo;
  //   } catch (error: any) {
  //     throw new Error(`Error buscando legajo por empresa: ${error.message}`);
  //   }
  // }
}

export default LegajoService;


