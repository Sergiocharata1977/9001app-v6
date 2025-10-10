'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  User,
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface HistoryEntry {
  id?: string;
  campo: string;
  valor_anterior: any;
  valor_nuevo: any;
  fecha: string;
  usuario_id: string;
  usuario_nombre: string;
  accion?: 'create' | 'update' | 'delete';
  descripcion?: string;
}

interface HistoryLogProps {
  entries: HistoryEntry[];
  maxHeight?: string;
  showUserAvatars?: boolean;
  compact?: boolean;
  groupByDate?: boolean;
}

export default function HistoryLog({
  entries,
  maxHeight = '400px',
  showUserAvatars = true,
  compact = false,
  groupByDate = true
}: HistoryLogProps) {
  
  const getActionIcon = (accion?: string, campo?: string) => {
    if (accion === 'create' || !valor_anterior) {
      return <Plus className="h-4 w-4 text-green-600" />;
    }
    if (accion === 'delete') {
      return <Trash2 className="h-4 w-4 text-red-600" />;
    }
    return <Edit className="h-4 w-4 text-blue-600" />;
  };

  const getActionColor = (accion?: string) => {
    if (accion === 'create') return 'border-green-500 bg-green-50';
    if (accion === 'delete') return 'border-red-500 bg-red-50';
    return 'border-blue-500 bg-blue-50';
  };

  const getActionLabel = (accion?: string, campo?: string) => {
    if (accion === 'create') return 'Creado';
    if (accion === 'delete') return 'Eliminado';
    return 'Modificado';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-500 italic">vacío</span>;
    }
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Sí' : 'No'}</Badge>;
    }
    if (typeof value === 'number') {
      return <span className="font-mono">{value.toLocaleString()}</span>;
    }
    if (typeof value === 'string' && value.length > 50) {
      return <span title={value}>{value.substring(0, 50)}...</span>;
    }
    return <span>{String(value)}</span>;
  };

  const getFieldLabel = (campo: string) => {
    const labels: { [key: string]: string } = {
      'estado': 'Estado',
      'etapa': 'Etapa',
      'probabilidad': 'Probabilidad',
      'valor_estimado': 'Valor Estimado',
      'fecha_cierre_esperada': 'Fecha de Cierre',
      'vendedor_asignado_id': 'Vendedor Asignado',
      'tipo_cliente': 'Tipo de Cliente',
      'cargo': 'Cargo',
      'email': 'Email',
      'telefono': 'Teléfono',
      'descripcion': 'Descripción',
      'titulo': 'Título',
      'prioridad': 'Prioridad',
      'duracion_minutos': 'Duración',
      'resultado_tecnico': 'Resultado Técnico',
      'recomendaciones': 'Recomendaciones'
    };
    return labels[campo] || campo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const groupEntriesByDate = (entries: HistoryEntry[]) => {
    const groups: { [key: string]: HistoryEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.fecha).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, entries]) => ({
        date,
        entries: entries.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      }));
  };

  const renderEntry = (entry: HistoryEntry) => (
    <div
      key={entry.id || entry.fecha}
      className={`flex items-start space-x-3 p-3 border rounded-lg ${getActionColor(entry.accion)}`}
    >
      <div className="flex-shrink-0 mt-1">
        {getActionIcon(entry.accion, entry.campo)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            {showUserAvatars && (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(entry.usuario_nombre)}
              </div>
            )}
            <span className="text-sm font-medium">{entry.usuario_nombre}</span>
            <Badge variant="outline" className="text-xs">
              {getActionLabel(entry.accion, entry.campo)}
            </Badge>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(entry.fecha)}
          </span>
        </div>

        {entry.descripcion ? (
          <p className="text-sm text-gray-700">{entry.descripcion}</p>
        ) : (
          <div className="text-sm">
            <p className="mb-1">
              <strong>{getFieldLabel(entry.campo)}</strong>
            </p>
            {entry.accion === 'create' ? (
              <div className="text-green-700">
                Valor: {formatValue(entry.valor_nuevo)}
              </div>
            ) : entry.accion === 'delete' ? (
              <div className="text-red-700">
                Eliminado: {formatValue(entry.valor_anterior)}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ArrowLeft className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">De: {formatValue(entry.valor_anterior)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-900">A: {formatValue(entry.valor_nuevo)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Cambios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay cambios registrados</p>
            <p className="text-sm text-gray-400">El historial aparecerá aquí cuando se realicen modificaciones</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {entries.slice(0, 5).map(renderEntry)}
        {entries.length > 5 && (
          <p className="text-sm text-gray-500 text-center">
            Y {entries.length - 5} cambios más...
          </p>
        )}
      </div>
    );
  }

  if (groupByDate) {
    const groupedEntries = groupEntriesByDate(entries);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Cambios
            <Badge variant="secondary">{entries.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="space-y-6 overflow-y-auto"
            style={{ maxHeight }}
          >
            {groupedEntries.map(({ date, entries }) => (
              <div key={date}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-sm font-medium text-gray-600 px-2">
                    {formatDateOnly(date)}
                  </span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="space-y-3">
                  {entries.map(renderEntry)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Cambios
          <Badge variant="secondary">{entries.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="space-y-3 overflow-y-auto"
          style={{ maxHeight }}
        >
          {entries.map(renderEntry)}
        </div>
      </CardContent>
    </Card>
  );
}




