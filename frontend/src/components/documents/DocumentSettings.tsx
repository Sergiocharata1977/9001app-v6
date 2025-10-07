'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function DocumentSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se implementará la configuración del sistema de documentos,
            incluyendo tipos, estados, flujos de aprobación y permisos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}