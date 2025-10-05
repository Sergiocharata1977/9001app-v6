'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  Plus,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { QualityObjective } from '@/types/process';
import api from '@/lib/api';

interface ProcessObjetivosTabProps {
  processId: string;
}

export function ProcessObjetivosTab({ processId }: ProcessObjetivosTabProps) {
  const [objectives, setObjectives] = useState<QualityObjective[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObjectives();
  }, [processId]);

  const loadObjectives = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quality-objectives?process_definition_id=${processId}&organization_id=1`);
      if (response.data.success) {
        setObjectives(response.data.data || []);
      } else {
        console.error('Error en la respuesta:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error cargando objetivos:', error);
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

  // Calcular estadísticas
  const stats = {
    total: objectives.length,
    cumplidos: objectives.filter(o => o.estado === 'cumplido').length,
    enProgreso: objectives.filter(o => o.estado === 'en_progreso').length,
    vencidos: objectives.filter(o => {
      const deadline = new Date(o.deadline);
      return deadline < new Date() && o.estado !== 'cumplido';
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Objetivos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cumplidos</p>
              <p className="text-2xl font-bold text-green-600">{stats.cumplidos}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.enProgreso}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de objetivos */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Objetivos de Calidad</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Objetivo
          </Button>
        </div>

        {objectives.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay objetivos de calidad definidos</p>
            <Button className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Objetivo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {objectives.map(objective => {
              const deadline = new Date(objective.deadline);
              const isOverdue = deadline < new Date() && objective.estado !== 'cumplido';
              const daysUntilDeadline = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={objective.id} className={`p-4 ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {objective.objective}
                        </h3>
                        <Badge className={getStatusBadge(objective.estado)}>
                          {getStatusLabel(objective.estado)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Meta</p>
                          <p className="font-medium text-gray-900">{objective.target}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Responsable</p>
                          <p className="font-medium text-gray-900">{objective.responsible}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Fecha Límite
                          </p>
                          <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                            {deadline.toLocaleDateString('es-ES')}
                            {!isOverdue && daysUntilDeadline > 0 && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({daysUntilDeadline} días)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Indicadores relacionados */}
                      {objective.related_indicators && objective.related_indicators.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Indicadores Relacionados:</p>
                          <div className="flex flex-wrap gap-2">
                            {objective.related_indicators.map((indicator: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function getStatusBadge(estado: string) {
  const badges: Record<string, string> = {
    'pendiente': 'bg-gray-100 text-gray-800',
    'en_progreso': 'bg-blue-100 text-blue-800',
    'cumplido': 'bg-green-100 text-green-800',
    'no_cumplido': 'bg-red-100 text-red-800'
  };
  return badges[estado] || 'bg-gray-100 text-gray-800';
}

function getStatusLabel(estado: string) {
  const labels: Record<string, string> = {
    'pendiente': 'Pendiente',
    'en_progreso': 'En Progreso',
    'cumplido': 'Cumplido',
    'no_cumplido': 'No Cumplido'
  };
  return labels[estado] || estado;
}

