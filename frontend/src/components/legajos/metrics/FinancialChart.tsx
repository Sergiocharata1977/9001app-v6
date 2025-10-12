'use client';

import { FiscalYear } from '@/types/legajo';
import React, { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface FinancialChartProps {
  fiscalYears: FiscalYear[];
  type?: 'line' | 'bar';
}

/**
 * Gráfico de evolución de ratios financieros
 */
const FinancialChart: React.FC<FinancialChartProps> = ({
  fiscalYears,
  type = 'line'
}) => {
  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    return fiscalYears
      .filter(fy => fy.ratios) // Solo años con ratios calculados
      .map(fy => ({
        year: fy.year.toString(),
        'Liquidez': fy.ratios!.liquidez_corriente,
        'ROA (%)': fy.ratios!.roa * 100,
        'ROE (%)': fy.ratios!.roe * 100,
        'Endeudamiento (%)': fy.ratios!.ratio_endeudamiento * 100,
        'Margen Neto (%)': fy.ratios!.margen_neto * 100
      }));
  }, [fiscalYears]);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No hay datos suficientes para mostrar gráficos
      </div>
    );
  }

  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <div className="space-y-6">
      {/* Gráfico de Liquidez */}
      <div>
        <h4 className="text-sm font-medium mb-4">Liquidez Corriente</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {type === 'line' ? (
              <Line 
                type="monotone" 
                dataKey="Liquidez" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ) : (
              <Bar dataKey="Liquidez" fill="#10b981" />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Rentabilidad */}
      <div>
        <h4 className="text-sm font-medium mb-4">Rentabilidad</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {type === 'line' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="ROA (%)" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ROE (%)" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </>
            ) : (
              <>
                <Bar dataKey="ROA (%)" fill="#3b82f6" />
                <Bar dataKey="ROE (%)" fill="#8b5cf6" />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Endeudamiento */}
      <div>
        <h4 className="text-sm font-medium mb-4">Endeudamiento</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {type === 'line' ? (
              <Line 
                type="monotone" 
                dataKey="Endeudamiento (%)" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ) : (
              <Bar dataKey="Endeudamiento (%)" fill="#ef4444" />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;

