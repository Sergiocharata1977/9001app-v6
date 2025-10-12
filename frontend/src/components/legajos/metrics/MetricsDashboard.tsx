'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LegajoService from '@/services/legajoService';
import { Legajo, LegajoMetrics } from '@/types/legajo';
import React from 'react';
import FinancialChart from './FinancialChart';
import RatioCard from './RatioCard';

interface MetricsDashboardProps {
  legajo: Legajo;
  metrics?: LegajoMetrics;
  showCharts?: boolean;
  showComparison?: boolean;
}

/**
 * Dashboard principal de métricas financieras
 * Muestra todos los ratios calculados automáticamente
 */
const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  legajo,
  metrics,
  showCharts = true,
  showComparison = false
}) => {
  const latestYear = legajo.fiscal_years[legajo.fiscal_years.length - 1];
  const ratios = latestYear?.ratios;

  if (!ratios) {
    return (
      <Alert>
        <AlertDescription>
          No hay ratios financieros calculados. Agrega datos financieros para ver las métricas.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Financieras - Año {latestYear.year}</CardTitle>
          <CardDescription>
            Ratios calculados automáticamente a partir del balance y estado de resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ratios.calculation_warnings && ratios.calculation_warnings.length > 0 && (
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Advertencias:</strong>
                <ul className="list-disc list-inside mt-2">
                  {ratios.calculation_warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Ratios de Liquidez */}
      <Card>
        <CardHeader>
          <CardTitle>💧 Ratios de Liquidez</CardTitle>
          <CardDescription>
            Capacidad de la empresa para pagar deudas a corto plazo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RatioCard
              title="Liquidez Corriente"
              value={ratios.liquidez_corriente}
              ratioName="liquidez_corriente"
              description="Activo Corriente / Pasivo Corriente"
              format="ratio"
            />
            {ratios.prueba_acida && (
              <RatioCard
                title="Prueba Ácida"
                value={ratios.prueba_acida}
                ratioName="liquidez_corriente"
                description="(Act. Corriente - Inventarios) / Pas. Corriente"
                format="ratio"
              />
            )}
            <RatioCard
              title="Capital de Trabajo"
              value={ratios.capital_trabajo}
              description="Activo Corriente - Pasivo Corriente"
              format="currency"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ratios de Endeudamiento */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Ratios de Endeudamiento</CardTitle>
          <CardDescription>
            Nivel de deuda de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RatioCard
              title="Ratio de Endeudamiento"
              value={ratios.ratio_endeudamiento}
              ratioName="ratio_endeudamiento"
              description="Total Pasivo / Total Activo"
              format="percentage"
            />
            <RatioCard
              title="Ratio de Autonomía"
              value={ratios.ratio_autonomia}
              description="Patrimonio Neto / Total Activo"
              format="percentage"
            />
            {ratios.ratio_solvencia && (
              <RatioCard
                title="Ratio de Solvencia"
                value={ratios.ratio_solvencia}
                description="Total Activo / Total Pasivo"
                format="ratio"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ratios de Rentabilidad */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Ratios de Rentabilidad</CardTitle>
          <CardDescription>
            Capacidad de generar ganancias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <RatioCard
              title="ROA"
              value={ratios.roa}
              ratioName="roa"
              description="Rentabilidad sobre Activos"
              format="percentage"
            />
            <RatioCard
              title="ROE"
              value={ratios.roe}
              ratioName="roe"
              description="Rentabilidad sobre Patrimonio"
              format="percentage"
            />
            <RatioCard
              title="Margen Neto"
              value={ratios.margen_neto}
              ratioName="margen_neto"
              description="Resultado / Ventas"
              format="percentage"
            />
            <RatioCard
              title="Margen Bruto"
              value={ratios.margen_bruto}
              ratioName="margen_bruto"
              description="Res. Bruto / Ventas"
              format="percentage"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      {showCharts && legajo.fiscal_years.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>📈 Evolución Temporal</CardTitle>
            <CardDescription>
              Comparación de ratios a través de los años
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialChart fiscalYears={legajo.fiscal_years} />
          </CardContent>
        </Card>
      )}

      {/* Resumen de Activos Patrimoniales */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>🏠 Activos Patrimoniales</CardTitle>
            <CardDescription>
              Resumen de propiedades, vehículos y maquinaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Activos</p>
                <p className="text-2xl font-bold">
                  {LegajoService.formatCurrency(metrics.total_activos_patrimonio)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Propiedades</p>
                <p className="text-2xl font-bold">{metrics.total_propiedades}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Vehículos</p>
                <p className="text-2xl font-bold">{metrics.total_vehiculos}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Maquinaria</p>
                <p className="text-2xl font-bold">{metrics.total_maquinaria}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetricsDashboard;

