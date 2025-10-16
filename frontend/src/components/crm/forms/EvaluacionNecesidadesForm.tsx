'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RequisitoCliente {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'producto' | 'servicio' | 'proceso' | 'calidad' | 'entrega' | 'tecnico' | 'otro';
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'capturado' | 'en_revision' | 'aprobado' | 'rechazado' | 'implementado';
  fecha_captura: Date;
  fecha_revision?: Date;
  responsable: string;
  cumplimiento?: 'cumple' | 'no_cumple' | 'parcial';
  observaciones?: string;
}

interface EvaluacionNecesidades {
  campana_id?: string;
  campana_nombre?: string;
  tipo_relacionamiento: 'prospeccion' | 'seguimiento' | 'fidelizacion' | 'reactivacion' | 'cross_sell' | 'up_sell';
  canal_contacto: 'email' | 'telefono' | 'presencial' | 'whatsapp' | 'linkedin' | 'evento' | 'referido' | 'otro';
  fecha_contacto: Date;
  proximo_contacto?: Date;
  requisitos: RequisitoCliente[];
  evaluacion_completa: boolean;
  fecha_evaluacion: Date;
  responsable_evaluacion: string;
  puntuacion_requisitos: number;
  observaciones_generales?: string;
  requisitos_capturados: number;
  requisitos_aprobados: number;
  cumplimiento_porcentaje: number;
  fecha_revision_iso?: Date;
  nivel_interes: 'muy_alto' | 'alto' | 'medio' | 'bajo' | 'sin_interes';
  probabilidad_cierre: number;
  presupuesto_estimado?: number;
  decision_maker?: string;
  pain_points?: string[];
  necesidades_identificadas?: string[];
}

interface EvaluacionNecesidadesFormProps {
  initialData?: Partial<EvaluacionNecesidades>;
  onSubmit: (data: EvaluacionNecesidades) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

export default function EvaluacionNecesidadesForm({
  initialData,
  onSubmit,
  onCancel,
  readOnly = false
}: EvaluacionNecesidadesFormProps) {
  const [formData, setFormData] = useState<EvaluacionNecesidades>({
    tipo_relacionamiento: 'prospeccion',
    canal_contacto: 'email',
    fecha_contacto: new Date(),
    requisitos: [],
    evaluacion_completa: false,
    fecha_evaluacion: new Date(),
    responsable_evaluacion: '',
    puntuacion_requisitos: 3,
    requisitos_capturados: 0,
    requisitos_aprobados: 0,
    cumplimiento_porcentaje: 0,
    nivel_interes: 'medio',
    probabilidad_cierre: 50,
    pain_points: [],
    necesidades_identificadas: []
  });

  const [newPainPoint, setNewPainPoint] = useState('');
  const [newNecesidad, setNewNecesidad] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddRequisito = () => {
    const nuevoRequisito: RequisitoCliente = {
      id: Date.now().toString(),
      titulo: '',
      descripcion: '',
      tipo: 'producto',
      prioridad: 'media',
      estado: 'capturado',
      fecha_captura: new Date(),
      responsable: formData.responsable_evaluacion
    };

    setFormData(prev => ({
      ...prev,
      requisitos: [...prev.requisitos, nuevoRequisito]
    }));
  };

  const handleRemoveRequisito = (id: string) => {
    setFormData(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter(r => r.id !== id)
    }));
  };

  const handleUpdateRequisito = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      requisitos: prev.requisitos.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    }));
  };

  const handleAddPainPoint = () => {
    if (newPainPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        pain_points: [...(prev.pain_points || []), newPainPoint.trim()]
      }));
      setNewPainPoint('');
    }
  };

  const handleRemovePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pain_points: prev.pain_points?.filter((_, i) => i !== index)
    }));
  };

  const handleAddNecesidad = () => {
    if (newNecesidad.trim()) {
      setFormData(prev => ({
        ...prev,
        necesidades_identificadas: [...(prev.necesidades_identificadas || []), newNecesidad.trim()]
      }));
      setNewNecesidad('');
    }
  };

  const handleRemoveNecesidad = (index: number) => {
    setFormData(prev => ({
      ...prev,
      necesidades_identificadas: prev.necesidades_identificadas?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.responsable_evaluacion) {
      toast.error('El responsable de evaluación es requerido');
      return;
    }

    if (formData.requisitos.length === 0) {
      toast.error('Debe agregar al menos un requisito');
      return;
    }

    // Calcular métricas
    const requisitosCompletos = formData.requisitos.filter(r => r.titulo && r.descripcion);
    const requisitosAprobados = formData.requisitos.filter(r => r.estado === 'aprobado').length;
    const cumplimientoPorcentaje = requisitosCompletos.length > 0 
      ? Math.round((requisitosAprobados / requisitosCompletos.length) * 100)
      : 0;

    const dataToSubmit: EvaluacionNecesidades = {
      ...formData,
      requisitos_capturados: requisitosCompletos.length,
      requisitos_aprobados: requisitosAprobados,
      cumplimiento_porcentaje: cumplimientoPorcentaje,
      evaluacion_completa: requisitosCompletos.length > 0 && requisitosCompletos.every(r => r.estado === 'aprobado')
    };

    onSubmit(dataToSubmit);
  };

  const getNivelInteresColor = (nivel: string) => {
    const colors: Record<string, string> = {
      muy_alto: 'bg-green-100 text-green-800',
      alto: 'bg-blue-100 text-blue-800',
      medio: 'bg-yellow-100 text-yellow-800',
      bajo: 'bg-orange-100 text-orange-800',
      sin_interes: 'bg-red-100 text-red-800'
    };
    return colors[nivel] || 'bg-gray-100 text-gray-800';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información de Campaña y Relacionamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaña y Relacionamiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campana_nombre">Nombre de Campaña</Label>
              <Input
                id="campana_nombre"
                value={formData.campana_nombre || ''}
                onChange={(e) => handleInputChange('campana_nombre', e.target.value)}
                placeholder="Ej: Campaña Q1 2025"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="tipo_relacionamiento">Tipo de Relacionamiento *</Label>
              <Select
                value={formData.tipo_relacionamiento}
                onValueChange={(value) => handleInputChange('tipo_relacionamiento', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospeccion">Prospección</SelectItem>
                  <SelectItem value="seguimiento">Seguimiento</SelectItem>
                  <SelectItem value="fidelizacion">Fidelización</SelectItem>
                  <SelectItem value="reactivacion">Reactivación</SelectItem>
                  <SelectItem value="cross_sell">Cross Sell</SelectItem>
                  <SelectItem value="up_sell">Up Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="canal_contacto">Canal de Contacto *</Label>
              <Select
                value={formData.canal_contacto}
                onValueChange={(value) => handleInputChange('canal_contacto', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="referido">Referido</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fecha_contacto">Fecha de Contacto *</Label>
              <Input
                id="fecha_contacto"
                type="date"
                value={formData.fecha_contacto ? new Date(formData.fecha_contacto).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('fecha_contacto', new Date(e.target.value))}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="proximo_contacto">Próximo Contacto</Label>
              <Input
                id="proximo_contacto"
                type="date"
                value={formData.proximo_contacto ? new Date(formData.proximo_contacto).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('proximo_contacto', e.target.value ? new Date(e.target.value) : undefined)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="responsable_evaluacion">Responsable *</Label>
              <Input
                id="responsable_evaluacion"
                value={formData.responsable_evaluacion}
                onChange={(e) => handleInputChange('responsable_evaluacion', e.target.value)}
                placeholder="Nombre del responsable"
                disabled={readOnly}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos de Relacionamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de Relacionamiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nivel_interes">Nivel de Interés *</Label>
              <Select
                value={formData.nivel_interes}
                onValueChange={(value) => handleInputChange('nivel_interes', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muy_alto">Muy Alto</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                  <SelectItem value="sin_interes">Sin Interés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="probabilidad_cierre">Probabilidad de Cierre (%) *</Label>
              <Input
                id="probabilidad_cierre"
                type="number"
                min="0"
                max="100"
                value={formData.probabilidad_cierre}
                onChange={(e) => handleInputChange('probabilidad_cierre', parseInt(e.target.value))}
                disabled={readOnly}
                required
              />
            </div>

            <div>
              <Label htmlFor="presupuesto_estimado">Presupuesto Estimado</Label>
              <Input
                id="presupuesto_estimado"
                type="number"
                value={formData.presupuesto_estimado || ''}
                onChange={(e) => handleInputChange('presupuesto_estimado', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="0.00"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="decision_maker">Tomador de Decisiones</Label>
              <Input
                id="decision_maker"
                value={formData.decision_maker || ''}
                onChange={(e) => handleInputChange('decision_maker', e.target.value)}
                placeholder="Nombre del decisor"
                disabled={readOnly}
              />
            </div>
          </div>

          {/* Pain Points */}
          <div>
            <Label>Puntos de Dolor Identificados</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                placeholder="Agregar punto de dolor"
                disabled={readOnly}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPainPoint())}
              />
              <Button
                type="button"
                onClick={handleAddPainPoint}
                disabled={readOnly}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.pain_points?.map((point, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {point}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemovePainPoint(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Necesidades Identificadas */}
          <div>
            <Label>Necesidades Identificadas</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newNecesidad}
                onChange={(e) => setNewNecesidad(e.target.value)}
                placeholder="Agregar necesidad"
                disabled={readOnly}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNecesidad())}
              />
              <Button
                type="button"
                onClick={handleAddNecesidad}
                disabled={readOnly}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.necesidades_identificadas?.map((necesidad, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {necesidad}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNecesidad(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requisitos del Cliente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Requisitos del Cliente</CardTitle>
            {!readOnly && (
              <Button
                type="button"
                onClick={handleAddRequisito}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Requisito
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.requisitos.map((requisito, index) => (
            <Card key={requisito.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold">Requisito #{index + 1}</h4>
                {!readOnly && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveRequisito(requisito.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Título *</Label>
                  <Input
                    value={requisito.titulo}
                    onChange={(e) => handleUpdateRequisito(requisito.id, 'titulo', e.target.value)}
                    placeholder="Título del requisito"
                    disabled={readOnly}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Descripción *</Label>
                  <Textarea
                    value={requisito.descripcion}
                    onChange={(e) => handleUpdateRequisito(requisito.id, 'descripcion', e.target.value)}
                    placeholder="Descripción detallada"
                    disabled={readOnly}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Tipo *</Label>
                  <Select
                    value={requisito.tipo}
                    onValueChange={(value) => handleUpdateRequisito(requisito.id, 'tipo', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="producto">Producto</SelectItem>
                      <SelectItem value="servicio">Servicio</SelectItem>
                      <SelectItem value="proceso">Proceso</SelectItem>
                      <SelectItem value="calidad">Calidad</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prioridad *</Label>
                  <Select
                    value={requisito.prioridad}
                    onValueChange={(value) => handleUpdateRequisito(requisito.id, 'prioridad', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={requisito.estado}
                    onValueChange={(value) => handleUpdateRequisito(requisito.id, 'estado', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="capturado">Capturado</SelectItem>
                      <SelectItem value="en_revision">En Revisión</SelectItem>
                      <SelectItem value="aprobado">Aprobado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                      <SelectItem value="implementado">Implementado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cumplimiento</Label>
                  <Select
                    value={requisito.cumplimiento || ''}
                    onValueChange={(value) => handleUpdateRequisito(requisito.id, 'cumplimiento', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cumple">Cumple</SelectItem>
                      <SelectItem value="no_cumple">No Cumple</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Observaciones</Label>
                  <Textarea
                    value={requisito.observaciones || ''}
                    onChange={(e) => handleUpdateRequisito(requisito.id, 'observaciones', e.target.value)}
                    placeholder="Observaciones adicionales"
                    disabled={readOnly}
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))}
          {formData.requisitos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay requisitos agregados. Haz clic en "Agregar Requisito" para comenzar.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observaciones Generales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observaciones_generales || ''}
            onChange={(e) => handleInputChange('observaciones_generales', e.target.value)}
            placeholder="Observaciones generales sobre la evaluación..."
            disabled={readOnly}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Resumen de Métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Requisitos Capturados</p>
              <p className="text-2xl font-bold text-blue-600">{formData.requisitos_capturados}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Requisitos Aprobados</p>
              <p className="text-2xl font-bold text-green-600">{formData.requisitos_aprobados}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Cumplimiento</p>
              <p className="text-2xl font-bold text-purple-600">{formData.cumplimiento_porcentaje}%</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Nivel de Interés</p>
              <Badge className={getNivelInteresColor(formData.nivel_interes)}>
                {formData.nivel_interes.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      {!readOnly && (
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Guardar Evaluación
          </Button>
        </div>
      )}
    </form>
  );
}

