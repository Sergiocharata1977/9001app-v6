'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from 'lucide-react';

export function DocumentTemplates() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Plantillas de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se implementará la gestión de plantillas de documentos,
            incluyendo biblioteca, creación desde plantillas y versiones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}