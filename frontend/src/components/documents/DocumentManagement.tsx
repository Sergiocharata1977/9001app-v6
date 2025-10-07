'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { DocumentTable } from '@/components/modules/documents/tables/DocumentTable';

export function DocumentManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Administración de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DocumentTable
          onView={(document) => {
            console.log('Ver documento:', document);
            // Implementar vista de documento
          }}
          onDownload={(document) => {
            console.log('Descargar documento:', document);
            // Implementar descarga
          }}
          onEdit={(document) => {
            console.log('Editar documento:', document);
          }}
          onDelete={(id) => {
            console.log('Eliminar documento:', id);
          }}
        />
      </CardContent>
    </Card>
  );
}