'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Grid3X3,
  List
} from 'lucide-react';
import { ProcessRecordFormV2 } from '@/components/modules/processes/forms/ProcessRecordFormV2';
import { ProcessRecordTable } from '@/components/modules/processes/tables/ProcessRecordTable';
import { ProcessRecordCard } from '@/components/modules/processes/cards/ProcessRecordCard';

// Datos de ejemplo actualizados con el nuevo modelo
const mockProcessRecords = [
  {
    _id: '1',
    titulo: 'Auditoría Interna Q1 2024',
    descripcion: 'Auditoría interna del sistema de gestión de calidad para el primer trimestre',
    current_state: 'en_progreso' as const,
    prioridad: 'alta' as const,
    progress_percentage: 65,
    fecha_inicio: '2024-01-15T08:00:00Z',
    fecha_fin: '2024-03-15T17:00:00Z',
    responsable: 'María García',
    process_definition: {
      nombre: 'Auditoría Interna ISO 9001'
    },
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z'
  },
  {
    _id: '2',
    titulo: 'Revisión de Documentos',
    descripcion: 'Revisión y actualización de procedimientos operativos',
    current_state: 'completado' as const,
    prioridad: 'media' as const,
    progress_percentage: 100,
    fecha_inicio: '2024-01-01T08:00:00Z',
    fecha_fin: '2024-01-31T17:00:00Z',
    responsable: 'Carlos López',
    process_definition: {
      nombre: 'Control de Documentos'
    },
    created_at: '2023-12-28T10:00:00Z',
    updated_at: '2024-01-31T17:00:00Z'
  },
  {
    _id: '3',
    titulo: 'Capacitación Personal',
    descripcion: 'Programa de capacitación en nuevos procedimientos de calidad',
    current_state: 'iniciado' as const,
    prioridad: 'crítica' as const,
    progress_percentage: 25,
    fecha_inicio: '2024-02-01T08:00:00Z',
    fecha_fin: '2024-02-28T17:00:00Z',
    responsable: 'Ana Martínez',
    process_definition: {
      nombre: 'Gestión de Competencias'
    },
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-02-05T14:20:00Z'
  }
];

const mockProcessDefinitions = [
  { _id: 'def1', nombre: 'Auditoría Interna ISO 9001' },
  { _id: 'def2', nombre: 'Control de Documentos' },
  { _id: 'def3', nombre: 'Gestión de Competencias' },
  { _id: 'def4', nombre: 'Revisión por la Dirección' },
];

const mockUsers = [
  { _id: 'user1', nombre: 'María García' },
  { _id: 'user2', nombre: 'Carlos López' },
  { _id: 'user3', nombre: 'Ana Martínez' },
  { _id: 'user4', nombre: 'Pedro Rodríguez' },
];

export default function ProcessRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredRecords = mockProcessRecords.filter(record => {
    const matchesSearch = record.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'todos' || record.current_state === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockProcessRecords.length,
    en_progreso: mockProcessRecords.filter(r => r.current_state === 'en_progreso').length,
    completados: mockProcessRecords.filter(r => r.current_state === 'completado').length,
    iniciados: mockProcessRecords.filter(r => r.current_state === 'iniciado').length
  };

  const handleCreateNew = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleDelete = (record: any) => {
    // Implementar lógica de eliminación
    console.log('Eliminar registro:', record._id);
  };

  const handleView = (record: any) => {
    // Implementar vista de detalles
    console.log('Ver detalles:', record._id);
  };

  const handleChangeState = (record: any, newState: string) => {
    // Implementar cambio de estado
    console.log('Cambiar estado:', record._id, 'a', newState);
  };

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    // Simular API call
    setTimeout(() => {
      console.log('Datos del formulario:', data);
      setIsLoading(false);
      setIsFormOpen(false);
      setEditingRecord(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registros de Procesos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y monitorea todos los registros de procesos del sistema de calidad
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{stats.en_progreso}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Iniciados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.iniciados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'todos' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('todos')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={selectedFilter === 'iniciado' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('iniciado')}
                size="sm"
              >
                Iniciados
              </Button>
              <Button
                variant={selectedFilter === 'en_progreso' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('en_progreso')}
                size="sm"
              >
                En Progreso
              </Button>
              <Button
                variant={selectedFilter === 'completado' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('completado')}
                size="sm"
              >
                Completados
              </Button>
            </div>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'table' ? (
        <ProcessRecordTable
          data={filteredRecords}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onChangeState={handleChangeState}
          isLoading={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <ProcessRecordCard
              key={record._id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onChangeState={handleChangeState}
            />
          ))}
        </div>
      )}

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron registros
            </h3>
            <p className="text-gray-600">
              No hay registros que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal Form */}
      <ProcessRecordFormV2
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingRecord}
        onSubmit={handleSubmit}
        processDefinitions={mockProcessDefinitions}
        users={mockUsers}
        isLoading={isLoading}
      />
    </div>
  );
}