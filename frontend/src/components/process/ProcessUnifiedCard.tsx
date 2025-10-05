'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface ProcessUnifiedCardProps {
  process: any;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'activo':
      return 'bg-green-100 text-green-800';
    case 'inactivo':
      return 'bg-gray-100 text-gray-800';
    case 'revision':
      return 'bg-yellow-100 text-yellow-800';
    case 'obsoleto':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'operativo':
      return 'bg-blue-100 text-blue-800';
    case 'apoyo':
      return 'bg-purple-100 text-purple-800';
    case 'gestion':
      return 'bg-orange-100 text-orange-800';
    case 'otro':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ProcessUnifiedCard: React.FC<ProcessUnifiedCardProps> = ({
  process
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {process.name || 'Sin nombre'}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">
              Código: {process.code || 'Sin código'}
            </p>
          </div>
          <div className="flex gap-1">
            <Badge className={getStatusColor(process.status || 'inactivo')}>
              {process.status || 'inactivo'}
            </Badge>
            <Badge className={getTypeColor(process.type || 'otro')}>
              {process.type || 'otro'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          {process.description || 'Sin descripción'}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{process.category || 'Sin categoría'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {process.team_members?.length || 0} miembros
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {process.etapas_proceso?.length || 0} etapas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {process.updated_at ? formatDate(process.updated_at) : 'Sin fecha'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Responsable:</span> {process.responsible_user_id?.name || 'No asignado'}
          </div>
        </div>

        {/* Botones removidos - solo aparecen en el single de proceso */}
      </CardContent>
    </Card>
  );
};

export default ProcessUnifiedCard;