'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, FileText, Search, Filter, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { processDocumentService, ProcessDocument } from '@/services/processDocumentService';

// Datos mock para desarrollo (mientras no hay backend)
const mockDocuments: ProcessDocument[] = [
  {
    _id: 'doc-001',
    code: 'DOC-2024-001',
    title: 'Manual de Calidad ISO 9001',
    description: 'Manual completo del sistema de gestión de calidad',
    type: 'manual',
    category: 'Sistema de Calidad',
    status: 'vigente',
    version: 2,
    responsible_user_id: 'user-001',
    department_id: 'dept-001',
    keywords: ['calidad', 'ISO 9001', 'manual', 'sistema'],
    distribution_list: ['user-001', 'user-002', 'user-003'],
    effective_date: '2024-01-15',
    review_date: '2025-01-15',
    organization_id: 'org-001',
    is_active: true,
    is_archived: false,
    created_by: 'user-001',
    created_at: '2024-01-10T10:00:00.000Z',
    updated_at: '2024-01-15T14:30:00.000Z'
  },
  {
    _id: 'doc-002',
    code: 'DOC-2024-002',
    title: 'Procedimiento de Control de Documentos',
    description: 'Procedimiento para el control y gestión de documentos',
    type: 'procedimiento',
    category: 'Documentación',
    status: 'revision',
    version: 1,
    responsible_user_id: 'user-002',
    department_id: 'dept-002',
    keywords: ['procedimiento', 'control', 'documentos', 'ISO 9001'],
    distribution_list: ['user-002', 'user-003'],
    effective_date: '2024-02-01',
    review_date: '2025-02-01',
    organization_id: 'org-001',
    is_active: true,
    is_archived: false,
    created_by: 'user-002',
    created_at: '2024-01-20T09:00:00.000Z',
    updated_at: '2024-01-25T11:15:00.000Z'
  },
  {
    _id: 'doc-003',
    code: 'DOC-2024-003',
    title: 'Política de Calidad',
    description: 'Política de calidad de la organización',
    type: 'politica',
    category: 'Sistema de Calidad',
    status: 'borrador',
    version: 1,
    keywords: ['politica', 'calidad', 'ISO 9001', 'sistema'],
    responsible_user_id: 'user-003',
    department_id: 'dept-001',
    distribution_list: ['user-001', 'user-002', 'user-003', 'user-004'],
    organization_id: 'org-001',
    is_active: true,
    is_archived: false,
    created_by: 'user-003',
    created_at: '2024-01-25T08:00:00.000Z',
    updated_at: '2024-01-25T08:00:00.000Z'
  }
];

export default function DocumentacionPage() {
  const [documents, setDocuments] = useState<ProcessDocument[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<ProcessDocument[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [loading, setLoading] = useState(false);

  // Filtros
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    if (typeFilter !== 'todos') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vigente':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'revision':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'borrador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'obsoleto':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'vigente':
        return 'Vigente';
      case 'revision':
        return 'En Revisión';
      case 'borrador':
        return 'Borrador';
      case 'obsoleto':
        return 'Obsoleto';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'manual':
        return 'Manual';
      case 'procedimiento':
        return 'Procedimiento';
      case 'instruccion':
        return 'Instrucción';
      case 'politica':
        return 'Política';
      case 'registro':
        return 'Registro';
      case 'formulario':
        return 'Formulario';
      default:
        return type;
    }
  };

  const handleNewDocument = () => {
    // Aquí iría la lógica para crear un nuevo documento
    console.log('Crear nuevo documento');
  };

  const handleViewDocument = (document: ProcessDocument) => {
    // Aquí iría la lógica para ver el documento
    console.log('Ver documento:', document._id);
  };

  const handleEditDocument = (document: ProcessDocument) => {
    // Aquí iría la lógica para editar el documento
    console.log('Editar documento:', document._id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentación</h1>
          <p className="text-gray-600 mt-2">
            Gestión y control de documentos del sistema de calidad ISO 9001
          </p>
        </div>
        <Button onClick={handleNewDocument} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Documento
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documentos</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vigentes</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'vigente').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'revision').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-blue-600">
                  {documents.filter(d => d.status === 'borrador').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input w-full md:w-48"
            >
              <option value="todos">Todos los estados</option>
              <option value="vigente">Vigente</option>
              <option value="revision">En Revisión</option>
              <option value="borrador">Borrador</option>
              <option value="obsoleto">Obsoleto</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-input w-full md:w-48"
            >
              <option value="todos">Todos los tipos</option>
              <option value="manual">Manual</option>
              <option value="procedimiento">Procedimiento</option>
              <option value="instruccion">Instrucción</option>
              <option value="politica">Política</option>
              <option value="registro">Registro</option>
              <option value="formulario">Formulario</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'todos' || typeFilter !== 'todos'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer documento'}
              </p>
              <Button onClick={handleNewDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Documento
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {document.title}
                      </h3>
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusText(document.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeText(document.type)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{document.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Código: {document.code}</span>
                      <span>Versión: {document.version}</span>
                      <span>Categoría: {document.category}</span>
                      {document.effective_date && (
                        <span>Vigente desde: {new Date(document.effective_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDocument(document)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}