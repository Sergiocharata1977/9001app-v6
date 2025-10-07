'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DocumentCategories() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Gestión de Categorías
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se implementará la gestión completa de categorías de documentos,
            incluyendo árbol jerárquico, CRUD, y asignación de documentos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}