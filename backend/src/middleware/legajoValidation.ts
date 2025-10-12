import { NextFunction, Request, Response } from 'express';
import { ICreateLegajoDTO, IFiscalYear, IUpdateLegajoDTO } from '../types/legajo.types';

/**
 * MIDDLEWARE DE VALIDACIÓN PARA LEGAJOS
 * 
 * Valida datos de entrada antes de procesarlos
 */

/**
 * Valida datos para crear un legajo
 */
export const validateLegajoCreate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const data: ICreateLegajoDTO = req.body;
    
    // Campos requeridos
    if (!data.company_id) {
      res.status(400).json({ error: 'company_id es requerido' });
      return;
    }
    
    // Validar años fiscales si existen
    if (data.fiscal_years && data.fiscal_years.length > 0) {
      for (const fiscalYear of data.fiscal_years) {
        const errors = validateFiscalYearData(fiscalYear);
        if (errors.length > 0) {
          res.status(400).json({ error: 'Datos fiscales inválidos', details: errors });
          return;
        }
      }
    }
    
    next();
    
  } catch (error: any) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: error.message });
  }
};

/**
 * Valida datos para actualizar un legajo
 */
export const validateLegajoUpdate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const data: IUpdateLegajoDTO = req.body;
    
    // Validar años fiscales si se están actualizando
    if (data.fiscal_years && data.fiscal_years.length > 0) {
      for (const fiscalYear of data.fiscal_years) {
        const errors = validateFiscalYearData(fiscalYear);
        if (errors.length > 0) {
          res.status(400).json({ error: 'Datos fiscales inválidos', details: errors });
          return;
        }
      }
    }
    
    next();
    
  } catch (error: any) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: error.message });
  }
};

/**
 * Valida un año fiscal
 */
export const validateFiscalYear = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const fiscalYear: IFiscalYear = req.body;
    
    const errors = validateFiscalYearData(fiscalYear);
    if (errors.length > 0) {
      res.status(400).json({ error: 'Datos fiscales inválidos', details: errors });
      return;
    }
    
    next();
    
  } catch (error: any) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: error.message });
  }
};

/**
 * Función helper para validar datos de año fiscal
 */
function validateFiscalYearData(fiscalYear: IFiscalYear): string[] {
  const errors: string[] = [];
  
  // Validar año
  if (!fiscalYear.year || fiscalYear.year < 1900 || fiscalYear.year > 2100) {
    errors.push('Año inválido (debe estar entre 1900 y 2100)');
  }
  
  // Validar balance sheet
  if (!fiscalYear.balance_sheet) {
    errors.push('balance_sheet es requerido');
  } else {
    const bs = fiscalYear.balance_sheet;
    
    // Validar campos requeridos
    if (bs.activo_corriente === undefined) errors.push('activo_corriente es requerido');
    if (bs.activo_no_corriente === undefined) errors.push('activo_no_corriente es requerido');
    if (bs.total_activo === undefined) errors.push('total_activo es requerido');
    if (bs.pasivo_corriente === undefined) errors.push('pasivo_corriente es requerido');
    if (bs.pasivo_no_corriente === undefined) errors.push('pasivo_no_corriente es requerido');
    if (bs.total_pasivo === undefined) errors.push('total_pasivo es requerido');
    if (bs.total_patrimonio === undefined) errors.push('total_patrimonio es requerido');
    
    // Validar que no haya valores negativos donde no debería
    if (bs.activo_corriente !== undefined && bs.activo_corriente < 0) {
      errors.push('activo_corriente no puede ser negativo');
    }
    if (bs.activo_no_corriente !== undefined && bs.activo_no_corriente < 0) {
      errors.push('activo_no_corriente no puede ser negativo');
    }
    if (bs.total_activo !== undefined && bs.total_activo < 0) {
      errors.push('total_activo no puede ser negativo');
    }
    if (bs.pasivo_corriente !== undefined && bs.pasivo_corriente < 0) {
      errors.push('pasivo_corriente no puede ser negativo');
    }
    if (bs.pasivo_no_corriente !== undefined && bs.pasivo_no_corriente < 0) {
      errors.push('pasivo_no_corriente no puede ser negativo');
    }
    if (bs.total_pasivo !== undefined && bs.total_pasivo < 0) {
      errors.push('total_pasivo no puede ser negativo');
    }
    
    // Validar ecuación contable
    if (bs.total_activo !== undefined && bs.total_pasivo !== undefined && bs.total_patrimonio !== undefined) {
      const diferencia = Math.abs(bs.total_activo - (bs.total_pasivo + bs.total_patrimonio));
      if (diferencia > 1) { // Tolerancia de 1 peso
        errors.push(
          `Ecuación contable no balanceada: ` +
          `Activo (${bs.total_activo}) ≠ Pasivo (${bs.total_pasivo}) + Patrimonio (${bs.total_patrimonio})`
        );
      }
    }
  }
  
  // Validar income statement
  if (!fiscalYear.income_statement) {
    errors.push('income_statement es requerido');
  } else {
    const is = fiscalYear.income_statement;
    
    // Validar campos requeridos
    if (is.ventas === undefined) errors.push('ventas es requerido');
    if (is.costo_ventas === undefined) errors.push('costo_ventas es requerido');
    if (is.resultado_bruto === undefined) errors.push('resultado_bruto es requerido');
    if (is.gastos_administracion === undefined) errors.push('gastos_administracion es requerido');
    if (is.gastos_comercializacion === undefined) errors.push('gastos_comercializacion es requerido');
    if (is.gastos_financieros === undefined) errors.push('gastos_financieros es requerido');
    if (is.resultado_antes_impuestos === undefined) errors.push('resultado_antes_impuestos es requerido');
    if (is.impuestos === undefined) errors.push('impuestos es requerido');
    if (is.resultado_del_ejercicio === undefined) errors.push('resultado_del_ejercicio es requerido');
    
    // Validar que ventas y costos no sean negativos
    if (is.ventas !== undefined && is.ventas < 0) {
      errors.push('ventas no puede ser negativo');
    }
    if (is.costo_ventas !== undefined && is.costo_ventas < 0) {
      errors.push('costo_ventas no puede ser negativo');
    }
    if (is.gastos_administracion !== undefined && is.gastos_administracion < 0) {
      errors.push('gastos_administracion no puede ser negativo');
    }
    if (is.gastos_comercializacion !== undefined && is.gastos_comercializacion < 0) {
      errors.push('gastos_comercializacion no puede ser negativo');
    }
    if (is.gastos_financieros !== undefined && is.gastos_financieros < 0) {
      errors.push('gastos_financieros no puede ser negativo');
    }
    if (is.impuestos !== undefined && is.impuestos < 0) {
      errors.push('impuestos no puede ser negativo');
    }
    
    // Validar resultado bruto = ventas - costo de ventas
    if (is.ventas !== undefined && is.costo_ventas !== undefined && is.resultado_bruto !== undefined) {
      const resultadoBrutoCalculado = is.ventas - is.costo_ventas;
      const diferencia = Math.abs(resultadoBrutoCalculado - is.resultado_bruto);
      if (diferencia > 1) {
        errors.push(
          `Resultado bruto incorrecto: ` +
          `Ventas (${is.ventas}) - Costo Ventas (${is.costo_ventas}) ≠ Resultado Bruto (${is.resultado_bruto})`
        );
      }
    }
  }
  
  return errors;
}


