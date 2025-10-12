'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, Plus } from 'lucide-react';

interface RequisitoFormData {
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: string;
  responsable: string;
  observaciones?: string;
}

interface RequisitoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequisitoFormData) => void;
  loading?: boolean;
  initialData?: Partial<RequisitoFormData>;
}

export default function RequisitoForm({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = {}
}: RequisitoFormProps) {
  const [formData, setFormData] = useState<RequisitoFormData>({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    tipo: initialData?.tipo || '',
    prioridad: initialData?.prioridad || '',
    responsable: initialData?.responsable || '',
    observaciones: initialData?.observaciones || ''
  });

  const [errors, setErrors] = useState<Partial<RequisitoFormData>>({});

  const handleInputChange = (field: keyof RequisitoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RequisitoFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (!formData.prioridad) {
      newErrors.prioridad = 'La prioridad es requerida';
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: '',
      prioridad: '',
      responsable: '',
      observaciones: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <CardTitle className="text-xl font-bold">
            {initialData.titulo ? 'Editar Requisito' : 'Nuevo Requisito del Cliente'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="titulo">Título del Requisito *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Ej: Certificación orgánica"
                className={errors.titulo ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.titulo && (
                <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Requisito *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange('tipo', value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.tipo ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tipo" />
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
              {errors.tipo && (
                <p className="text-sm text-red-500 mt-1">{errors.tipo}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Descripción detallada del requisito"
              rows={4}
              className={errors.descripcion ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="prioridad">Prioridad *</Label>
              <Select
                value={formData.prioridad}
                onValueChange={(value) => handleInputChange('prioridad', value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.prioridad ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
              {errors.prioridad && (
                <p className="text-sm text-red-500 mt-1">{errors.prioridad}</p>
              )}
            </div>

            <div>
              <Label htmlFor="responsable">Responsable *</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => handleInputChange('responsable', e.target.value)}
                placeholder="Nombre del responsable"
                className={errors.responsable ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.responsable && (
                <p className="text-sm text-red-500 mt-1">{errors.responsable}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales (opcional)"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {initialData.titulo ? 'Actualizar' : 'Crear'} Requisito
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}




