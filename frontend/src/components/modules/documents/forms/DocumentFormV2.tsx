'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Document, DocumentType, DocumentStatus, AccessLevel } from '@/shared-types/entities/Document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  AlertCircle,
  CheckCircle,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const documentSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  documentType: z.enum(['manual', 'procedure', 'instruction', 'form', 'record', 'policy', 'plan', 'report', 'certificate', 'specification', 'drawing', 'other']),
  version: z.string().min(1, 'La versión es requerida'),
  status: z.enum(['draft', 'review', 'approved', 'published', 'obsolete', 'archived']),
  accessLevel: z.enum(['public', 'internal', 'confidential', 'restricted']),
  isoClause: z.string().optional(),
  processId: z.string().optional(),
  departmentId: z.string().optional(),
  tags: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormV2Props {
  document?: Document | null;
  onSubmit: (data: DocumentFormData & { file?: File }) => void;
  onCancel: () => void;
}

export function DocumentFormV2({ document, onSubmit, onCancel }: DocumentFormV2Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: document?.title || '',
      description: document?.description || '',
      categoryId: document?.categoryId || '',
      documentType: document?.documentType || 'other',
      version: document?.version || '1.0',
      status: document?.status || 'draft',
      accessLevel: document?.accessLevel || 'internal',
      isoClause: document?.isoClause || '',
      processId: document?.processId || '',
      departmentId: document?.departmentId || '',
      tags: document?.tags?.join(', ') || '',
      isPublic: document?.isPublic || false,
    }
  });

  const documentType = watch('documentType');
  const accessLevel = watch('accessLevel');

  // Categorías mock - en producción vendrían de la API
  const categories = [
    { id: '1', name: 'Manuales de Calidad', color: 'blue' },
    { id: '2', name: 'Procedimientos', color: 'green' },
    { id: '3', name: 'Instrucciones de Trabajo', color: 'orange' },
    { id: '4', name: 'Formatos', color: 'purple' },
    { id: '5', name: 'Registros', color: 'red' },
    { id: '6', name: 'Políticas', color: 'indigo' },
    { id: '7', name: 'Planes', color: 'yellow' },
    { id: '8', name: 'Reportes', color: 'pink' },
  ];

  const documentTypes = [
    { value: 'manual', label: 'Manual de Calidad' },
    { value: 'procedure', label: 'Procedimiento' },
    { value: 'instruction', label: 'Instrucción de Trabajo' },
    { value: 'form', label: 'Formato/Formulario' },
    { value: 'record', label: 'Registro' },
    { value: 'policy', label: 'Política' },
    { value: 'plan', label: 'Plan' },
    { value: 'report', label: 'Reporte' },
    { value: 'certificate', label: 'Certificado' },
    { value: 'specification', label: 'Especificación' },
    { value: 'drawing', label: 'Plano/Dibujo' },
    { value: 'other', label: 'Otro' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Borrador', color: 'gray' },
    { value: 'review', label: 'En Revisión', color: 'yellow' },
    { value: 'approved', label: 'Aprobado', color: 'green' },
    { value: 'published', label: 'Publicado', color: 'blue' },
    { value: 'obsolete', label: 'Obsoleto', color: 'red' },
    { value: 'archived', label: 'Archivado', color: 'gray' },
  ];

  const accessLevels = [
    { value: 'public', label: 'Público', description: 'Acceso para todos' },
    { value: 'internal', label: 'Interno', description: 'Solo personal interno' },
    { value: 'confidential', label: 'Confidencial', description: 'Acceso restringido' },
    { value: 'restricted', label: 'Restringido', description: 'Máxima seguridad' },
  ];

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    
    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipo de archivo no permitido. Solo se permiten PDF, Word, Excel, PowerPoint, imágenes y texto.');
      return;
    }

    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('El archivo es demasiado grande. Máximo 50MB permitido.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (file.type.includes('image')) return <Image className="h-8 w-8 text-green-500" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    return <File className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmitForm = (data: DocumentFormData) => {
    if (!document && !selectedFile) {
      setUploadError('Debe seleccionar un archivo');
      return;
    }

    onSubmit({
      ...data,
      file: selectedFile || undefined
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document ? 'Editar Documento' : 'Nuevo Documento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* File Upload Section */}
          {!document && (
            <div className="space-y-4">
              <Label>Archivo del Documento *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      {getFileIcon(selectedFile)}
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Archivo seleccionado correctamente</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Arrastra tu archivo aquí o{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-500"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          selecciona uno
                        </button>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF, Word, Excel, PowerPoint, imágenes (máx. 50MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
              />

              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Documento *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Ej: Manual de Calidad v2.0"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descripción del documento..."
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="categoryId">Categoría *</Label>
                <Select onValueChange={(value) => setValue('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="documentType">Tipo de Documento *</Label>
                <Select onValueChange={(value) => setValue('documentType', value as DocumentType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.documentType && (
                  <p className="text-sm text-red-600 mt-1">{errors.documentType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="version">Versión *</Label>
                <Input
                  id="version"
                  {...register('version')}
                  placeholder="Ej: 1.0, 2.1, etc."
                />
                {errors.version && (
                  <p className="text-sm text-red-600 mt-1">{errors.version.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Estado *</Label>
                <Select onValueChange={(value) => setValue('status', value as DocumentStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`bg-${status.color}-100 text-${status.color}-800`}>
                            {status.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="accessLevel">Nivel de Acceso *</Label>
                <Select onValueChange={(value) => setValue('accessLevel', value as AccessLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-gray-500">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.accessLevel && (
                  <p className="text-sm text-red-600 mt-1">{errors.accessLevel.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tags">Etiquetas</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="Separadas por comas: calidad, proceso, manual"
                />
              </div>
            </div>
          </div>

          {/* ISO and Process Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="isoClause">Cláusula ISO</Label>
              <Input
                id="isoClause"
                {...register('isoClause')}
                placeholder="Ej: 4.2.3, 7.1.2"
              />
            </div>

            <div>
              <Label htmlFor="processId">Proceso Relacionado</Label>
              <Select onValueChange={(value) => setValue('processId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proceso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proc-1">Gestión de Calidad</SelectItem>
                  <SelectItem value="proc-2">Producción</SelectItem>
                  <SelectItem value="proc-3">Recursos Humanos</SelectItem>
                  <SelectItem value="proc-4">Compras</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="departmentId">Departamento</Label>
              <Select onValueChange={(value) => setValue('departmentId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dept-1">Calidad</SelectItem>
                  <SelectItem value="dept-2">Producción</SelectItem>
                  <SelectItem value="dept-3">Recursos Humanos</SelectItem>
                  <SelectItem value="dept-4">Administración</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : document ? 'Actualizar' : 'Crear Documento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}