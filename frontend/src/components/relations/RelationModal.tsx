'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Plus,
  Loader2
} from 'lucide-react';
import { relationService } from '@/services/relationService';
import { normPointService } from '@/services/normPointService';
import { processUnifiedService } from '@/services/processUnifiedService';
import { processDocumentService } from '@/services/processDocumentService';
import type { NormProcessDocRelation, CreateRelationData, UpdateRelationData } from '@/types/relation';
import type { NormPoint } from '@/services/normPointService';
import type { ProcessDocument } from '@/services/processDocumentService';

interface RelationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  relation?: NormProcessDocRelation | null;
}

export function RelationModal({ isOpen, onClose, onSave, relation }: RelationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState<CreateRelationData>({
    norm_point_id: '',
    process_id: '',
    document_ids: [],
    compliance_status: 'pendiente',
    compliance_percentage: 0,
    evidence_description: '',
    evidence_files: [],
    responsible_user_id: '',
    verification_date: '',
    next_review_date: '',
    organization_id: '1',
    created_by: 'user-id' // This should come from auth context
  });

  // Data for dropdowns
  const [normPoints, setNormPoints] = useState<NormPoint[]>([]);
  const [processes, setProcesses] = useState<any[]>([]);
  const [documents, setDocuments] = useState<ProcessDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<ProcessDocument[]>([]);

  // Load data for dropdowns
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  // Initialize form when editing
  useEffect(() => {
    if (relation && isOpen) {
      setFormData({
        norm_point_id: relation.norm_point_id._id,
        process_id: relation.process_id._id,
        document_ids: relation.document_ids.map(d => d._id),
        compliance_status: relation.compliance_status,
        compliance_percentage: relation.compliance_percentage,
        evidence_description: relation.evidence_description || '',
        evidence_files: relation.evidence_files || [],
        responsible_user_id: relation.responsible_user_id?._id || '',
        verification_date: relation.verification_date || '',
        next_review_date: relation.next_review_date || '',
        organization_id: relation.organization_id,
        created_by: relation.created_by
      });

      // Load selected documents
      const selectedDocs = documents.filter(doc => relation.document_ids.some(rd => rd._id === doc._id));
      setSelectedDocuments(selectedDocs);
    } else if (isOpen) {
      // Reset form for new relation
      setFormData({
        norm_point_id: '',
        process_id: '',
        document_ids: [],
        compliance_status: 'pendiente',
        compliance_percentage: 0,
        evidence_description: '',
        evidence_files: [],
        responsible_user_id: '',
        verification_date: '',
        next_review_date: '',
        organization_id: '1',
        created_by: 'user-id'
      });
      setSelectedDocuments([]);
    }
  }, [relation, isOpen, documents]);

  const loadDropdownData = async () => {
    setIsLoading(true);
    try {
      const [normPointsData, processesData, documentsData] = await Promise.all([
        normPointService.getNormPoints(),
        processUnifiedService.getAllProcesses('1'),
        processDocumentService.getDocuments('1')
      ]);

      setNormPoints(normPointsData);
      setProcesses(processesData.data || []);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update form data with selected documents
    const submitData = {
      ...formData,
      document_ids: selectedDocuments.map(doc => doc._id)
    };

    setIsSaving(true);
    try {
      if (relation) {
        // Update existing relation
        await relationService.updateRelation(relation._id, submitData as UpdateRelationData);
      } else {
        // Create new relation
        await relationService.createRelation(submitData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving relation:', error);
      alert('Error al guardar la relación');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentToggle = (document: ProcessDocument) => {
    setSelectedDocuments(prev => {
      const isSelected = prev.some(doc => doc._id === document._id);
      if (isSelected) {
        return prev.filter(doc => doc._id !== document._id);
      } else {
        return [...prev, document];
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completo': return 'bg-green-100 text-green-800';
      case 'parcial': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-red-100 text-red-800';
      case 'no_aplica': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {relation ? 'Editar Relación' : 'Crear Nueva Relación'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="norm_point">Punto de Norma *</Label>
              <Select
                value={formData.norm_point_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, norm_point_id: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar punto de norma" />
                </SelectTrigger>
                <SelectContent>
                  {normPoints.map((point) => (
                    <SelectItem key={point._id} value={point._id}>
                      {point.code} - {point.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="process">Proceso *</Label>
              <Select
                value={formData.process_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, process_id: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proceso" />
                </SelectTrigger>
                <SelectContent>
                  {processes.map((process) => (
                    <SelectItem key={process._id} value={process._id}>
                      {process.name} {process.codigo && `(${process.codigo})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Estado de Cumplimiento *</Label>
              <Select
                value={formData.compliance_status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, compliance_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completo">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Completo
                    </div>
                  </SelectItem>
                  <SelectItem value="parcial">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Parcial
                    </div>
                  </SelectItem>
                  <SelectItem value="pendiente">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Pendiente
                    </div>
                  </SelectItem>
                  <SelectItem value="no_aplica">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      No Aplica
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Porcentaje de Cumplimiento</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={formData.compliance_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, compliance_percentage: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label>Documentos Relacionados</Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedDocuments.map((doc) => (
                  <Badge key={doc._id} variant="secondary" className="flex items-center gap-1">
                    {doc.title}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleDocumentToggle(doc)}
                    />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => {
                const doc = documents.find(d => d._id === value);
                if (doc) handleDocumentToggle(doc);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Agregar documento..." />
                </SelectTrigger>
                <SelectContent>
                  {documents
                    .filter(doc => !selectedDocuments.some(sd => sd._id === doc._id))
                    .map((doc) => (
                      <SelectItem key={doc._id} value={doc._id}>
                        {doc.title} - {doc.type}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Evidence Description */}
          <div className="space-y-2">
            <Label htmlFor="evidence">Descripción de Evidencia</Label>
            <Textarea
              id="evidence"
              value={formData.evidence_description}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence_description: e.target.value }))}
              placeholder="Describa la evidencia que demuestra el cumplimiento..."
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="verification_date">Fecha de Verificación</Label>
              <Input
                id="verification_date"
                type="date"
                value={formData.verification_date}
                onChange={(e) => setFormData(prev => ({ ...prev, verification_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_review_date">Próxima Revisión</Label>
              <Input
                id="next_review_date"
                type="date"
                value={formData.next_review_date}
                onChange={(e) => setFormData(prev => ({ ...prev, next_review_date: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {relation ? 'Actualizar' : 'Crear'} Relación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}