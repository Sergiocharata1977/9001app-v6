'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Finding, FindingSource, FindingType, FindingSeverity, FindingCategory, RiskLevel, FindingPriority } from '@/shared-types/entities/Finding';
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  User, 
  Building2, 
  Calendar,
  FileText,
  Camera,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const findingSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'Máximo 1000 caracteres'),
  source: z.enum(['audit', 'employee', 'customer', 'supplier', 'management', 'inspection', 'complaint', 'incident', 'self_assessment']),
  sourceId: z.string().min(1, 'El origen es requerido'),
  sourceName: z.string().min(1, 'El nombre del origen es requerido'),
  sourceReference: z.string().optional(),
  findingType: z.enum(['non_conformity', 'observation', 'opportunity', 'positive_finding', 'risk', 'complaint']),
  severity: z.enum(['critical', 'major', 'minor', 'low']),
  category: z.enum(['quality', 'safety', 'environmental', 'regulatory', 'process', 'documentation', 'training', 'equipment', 'supplier', 'customer_service']),
  riskLevel: z.enum(['very_high', 'high', 'medium', 'low', 'very_low']),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  departmentId: z.string().optional(),
  processId: z.string().optional(),
  location: z.string().optional(),
  isoClause: z.string().optional(),
  requirement: z.string().optional(),
  evidence: z.string().min(1, 'La evidencia es requerida'),
  responsiblePersonId: z.string().optional(),
  targetCloseDate: z.string().optional(),
  rootCause: z.string().optional(),
  contributingFactors: z.string().optional(),
  customerImpact: z.boolean().default(false),
  regulatoryImpact: z.boolean().default(false),
});

type FindingFormData = z.infer<typeof findingSchema>;

interface FindingFormV2Props {
  finding?: Finding | null;
  onSubmit: (data: FindingFormData) => void;
  onCancel: () => void;
}

export function FindingFormV2({ finding, onSubmit, onCancel }: FindingFormV2Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FindingFormData>({
    resolver: zodResolver(findingSchema),
    defaultValues: {
      title: finding?.title || '',
      description: finding?.description || '',
      source: finding?.source || 'audit',
      sourceId: finding?.sourceId || '',
      sourceName: finding?.sourceName || '',
      sourceReference: finding?.sourceReference || '',
      findingType: finding?.findingType || 'non_conformity',
      severity: finding?.severity || 'minor',
      category: finding?.category || 'quality',
      riskLevel: finding?.riskLevel || 'medium',
      priority: finding?.priority || 'medium',
      departmentId: finding?.departmentId || '',
      processId: finding?.processId || '',
      location: finding?.location || '',
      isoClause: finding?.isoClause || '',
      requirement: finding?.requirement || '',
      evidence: finding?.evidence || '',
      responsiblePersonId: finding?.responsiblePersonId || '',
      targetCloseDate: finding?.targetCloseDate?.toISOString().split('T')[0] || '',
      rootCause: finding?.rootCause || '',
      contributingFactors: finding?.contributingFactors?.join(', ') || '',
      customerImpact: finding?.customerImpact || false,
      regulatoryImpact: finding?.regulatoryImpact || false,
    }
  });

  const source = watch('source');
  const severity = watch('severity');
  const findingType = watch('findingType');

  // Mock data - en producción vendrían de la API
  const sourceOptions = {
    audit: { label: 'Auditoría', icon: CheckCircle, color: 'text-blue-600' },
    employee: { label: 'Empleado', icon: User, color: 'text-green-600' },
    customer: { label: 'Cliente', icon: User, color: 'text-purple-600' },
    supplier: { label: 'Proveedor', icon: Building2, color: 'text-orange-600' },
    management: { label: 'Dirección', icon: Target, color: 'text-red-600' },
    inspection: { label: 'Inspección', icon: AlertCircle, color: 'text-yellow-600' },
    complaint: { label: 'Queja', icon: AlertTriangle, color: 'text-red-500' },
    incident: { label: 'Incidente', icon: AlertTriangle, color: 'text-red-700' },
    self_assessment: { label: 'Autoevaluación', icon: FileText, color: 'text-indigo-600' }
  };

  const typeOptions = [
    { value: 'non_conformity', label: 'No Conformidad', color: 'bg-red-100 text-red-800' },
    { value: 'observation', label: 'Observación', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'opportunity', label: 'Oportunidad de Mejora', color: 'bg-blue-100 text-blue-800' },
    { value: 'positive_finding', label: 'Hallazgo Positivo', color: 'bg-green-100 text-green-800' },
    { value: 'risk', label: 'Riesgo Identificado', color: 'bg-orange-100 text-orange-800' },
    { value: 'complaint', label: 'Queja', color: 'bg-purple-100 text-purple-800' }
  ];

  const severityOptions = [
    { value: 'critical', label: 'Crítico', color: 'bg-red-100 text-red-800', description: 'Impacto inmediato en la calidad/seguridad' },
    { value: 'major', label: 'Mayor', color: 'bg-orange-100 text-orange-800', description: 'Impacto significativo en el sistema' },
    { value: 'minor', label: 'Menor', color: 'bg-yellow-100 text-yellow-800', description: 'Impacto limitado, fácil corrección' },
    { value: 'low', label: 'Bajo', color: 'bg-blue-100 text-blue-800', description: 'Impacto mínimo o potencial' }
  ];

  const categoryOptions = [
    { value: 'quality', label: 'Calidad' },
    { value: 'safety', label: 'Seguridad' },
    { value: 'environmental', label: 'Ambiental' },
    { value: 'regulatory', label: 'Regulatorio' },
    { value: 'process', label: 'Proceso' },
    { value: 'documentation', label: 'Documentación' },
    { value: 'training', label: 'Capacitación' },
    { value: 'equipment', label: 'Equipos' },
    { value: 'supplier', label: 'Proveedor' },
    { value: 'customer_service', label: 'Servicio al Cliente' }
  ];

  const riskLevels = [
    { value: 'very_high', label: 'Muy Alto', color: 'bg-red-100 text-red-800' },
    { value: 'high', label: 'Alto', color: 'bg-orange-100 text-orange-800' },
    { value: 'medium', label: 'Medio', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Bajo', color: 'bg-blue-100 text-blue-800' },
    { value: 'very_low', label: 'Muy Bajo', color: 'bg-green-100 text-green-800' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' }
  ];

  const departments = [
    { id: 'dept-1', name: 'Calidad' },
    { id: 'dept-2', name: 'Producción' },
    { id: 'dept-3', name: 'Recursos Humanos' },
    { id: 'dept-4', name: 'Administración' },
    { id: 'dept-5', name: 'Ventas' },
    { id: 'dept-6', name: 'Compras' }
  ];

  const processes = [
    { id: 'proc-1', name: 'Gestión de Calidad' },
    { id: 'proc-2', name: 'Producción' },
    { id: 'proc-3', name: 'Recursos Humanos' },
    { id: 'proc-4', name: 'Compras' },
    { id: 'proc-5', name: 'Ventas' }
  ];

  const personnel = [
    { id: 'person-1', name: 'Ana García - Director de Calidad' },
    { id: 'person-2', name: 'Carlos Rodríguez - Coordinador SGC' },
    { id: 'person-3', name: 'María López - Jefe de Producción' },
    { id: 'person-4', name: 'José Martínez - Supervisor' }
  ];

  const getSeverityColor = (severity: string) => {
    const option = severityOptions.find(opt => opt.value === severity);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const onSubmitForm = (data: FindingFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {finding ? 'Editar Hallazgo' : 'Nuevo Hallazgo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Hallazgo *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Descripción breve del hallazgo"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="source">Origen del Hallazgo *</Label>
                <Select onValueChange={(value) => setValue('source', value as FindingSource)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar origen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sourceOptions).map(([key, option]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <option.icon className={`h-4 w-4 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.source && (
                  <p className="text-sm text-red-600 mt-1">{errors.source.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sourceName">Nombre del Origen *</Label>
                <Input
                  id="sourceName"
                  {...register('sourceName')}
                  placeholder={
                    source === 'audit' ? 'Ej: Auditoría Interna 2024-01' :
                    source === 'employee' ? 'Ej: Juan Pérez - Operario' :
                    source === 'customer' ? 'Ej: Cliente ABC Corp' :
                    'Nombre específico del origen'
                  }
                />
                {errors.sourceName && (
                  <p className="text-sm text-red-600 mt-1">{errors.sourceName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sourceReference">Referencia Adicional</Label>
                <Input
                  id="sourceReference"
                  {...register('sourceReference')}
                  placeholder="Número de referencia, código, etc."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="findingType">Tipo de Hallazgo *</Label>
                <Select onValueChange={(value) => setValue('findingType', value as FindingType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={type.color}>
                            {type.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.findingType && (
                  <p className="text-sm text-red-600 mt-1">{errors.findingType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="severity">Severidad *</Label>
                <Select onValueChange={(value) => setValue('severity', value as FindingSeverity)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((severity) => (
                      <SelectItem key={severity.value} value={severity.value}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={severity.color}>
                              {severity.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">{severity.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.severity && (
                  <p className="text-sm text-red-600 mt-1">{errors.severity.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select onValueChange={(value) => setValue('category', value as FindingCategory)}>
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
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Prioridad *</Label>
                <Select onValueChange={(value) => setValue('priority', value as FindingPriority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción Detallada *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción completa del hallazgo, incluyendo contexto y detalles específicos..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Evidence */}
          <div>
            <Label htmlFor="evidence">Evidencia *</Label>
            <Textarea
              id="evidence"
              {...register('evidence')}
              placeholder="Descripción de la evidencia que sustenta el hallazgo..."
              rows={3}
            />
            {errors.evidence && (
              <p className="text-sm text-red-600 mt-1">{errors.evidence.message}</p>
            )}
          </div>

          {/* Location and Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="departmentId">Departamento</Label>
              <Select onValueChange={(value) => setValue('departmentId', value)}>
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
              <Label htmlFor="processId">Proceso</Label>
              <Select onValueChange={(value) => setValue('processId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proceso" />
                </SelectTrigger>
                <SelectContent>
                  {processes.map((process) => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Ubicación específica"
              />
            </div>
          </div>

          {/* ISO and Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isoClause">Cláusula ISO</Label>
              <Input
                id="isoClause"
                {...register('isoClause')}
                placeholder="Ej: 4.2.3, 7.1.2"
              />
            </div>

            <div>
              <Label htmlFor="requirement">Requisito Específico</Label>
              <Input
                id="requirement"
                {...register('requirement')}
                placeholder="Requisito no cumplido"
              />
            </div>
          </div>

          {/* Responsibility and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsiblePersonId">Responsable</Label>
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

            <div>
              <Label htmlFor="targetCloseDate">Fecha Objetivo de Cierre</Label>
              <Input
                id="targetCloseDate"
                type="date"
                {...register('targetCloseDate')}
              />
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="rootCause">Causa Raíz</Label>
              <Textarea
                id="rootCause"
                {...register('rootCause')}
                placeholder="Análisis de la causa raíz del hallazgo..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="contributingFactors">Factores Contribuyentes</Label>
              <Input
                id="contributingFactors"
                {...register('contributingFactors')}
                placeholder="Factores separados por comas"
              />
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="space-y-4">
            <Label>Evaluación de Impacto</Label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customerImpact"
                  onCheckedChange={(checked) => setValue('customerImpact', !!checked)}
                />
                <Label htmlFor="customerImpact" className="text-sm">
                  Impacto en Cliente
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="regulatoryImpact"
                  onCheckedChange={(checked) => setValue('regulatoryImpact', !!checked)}
                />
                <Label htmlFor="regulatoryImpact" className="text-sm">
                  Impacto Regulatorio
                </Label>
              </div>
            </div>
          </div>

          {/* Current Status Display */}
          {severity && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <span>Severidad seleccionada:</span>
                  <Badge className={getSeverityColor(severity)}>
                    {severityOptions.find(opt => opt.value === severity)?.label}
                  </Badge>
                </div>
                <p className="text-sm mt-1">
                  {severityOptions.find(opt => opt.value === severity)?.description}
                </p>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : finding ? 'Actualizar' : 'Crear Hallazgo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}