'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  Link,
  FileText,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { RelationsTable } from '@/components/relations/RelationsTable';
import { RelationModal } from '@/components/relations/RelationModal';
import { relationService } from '@/services/relationService';
import type { NormProcessDocRelation, RelationFilters } from '@/types/relation';

export default function RelacionesNormaPage() {
  const [relations, setRelations] = useState<NormProcessDocRelation[]>([]);
  const [filteredRelations, setFilteredRelations] = useState<NormProcessDocRelation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<NormProcessDocRelation | null>(null);
  const [filters, setFilters] = useState<RelationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load relations
  const loadRelations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await relationService.getRelations(filters);
      setRelations(data);
      setFilteredRelations(data);
    } catch (err) {
      setError('Error al cargar las relaciones');
      console.error('Error loading relations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter relations based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRelations(relations);
    } else {
      const filtered = relations.filter(relation =>
        relation.norm_point_id.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.norm_point_id.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.process_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.process_id.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRelations(filtered);
    }
  }, [relations, searchTerm]);

  // Load relations on mount and when filters change
  useEffect(() => {
    loadRelations();
  }, [filters]);

  // Handle create relation
  const handleCreateRelation = () => {
    setEditingRelation(null);
    setIsModalOpen(true);
  };

  // Handle edit relation
  const handleEditRelation = (relation: NormProcessDocRelation) => {
    setEditingRelation(relation);
    setIsModalOpen(true);
  };

  // Handle delete relation
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

  // Handle modal save
  const handleModalSave = async () => {
    await loadRelations();
    setIsModalOpen(false);
    setEditingRelation(null);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof RelationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  // Get compliance stats
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completo': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'parcial': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pendiente': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'no_aplica': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadRelations}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relaciones Norma-Proceso-Documento</h1>
          <p className="text-gray-600 mt-2">
            Gestión manual de relaciones entre puntos de norma ISO 9001, procesos y documentos
          </p>
        </div>
        <Button onClick={handleCreateRelation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Relación
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Relaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Parciales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.parcial}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendiente}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">No Aplica</p>
                <p className="text-2xl font-bold text-gray-900">{stats.noAplica}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cumplimiento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averagePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código de norma o nombre de proceso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.compliance_status || 'all'}
              onValueChange={(value) => handleFilterChange('compliance_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado de cumplimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="no_aplica">No Aplica</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.chapter?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('chapter', value === 'all' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Capítulo ISO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los capítulos</SelectItem>
                <SelectItem value="4">Capítulo 4 - Contexto</SelectItem>
                <SelectItem value="5">Capítulo 5 - Liderazgo</SelectItem>
                <SelectItem value="6">Capítulo 6 - Planificación</SelectItem>
                <SelectItem value="7">Capítulo 7 - Apoyo</SelectItem>
                <SelectItem value="8">Capítulo 8 - Operación</SelectItem>
                <SelectItem value="9">Capítulo 9 - Evaluación</SelectItem>
                <SelectItem value="10">Capítulo 10 - Mejora</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.process_type || 'all'}
              onValueChange={(value) => handleFilterChange('process_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de proceso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="estratégico">Estratégico</SelectItem>
                <SelectItem value="operativo">Operativo</SelectItem>
                <SelectItem value="apoyo">Apoyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Relations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relaciones Existentes ({filteredRelations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RelationsTable
            relations={filteredRelations}
            isLoading={isLoading}
            onEdit={handleEditRelation}
            onDelete={handleDeleteRelation}
          />
        </CardContent>
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