'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Building2,
  Grid3X3,
  List
} from 'lucide-react';

export default function SatisfaccionClientesPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Datos de ejemplo de encuestas
  const encuestas = [
    {
      id: 'ENC-001',
      empresa: 'Estancia San Miguel',
      empresaId: 'CLI-2024-001',
      fecha: '2024-01-15',
      tipo: 'Post-Entrega',
      puntuacion: 4.5,
      nps: 9,
      estado: 'completada',
      comentarios: 'Excelente servicio y calidad de productos'
    },
    {
      id: 'ENC-002',
      empresa: 'Agropecuaria Los Pinos',
      empresaId: 'CLI-2024-002',
      fecha: '2024-01-20',
      tipo: 'Satisfacción Anual',
      puntuacion: 4.0,
      nps: 8,
      estado: 'completada',
      comentarios: 'Muy buenos productos, mejorar tiempos de entrega'
    },
    {
      id: 'ENC-003',
      empresa: 'Campo Verde SA',
      empresaId: 'CLI-2024-003',
      fecha: '2024-01-25',
      tipo: 'Post-Entrega',
      puntuacion: 3.5,
      nps: 6,
      estado: 'pendiente',
      comentarios: ''
    },
  ];

  const getNPSColor = (nps: number) => {
    if (nps >= 9) return 'bg-green-100 text-green-800';
    if (nps >= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getNPSLabel = (nps: number) => {
    if (nps >= 9) return 'Promotor';
    if (nps >= 7) return 'Pasivo';
    return 'Detractor';
  };

  const getEstadoColor = (estado: string) => {
    return estado === 'completada' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const renderStars = (puntuacion: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= puntuacion
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const promedioNPS = encuestas.reduce((sum, enc) => sum + enc.nps, 0) / encuestas.length;
  const promedioPuntuacion = encuestas.reduce((sum, enc) => sum + enc.puntuacion, 0) / encuestas.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Satisfacción de Clientes</h1>
          <p className="text-gray-600 mt-2">Encuestas y medición de satisfacción</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Encuesta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Encuestas</p>
                <p className="text-2xl font-bold text-gray-900">{encuestas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Puntuación Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{promedioPuntuacion.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">NPS Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{promedioNPS.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Encuestados</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(encuestas.map(e => e.empresaId)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Vista Tarjetas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            Vista Lista
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {encuestas.length} encuestas registradas
        </div>
      </div>

      {/* Vista Tarjetas */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {encuestas.map((encuesta) => (
            <Card key={encuesta.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{encuesta.empresa}</h3>
                    <p className="text-sm text-gray-600">{encuesta.id}</p>
                  </div>
                  <Badge className={getEstadoColor(encuesta.estado)}>
                    {encuesta.estado}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Puntuación:</span>
                    {renderStars(encuesta.puntuacion)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">NPS:</span>
                    <Badge className={getNPSColor(encuesta.nps)}>
                      {encuesta.nps} - {getNPSLabel(encuesta.nps)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{encuesta.tipo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(encuesta.fecha).toLocaleDateString()}</span>
                  </div>
                </div>

                {encuesta.comentarios && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 italic line-clamp-2">
                      "{encuesta.comentarios}"
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Vista Lista */
        <div className="space-y-4">
          {encuestas.map((encuesta) => (
            <Card key={encuesta.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{encuesta.empresa}</h3>
                    <Badge className={getEstadoColor(encuesta.estado)}>
                      {encuesta.estado}
                    </Badge>
                    <Badge className={getNPSColor(encuesta.nps)}>
                      NPS: {encuesta.nps} - {getNPSLabel(encuesta.nps)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>{encuesta.tipo}</span>
                    <span className="flex items-center gap-1">
                      {renderStars(encuesta.puntuacion)}
                      <span className="ml-1">{encuesta.puntuacion}/5</span>
                    </span>
                    <span>{new Date(encuesta.fecha).toLocaleDateString()}</span>
                    {encuesta.comentarios && (
                      <span className="italic">"{encuesta.comentarios.substring(0, 50)}..."</span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}