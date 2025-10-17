// COMENTADO: Tipos deshabilitados temporalmente por migración de Legajo
// import {
//     IBalanceSheet,
//     IFinancialRatios,
//     IFiscalYear,
//     IIncomeStatement,
//     IMetricsCalculationOptions,
//     IMetricsCalculationResult
// } from '../types/legajo.types'; // TODO: Verificar si estos tipos existen

// Definiciones temporales de tipos para evitar errores de compilación
type IBalanceSheet = any;
type IIncomeStatement = any;
type IFiscalYear = any;
type IFinancialRatios = any;
type IMetricsCalculationOptions = any;
type IMetricsCalculationResult = any;

/**
 * SERVICIO DE CÁLCULO DE MÉTRICAS FINANCIERAS
 * 
 * Calcula automáticamente todos los ratios financieros
 * a partir de los datos del balance y estado de resultados.
 * 
 * Incluye validaciones y manejo de edge cases.
 */

export class MetricsService {
  
  /**
   * Calcula todos los ratios financieros para un año fiscal
   */
  static calculateFinancialRatios(
    fiscalYear: IFiscalYear,
    options: IMetricsCalculationOptions = {}
  ): IMetricsCalculationResult {
    const {
      include_warnings = true,
      validate_equations = true,
      round_decimals = 4
    } = options;
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      const bs = fiscalYear.balance_sheet;
      const is = fiscalYear.income_statement;
      
      // Validar ecuación contable si está habilitado
      if (validate_equations) {
        const ecuacionErrors = this.validateAccountingEquations(bs, is);
        if (ecuacionErrors.length > 0) {
          errors.push(...ecuacionErrors);
        }
      }
      
      // Calcular ratios
      const ratios: IFinancialRatios = {
        // Ratios de Liquidez
        liquidez_corriente: this.calculateLiquidezCorriente(bs, warnings),
        prueba_acida: this.calculatePruebaAcida(bs, warnings),
        capital_trabajo: this.calculateCapitalTrabajo(bs),
        
        // Ratios de Endeudamiento
        ratio_endeudamiento: this.calculateRatioEndeudamiento(bs, warnings),
        ratio_autonomia: this.calculateRatioAutonomia(bs, warnings),
        ratio_solvencia: this.calculateRatioSolvencia(bs, warnings),
        endeudamiento_patrimonial: this.calculateEndeudamientoPatrimonial(bs, warnings),
        
        // Ratios de Rentabilidad
        roa: this.calculateROA(bs, is, warnings),
        roe: this.calculateROE(bs, is, warnings),
        margen_neto: this.calculateMargenNeto(is, warnings),
        margen_bruto: this.calculateMargenBruto(is, warnings),
        margen_operativo: this.calculateMargenOperativo(is, warnings),
        
        // Ratios de Eficiencia
        rotacion_activos: this.calculateRotacionActivos(bs, is, warnings),
        rotacion_activo_corriente: this.calculateRotacionActivoCorriente(bs, is, warnings),
        
        // Cobertura
        cobertura_intereses: this.calculateCoberturaIntereses(is, warnings),
        
        // Metadatos
        calculated_at: new Date(),
        calculation_warnings: include_warnings ? warnings : undefined
      };
      
      // Redondear decimales
      this.roundRatios(ratios, round_decimals);
      
      return {
        success: true,
        ratios,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error: any) {
      errors.push(`Error calculando métricas: ${error.message}`);
      return {
        success: false,
        errors
      };
    }
  }
  
  // ============================================
  // VALIDACIONES
  // ============================================
  
  /**
   * Valida las ecuaciones contables básicas
   */
  private static validateAccountingEquations(
    bs: IBalanceSheet,
    is: IIncomeStatement
  ): string[] {
    const errors: string[] = [];
    
    // Ecuación fundamental: Activo = Pasivo + Patrimonio
    const diferencia = Math.abs(bs.total_activo - (bs.total_pasivo + bs.total_patrimonio));
    if (diferencia > 1) { // Tolerancia de 1 peso por redondeos
      errors.push(
        `Ecuación contable no balanceada: ` +
        `Activo (${bs.total_activo}) ≠ Pasivo (${bs.total_pasivo}) + Patrimonio (${bs.total_patrimonio}). ` +
        `Diferencia: ${diferencia.toFixed(2)}`
      );
    }
    
    // Validar que activo corriente + no corriente = total activo
    if (bs.activo_corriente !== undefined && bs.activo_no_corriente !== undefined) {
      const sumaActivos = bs.activo_corriente + bs.activo_no_corriente;
      const difActivos = Math.abs(sumaActivos - bs.total_activo);
      if (difActivos > 1) {
        errors.push(
          `Suma de activos no coincide: ` +
          `Corriente (${bs.activo_corriente}) + No Corriente (${bs.activo_no_corriente}) ≠ Total (${bs.total_activo})`
        );
      }
    }
    
    // Validar que pasivo corriente + no corriente = total pasivo
    if (bs.pasivo_corriente !== undefined && bs.pasivo_no_corriente !== undefined) {
      const sumaPasivos = bs.pasivo_corriente + bs.pasivo_no_corriente;
      const difPasivos = Math.abs(sumaPasivos - bs.total_pasivo);
      if (difPasivos > 1) {
        errors.push(
          `Suma de pasivos no coincide: ` +
          `Corriente (${bs.pasivo_corriente}) + No Corriente (${bs.pasivo_no_corriente}) ≠ Total (${bs.total_pasivo})`
        );
      }
    }
    
    // Validar resultado bruto = ventas - costo de ventas
    const resultadoBrutoCalculado = is.ventas - is.costo_ventas;
    const difResultadoBruto = Math.abs(resultadoBrutoCalculado - is.resultado_bruto);
    if (difResultadoBruto > 1) {
      errors.push(
        `Resultado bruto incorrecto: ` +
        `Ventas (${is.ventas}) - Costo Ventas (${is.costo_ventas}) ≠ Resultado Bruto (${is.resultado_bruto})`
      );
    }
    
    return errors;
  }
  
  // ============================================
  // RATIOS DE LIQUIDEZ
  // ============================================
  
  /**
   * Liquidez Corriente = Activo Corriente / Pasivo Corriente
   * Indica la capacidad de la empresa para pagar sus deudas a corto plazo
   * Valor óptimo: > 1.5
   */
  private static calculateLiquidezCorriente(
    bs: IBalanceSheet,
    warnings: string[]
  ): number {
    if (bs.pasivo_corriente === 0) {
      warnings.push('Pasivo corriente es 0, ratio de liquidez no calculable con precisión');
      return 999; // Valor muy alto si no hay pasivos corrientes
    }
    
    const ratio = bs.activo_corriente / bs.pasivo_corriente;
    
    if (ratio < 1) {
      warnings.push(`Liquidez corriente baja (${ratio.toFixed(2)}): la empresa podría tener dificultades para pagar deudas a corto plazo`);
    } else if (ratio > 3) {
      warnings.push(`Liquidez corriente muy alta (${ratio.toFixed(2)}): podría indicar activos ociosos`);
    }
    
    return ratio;
  }
  
  /**
   * Prueba Ácida = (Activo Corriente - Inventarios) / Pasivo Corriente
   * Versión más conservadora de liquidez
   * Nota: En este modelo simplificado, no tenemos inventarios separados
   */
  private static calculatePruebaAcida(
    bs: IBalanceSheet,
    warnings: string[]
  ): number | undefined {
    if (bs.pasivo_corriente === 0) {
      return undefined;
    }
    
    // Como no tenemos inventarios separados, usamos 70% del activo corriente como aproximación
    const activoLiquido = bs.activo_corriente * 0.7;
    return activoLiquido / bs.pasivo_corriente;
  }
  
  /**
   * Capital de Trabajo = Activo Corriente - Pasivo Corriente
   * Recursos disponibles para operaciones
   */
  private static calculateCapitalTrabajo(bs: IBalanceSheet): number {
    return bs.activo_corriente - bs.pasivo_corriente;
  }
  
  // ============================================
  // RATIOS DE ENDEUDAMIENTO
  // ============================================
  
  /**
   * Ratio de Endeudamiento = Total Pasivo / Total Activo
   * Indica el % de activos financiados con deuda
   * Valor óptimo: < 0.5 (50%)
   */
  private static calculateRatioEndeudamiento(
    bs: IBalanceSheet,
    warnings: string[]
  ): number {
    if (bs.total_activo === 0) {
      warnings.push('Total activo es 0, ratio de endeudamiento no calculable');
      return 0;
    }
    
    const ratio = bs.total_pasivo / bs.total_activo;
    
    if (ratio > 0.7) {
      warnings.push(`Endeudamiento alto (${(ratio * 100).toFixed(1)}%): la empresa tiene mucha deuda`);
    } else if (ratio > 0.5) {
      warnings.push(`Endeudamiento moderado-alto (${(ratio * 100).toFixed(1)}%)`);
    }
    
    return ratio;
  }
  
  /**
   * Ratio de Autonomía = Patrimonio Neto / Total Activo
   * Indica el % de activos financiados con capital propio
   * Valor óptimo: > 0.5 (50%)
   */
  private static calculateRatioAutonomia(
    bs: IBalanceSheet,
    warnings: string[]
  ): number {
    if (bs.total_activo === 0) {
      warnings.push('Total activo es 0, ratio de autonomía no calculable');
      return 0;
    }
    
    return bs.total_patrimonio / bs.total_activo;
  }
  
  /**
   * Ratio de Solvencia = Total Activo / Total Pasivo
   * Capacidad de cubrir todas las deudas con los activos
   * Valor óptimo: > 1.5
   */
  private static calculateRatioSolvencia(
    bs: IBalanceSheet,
    warnings: string[]
  ): number | undefined {
    if (bs.total_pasivo === 0) {
      return undefined; // Excelente, no hay deudas
    }
    
    const ratio = bs.total_activo / bs.total_pasivo;
    
    if (ratio < 1.2) {
      warnings.push(`Solvencia baja (${ratio.toFixed(2)}): activos apenas cubren pasivos`);
    }
    
    return ratio;
  }
  
  /**
   * Endeudamiento Patrimonial = Total Pasivo / Patrimonio Neto
   * Por cada peso de patrimonio, cuánto de deuda
   * Valor óptimo: < 1
   */
  private static calculateEndeudamientoPatrimonial(
    bs: IBalanceSheet,
    warnings: string[]
  ): number | undefined {
    if (bs.total_patrimonio === 0 || bs.total_patrimonio < 0) {
      warnings.push('Patrimonio neto es 0 o negativo, endeudamiento patrimonial no calculable');
      return undefined;
    }
    
    const ratio = bs.total_pasivo / bs.total_patrimonio;
    
    if (ratio > 2) {
      warnings.push(`Endeudamiento patrimonial muy alto (${ratio.toFixed(2)}): deuda es más del doble del patrimonio`);
    }
    
    return ratio;
  }
  
  // ============================================
  // RATIOS DE RENTABILIDAD
  // ============================================
  
  /**
   * ROA (Return on Assets) = Resultado del Ejercicio / Total Activo
   * Rentabilidad sobre activos
   * Valor óptimo: > 5%
   */
  private static calculateROA(
    bs: IBalanceSheet,
    is: IIncomeStatement,
    warnings: string[]
  ): number {
    if (bs.total_activo === 0) {
      warnings.push('Total activo es 0, ROA no calculable');
      return 0;
    }
    
    const roa = is.resultado_del_ejercicio / bs.total_activo;
    
    if (roa < 0) {
      warnings.push(`ROA negativo (${(roa * 100).toFixed(2)}%): la empresa tuvo pérdidas`);
    } else if (roa < 0.03) {
      warnings.push(`ROA bajo (${(roa * 100).toFixed(2)}%): rentabilidad sobre activos es baja`);
    }
    
    return roa;
  }
  
  /**
   * ROE (Return on Equity) = Resultado del Ejercicio / Patrimonio Neto
   * Rentabilidad sobre capital propio
   * Valor óptimo: > 10%
   */
  private static calculateROE(
    bs: IBalanceSheet,
    is: IIncomeStatement,
    warnings: string[]
  ): number {
    if (bs.total_patrimonio === 0 || bs.total_patrimonio < 0) {
      warnings.push('Patrimonio neto es 0 o negativo, ROE no calculable');
      return 0;
    }
    
    const roe = is.resultado_del_ejercicio / bs.total_patrimonio;
    
    if (roe < 0) {
      warnings.push(`ROE negativo (${(roe * 100).toFixed(2)}%): pérdida sobre el capital`);
    } else if (roe < 0.08) {
      warnings.push(`ROE bajo (${(roe * 100).toFixed(2)}%): rentabilidad sobre patrimonio es baja`);
    }
    
    return roe;
  }
  
  /**
   * Margen Neto = Resultado del Ejercicio / Ventas
   * % de ganancia sobre ventas
   * Valor óptimo: > 10%
   */
  private static calculateMargenNeto(
    is: IIncomeStatement,
    warnings: string[]
  ): number {
    if (is.ventas === 0) {
      warnings.push('Ventas son 0, margen neto no calculable');
      return 0;
    }
    
    const margen = is.resultado_del_ejercicio / is.ventas;
    
    if (margen < 0) {
      warnings.push(`Margen neto negativo (${(margen * 100).toFixed(2)}%): pérdidas`);
    } else if (margen < 0.05) {
      warnings.push(`Margen neto bajo (${(margen * 100).toFixed(2)}%)`);
    }
    
    return margen;
  }
  
  /**
   * Margen Bruto = Resultado Bruto / Ventas
   * % de ganancia bruta sobre ventas
   * Valor óptimo: > 30%
   */
  private static calculateMargenBruto(
    is: IIncomeStatement,
    warnings: string[]
  ): number {
    if (is.ventas === 0) {
      warnings.push('Ventas son 0, margen bruto no calculable');
      return 0;
    }
    
    const margen = is.resultado_bruto / is.ventas;
    
    if (margen < 0.2) {
      warnings.push(`Margen bruto bajo (${(margen * 100).toFixed(2)}%): costos muy altos`);
    }
    
    return margen;
  }
  
  /**
   * Margen Operativo = Resultado Operativo / Ventas
   */
  private static calculateMargenOperativo(
    is: IIncomeStatement,
    warnings: string[]
  ): number | undefined {
    if (!is.resultado_operativo || is.ventas === 0) {
      return undefined;
    }
    
    return is.resultado_operativo / is.ventas;
  }
  
  // ============================================
  // RATIOS DE EFICIENCIA
  // ============================================
  
  /**
   * Rotación de Activos = Ventas / Total Activo
   * Cuántas veces se "rotan" los activos en ventas
   * Valor óptimo: depende del sector
   */
  private static calculateRotacionActivos(
    bs: IBalanceSheet,
    is: IIncomeStatement,
    warnings: string[]
  ): number | undefined {
    if (bs.total_activo === 0) {
      return undefined;
    }
    
    const rotacion = is.ventas / bs.total_activo;
    
    if (rotacion < 0.5) {
      warnings.push(`Rotación de activos baja (${rotacion.toFixed(2)}): activos poco productivos`);
    }
    
    return rotacion;
  }
  
  /**
   * Rotación de Activo Corriente = Ventas / Activo Corriente
   */
  private static calculateRotacionActivoCorriente(
    bs: IBalanceSheet,
    is: IIncomeStatement,
    warnings: string[]
  ): number | undefined {
    if (bs.activo_corriente === 0) {
      return undefined;
    }
    
    return is.ventas / bs.activo_corriente;
  }
  
  // ============================================
  // RATIOS DE COBERTURA
  // ============================================
  
  /**
   * Cobertura de Intereses = (Resultado antes de intereses e impuestos) / Gastos Financieros
   * Capacidad de cubrir intereses con utilidades
   * Valor óptimo: > 2.5
   */
  private static calculateCoberturaIntereses(
    is: IIncomeStatement,
    warnings: string[]
  ): number | undefined {
    if (is.gastos_financieros === 0) {
      return undefined; // No hay gastos financieros
    }
    
    // EBIT = Resultado antes de impuestos + Gastos financieros
    const ebit = is.resultado_antes_impuestos + is.gastos_financieros;
    const cobertura = ebit / is.gastos_financieros;
    
    if (cobertura < 1.5) {
      warnings.push(`Cobertura de intereses baja (${cobertura.toFixed(2)}): dificultad para pagar intereses`);
    }
    
    return cobertura;
  }
  
  // ============================================
  // UTILIDADES
  // ============================================
  
  /**
   * Redondea todos los ratios al número de decimales especificado
   */
  private static roundRatios(ratios: IFinancialRatios, decimals: number): void {
    const keys = Object.keys(ratios) as (keyof IFinancialRatios)[];
    
    for (const key of keys) {
      const value = ratios[key];
      if (typeof value === 'number') {
        (ratios[key] as any) = parseFloat(value.toFixed(decimals));
      }
    }
  }
  
  /**
   * Interpreta un ratio y devuelve una calificación
   * @returns 'excelente' | 'bueno' | 'regular' | 'malo'
   */
  static interpretarRatio(
    ratioName: keyof IFinancialRatios,
    value: number
  ): string {
    // Tabla de interpretación por ratio
    const interpretaciones: Record<string, any> = {
      liquidez_corriente: [
        { min: 2.0, nivel: 'excelente' },
        { min: 1.5, nivel: 'bueno' },
        { min: 1.0, nivel: 'regular' },
        { min: 0, nivel: 'malo' }
      ],
      ratio_endeudamiento: [
        { max: 0.3, nivel: 'excelente' },
        { max: 0.5, nivel: 'bueno' },
        { max: 0.7, nivel: 'regular' },
        { max: 1.0, nivel: 'malo' }
      ],
      roa: [
        { min: 0.10, nivel: 'excelente' },
        { min: 0.05, nivel: 'bueno' },
        { min: 0.02, nivel: 'regular' },
        { min: -999, nivel: 'malo' }
      ],
      roe: [
        { min: 0.15, nivel: 'excelente' },
        { min: 0.10, nivel: 'bueno' },
        { min: 0.05, nivel: 'regular' },
        { min: -999, nivel: 'malo' }
      ],
      margen_neto: [
        { min: 0.15, nivel: 'excelente' },
        { min: 0.10, nivel: 'bueno' },
        { min: 0.05, nivel: 'regular' },
        { min: -999, nivel: 'malo' }
      ]
    };
    
    const tabla = interpretaciones[ratioName as keyof typeof interpretaciones];
    if (!tabla) return 'regular';
    
    // Buscar nivel correspondiente
    for (const rango of tabla) {
      if (rango.min !== undefined && value >= rango.min) {
        return rango.nivel;
      }
      if (rango.max !== undefined && value <= rango.max) {
        return rango.nivel;
      }
    }
    
    return 'regular';
  }
}

export default MetricsService;
