'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IsoClause, ComplianceStatus } from '@/shared-types/entities/IsoClause';
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
  BookOpen, 
  Plus, 
  X, 
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const clauseSchema = z.object({
  clauseNumber: z.string().min(1, 'El número de cláusula es requerido'),
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'Máximo 1000 caracteres'),
  requirements: z.array(z.string()).min(1, 'Debe agregar al menos un requisito'),
  parentClauseId: z.string().optional(),
  level: z.number().min(1).max(4),
  complianceStatus: z.enum(['not_evaluated', 'non_compliant', 'partially_compliant', 'compliant', 'not_applicable']),
  compliancePercentage: z.number().min(0).max(100),
  responsibleDepartmentId: z.string().optional(),
  responsiblePersonId: z.string().optional(),
  nextEvaluationDate: z.string().optional(),
  processIds: z.array(z.string()).optional(),
  evidenceDocuments: z.array(z.string()).optional(),
});

type ClauseFormData = z.infer<typeof clauseSchema>;

interface IsoClauseFormV2Props {
  clause?: IsoClause | null;
  onSubmit: (data: ClauseFormData) => void;
  onCancel: () => void;
}

export function IsoClauseFormV2({ clause, onSubmit, onCancel }: IsoClauseFormV2Props) {
  const [requirements, setRequirements] = useState<string[]>(
    clause?.requirements || ['']
  );
  const [newRequirement, setNewRequirement] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ClauseFormData>({
    resolver: zodResolver(clauseSchema),
    defaultValues: {
      clauseNumber: clause?.clauseNumber || '',
      title: clause?.title || '',
      description: clause?.description || '',
      requirements: clause?.requirements || [],
      parentClauseId: clause?.parentClauseId || '',
      level: clause?.level || 1,
      complianceStatus: clause?.complianceStatus || 'not_evaluated',
      compliancePercentage: clause?.compliancePercentage || 0,
      responsibleDepartmentId: clause?.responsibleDepartmentId || '',
      responsiblePersonId: clause?.responsiblePersonId || '',
      nextEvaluationDate: clause?.nextEvaluationDate?.toISOString().split('T')[0] || '',
      processIds: clause?.processIds || [],
      evidenceDocuments: clause?.evidenceDocuments || [],
    }
  });

  const complianceStatus = watch('complianceStatus');
  const level = watch('level');

  // Mock data - en producción vendrían de la API
  const parentClauses = [
    { id: '1', number: '4', title: 'Contexto de la organización' },
    { id: '2', number: '5', title: 'Liderazgo' },
    { id: '3', number: '6', title: 'Planificación' },
    { id: '4', number: '7', title: 'Apoyo' },
    { id: '5', number: '8', title: 'Operación' },
    { id: '6', number: '9', title: 'Evaluación del desempeño' },
    { id: '7', number: '10', title: 'Mejora' },
  ];

  const departments = [
    { id: 'dept-1', name: 'Calidad' },
    { id: 'dept-2', name: 'Producción' },
    { id: 'dept-3', name: 'Recursos Humanos' },
    { id: 'dept-4', name: 'Administración' },
  ];

  const personnel = [
    { id: 'person-1', name: 'Ana García - Director de Calidad' },
    { id: 'person-2', name: 'Carlos Rodríguez - Coordinador SGC' },
    { id: 'person-3', name: 'María López - Jefe de Producción' },
    { id: 'person-4', name: 'José Martínez - Auditor Interno' },
  ];

  const processes = [
    { id: 'proc-1', name: 'Gestión de Calidad' },
    { id: 'proc-2', name: 'Producción' },
    { id: 'proc-3', name: 'Recursos Humanos' },
    { id: 'proc-4', name: 'Compras' },
  ];

  const complianceOptions = [
    { 
      value: 'not_evaluated', 
      label: 'No Evaluado', 
      color: 'bg-gray-100 text-gray-800',
      description: 'Aún no se ha evaluado el cumplimiento'
    },
    { 
      value: 'non_compliant', 
      label: 'No Conforme', 
      color: 'bg-red-100 text-red-800',
      description: 'No cumple con los requisitos'
    },
    { 
      value: 'partially_compliant', 
      label: 'Parcialmente Conforme', 
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Cumple parcialmente con los requisitos'
    },
    { 
      value: 'compliant', 
      label: 'Conforme', 
      color: 'bg-green-100 text-green-800',
      description: 'Cumple completamente con los requisitos'
    },
    { 
      value: 'not_applicable', 
      label: 'No Aplica', 
      color: 'bg-blue-100 text-blue-800',
      description: 'No es aplicable a la organización'
    },
  ];

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const updatedRequirements = [...requirements, newRequirement.trim()];
      setRequirements(updatedRequirements);
      setValue('requirements', updatedRequirements);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
    setValue('requirements', updatedRequirements);
  };

  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
    setValue('requirements', updatedRequirements);
  };

  const onSubmitForm = (data: ClauseFormData) => {
    onSubmit({
      ...data,
      requirements: requirements.filter(req => req.trim() !== '')
    });
  };

  const getComplianceColor = (status: ComplianceStatus) => {
    const option = complianceOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {clause ? 'Editar Cláusula ISO' : 'Nueva Cláusula ISO'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="clauseNumber">Número de Cláusula *</Label>
                <Input
                  id="clauseNumber"
                  {...register('clauseNumber')}
                  placeholder="Ej: 4.1, 7.2.1, 8.5.3"
                />
                {errors.clauseNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.clauseNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Título de la cláusula"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="level">Nivel de Jerarquía *</Label>
                <Select onValueChange={(value) => setValue('level', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nivel 1 - Capítulo Principal</SelectItem>
                    <SelectItem value="2">Nivel 2 - Subcláusula</SelectItem>
                    <SelectItem value="3">Nivel 3 - Sub-subcláusula</SelectItem>
                    <SelectItem value="4">Nivel 4 - Detalle</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-red-600 mt-1">{errors.level.message}</p>
                )}
              </div>

              {level > 1 && (
                <div>
                  <Label htmlFor="parentClauseId">Cláusula Padre</Label>
                  <Select onValueChange={(value) => setValue('parentClauseId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cláusula padre" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentClauses.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.number} - {parent.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="complianceStatus">Estado de Cumplimiento *</Label>
                <Select onValueChange={(value) => setValue('complianceStatus', value as ComplianceStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {complianceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.complianceStatus && (
                  <p className="text-sm text-red-600 mt-1">{errors.complianceStatus.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="compliancePercentage">Porcentaje de Cumplimiento</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="compliancePercentage"
                    type="number"
                    min="0"
                    max="100"
                    {...register('compliancePercentage', { valueAsNumber: true })}
                    placeholder="0-100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                {errors.compliancePercentage && (
                  <p className="text-sm text-red-600 mt-1">{errors.compliancePercentage.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nextEvaluationDate">Próxima Evaluación</Label>
                <Input
                  id="nextEvaluationDate"
                  type="date"
                  {...register('nextEvaluationDate')}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción detallada de la cláusula y su propósito..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <Label>Requisitos *</Label>
            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requisito ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Agregar nuevo requisito..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {errors.requirements && (
              <p className="text-sm text-red-600 mt-1">{errors.requirements.message}</p>
            )}
          </div>

          {/* Responsibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="responsibleDepartmentId">Departamento Responsable</Label>
              <Select onValueChange={(value) => setValue('responsibleDepartmentId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {dept.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="responsiblePersonId">Persona Responsable</Label>
              <Select onValueChange={(value) => setValue('responsiblePersonId', value)}>
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
            </div>
          </div>

          {/* Current Status Display */}
          {complianceStatus && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <span>Estado actual:</span>
                  <Badge className={getComplianceColor(complianceStatus)}>
                    {complianceOptions.find(opt => opt.value === complianceStatus)?.label}
                  </Badge>
                </div>
                <p className="text-sm mt-1">
                  {complianceOptions.find(opt => opt.value === complianceStatus)?.description}
                </p>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : clause ? 'Actualizar' : 'Crear Cláusula'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}