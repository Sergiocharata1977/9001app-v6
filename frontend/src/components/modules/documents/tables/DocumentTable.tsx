'use client';

import React, { useState, useEffect } from 'react';
import { Document, DocumentType, DocumentStatus, AccessLevel } from '@/shared-types/entities/Document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  Building2,
  Tag,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DocumentFormV2 } from '../forms/DocumentFormV2';

interface DocumentTableProps {
  onEdit?: (document: Document) => void;
  onDelete?: (id: string) => void;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

export function DocumentTable({ onEdit, onDelete, onView, onDownload }: DocumentTableProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        title: 'Manual de Calidad ISO 9001:2015',
        description: 'Manual principal del sistema de gestión de calidad',
        fileName: 'manual-calidad-v3.pdf',
        originalFileName: 'Manual de Calidad v3.0.pdf',
        filePath: '/documents/manual-calidad-v3.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        categoryId: '1',
        categoryName: 'Manuales de Calidad',
        documentType: 'manual',
        version: '3.0',
        isCurrentVersion: true,
        status: 'published',
        approvedBy: 'Director de Calidad',
        approvedAt: new Date('2024-01-15'),
        accessLevel: 'internal',
        isPublic: false,
        allowedRoles: ['admin', 'quality'],
        isoClause: '4.2.2',
        organizationId: 'org-1',
        createdBy: 'Ana García',
        createdAt: new Date('2024-01-10'),
        updatedBy: 'Ana García',
        updatedAt: new Date('2024-01-15'),
        downloadCount: 45,
        tags: ['calidad', 'manual', 'iso9001']
      },
      {
        id: '2',
        title: 'Procedimiento de Control de Documentos',
        description: 'Procedimiento para el control y gestión de documentos del SGC',
        fileName: 'proc-control-documentos-v2.pdf',
        originalFileName: 'Procedimiento Control Documentos v2.1.pdf',
        filePath: '/documents/proc-control-documentos-v2.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        categoryId: '2',
        categoryName: 'Procedimientos',
        documentType: 'procedure',
        version: '2.1',
        isCurrentVersion: true,
        status: 'approved',
        reviewedBy: 'Coordinador de Calidad',
        reviewedAt: new Date('2024-01-20'),
        accessLevel: 'internal',
        isPublic: false,
        allowedRoles: ['admin', 'quality', 'manager'],
        isoClause: '4.2.3',
        processId: 'proc-1',
        organizationId: 'org-1',
        createdBy: 'Carlos Rodríguez',
        createdAt: new Date('2024-01-18'),
        updatedBy: 'Carlos Rodríguez',
        updatedAt: new Date('2024-01-20'),
        downloadCount: 23,
        tags: ['procedimiento', 'control', 'documentos']
      },
      {
        id: '3',
        title: 'Formato de Solicitud de Compras',
        description: 'Formato estándar para solicitudes de compra de materiales',
        fileName: 'formato-solicitud-compras.xlsx',
        originalFileName: 'Formato Solicitud Compras.xlsx',
        filePath: '/documents/formato-solicitud-compras.xlsx',
        fileSize: 512000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: 'xlsx',
        categoryId: '4',
        categoryName: 'Formatos',
        documentType: 'form',
        version: '1.5',
        isCurrentVersion: true,
        status: 'published',
        approvedBy: 'Jefe de Compras',
        approvedAt: new Date('2024-01-25'),
        accessLevel: 'public',
        isPublic: true,
        allowedRoles: [],
        processId: 'proc-4',
        departmentId: 'dept-4',
        organizationId: 'org-1',
        createdBy: 'María López',
        createdAt: new Date('2024-01-22'),
        updatedBy: 'María López',
        updatedAt: new Date('2024-01-25'),
        downloadCount: 67,
        tags: ['formato', 'compras', 'solicitud']
      },
      {
        id: '4',
        title: 'Política de Calidad 2024',
        description: 'Política de calidad actualizada para el año 2024',
        fileName: 'politica-calidad-2024.pdf',
        originalFileName: 'Política de Calidad 2024.pdf',
        filePath: '/documents/politica-calidad-2024.pdf',
        fileSize: 256000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        categoryId: '6',
        categoryName: 'Políticas',
        documentType: 'policy',
        version: '1.0',
        isCurrentVersion: true,
        status: 'draft',
        accessLevel: 'confidential',
        isPublic: false,
        allowedRoles: ['admin', 'director'],
        isoClause: '5.2',
        organizationId: 'org-1',
        createdBy: 'Director General',
        createdAt: new Date('2024-01-28'),
        updatedBy: 'Director General',
        updatedAt: new Date('2024-01-28'),
        downloadCount: 5,
        tags: ['política', 'calidad', '2024']
      }
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter documents
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.categoryId === categoryFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, typeFilter, statusFilter, categoryFilter]);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (mimeType.includes('image')) return <Image className="h-4 w-4 text-green-500" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    return <File className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800',
      obsolete: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-600'
    };

    const labels = {
      draft: 'Borrador',
      review: 'En Revisión',
      approved: 'Aprobado',
      published: 'Publicado',
      obsolete: 'Obsoleto',
      archived: 'Archivado'
    };

    return (
      <Badge className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getAccessLevelBadge = (level: AccessLevel) => {
    const colors = {
      public: 'bg-green-100 text-green-800',
      internal: 'bg-blue-100 text-blue-800',
      confidential: 'bg-orange-100 text-orange-800',
      restricted: 'bg-red-100 text-red-800'
    };

    const labels = {
      public: 'Público',
      internal: 'Interno',
      confidential: 'Confidencial',
      restricted: 'Restringido'
    };

    return (
      <Badge className={colors[level]}>
        {labels[level]}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setShowForm(true);
    onEdit?.(document);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      onDelete?.(id);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingDocument) {
      // Update existing document
      setDocuments(prev => prev.map(doc => 
        doc.id === editingDocument.id 
          ? { ...doc, ...data, updatedAt: new Date() }
          : doc
      ));
    } else {
      // Add new document
      const newDocument: Document = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        fileName: data.file?.name || 'document.pdf',
        originalFileName: data.file?.name || 'document.pdf',
        filePath: `/documents/${data.file?.name || 'document.pdf'}`,
        fileSize: data.file?.size || 0,
        mimeType: data.file?.type || 'application/pdf',
        fileExtension: data.file?.name?.split('.').pop() || 'pdf',
        categoryId: data.categoryId,
        categoryName: 'Categoría',
        documentType: data.documentType,
        version: data.version,
        isCurrentVersion: true,
        status: data.status,
        accessLevel: data.accessLevel,
        isPublic: data.isPublic,
        allowedRoles: [],
        isoClause: data.isoClause,
        processId: data.processId,
        departmentId: data.departmentId,
        organizationId: 'org-1',
        createdBy: 'Usuario Actual',
        createdAt: new Date(),
        updatedBy: 'Usuario Actual',
        updatedAt: new Date(),
        downloadCount: 0,
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []
      };
      setDocuments(prev => [...prev, newDocument]);
    }
    
    setShowForm(false);
    setEditingDocument(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="procedure">Procedimiento</SelectItem>
              <SelectItem value="instruction">Instrucción</SelectItem>
              <SelectItem value="form">Formato</SelectItem>
              <SelectItem value="record">Registro</SelectItem>
              <SelectItem value="policy">Política</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="review">En Revisión</SelectItem>
              <SelectItem value="approved">Aprobado</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Documento
        </Button>
      </div>

      {/* Documents Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acceso</TableHead>
              <TableHead>Versión</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-start gap-3">
                    {getFileIcon(document.mimeType)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {document.title}
                      </p>
                      {document.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {document.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {document.createdBy}
                        </span>
                        {document.downloadCount && (
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {document.downloadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {document.documentType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(document.status)}
                </TableCell>
                <TableCell>
                  {getAccessLevelBadge(document.accessLevel)}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    v{document.version}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatFileSize(document.fileSize)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    <div>{document.updatedAt.toLocaleDateString()}</div>
                    <div className="text-xs">{document.updatedBy}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(document)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload?.(document)}>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(document)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron documentos
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza subiendo tu primer documento'
            }
          </p>
          {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Subir Documento
            </Button>
          )}
        </div>
      )}

      {/* Document Form Modal */}
      {showForm && (
        <DocumentFormV2
          document={editingDocument}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingDocument(null);
          }}
        />
      )}
    </div>
  );
}
