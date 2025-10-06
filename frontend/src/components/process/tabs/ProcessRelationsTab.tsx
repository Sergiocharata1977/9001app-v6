'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Link,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Target
} from 'lucide-react';
import { relationService } from '@/services/relationService';
import { RelationsTable } from '@/components/relations/RelationsTable';
import { RelationModal } from '@/components/relations/RelationModal';
import type { NormProcessDocRelation } from '@/types/relation';

interface ProcessRelationsTabProps {
  processId: string;
}

export function ProcessRelationsTab({ processId }: ProcessRelationsTabProps) {
  const [relations, setRelations] = useState<NormProcessDocRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<NormProcessDocRelation | null>(null);

  useEffect(() => {
    loadRelations();
  }, [processId]);

  const loadRelations = async () => {
    try {
      setLoading(true);
      // Get relations filtered by this process
      const allRelations = await relationService.getRelations();
      const processRelations = allRelations.filter(r => r.process_id._id === processId);
      setRelations(processRelations);
    } catch (error) {
      console.error('Error loading relations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRelation = () => {
    setEditingRelation(null);
    setIsModalOpen(true);
  };

  const handleEditRelation = (relation: NormProcessDocRelation) => {
    setEditingRelation(relation);
    setIsModalOpen(true);
  };

  const handleDeleteRelation = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta relación?')) {
      try {
        await relationService.deleteRelation(id);
        await loadRelations();
      } catch (err) {
        console.error('Error deleting relation:', err);
        alert('Error al eliminar la relación');
      }
    }
  };

  const handleModalSave = async () => {
    await loadRelations();
    setIsModalOpen(false);
    setEditingRelation(null);
  };

  // Calculate compliance stats for this process
  const getComplianceStats = () => {
    const total = relations.length;
    const completo = relations.filter(r => r.compliance_status === 'completo').length;
    const parcial = relations.filter(r => r.compliance_status === 'parcial').length;
    const pendiente = relations.filter(r => r.compliance_status === 'pendiente').length;
    const noAplica = relations.filter(r => r.compliance_status === 'no_aplica').length;
    const averagePercentage = total > 0
      ? Math.round(relations.reduce((sum, r) => sum + r.compliance_percentage, 0) / total)
      : 0;

    return { total, completo, parcial, pendiente, noAplica, averagePercentage };
  };

  const stats = getComplianceStats();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Relaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completo}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Parciales</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.parcial}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cumplimiento</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averagePercentage}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de relaciones */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Relaciones con Norma ISO 9001</h2>
          <Button onClick={handleCreateRelation}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Relación
          </Button>
        </div>

        {relations.length === 0 ? (
          <div className="text-center py-12">
            <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No hay relaciones definidas para este proceso</p>
            <p className="text-sm text-gray-400 mb-6">
              Las relaciones permiten vincular este proceso con puntos específicos de la norma ISO 9001
            </p>
            <Button onClick={handleCreateRelation} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Relación
            </Button>
          </div>
        ) : (
          <RelationsTable
            relations={relations}
            isLoading={false}
            onEdit={handleEditRelation}
            onDelete={handleDeleteRelation}
          />
        )}
      </Card>

      {/* Modal */}
      <RelationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRelation(null);
        }}
        onSave={handleModalSave}
        relation={editingRelation}
      />
    </div>
  );
}