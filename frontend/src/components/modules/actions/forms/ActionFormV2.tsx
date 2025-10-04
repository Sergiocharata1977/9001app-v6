'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Action, ActionType, ActionCategory, ActionPriority } from '@/shared-types/entities/Action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  User, 
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const actionSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'Máximo 1000 caracteres'),
  findingId: z.string().min(1, 'El hallazgo es requerido'),
  actionType: z.enum(['corrective', 'preventive', 'improvement', 'containment', 'investigation', 'monitoring']),
  actionCategory: z.enum(['process', 'training', 'documentation', 'equipment', 'system', 'procedure', 'policy', 'infrastructure', 'supplier', 'customer']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  assignedToId: z.string().min(1, 'El responsable es requerido'),
  plannedStartDate: z.string().min(1, 'La fecha de inicio es requerida'),
  plannedEndDate: z.string().min(1, 'La fecha de fin es requerida'),
  estimatedHours: z.number().min(0).optional(),
  estimatedCost: z.number().min(0).optional(),
  implementationPlan: z.string().optional(),
  verificationMethod: z.string().optional(),
  verificationCriteria: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().optional(),
});

type ActionFormData = z.infer<typeof actionSchema>;

interface ActionFormV2Props {
  action?: Action | null;
  findingId?: string;
  findingTitle?: string;
  onSubmit: (data: ActionFormData) => void;
  onCancel: () => void;
}

export function ActionFormV2({ action, findingId, findingTitle, onSubmit, onCancel }: ActionFormV2Props) {
  const [implementationSteps, setImplementationSteps] = useState<string[]>(
    action?.implementationSteps?.map(step => step.title) || ['']
  );
  const [newStep, setNewStep] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ActionFormData>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      title: action?.title || '',
      description: action?.description || '',
      findingId: action?.findingId || findingId || '',
      actionType: action?.actionType || 'corrective',
      actionCategory: action?.actionCategory || 'process',
      priority: action?.priority || 'medium',
      assignedToId: action?.assignedToId || '',
      plannedStartDate: action?.plannedStartDate?.toISOString().split('T')[0] || '',
      plannedEndDate: action?.plannedEndDate?.toISOString().split('T')[0] || '',
      estimatedHours: action?.estimatedHours || undefined,
      estimatedCost: action?.estimatedCost || undefined,
      implementationPlan: action?.implementationPlan || '',
      verificationMethod: action?.verificationMethod || '',
      verificationCriteria: action?.verificationCriteria || '',
      followUpRequired: action?.followUpRequired || false,
      followUpDate: action?.followUpDate?.toISOString().split('T')[0] || '',
    }
  });

  const actionType = watch('actionType');
  const priority = watch('priority');
  const followUpRequired = watch('followUpRequired');

  // Mock data - en producción vendrían de la API
  const findings = [
    { id: '1', number: 'AUDIT-001-HALL-001', title: 'Falta de registros de calibración' },
    { id: '2', number: 'EMP-001-HALL-001', title: 'Procedimiento de limpieza no seguido' },
    { id: '3', number: 'CLI-001-HALL-001', title: 'Demora en entrega de productos' },
  ];

  const typeOptions = [
    { 
      value: 'corrective', 
      label: 'Correctiva', 
      color: 'bg-red-100 text-red-800',
      description: 'Eliminar la causa de una no conformidad'
    },
    { 
      value: 'preventive', 
      label: 'Preventiva', 
      color: 'bg-blue-100 text-blue-800',
      description: 'Eliminar la causa de una no conformidad potencial'
    },
    { 
      value: 'improvement', 
      label: 'Mejora', 
      color: 'bg-green-100 text-green-800',
      description: 'Mejorar el desempeño del sistema'
    },
    { 
      value: 'containment', 
      label: 'Contención', 
      color: 'bg-orange-100 text-orange-800',
      description: 'Acción inmediata para controlar el problema'
    },
    { 
      value: 'investigation', 
      label: 'Investigación', 
      color: 'bg-purple-100 text-purple-800',
      description: 'Investigar las causas del problema'
    },
    { 
      value: 'monitoring', 
      label: 'Monitoreo', 
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Seguimiento y control continuo'
    }
  ];

  const categoryOptions = [
    { value: 'process', label: 'Proceso' },
    { value: 'training', label: 'Capacitación' },
    { value: 'documentation', label: 'Documentación' },
    { value: 'equipment', label: 'Equipos' },
    { value: 'system', label: 'Sistema' },
    { value: 'procedure', label: 'Procedimiento' },
    { value: 'policy', label: 'Política' },
    { value: 'infrastructure', label: 'Infraestructura' },
    { value: 'supplier', label: 'Proveedor' },
    { value: 'customer', label: 'Cliente' }
  ];

  const priorityOptions = [
    { 
      value: 'critical', 
      label: 'Crítica', 
      color: 'bg-red-100 text-red-800',
      description: 'Requiere acción inmediata'
    },
    { 
      value: 'high', 
      label: 'Alta', 
      color: 'bg-orange-100 text-orange-800',
      description: 'Importante, requiere atención pronta'
    },
    { 
      value: 'medium', 
      label: 'Media', 
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Importante, puede programarse'
    },
    { 
      value: 'low', 
      label: 'Baja', 
      color: 'bg-green-100 text-green-800',
      description: 'Puede realizarse cuando sea conveniente'
    }
  ];

  const personnel = [
    { id: 'person-1', name: 'Ana García - Director de Calidad' },
    { id: 'person-2', name: 'Carlos Rodríguez - Coordinador SGC' },
    { id: 'person-3', name: 'María López - Jefe de Producción' },
    { id: 'person-4', name: 'José Martínez - Supervisor' },
    { id: 'person-5', name: 'Ana Rodríguez - Jefe de Ventas' }
  ];

  const addImplementationStep = () => {
    if (newStep.trim()) {
      const updatedSteps = [...implementationSteps, newStep.trim()];
      setImplementationSteps(updatedSteps);
      setNewStep('');
    }
  };

  const removeImplementationStep = (index: number) => {
    const updatedSteps = implementationSteps.filter((_, i) => i !== index);
    setImplementationSteps(updatedSteps);
  };

  const updateImplementationStep = (index: number, value: string) => {
    const updatedSteps = [...implementationSteps];
    updatedSteps[index] = value;
    setImplementationSteps(updatedSteps);
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const option = typeOptions.find(opt => opt.value === type);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const onSubmitForm = (data: ActionFormData) => {
    onSubmit({
      ...data,
      // Agregar los pasos de implementación como parte de los datos
      implementationSteps: implementationSteps.filter(step => step.trim() !== '')
    } as any);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {action ? 'Editar Acción' : 'Nueva Acción'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Finding Selection */}
          <div>
            <Label htmlFor="findingId">Hallazgo Relacionado *</Label>
            {findingId && findingTitle ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">{findingTitle}</span>
                </div>
                <input type="hidden" {...register('findingId')} value={findingId} />
              </div>
            ) : (
              <Select onValueChange={(value) => setValue('findingId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hallazgo" />
                </SelectTrigger>
                <SelectContent>
                  {findings.map((finding) => (
                    <SelectItem key={finding.id} value={finding.id}>
                      <div>
                        <div className="font-medium">{finding.number}</div>
                        <div className="text-sm text-gray-500">{finding.title}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.findingId && (
              <p className="text-sm text-red-600 mt-1">{errors.findingId.message}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título de la Acción *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Descripción breve de la acción"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="actionType">Tipo de Acción *</Label>
                <Select onValueChange={(value) => setValue('actionType', value as ActionType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={type.color}>
                              {type.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.actionType && (
                  <p className="text-sm text-red-600 mt-1">{errors.actionType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="actionCategory">Categoría *</Label>
                <Select onValueChange={(value) => setValue('actionCategory', value as ActionCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.actionCategory && (
                  <p className="text-sm text-red-600 mt-1">{errors.actionCategory.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Prioridad *</Label>
                <Select onValueChange={(value) => setValue('priority', value as ActionPriority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">{priority.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="assignedToId">Responsable *</Label>
                <Select onValueChange={(value) => setValue('assignedToId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {personnel.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {person.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedToId && (
                  <p className="text-sm text-red-600 mt-1">{errors.assignedToId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="plannedStartDate">Fecha de Inicio *</Label>
                <Input
                  id="plannedStartDate"
                  type="date"
                  {...register('plannedStartDate')}
                />
                {errors.plannedStartDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.plannedStartDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="plannedEndDate">Fecha de Finalización *</Label>
                <Input
                  id="plannedEndDate"
                  type="date"
                  {...register('plannedEndDate')}
                />
                {errors.plannedEndDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.plannedEndDate.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="estimatedHours"
                      type="number"
                      min="0"
                      step="0.5"
                      {...register('estimatedHours', { valueAsNumber: true })}
                      placeholder="0"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimatedCost">Costo Estimado</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="estimatedCost"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('estimatedCost', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción Detallada *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción completa de la acción a implementar..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Implementation Plan */}
          <div>
            <Label htmlFor="implementationPlan">Plan de Implementación</Label>
            <Textarea
              id="implementationPlan"
              {...register('implementationPlan')}
              placeholder="Plan general de implementación de la acción..."
              rows={3}
            />
          </div>

          {/* Implementation Steps */}
          <div>
            <Label>Pasos de Implementación</Label>
            <div className="space-y-3">
              {implementationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                  <Input
                    value={step}
                    onChange={(e) => updateImplementationStep(index, e.target.value)}
                    placeholder={`Paso ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImplementationStep(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-8">{implementationSteps.length + 1}.</span>
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Agregar nuevo paso..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImplementationStep();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImplementationStep}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="verificationMethod">Método de Verificación</Label>
              <Input
                id="verificationMethod"
                {...register('verificationMethod')}
                placeholder="Cómo se verificará la efectividad"
              />
            </div>

            <div>
              <Label htmlFor="verificationCriteria">Criterios de Verificación</Label>
              <Input
                id="verificationCriteria"
                {...register('verificationCriteria')}
                placeholder="Criterios para considerar efectiva la acción"
              />
            </div>
          </div>

          {/* Follow-up */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="followUpRequired"
                {...register('followUpRequired')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="followUpRequired" className="text-sm">
                Requiere seguimiento posterior
              </Label>
            </div>

            {followUpRequired && (
              <div>
                <Label htmlFor="followUpDate">Fecha de Seguimiento</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  {...register('followUpDate')}
                />
              </div>
            )}
          </div>

          {/* Current Status Display */}
          {actionType && priority && (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <span>Configuración actual:</span>
                  <Badge className={getTypeColor(actionType)}>
                    {typeOptions.find(opt => opt.value === actionType)?.label}
                  </Badge>
                  <Badge className={getPriorityColor(priority)}>
                    {priorityOptions.find(opt => opt.value === priority)?.label}
                  </Badge>
                </div>
                <p className="text-sm mt-1">
                  {typeOptions.find(opt => opt.value === actionType)?.description}
                </p>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : action ? 'Actualizar' : 'Crear Acción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}