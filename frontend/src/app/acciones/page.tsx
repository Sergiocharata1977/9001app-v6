'use client';

import {
    Activity,
    AlertTriangle,
    Clock,
    Plus,
    Target
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Action } from '../../../shared-types/entities/Action';
import { ActionFormV2 } from '../../components/modules/actions/forms/ActionFormV2';
import ActionTable from '../../components/modules/actions/tables/ActionTable';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

// Datos de ejemplo - En producción vendrían de la API
const mockActions: Action[] = [
  {
    id: '1',
    actionNumber: 'AUDIT-001-HALL-001-ACC-001',
    findingId: 'finding-1',
    title: 'Implementar procedimiento de calibración',
    description: 'Desarrollar e implementar un procedimiento documentado para la calibración de equipos de medición',
    type: 'correctiva',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Juan Pérez',
    assignedToId: 'user-1',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    progress: 65,
    estimatedHours: 40,
    actualHours: 26,
    estimatedCost: 2500,
    actualCost: 1625,
    implementationSteps: [
      { step: 'Análisis de requisitos', completed: true },
      { step: 'Diseño del procedimiento', completed: true },
      { step: 'Revisión y aprobación', completed: false },
      { step: 'Implementación', completed: false }
    ],
    verificationMethods: ['Auditoría interna', 'Revisión documental'],
    rootCauseAnalysis: 'Falta de procedimientos documentados',
    preventiveActions: ['Capacitación del personal', 'Revisión periódica'],
    organizationId: 'org-1'
  },
  {
    id: '2',
    actionNumber: 'AUDIT-001-HALL-002-ACC-001',
    findingId: 'finding-2',
    title: 'Capacitación en ISO 9001:2015',
    description: 'Programa de capacitación para todo el personal sobre los requisitos de ISO 9001:2015',
    type: 'preventiva',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'María García',
    assignedToId: 'user-2',
    dueDate: '2024-03-01',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    progress: 0,
    estimatedHours: 80,
    actualHours: 0,
    estimatedCost: 5000,
    actualCost: 0,
    implementationSteps: [
      { step: 'Diseño del programa', completed: false },
      { step: 'Preparación de materiales', completed: false },
      { step: 'Ejecución de capacitaciones', completed: false },
      { step: 'Evaluación de efectividad', completed: false }
    ],
    verificationMethods: ['Evaluaciones', 'Encuestas de satisfacción'],
    organizationId: 'org-1'
  },
  {
    id: '3',
    actionNumber: 'EMP-001-HALL-001-ACC-001',
    findingId: 'finding-3',
    title: 'Mejora del sistema de gestión documental',
    description: 'Implementar sistema digital para la gestión y control de documentos',
    type: 'mejora',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Carlos López',
    assignedToId: 'user-3',
    dueDate: '2024-01-30',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-30T17:00:00Z',
    progress: 100,
    estimatedHours: 120,
    actualHours: 115,
    estimatedCost: 8000,
    actualCost: 7800,
    implementationSteps: [
      { step: 'Análisis de requisitos', completed: true },
      { step: 'Selección de herramienta', completed: true },
      { step: 'Configuración e implementación', completed: true },
      { step: 'Migración de documentos', completed: true },
      { step: 'Capacitación de usuarios', completed: true }
    ],
    verificationMethods: ['Pruebas de usuario', 'Auditoría del sistema'],
    organizationId: 'org-1'
  }
];

export default function AccionesPage() {
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [showForm, setShowForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');

  // Métricas calculadas
  const metrics = useMemo(() => {
    const total = actions.length;
    const completed = actions.filter(a => a.status === 'completed').length;
    const inProgress = actions.filter(a => a.status === 'in_progress').length;
    const pending = actions.filter(a => a.status === 'pending').length;
    const overdue = actions.filter(a => {
      if (!a.dueDate) return false;
      return new Date(a.dueDate) < new Date() && a.status !== 'completed';
    }).length;

    const avgProgress = total > 0 
      ? Math.round(actions.reduce((sum, a) => sum + (a.progress || 0), 0) / total)
      : 0;

    const totalEstimatedCost = actions.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
    const totalActualCost = actions.reduce((sum, a) => sum + (a.actualCost || 0), 0);

    // Distribución por tipo
    const byType = {
      correctiva: actions.filter(a => a.type === 'correctiva').length,
      preventiva: actions.filter(a => a.type === 'preventiva').length,
      mejora: actions.filter(a => a.type === 'mejora').length
    };

    // Distribución por prioridad
    const byPriority = {
      critical: actions.filter(a => a.priority === 'critical').length,
      high: actions.filter(a => a.priority === 'high').length,
      medium: actions.filter(a => a.priority === 'medium').length,
      low: actions.filter(a => a.priority === 'low').length
    };

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      avgProgress,
      totalEstimatedCost,
      totalActualCost,
      byType,
      byPriority
    };
  }, [actions]);

  const handleActionUpdate = (actionId: string, updates: Partial<Action>) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, ...updates, updatedAt: new Date().toISOString() }
        : action
    ));
  };

  const handleActionSave = (actionData: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedAction) {
      // Editar acción existente
      handleActionUpdate(selectedAction.id, actionData);
    } else {
      // Crear nueva acción
      const newAction: Action = {
        ...actionData,
        id: `action-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setActions(prev => [...prev, newAction]);
    }
    setShowForm(false);
    setSelectedAction(null);
  };

  const handleActionDelete = (actionId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta acción?')) {
      setActions(prev => prev.filter(action => action.id !== actionId));
    }
  };

  const handleActionView = (action: Action) => {
    setSelectedAction(action);
    setViewMode('view');
    setShowForm(true);
  };

  const handleActionEdit = (action: Action) => {
    setSelectedAction(action);
    setViewMode('edit');
    setShowForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Acciones</h1>
          <p className="text-gray-600">
            Seguimiento y control de acciones correctivas, preventivas y de mejora
          </p>
        </div>
        <Button onClick={() => {
          setSelectedAction(null);
          setViewMode('edit');
          setShowForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Acción
        </Button>
      </div>

      {/* Métricas Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Acciones</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completed} completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Progreso promedio: {metrics.avgProgress}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.overdue}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pending} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efectividad</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tasa de completitud
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Correctivas</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byType.correctiva / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byType.correctiva}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Preventivas</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byType.preventiva / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byType.preventiva}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mejoras</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byType.mejora / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byType.mejora}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribución por Prioridad */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Prioridad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Crítica</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byPriority.critical / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byPriority.critical}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alta</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byPriority.high / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byPriority.high}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Media</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byPriority.medium / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byPriority.medium}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Baja</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${metrics.total > 0 ? (metrics.byPriority.low / metrics.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <Badge variant="secondary">{metrics.byPriority.low}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Costos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análisis de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Costo Estimado Total</span>
                <span className="font-semibold">{formatCurrency(metrics.totalEstimatedCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Costo Real Total</span>
                <span className="font-semibold">{formatCurrency(metrics.totalActualCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Variación</span>
                <span className={`font-semibold ${
                  metrics.totalActualCost <= metrics.totalEstimatedCost 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(metrics.totalActualCost - metrics.totalEstimatedCost)}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Eficiencia de Costo</span>
                  <span className={`font-semibold ${
                    metrics.totalEstimatedCost > 0 && 
                    (metrics.totalActualCost / metrics.totalEstimatedCost) <= 1
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {metrics.totalEstimatedCost > 0 
                      ? `${Math.round((metrics.totalActualCost / metrics.totalEstimatedCost) * 100)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximos Vencimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actions
                .filter(action => action.dueDate && action.status !== 'completed')
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                .slice(0, 5)
                .map(action => {
                  const daysUntilDue = Math.ceil(
                    (new Date(action.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="text-sm font-medium truncate">
                          {action.actionNumber}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {action.title}
                        </div>
                      </div>
                      <Badge 
                        variant={daysUntilDue < 0 ? 'destructive' : daysUntilDue <= 3 ? 'secondary' : 'outline'}
                        className="ml-2"
                      >
                        {daysUntilDue < 0 
                          ? `${Math.abs(daysUntilDue)}d vencida`
                          : daysUntilDue === 0 
                          ? 'Hoy'
                          : `${daysUntilDue}d`
                        }
                      </Badge>
                    </div>
                  );
                })}
              {actions.filter(action => action.dueDate && action.status !== 'completed').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay acciones pendientes con fecha de vencimiento
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Acciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Todas las Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionTable
            actions={actions}
            onActionUpdate={handleActionUpdate}
            onActionView={handleActionView}
            onActionEdit={handleActionEdit}
            onActionDelete={handleActionDelete}
          />
        </CardContent>
      </Card>

      {/* Modal de Formulario */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedAction(null);
        }}
        title={
          viewMode === 'view' 
            ? 'Detalles de la Acción'
            : selectedAction 
            ? 'Editar Acción' 
            : 'Nueva Acción'
        }
        size="xl"
      >
        <ActionFormV2
          initialData={selectedAction}
          onSubmit={handleActionSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedAction(null);
          }}
          readOnly={viewMode === 'view'}
        />
      </Modal>
    </div>
  );
}