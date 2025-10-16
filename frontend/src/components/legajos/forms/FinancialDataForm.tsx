'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FiscalYear } from '@/types/legajo';
import { AlertTriangle, Calculator } from 'lucide-react';
import React, { useState } from 'react';

interface FinancialDataFormProps {
  initialData?: FiscalYear;
  onSubmit: (data: FiscalYear) => void;
  onCancel?: () => void;
}

/**
 * Formulario para cargar datos financieros (Balance + Estado de Resultados)
 * Incluye validaciones en tiempo real y cálculo automático de campos dependientes
 */
const FinancialDataForm: React.FC<FinancialDataFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  
  // Balance Sheet
  const [activoCorriente, setActivoCorriente] = useState(initialData?.balance_sheet.activo_corriente || 0);
  const [activoNoCorriente, setActivoNoCorriente] = useState(initialData?.balance_sheet.activo_no_corriente || 0);
  const [pasivoCorriente, setPasivoCorriente] = useState(initialData?.balance_sheet.pasivo_corriente || 0);
  const [pasivoNoCorriente, setPasivoNoCorriente] = useState(initialData?.balance_sheet.pasivo_no_corriente || 0);
  
  // Income Statement
  const [ventas, setVentas] = useState(initialData?.income_statement.ventas || 0);
  const [costoVentas, setCostoVentas] = useState(initialData?.income_statement.costo_ventas || 0);
  const [gastosAdmin, setGastosAdmin] = useState(initialData?.income_statement.gastos_administracion || 0);
  const [gastosComercial, setGastosComercial] = useState(initialData?.income_statement.gastos_comercializacion || 0);
  const [gastosFinancieros, setGastosFinancieros] = useState(initialData?.income_statement.gastos_financieros || 0);
  const [impuestos, setImpuestos] = useState(initialData?.income_statement.impuestos || 0);
  
  const [observaciones, setObservaciones] = useState(initialData?.observaciones || '');
  
  const [errors, setErrors] = useState<string[]>([]);

  // Cálculos automáticos
  const totalActivo = activoCorriente + activoNoCorriente;
  const totalPasivo = pasivoCorriente + pasivoNoCorriente;
  const totalPatrimonio = totalActivo - totalPasivo;
  
  const resultadoBruto = ventas - costoVentas;
  const totalGastos = gastosAdmin + gastosComercial + gastosFinancieros;
  const resultadoAntesImpuestos = resultadoBruto - totalGastos;
  const resultadoEjercicio = resultadoAntesImpuestos - impuestos;

  // Validar ecuación contable
  const ecuacionBalanceada = Math.abs(totalActivo - (totalPasivo + totalPatrimonio)) <= 1;

  // Manejar envío
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    
    // Validaciones
    if (year < 1900 || year > 2100) {
      newErrors.push('Año debe estar entre 1900 y 2100');
    }
    
    if (totalActivo <= 0) {
      newErrors.push('Total de activos debe ser mayor a 0');
    }
    
    if (!ecuacionBalanceada) {
      newErrors.push('La ecuación contable no está balanceada (Activo = Pasivo + Patrimonio)');
    }
    
    if (ventas < 0) {
      newErrors.push('Ventas no pueden ser negativas');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Construir objeto FiscalYear
    const fiscalYear: FiscalYear = {
      year,
      balance_sheet: {
        activo_corriente: activoCorriente,
        activo_no_corriente: activoNoCorriente,
        total_activo: totalActivo,
        pasivo_corriente: pasivoCorriente,
        pasivo_no_corriente: pasivoNoCorriente,
        total_pasivo: totalPasivo,
        total_patrimonio: totalPatrimonio
      },
      income_statement: {
        ventas,
        costo_ventas: costoVentas,
        resultado_bruto: resultadoBruto,
        gastos_administracion: gastosAdmin,
        gastos_comercializacion: gastosComercial,
        gastos_financieros: gastosFinancieros,
        resultado_antes_impuestos: resultadoAntesImpuestos,
        impuestos,
        resultado_del_ejercicio: resultadoEjercicio
      },
      declarations: initialData?.declarations || [],
      observaciones
    };
    
    onSubmit(fiscalYear);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Errores */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Año */}
      <Card>
        <CardHeader>
          <CardTitle>Año Fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="year">Año</Label>
          <Input
            id="year"
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            required
          />
        </CardContent>
      </Card>

      {/* Balance General */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Balance General</CardTitle>
          <CardDescription>Estado de Situación Patrimonial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activos */}
          <div>
            <h4 className="font-medium mb-3">ACTIVOS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activo_corriente">Activo Corriente</Label>
                <Input
                  id="activo_corriente"
                  type="number"
                  min={0}
                  step={0.01}
                  value={activoCorriente}
                  onChange={(e) => setActivoCorriente(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="activo_no_corriente">Activo No Corriente</Label>
                <Input
                  id="activo_no_corriente"
                  type="number"
                  min={0}
                  step={0.01}
                  value={activoNoCorriente}
                  onChange={(e) => setActivoNoCorriente(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                <Calculator className="inline w-4 h-4 mr-1" />
                Total Activo: ${totalActivo.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Pasivos */}
          <div>
            <h4 className="font-medium mb-3">PASIVOS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pasivo_corriente">Pasivo Corriente</Label>
                <Input
                  id="pasivo_corriente"
                  type="number"
                  min={0}
                  step={0.01}
                  value={pasivoCorriente}
                  onChange={(e) => setPasivoCorriente(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pasivo_no_corriente">Pasivo No Corriente</Label>
                <Input
                  id="pasivo_no_corriente"
                  type="number"
                  min={0}
                  step={0.01}
                  value={pasivoNoCorriente}
                  onChange={(e) => setPasivoNoCorriente(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                <Calculator className="inline w-4 h-4 mr-1" />
                Total Pasivo: ${totalPasivo.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Patrimonio Neto (calculado) */}
          <div className={`p-4 rounded-md ${ecuacionBalanceada ? 'bg-green-50' : 'bg-red-50'}`}>
            <h4 className="font-medium mb-2">PATRIMONIO NETO (Calculado)</h4>
            <p className="text-2xl font-bold mb-1">
              ${totalPatrimonio.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Activo ({totalActivo.toLocaleString()}) - Pasivo ({totalPasivo.toLocaleString()})
            </p>
            {!ecuacionBalanceada && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Ecuación contable no balanceada
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>💵 Estado de Resultados</CardTitle>
          <CardDescription>Ingresos y egresos del período</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ventas y Costos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ventas">Ventas</Label>
              <Input
                id="ventas"
                type="number"
                min={0}
                step={0.01}
                value={ventas}
                onChange={(e) => setVentas(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="costo_ventas">Costo de Ventas</Label>
              <Input
                id="costo_ventas"
                type="number"
                min={0}
                step={0.01}
                value={costoVentas}
                onChange={(e) => setCostoVentas(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              <Calculator className="inline w-4 h-4 mr-1" />
              Resultado Bruto: ${resultadoBruto.toLocaleString()}
            </p>
          </div>

          {/* Gastos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gastos_admin">Gastos Administrativos</Label>
              <Input
                id="gastos_admin"
                type="number"
                min={0}
                step={0.01}
                value={gastosAdmin}
                onChange={(e) => setGastosAdmin(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="gastos_comercial">Gastos Comerciales</Label>
              <Input
                id="gastos_comercial"
                type="number"
                min={0}
                step={0.01}
                value={gastosComercial}
                onChange={(e) => setGastosComercial(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="gastos_financieros">Gastos Financieros</Label>
              <Input
                id="gastos_financieros"
                type="number"
                min={0}
                step={0.01}
                value={gastosFinancieros}
                onChange={(e) => setGastosFinancieros(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              <Calculator className="inline w-4 h-4 mr-1" />
              Resultado antes de Impuestos: ${resultadoAntesImpuestos.toLocaleString()}
            </p>
          </div>

          {/* Impuestos */}
          <div>
            <Label htmlFor="impuestos">Impuestos</Label>
            <Input
              id="impuestos"
              type="number"
              min={0}
              step={0.01}
              value={impuestos}
              onChange={(e) => setImpuestos(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="p-4 bg-green-50 rounded-md">
            <h4 className="font-medium mb-1">Resultado del Ejercicio (Calculado)</h4>
            <p className="text-2xl font-bold">
              ${resultadoEjercicio.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones adicionales sobre este período fiscal..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={!ecuacionBalanceada}>
          <Calculator className="w-4 h-4 mr-2" />
          Guardar y Calcular Ratios
        </Button>
      </div>
    </form>
  );
};

export default FinancialDataForm;

















