'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GapsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/documentacion">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Documentación
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis de Gaps</h1>
          <p className="text-gray-600">Identificación de brechas y áreas de mejora</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Análisis de Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-700">
              Análisis completo de gaps disponible próximamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
