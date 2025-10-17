'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, GitBranch, Users, Target, Maximize, Book, Workflow, FileText, Briefcase } from 'lucide-react';

interface ProcesoDocumentoTabProps {
  processData: any;
  onUpdate: () => void;
}

export default function ProcesoDocumentoTab({ processData, onUpdate }: ProcesoDocumentoTabProps) {
  if (!processData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">No hay datos del proceso disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50/50">
      <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
        {/* Layout principal: contenido del proceso */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                {processData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Hash className="w-4 h-4 mr-2" />
                  <strong>Código:</strong><span className="ml-2">{processData.code}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <GitBranch className="w-4 h-4 mr-2" />
                  <strong>Versión:</strong><span className="ml-2">{processData.version}</span>
                </div>
                <div className="flex items-center text-gray-600 sm:col-span-2 md:col-span-1">
                  <Users className="w-4 h-4 mr-2" />
                  <strong>Tipo:</strong><span className="ml-2">{processData.type}</span>
                </div>
              </div>
              {/* Mostrar responsable actual */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <strong>Responsable:</strong>
                  <span className="ml-2">{processData.responsible_user_id?.name || 'No asignado'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secciones del contenido del proceso */}
          {processData.content && (
            <Card>
              <CardHeader><CardTitle className="flex items-center"><Book className="w-5 h-5 mr-2" />Contenido del Proceso</CardTitle></CardHeader>
              <CardContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: processData.content }} />
              </CardContent>
            </Card>
          )}

          {/* Metadatos adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processData.keywords && processData.keywords.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Palabras Clave</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {processData.keywords.map((keyword: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle>Información del Documento</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Estado:</strong> {processData.status}</div>
                  <div><strong>Categoría:</strong> {processData.category}</div>
                  {processData.effective_date && (
                    <div><strong>Fecha de vigencia:</strong> {new Date(processData.effective_date).toLocaleDateString()}</div>
                  )}
                  {processData.review_date && (
                    <div><strong>Próxima revisión:</strong> {new Date(processData.review_date).toLocaleDateString()}</div>
                  )}
                  <div><strong>Última actualización:</strong> {new Date(processData.updated_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Archivos adjuntos */}
          {processData.files && processData.files.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Archivos Adjuntos</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {processData.files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{file.original_name}</span>
                        <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}