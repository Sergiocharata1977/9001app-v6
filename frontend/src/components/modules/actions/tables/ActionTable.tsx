'use client';

import React, { useState, useMemo } from 'react';
import { Action } from '../../../../../shared-types/entities/Action';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import UnifiedKanban from '../../../ui/unified-kanban';
import type { KanbanColumn, KanbanItem } from '../../../types/unified-kanban';
import { 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play,
  Pause,
  MoreHorizontal,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';

interface ActionTableProps {
  actions: Action[];
  onActionUpdate?: (actionId: string, updates: Partial<Action>) => void;
  onActionView?: (action: Action) => void;
  onActionEdit?: (action: Action) => void;
  onActionDelete?: (actionId: string) => void;
  loading?: boolean;
}

const statusConfig = {
  'pending': { 
    label: 'Pendiente', 
    color: 'bg-gray-100 text-gray-800', 
    icon: Clock,
    column: 'Pendientes'
  },
  'in_progress': { 
    label: 'En Progreso', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Play,
    column: 'En Progreso'
  },
  'on_hold': { 
    label: 'En Pausa', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Pause,
    column: 'En Pausa'
  },
  'completed': { 
    label: 'Completada', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    column: 'Completadas'
  },
  'cancelled': { 
    label: 'Cancelada', 
    color: 'bg-red-100 text-red-800', 
    icon: AlertTriangle,
    column: 'Canceladas'
  }
};

const priorityConfig = {
  'low': { label: 'Baja', color: 'bg-green-100 text-green-800' },
  'medium': { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  'high': { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  'critical': { label: 'Crítica', color: 'bg-red-100 text-red-800' }
};

export default function ActionTable({
  actions,
  onActionUpdate,
  onActionView,
  onActionEdit,
  onActionDelete,
  loading = false
}: ActionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filtrar acciones
  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.actionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = !selectedPriority || action.priority === selectedPriority;
      const matchesType = !selectedType || action.type === selectedType;
      
      return matchesSearch && matchesPriority && matchesType;
    });
  }, [actions, searchTerm, selectedPriority, selectedType]);

  // Convertir acciones a formato Kanban
  const kanbanColumns: KanbanColumn[] = useMemo(() => {
    return Object.entries(statusConfig).map(([status, config]) => ({
      id: status,
      title: config.column,
      color: status === 'pending' ? '#6B7280' :
             status === 'in_progress' ? '#3B82F6' :
             status === 'on_hold' ? '#F59E0B' :
             status === 'completed' ? '#10B981' :
             '#EF4444'
    }));
  }, []);

  const kanbanItems: KanbanItem[] = useMemo(() => {
    return filteredActions.map(action => ({
      id: action.id,
      title: action.actionNumber,
      description: action.title,
      columnId: action.status,
      priority: action.priority,
      assignee: action.assignedTo,
      dueDate: action.dueDate,
      progress: action.progress,
      tags: [action.type],
      customData: { action }
    }));
  }, [filteredActions]);

  const handleItemMove = (itemId: string, sourceColumn: string, targetColumn: string, newIndex: number) => {
    if (!onActionUpdate) return;
    onActionUpdate(itemId, { status: targetColumn as Action['status'] });
  };

  const handleItemClick = (item: KanbanItem) => {
    const action = item.customData?.action as Action;
    if (action) {
      onActionView?.(action);
    }
  };

  const handleItemEdit = (item: KanbanItem) => {
    const action = item.customData?.action as Action;
    if (action) {
      onActionEdit?.(action);
    }
  };

  const handleItemDelete = (item: KanbanItem) => {
    const action = item.customData?.action as Action;
    if (action) {
      onActionDelete?.(action.id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros y Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar acciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todas las prioridades</option>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="correctiva">Correctiva</option>
            <option value="preventiva">Preventiva</option>
            <option value="mejora">Mejora</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tabla
          </Button>
        </div>
      </div>

      {/* Vista Kanban */}
      {viewMode === 'kanban' && (
        <UnifiedKanban
          columns={kanbanColumns}
          items={kanbanItems}
          onItemMove={handleItemMove}
          onItemClick={handleItemClick}
          onItemEdit={handleItemEdit}
          onItemDelete={handleItemDelete}
          loading={loading}
        />
      )}

      {/* Vista de Tabla */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActions.map((action) => {
                  const StatusIcon = statusConfig[action.status]?.icon || Clock;
                  const daysUntilDue = action.dueDate ? getDaysUntilDue(action.dueDate) : null;
                  
                  return (
                    <tr key={action.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {action.actionNumber}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {action.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={statusConfig[action.status]?.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[action.status]?.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant="secondary" 
                          className={priorityConfig[action.priority]?.color}
                        >
                          {priorityConfig[action.priority]?.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {action.assignedTo || '-'}
                      </td>
                      <td className="px-4 py-4">
                        {action.dueDate ? (
                          <div className={`text-sm ${
                            daysUntilDue !== null && daysUntilDue < 0 
                              ? 'text-red-600 font-medium' 
                              : daysUntilDue !== null && daysUntilDue <= 3
                              ? 'text-orange-600 font-medium'
                              : 'text-gray-900'
                          }`}>
                            {formatDate(action.dueDate)}
                            {daysUntilDue !== null && (
                              <div className="text-xs">
                                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} días vencida` : 
                                 daysUntilDue === 0 ? 'Vence hoy' : 
                                 `${daysUntilDue} días`}
                              </div>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-4">
                        {action.progress !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${action.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{action.progress}%</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onActionView?.(action)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onActionEdit?.(action)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onActionDelete?.(action.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredActions.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay acciones</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron acciones que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}
