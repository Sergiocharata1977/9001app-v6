import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, User, Eye, Edit, Download } from 'lucide-react';

export default function ProcesosDocumentosPage() {
  const documentos = [
    {
      id: 1,
      codigo: 'DOC-2024-001',
      titulo: 'Procedimiento de Gestión de Recursos Humanos',
      descripcion: 'Documento que establece los procedimientos para la gestión integral del personal',
      tipo: 'procedimiento',
      categoria: 'Recursos Humanos',
      estado: 'vigente',
      version: 2,
      responsable: 'María García',
      fechaCreacion: '2024-01-15',
      fechaRevision: '2024-07-15',
      archivos: 3
    },
    {
      id: 2,
      codigo: 'DOC-2024-002',
      titulo: 'Instrucción de Control de Calidad',
      descripcion: 'Instrucciones específicas para el control de calidad en procesos productivos',
      tipo: 'instruccion',
      categoria: 'Calidad',
      estado: 'aprobado',
      version: 1,
      responsable: 'Ana Martínez',
      fechaCreacion: '2024-01-20',
      fechaRevision: '2024-07-20',
      archivos: 2
    },
    {
      id: 3,
      codigo: 'DOC-2024-003',
      titulo: 'Manual de Gestión de No Conformidades',
      descripcion: 'Manual completo para la gestión y corrección de no conformidades',
      tipo: 'manual',
      categoria: 'Mejora Continua',
      estado: 'revision',
      version: 3,
      responsable: 'Carlos López',
      fechaCreacion: '2024-01-25',
      fechaRevision: '2024-07-25',
      archivos: 5
    },
    {
      id: 4,
      codigo: 'DOC-2024-004',
      titulo: 'Política de Seguridad de la Información',
      descripcion: 'Política organizacional para la seguridad de la información',
      tipo: 'politica',
      categoria: 'Seguridad',
      estado: 'vigente',
      version: 1,
      responsable: 'Roberto Silva',
      fechaCreacion: '2024-02-01',
      fechaRevision: '2024-08-01',
      archivos: 1
    },
    {
      id: 5,
      codigo: 'DOC-2024-005',
      titulo: 'Formulario de Auditoría Interna',
      descripcion: 'Formulario estándar para la realización de auditorías internas',
      tipo: 'formulario',
      categoria: 'Auditoría',
      estado: 'borrador',
      version: 1,
      responsable: 'Laura Fernández',
      fechaCreacion: '2024-02-10',
      fechaRevision: '2024-08-10',
      archivos: 1
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vigente':
        return <Badge variant="default" className="bg-green-100 text-green-800">Vigente</Badge>;
      case 'aprobado':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Aprobado</Badge>;
      case 'revision':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En Revisión</Badge>;
      case 'borrador':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Borrador</Badge>;
      case 'obsoleto':
        return <Badge variant="destructive">Obsoleto</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'procedimiento':
        return '📋';
      case 'instruccion':
        return '📝';
      case 'manual':
        return '📖';
      case 'politica':
        return '📜';
      case 'formulario':
        return '📄';
      case 'registro':
        return '📊';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procesos Documentos</h1>
          <p className="text-gray-600">Gestión de documentación de procesos organizacionales</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documentos</p>
                <p className="text-2xl font-bold text-gray-900">{documentos.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vigentes</p>
                <p className="text-2xl font-bold text-green-600">
                  {documentos.filter(d => d.estado === 'vigente').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documentos.filter(d => d.estado === 'revision').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-600">
                  {documentos.filter(d => d.estado === 'borrador').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentos.map((documento) => (
          <Card key={documento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTipoIcon(documento.tipo)}</span>
                  <div>
                    <CardTitle className="text-lg">{documento.titulo}</CardTitle>
                    <p className="text-sm text-gray-500">{documento.codigo}</p>
                  </div>
                </div>
                {getEstadoBadge(documento.estado)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {documento.descripcion}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  <span>Responsable: {documento.responsable}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Versión: {documento.version}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{documento.archivos} archivo{documento.archivos > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Creado: {documento.fechaCreacion}</span>
                  <span>Revisión: {documento.fechaRevision}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


