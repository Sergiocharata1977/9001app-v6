'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Plus,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import api from '@/lib/api';

interface Medicion {
  id: string;
  indicadorId: string;
  indicadorNombre: string;
  valor: number;
  fecha: string;
  responsable: string;
  observaciones?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

interface ProcessMedicionesTabProps {
  processId: string;
}

export function ProcessMedicionesTab({ processId }: ProcessMedicionesTabProps) {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  useEffect(() => {
    loadMediciones();
  }, [processId]);

  const loadMediciones = async () => {
    try {
      setLoading(true);
      // First get indicators for this process
      const indicatorsResponse = await api.get(`/quality-indicators?process_definition_id=${processId}&organization_id=1`);
      if (!indicatorsResponse.data.success) {
        console.error('Error cargando indicadores');
        setMediciones([]);
        return;
      }

      const indicators = indicatorsResponse.data.data || [];

      // Then get measurements for each indicator
      const allMediciones: Medicion[] = [];
      for (const indicator of indicators) {
        try {
          const measurementsResponse = await api.get(`/measurements/indicator/${indicator._id}`);
          if (measurementsResponse.data.success) {
            const measurements = measurementsResponse.data.data || [];
            // Add indicator name to each measurement
            const medicionesWithIndicator = measurements.map((med: any) => ({
              ...med,
              indicadorNombre: indicator.name,
              indicadorId: indicator._id
            }));
            allMediciones.push(...medicionesWithIndicator);
          }
        } catch (error) {
          console.error(`Error cargando mediciones para indicador ${indicator._id}:`, error);
        }
      }

      setMediciones(allMediciones);
    } catch (error) {
      console.error('Error cargando mediciones:', error);
      setMediciones([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const medicionesFiltradas = filterEstado === 'todos' 
    ? mediciones 
    : mediciones.filter(m => m.estado === filterEstado);

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mediciones</h2>
            <p className="text-sm text-gray-600 mt-1">
              Registro de mediciones de indicadores del proceso
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filtro por estado */}
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Medición
            </Button>
          </div>
        </div>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mediciones</p>
              <p className="text-2xl font-bold text-gray-900">{mediciones.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mediciones.filter(m => m.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">
                {mediciones.filter(m => m.estado === 'aprobado').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de mediciones */}
      {medicionesFiltradas.length === 0 ? (
        <Card className="p-12 text-center">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filterEstado === 'todos' 
              ? 'No hay mediciones registradas'
              : `No hay mediciones en estado "${filterEstado}"`
            }
          </h3>
          <p className="text-gray-600 mb-4">
            Registra la primera medición para este proceso
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Primera Medición
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Indicador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Medido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicionesFiltradas.map(medicion => (
                <tr key={medicion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {medicion.indicadorNombre}
                    </div>
                    {medicion.observaciones && (
                      <div className="text-xs text-gray-500 mt-1">
                        {medicion.observaciones.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-blue-600">
                      {medicion.valor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(medicion.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <User className="h-4 w-4 text-gray-400" />
                      {medicion.responsable}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getEstadoBadge(medicion.estado)}>
                      {getEstadoLabel(medicion.estado)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">Ver</Button>
                      {medicion.estado === 'pendiente' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            Aprobar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function getEstadoBadge(estado: string) {
  const badges: Record<string, string> = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'aprobado': 'bg-green-100 text-green-800',
    'rechazado': 'bg-red-100 text-red-800'
  };
  return badges[estado] || 'bg-gray-100 text-gray-800';
}

function getEstadoLabel(estado: string) {
  const labels: Record<string, string> = {
    'pendiente': 'Pendiente',
    'aprobado': 'Aprobado',
    'rechazado': 'Rechazado'
  };
  return labels[estado] || estado;
}

