'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Target,
  DollarSign,
  Calendar,
  User,
  Building2,
  Settings,
  TrendingUp,
  Kanban,
  List,
  LayoutGrid,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';

// Datos de ejemplo para oportunidades
const mockOportunidades: KanbanItem[] = [
  {
    id: 'opp-1',
    title: 'Estancia San Miguel - Semillas Soja',
    description: 'Venta de semillas de soja para 500 hectáreas',
    columnId: 'prospecto',
    priority: 'high',
    assignee: 'Juan Pérez',
    dueDate: '2024-03-15',
    tags: ['Semillas', 'Soja'],
    customData: {
      empresa: 'Estancia San Miguel',
      valor: 125000,
      probabilidad: 25
    }
  },
  {
    id: 'opp-2',
    title: 'Agropecuaria Los Pinos - Agroquímicos',
    description: 'Provisión de agroquímicos para temporada',
    columnId: 'calificacion',
    priority: 'medium',
    assignee: 'María González',
    dueDate: '2024-03-20',
    tags: ['Agroquímicos'],
    customData: {
      empresa: 'Agropecuaria Los Pinos',
      valor: 89500,
      probabilidad: 40
    }
  },
  {
    id: 'opp-3',
    title: 'Campo Verde SA - Fertilizantes',
    description: 'Fertilizantes para 800 hectáreas de maíz',
    columnId: 'propuesta',
    priority: 'high',
    assignee: 'Carlos Rodríguez',
    dueDate: '2024-03-10',
    tags: ['Fertilizantes', 'Maíz'],
    customData: {
      empresa: 'Campo Verde SA',
      valor: 210000,
      probabilidad: 60
    }
  },
  {
    id: 'opp-4',
    title: 'Estancia El Progreso - Maquinaria',
    description: 'Venta de equipamiento agrícola',
    columnId: 'negociacion',
    priority: 'critical',
    assignee: 'Ana Martínez',
    dueDate: '2024-03-05',
    tags: ['Maquinaria'],
    customData: {
      empresa: 'Estancia El Progreso',
      valor: 450000,
      probabilidad: 75
    }
  },
];

// Columnas del pipeline (editables)
const defaultColumns: KanbanColumn[] = [
  { id: 'prospecto', title: 'Prospecto', color: '#9CA3AF' },
  { id: 'calificacion', title: 'Calificación', color: '#3B82F6' },
  { id: 'propuesta', title: 'Propuesta', color: '#8B5CF6' },
  { id: 'negociacion', title: 'Negociación', color: '#F59E0B' },
  { id: 'cierre', title: 'Cierre', color: '#10B981' }
];

export default function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState<KanbanItem[]>(mockOportunidades);
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'table'>('kanban');

  // Función para mover oportunidades entre columnas
  const handleItemMove = (itemId: string, sourceColumnId: string, targetColumnId: string) => {
    setOportunidades(prevOportunidades => 
      prevOportunidades.map(opp => 
        opp.id === itemId 
          ? { ...opp, columnId: targetColumnId }
          : opp
      )
    );
  };

  // Función para obtener oportunidades por columna
  const getOportunidadesByColumn = (columnId: string) => {
    return oportunidades.filter(opp => opp.columnId === columnId);
  };

  // Calcular estadísticas
  const stats = {
    total: oportunidades.length,
    valorTotal: oportunidades.reduce((sum, opp) => sum + (opp.customData?.valor || 0), 0),
    valorPonderado: oportunidades.reduce((sum, opp) => {
      const valor = opp.customData?.valor || 0;
      const prob = (opp.customData?.probabilidad || 0) / 100;
      return sum + (valor * prob);
    }, 0)
  };

  const getPrioridadColor = (prioridad?: string) => {
    switch (prioridad) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadLabel = (prioridad?: string) => {
    switch (prioridad) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin prioridad';
    }
  };

  const OportunidadCard = ({ oportunidad }: { oportunidad: KanbanItem }) => {
    const dragRef = useKanbanDrag({
      itemId: oportunidad.id,
      columnId: oportunidad.columnId,
      item: oportunidad,
      onDragStart: (itemId) => setDraggedItem(itemId),
      onDragEnd: () => setDraggedItem(null)
    });

    return (
      <Card 
        ref={dragRef}
        className={`p-4 mb-3 cursor-move hover:shadow-lg transition-all ${
          draggedItem === oportunidad.id ? 'opacity-50 scale-95' : ''
        }`}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-sm text-gray-900 flex-1 pr-2">
              {oportunidad.title}
            </h4>
            <Badge className={`${getPrioridadColor(oportunidad.priority)} text-xs border`}>
              {getPrioridadLabel(oportunidad.priority)}
            </Badge>
          </div>
          
          {/* Descripción */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {oportunidad.description}
          </p>
          
          {/* Valor y Probabilidad */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>${(oportunidad.customData?.valor || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">{oportunidad.customData?.probabilidad}%</span>
            </div>
          </div>

          {/* Barra de progreso de probabilidad */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${oportunidad.customData?.probabilidad || 0}%` }}
            />
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {oportunidad.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Footer */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{oportunidad.customData?.empresa}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User className="h-3 w-3" />
              <span>{oportunidad.assignee}</span>
            </div>
            {oportunidad.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{new Date(oportunidad.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const KanbanColumn = ({ column }: { column: KanbanColumn }) => {
    const columnOportunidades = getOportunidadesByColumn(column.id);
    const valorColumna = columnOportunidades.reduce((sum, opp) => sum + (opp.customData?.valor || 0), 0);
    
    const dropRef = useKanbanDrop({
      columnId: column.id,
      column,
      onDrop: (itemId, sourceColumnId, targetColumnId) => {
        handleItemMove(itemId, sourceColumnId, targetColumnId);
      },
      onDragOver: () => {}
    });

    return (
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white rounded-lg border-2 border-gray-200 h-full">
          {/* Header de columna */}
          <div 
            className="p-4 rounded-t-lg border-b-2"
            style={{ 
              backgroundColor: `${column.color}20`,
              borderColor: column.color 
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="secondary" className="bg-white">
                {columnOportunidades.length}
              </Badge>
            </div>
            <div className="text-sm font-medium text-gray-700">
              ${(valorColumna / 1000).toFixed(0)}K
            </div>
          </div>
          
          {/* Área de drop */}
          <div 
            ref={dropRef}
            className="p-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto"
          >
            {columnOportunidades.map((oportunidad) => (
              <OportunidadCard key={oportunidad.id} oportunidad={oportunidad} />
            ))}
            
            {columnOportunidades.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Arrastra oportunidades aquí
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-gray-500 hover:text-gray-700 border-2 border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Oportunidad
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Ventas</h1>
          <p className="text-gray-600 mt-2">Gestión de oportunidades de negocio</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar Etapas
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Oportunidades Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total Pipeline</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.valorTotal / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Ponderado</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.valorPonderado / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de configuración */}
      {showConfig && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Configuración de Etapas</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Las etapas del pipeline son personalizables según el proceso de ventas de tu organización. 
                  Próximamente podrás agregar, editar o eliminar etapas desde esta sección.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Kanban className="h-4 w-4" />
            Vista Kanban
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Vista Tabla
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
      </div>

      {/* Vista Kanban */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      )}

      {/* Vista Tabla */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oportunidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etapa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probabilidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {oportunidades.map((opp) => {
                    const etapa = columns.find(c => c.id === opp.columnId);
                    return (
                      <tr key={opp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{opp.title}</div>
                            <div className="text-sm text-gray-500">{opp.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{opp.customData?.empresa}</td>
                        <td className="px-6 py-4">
                          <Badge style={{ backgroundColor: `${etapa?.color}20`, color: etapa?.color }}>
                            {etapa?.title}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          ${(opp.customData?.valor || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${opp.customData?.probabilidad}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{opp.customData?.probabilidad}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{opp.assignee}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista Lista */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {oportunidades.map((opp) => {
            const etapa = columns.find(c => c.id === opp.columnId);
            return (
              <Card key={opp.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{opp.title}</h3>
                      <Badge className={getPrioridadColor(opp.priority)}>
                        {getPrioridadLabel(opp.priority)}
                      </Badge>
                      <Badge style={{ backgroundColor: `${etapa?.color}20`, color: etapa?.color }}>
                        {etapa?.title}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {opp.customData?.empresa}
                      </span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        ${(opp.customData?.valor || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {opp.customData?.probabilidad}% probabilidad
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {opp.assignee}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}