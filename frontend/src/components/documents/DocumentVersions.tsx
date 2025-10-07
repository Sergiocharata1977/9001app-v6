'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

export function DocumentVersions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Control de Versiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se implementará el control de versiones de documentos,
            incluyendo historial, comparación y aprobación de versiones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}