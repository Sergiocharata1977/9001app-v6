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
  static async create(
    data: ICreateLegajoDTO,
    userId?: string
  ): Promise<ILegajoDocument> {
    try {
      // Validar que no exista ya un legajo para esta empresa
      const existingLegajo = await Legajo.findOne({
        company_id: data.company_id,
        organization_id: data.organization_id,
        is_active: true
      });
      
      if (existingLegajo) {
        throw new Error(`Ya existe un legajo activo para la empresa ${data.company_id}`);
      }
      
      // Calcular ratios para cada año fiscal si existen
      if (data.fiscal_years && data.fiscal_years.length > 0) {
        for (const fiscalYear of data.fiscal_years) {
          const result = MetricsService.calculateFinancialRatios(fiscalYear);
          if (result.success && result.ratios) {
            fiscalYear.ratios = result.ratios;
          }
        }
      }
      
      // Crear legajo
      const legajo = new Legajo({
        ...data,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: userId ? new Types.ObjectId(userId) : undefined
      });
      
      await legajo.save();
      
      return legajo;
      
    } catch (error: any) {
      throw new Error(`Error creando legajo: ${error.message}`);
    }
  }
  
  /**
   * Busca un legajo por ID
   */
  static async findById(
    legajoId: string,
    organizationId: string
  ): Promise<ILegajoDocument | null> {
    try {
      const legajo = await Legajo.findOne({
        _id: legajoId,
        organization_id: organizationId,
        is_active: true
      })
      .populate('company_id', 'razon_social cuit tipo_cliente')
      .exec();
      
      return legajo;
      
    } catch (error: any) {
      throw new Error(`Error buscando legajo: ${error.message}`);
    }
  }
  
  /**
   * Busca un legajo por company_id
   */
  static async findByCompanyId(
    companyId: string,
    organizationId: string
  ): Promise<ILegajoDocument | null> {
    try {
      return await Legajo.findByCompany(companyId, organizationId);
    } catch (error: any) {
      throw new Error(`Error buscando legajo por empresa: ${error.message}`);
    }
  }
  
  /**
   * Actualiza un legajo existente
   */
  static async update(
    legajoId: string,
    organizationId: string,
    data: IUpdateLegajoDTO,
    userId?: string
  ): Promise<ILegajoDocument | null> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      // Recalcular ratios para años fiscales actualizados
      if (data.fiscal_years) {
        for (const fiscalYear of data.fiscal_years) {
          const result = MetricsService.calculateFinancialRatios(fiscalYear);
          if (result.success && result.ratios) {
            fiscalYear.ratios = result.ratios;
          }
        }
      }
      
      // Actualizar campos
      Object.assign(legajo, data);
      legajo.updated_at = new Date();
      if (userId) {
        legajo.updated_by = new Types.ObjectId(userId);
      }
      
      await legajo.save();
      
      return legajo;
      
    } catch (error: any) {
      throw new Error(`Error actualizando legajo: ${error.message}`);
    }
  }
  
  /**
   * Elimina (soft delete) un legajo
   */
  static async delete(
    legajoId: string,
    organizationId: string,
    userId?: string
  ): Promise<boolean> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      legajo.is_active = false;
      legajo.updated_at = new Date();
      if (userId) {
        legajo.updated_by = new Types.ObjectId(userId);
      }
      
      await legajo.save();
      
      return true;
      
    } catch (error: any) {
      throw new Error(`Error eliminando legajo: ${error.message}`);
    }
  }
  
  /**
   * Busca legajos con filtros avanzados y paginación
   */
  static async findWithFilters(
    filters: ILegajoFilters
  ): Promise<ILegajosPaginatedResponse> {
    try {
      const {
        organization_id,
        company_id,
        year,
        score_min,
        score_max,
        has_financial_data,
        has_assets,
        search,
        page = 1,
        limit = 10,
        sort_by = 'updated_at',
        sort_order = 'desc'
      } = filters;
      
      // Construir query
      const query: any = {
        organization_id,
        is_active: true
      };
      
      if (company_id) {
        query.company_id = company_id;
      }
      
      if (year) {
        query['fiscal_years.year'] = year;
      }
      
      if (has_financial_data !== undefined) {
        if (has_financial_data) {
          query['fiscal_years.0'] = { $exists: true };
        } else {
          query.fiscal_years = { $size: 0 };
        }
      }
      
      if (has_assets !== undefined) {
        if (has_assets) {
          query.$or = [
            { 'assets.properties.0': { $exists: true } },
            { 'assets.vehicles.0': { $exists: true } },
            { 'assets.machinery.0': { $exists: true } }
          ];
        }
      }
      
      if (score_min !== undefined || score_max !== undefined) {
        const scoreQuery: any = {};
        if (score_min !== undefined) scoreQuery.$gte = score_min;
        if (score_max !== undefined) scoreQuery.$lte = score_max;
        query['risk_links.score_snapshot'] = scoreQuery;
      }
      
      // Búsqueda por texto (si está populated)
      if (search) {
        query.$or = [
          { observaciones: { $regex: search, $options: 'i' } },
          { notas_internas: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Paginación
      const skip = (page - 1) * limit;
      
      // Ordenamiento
      const sortOptions: any = {};
      sortOptions[sort_by] = sort_order === 'asc' ? 1 : -1;
      
      // Ejecutar query
      const [data, total] = await Promise.all([
        Legajo.find(query)
          .populate('company_id', 'razon_social cuit tipo_cliente')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
        Legajo.countDocuments(query)
      ]);
      
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;
      
      return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasMore
      };
      
    } catch (error: any) {
      throw new Error(`Error buscando legajos: ${error.message}`);
    }
  }
  
  /**
   * Agrega un año fiscal a un legajo
   */
  static async addFiscalYear(
    legajoId: string,
    organizationId: string,
    fiscalYear: IFiscalYear,
    userId?: string
  ): Promise<ILegajoDocument | null> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      // Verificar que no exista ya el año
      const existingYear = legajo.fiscal_years.find((fy: any) => fy.year === fiscalYear.year);
      if (existingYear) {
        throw new Error(`Ya existe un registro para el año ${fiscalYear.year}`);
      }
      
      // Calcular ratios
      const result = MetricsService.calculateFinancialRatios(fiscalYear);
      if (result.success && result.ratios) {
        fiscalYear.ratios = result.ratios;
      }
      
      // Agregar año fiscal
      legajo.fiscal_years.push(fiscalYear);
      legajo.updated_at = new Date();
      if (userId) {
        legajo.updated_by = new Types.ObjectId(userId);
      }
      
      await legajo.save();
      
      return legajo;
      
    } catch (error: any) {
      throw new Error(`Error agregando año fiscal: ${error.message}`);
    }
  }
  
  /**
   * Actualiza un año fiscal existente
   */
  static async updateFiscalYear(
    legajoId: string,
    organizationId: string,
    year: number,
    fiscalYearData: Partial<IFiscalYear>,
    userId?: string
  ): Promise<ILegajoDocument | null> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      const fiscalYearIndex = legajo.fiscal_years.findIndex((fy: any) => fy.year === year);
      if (fiscalYearIndex === -1) {
        throw new Error(`No existe registro para el año ${year}`);
      }
      
      // Actualizar datos
      const updatedFiscalYear = {
        ...legajo.fiscal_years[fiscalYearIndex],
        ...fiscalYearData
      };
      
      // Recalcular ratios
      const result = MetricsService.calculateFinancialRatios(updatedFiscalYear);
      if (result.success && result.ratios) {
        updatedFiscalYear.ratios = result.ratios;
      }
      
      legajo.fiscal_years[fiscalYearIndex] = updatedFiscalYear;
      legajo.updated_at = new Date();
      if (userId) {
        legajo.updated_by = new Types.ObjectId(userId);
      }
      
      await legajo.save();
      
      return legajo;
      
    } catch (error: any) {
      throw new Error(`Error actualizando año fiscal: ${error.message}`);
    }
  }
  
  /**
   * Recalcula ratios de todos los años fiscales
   */
  static async recalculateAllRatios(
    legajoId: string,
    organizationId: string
  ): Promise<ILegajoDocument | null> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      // Recalcular para cada año
      for (const fiscalYear of legajo.fiscal_years) {
        const result = MetricsService.calculateFinancialRatios(fiscalYear);
        if (result.success && result.ratios) {
          fiscalYear.ratios = result.ratios;
        }
      }
      
      legajo.updated_at = new Date();
      await legajo.save();
      
      return legajo;
      
    } catch (error: any) {
      throw new Error(`Error recalculando ratios: ${error.message}`);
    }
  }
  
  /**
   * Calcula métricas agregadas del legajo
   */
  static async calculateMetrics(
    legajoId: string,
    organizationId: string
  ): Promise<ILegajoMetrics> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      return await legajo.calculateMetrics();
      
    } catch (error: any) {
      throw new Error(`Error calculando métricas: ${error.message}`);
    }
  }
  
  /**
   * Obtiene estadísticas generales de legajos por organización
   */
  static async getOrganizationStats(organizationId: string): Promise<any> {
    try {
      const stats = await Legajo.aggregate([
        { $match: { organization_id: organizationId, is_active: true } },
        {
          $facet: {
            total: [{ $count: 'count' }],
            conDatosFinancieros: [
              { $match: { 'fiscal_years.0': { $exists: true } } },
              { $count: 'count' }
            ],
            conActivos: [
              {
                $match: {
                  $or: [
                    { 'assets.properties.0': { $exists: true } },
                    { 'assets.vehicles.0': { $exists: true } },
                    { 'assets.machinery.0': { $exists: true } }
                  ]
                }
              },
              { $count: 'count' }
            ],
            conAnalisisRiesgo: [
              { $match: { 'risk_links.0': { $exists: true } } },
              { $count: 'count' }
            ],
            promedioScore: [
              { $unwind: '$risk_links' },
              { $group: { _id: null, avg: { $avg: '$risk_links.score_snapshot' } } }
            ]
          }
        }
      ]);
      
      return {
        total: stats[0].total[0]?.count || 0,
        conDatosFinancieros: stats[0].conDatosFinancieros[0]?.count || 0,
        conActivos: stats[0].conActivos[0]?.count || 0,
        conAnalisisRiesgo: stats[0].conAnalisisRiesgo[0]?.count || 0,
        promedioScore: stats[0].promedioScore[0]?.avg || null
      };
      
    } catch (error: any) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }
  
  /**
   * Valida si un legajo está completo (tiene todos los datos necesarios)
   */
  static async validateCompleteness(
    legajoId: string,
    organizationId: string
  ): Promise<{ isComplete: boolean; missingFields: string[] }> {
    try {
      const legajo = await this.findById(legajoId, organizationId);
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      const missingFields: string[] = [];
      
      if (legajo.fiscal_years.length === 0) {
        missingFields.push('fiscal_years');
      }
      
      if (legajo.assets.properties.length === 0 && 
          legajo.assets.vehicles.length === 0 && 
          legajo.assets.machinery.length === 0) {
        missingFields.push('assets');
      }
      
      if (legajo.documents.length === 0) {
        missingFields.push('documents');
      }
      
      return {
        isComplete: missingFields.length === 0,
        missingFields
      };
      
    } catch (error: any) {
      throw new Error(`Error validando completitud: ${error.message}`);
    }
  }
  
  /**
   * Verifica si una empresa ya tiene un legajo activo
   * Útil para evitar duplicados y aplicar regla de negocio: 1 Empresa → 1 Legajo
   */
  static async hasLegajo(
    companyId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      const existingLegajo = await Legajo.findOne({
        company_id: companyId,
        organization_id: organizationId,
        is_active: true
      });
      
      return !!existingLegajo;
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


