'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuditoriasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/administracion">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Administración
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditorías y Logs</h1>
          <p className="text-gray-600">Monitoreo y auditoría del sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Estado del Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              Auditorías y logs pendientes de implementación.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
