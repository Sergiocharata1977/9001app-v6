'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ProcessRecord, ProcessState, ProcessPriority } from '@/types/process-record';
import { X } from 'lucide-react';

interface ProcessRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  record?: ProcessRecord | null;
  isSaving?: boolean;
  organizationId: string;
}

const ProcessRecordModal: React.FC<ProcessRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  record,
  isSaving = false,
  organizationId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unique_code: '',
    process_definition_id: '',
    responsible_user_id: '',
    current_state: 'iniciado' as ProcessState,
    priority: 'medium' as ProcessPriority,
    progress_percentage: 0,
    due_date: '',
    tags: [] as string[],
    custom_data: {}
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title || '',
        description: record.description || '',
        unique_code: record.unique_code || '',
        process_definition_id: record.process_definition_id || '',
        responsible_user_id: record.responsible_user_id || '',
        current_state: record.current_state || 'iniciado',
        priority: record.priority || 'medium',
        progress_percentage: record.progress_percentage || 0,
        due_date: record.due_date ? record.due_date.split('T')[0] : '',
        tags: record.tags || [],
        custom_data: record.custom_data || {}
      });
    } else {
      // Reset form for new record
      setFormData({
        title: '',
        description: '',
        unique_code: `REG-${Date.now()}`,
        process_definition_id: '',
        responsible_user_id: '',
        current_state: 'iniciado',
        priority: 'medium',
        progress_percentage: 0,
        due_date: '',
        tags: [],
        custom_data: {}
      });
    }
    setTagInput('');
  }, [record, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      organization_id: organizationId,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
    };

    await onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {record ? 'Editar Registro' : 'Nuevo Registro de Proceso'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Título del registro de proceso"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código Único *
              </label>
              <Input
                value={formData.unique_code}
                onChange={(e) => handleInputChange('unique_code', e.target.value)}
                placeholder="REG-2024-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID Definición de Proceso
              </label>
              <Input
                value={formData.process_definition_id}
                onChange={(e) => handleInputChange('process_definition_id', e.target.value)}
                placeholder="proc-audit-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción detallada del registro de proceso"
              rows={3}
            />
          </div>

          {/* Estado y prioridad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <Select
                value={formData.current_state}
                onChange={(value) => handleInputChange('current_state', value)}
                options={[
                  { value: 'iniciado', label: 'Iniciado' },
                  { value: 'en_progreso', label: 'En Progreso' },
                  { value: 'revision', label: 'En Revisión' },
                  { value: 'aprobado', label: 'Aprobado' },
                  { value: 'completado', label: 'Completado' },
                  { value: 'cancelado', label: 'Cancelado' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prioridad
              </label>
              <Select
                value={formData.priority}
                onChange={(value) => handleInputChange('priority', value)}
                options={[
                  { value: 'low', label: 'Baja' },
                  { value: 'medium', label: 'Media' },
                  { value: 'high', label: 'Alta' },
                  { value: 'critical', label: 'Crítica' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Progreso (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.progress_percentage}
                onChange={(e) => handleInputChange('progress_percentage', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Fechas y responsable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Límite
              </label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID Usuario Responsable
              </label>
              <Input
                value={formData.responsible_user_id}
                onChange={(e) => handleInputChange('responsible_user_id', e.target.value)}
                placeholder="user-001"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar etiqueta"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              disabled={!formData.title.trim() || !formData.unique_code.trim()}
            >
              {record ? 'Actualizar' : 'Crear'} Registro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessRecordModal;