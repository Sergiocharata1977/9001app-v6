'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, FileText, Link } from 'lucide-react';

interface CreateTaskData {
  title: string;
  description?: string;
  objectives?: string;
  module: string;
  status: string;
  priority: string;
  type: string;
  responsible?: string;
  assignedTo?: string;
  estimatedDays?: number;
  tags: string[];
  abmType?: string;
  phase: string;
  order: number;
  linkedMdFiles: string[];
  attachedDocuments: {
    name: string;
    path: string;
    type: string;
  }[];
}

interface TaskFormProps {
  task?: any;
  onSubmit: (data: CreateTaskData) => void;
  onCancel: () => void;
}

export default function EnhancedTaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: task?.title || '',
    description: task?.description || '',
    objectives: task?.objectives || '',
    module: task?.module || 'general',
    status: task?.status || 'backlog',
    priority: task?.priority || 'medium',
    type: task?.type || 'feature',
    responsible: task?.responsible || '',
    assignedTo: task?.assignedTo || '',
    estimatedDays: task?.estimatedDays || undefined,
    tags: task?.tags || [],
    abmType: task?.abmType || undefined,
    phase: task?.phase || 'backlog',
    order: task?.order || 0,
    linkedMdFiles: task?.linkedMdFiles || [],
    attachedDocuments: task?.attachedDocuments || []
  });

  const [tagInput, setTagInput] = useState('');
  const [mdFileInput, setMdFileInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const addMdFile = () => {
    if (mdFileInput && !formData.linkedMdFiles.includes(mdFileInput)) {
      setFormData({
        ...formData,
        linkedMdFiles: [...formData.linkedMdFiles, mdFileInput]
      });
      setMdFileInput('');
    }
  };

  const removeMdFile = (file: string) => {
    setFormData({
      ...formData,
      linkedMdFiles: formData.linkedMdFiles.filter(f => f !== file)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocuments = Array.from(files).map(file => ({
        name: file.name,
        path: `uploads/${file.name}`,
        type: file.type
      }));
      
      setFormData({
        ...formData,
        attachedDocuments: [...formData.attachedDocuments, ...newDocuments]
      });
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      attachedDocuments: formData.attachedDocuments.filter((_, i) => i !== index)
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {task ? 'Editar Tarea' : 'Nueva Tarea'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Implementar CRUD de Auditorías"
              />
            </div>

            <div>
              <Label htmlFor="module">Módulo *</Label>
              <Select value={formData.module} onValueChange={(value) => setFormData({ ...formData, module: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="rrhh">RRHH</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="auditorias">Auditorías</SelectItem>
                  <SelectItem value="procesos">Procesos</SelectItem>
                  <SelectItem value="documentos">Documentos</SelectItem>
                  <SelectItem value="normas">Normas</SelectItem>
                  <SelectItem value="calidad">Calidad</SelectItem>
                  <SelectItem value="productos">Productos</SelectItem>
                  <SelectItem value="riesgos">Riesgos</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe la tarea..."
              rows={3}
            />
          </div>

          {/* Objetivos */}
          <div>
            <Label htmlFor="objectives">Objetivos</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              placeholder="Define los objetivos específicos de esta tarea..."
              rows={4}
            />
          </div>

          {/* Configuración de la Tarea */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="priority">Prioridad *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="improvement">Mejora</SelectItem>
                  <SelectItem value="documentation">Documentación</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="abm">ABM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phase">Fase</Label>
              <Select value={formData.phase} onValueChange={(value) => setFormData({ ...formData, phase: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="v6.1">v6.1</SelectItem>
                  <SelectItem value="v6.5">v6.5</SelectItem>
                  <SelectItem value="v7.0">v7.0</SelectItem>
                  <SelectItem value="v8.0">v8.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Asignación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedTo">Asignado a</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="IA, Developer, Team..."
              />
            </div>

            <div>
              <Label htmlFor="estimatedDays">Días estimados</Label>
              <Input
                id="estimatedDays"
                type="number"
                value={formData.estimatedDays || ''}
                onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="5"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Archivos MD Relacionados */}
          <div>
            <Label className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Archivos .md Relacionados
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={mdFileInput}
                onChange={(e) => setMdFileInput(e.target.value)}
                placeholder="ruta/del/archivo.md"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMdFile())}
              />
              <Button type="button" onClick={addMdFile} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.linkedMdFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm font-mono">{file}</span>
                  <X 
                    className="h-4 w-4 cursor-pointer text-red-500" 
                    onClick={() => removeMdFile(file)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Documentos Adjuntos */}
          <div>
            <Label>Documentos Adjuntos</Label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="mt-2 space-y-1">
              {formData.attachedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{doc.name}</span>
                  <X 
                    className="h-4 w-4 cursor-pointer text-red-500" 
                    onClick={() => removeDocument(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? 'Actualizar Tarea' : 'Crear Tarea'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
