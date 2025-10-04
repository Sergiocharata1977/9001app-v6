'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save,
  X,
  FileText,
  User,
  Target,
  Workflow,
  Plus,
  Trash2
} from 'lucide-react';
import { ProcessDefinition } from '@/shared-types/processes';

interface ProcessMasterFormProps {
  initialData?: Partial<ProcessDefinition>;
  onSubmit: (data: Partial<ProcessDefinition>) => Promise<void>;
  onCancel: () => void;
}

export function ProcessMasterForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: ProcessMasterFormProps) {
  const [formData, setFormData] = useState<Partial<ProcessDefinition>>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    tipo: initialData?.tipo || 'operativo',
    estado: initialData?.estado || 'activo',
    owner: initialData?.owner || '',
    objective: initialData?.objective || '',
    description: initialData?.description || '',
    scope: initialData?.scope || '',
    inputs: initialData?.inputs || [''],
    outputs: initialData?.outputs || [''],
    related_documents: initialData?.related_documents || ['']
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof ProcessDefinition, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'inputs' | 'outputs' | 'related_documents', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const addArrayItem = (field: 'inputs' | 'outputs' | 'related_documents') => {
    const newArray = [...(formData[field] || []), ''];
    handleChange(field, newArray);
  };

  const removeArrayItem = (field: 'inputs' | 'outputs' | 'related_documents', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    handleChange(field, newArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error guardando proceso:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Información Básica
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proceso *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Proceso de Ventas"
            />
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Ej: PROC-001"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Proceso *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
            >
              <option value="estrategico">Estratégico</option>
              <option value="operativo">Operativo</option>
              <option value="apoyo">Apoyo</option>
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Responsable del Proceso *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              placeholder="Nombre del responsable"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_revision">En Revisión</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alcance y Objetivos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Alcance y Objetivos
        </h2>

        <div className="space-y-6">
          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo del Proceso *
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.objective}
              onChange={(e) => handleChange('objective', e.target.value)}
              placeholder="Describe el objetivo principal del proceso..."
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe el proceso en detalle..."
            />
          </div>

          {/* Alcance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alcance
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.scope}
              onChange={(e) => handleChange('scope', e.target.value)}
              placeholder="Define el alcance del proceso..."
            />
          </div>
        </div>
      </Card>

      {/* Entradas y Salidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Entradas</h3>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => addArrayItem('inputs')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>

          <div className="space-y-3">
            {formData.inputs?.map((input, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={input}
                  onChange={(e) => handleArrayChange('inputs', index, e.target.value)}
                  placeholder="Entrada del proceso"
                />
                {formData.inputs!.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('inputs', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Salidas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Salidas</h3>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => addArrayItem('outputs')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>

          <div className="space-y-3">
            {formData.outputs?.map((output, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={output}
                  onChange={(e) => handleArrayChange('outputs', index, e.target.value)}
                  placeholder="Salida del proceso"
                />
                {formData.outputs!.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('outputs', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Documentos Relacionados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Relacionados
          </h3>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={() => addArrayItem('related_documents')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Documento
          </Button>
        </div>

        <div className="space-y-3">
          {formData.related_documents?.map((doc, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                value={doc}
                onChange={(e) => handleArrayChange('related_documents', index, e.target.value)}
                placeholder="Código o nombre del documento"
              />
              {formData.related_documents!.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('related_documents', index)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Botones de Acción */}
      <Card className="p-6">
        <div className="flex justify-end gap-3">
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : (initialData ? 'Actualizar Proceso' : 'Crear Proceso')}
          </Button>
        </div>
      </Card>
    </form>
  );
}

