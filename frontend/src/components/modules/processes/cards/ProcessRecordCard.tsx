'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-menu';
import {
  Calendar,
  Clock,
  User,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Pause,
  PlayCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProcessRecord {
  _id: string;
  titulo: string;
  descripcion?: string;
  current_state: 'iniciado' | 'en_progreso' | 'revision' | 'aprobado' | 'completado' | 'cancelado';
  prioridad: 'baja' | 'media' | 'alta' | 'crítica';
  progress_percentage: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  responsable?: string;
  process_definition?: {
    nombre: string;
  };
  created_at: string;
  updated_at: string;
}

interface ProcessRecordCardProps {
  record: ProcessRecord;
  onEdit: (record: ProcessRecord) => void;
  onDelete: (record: ProcessRecord) => void;
  onView: (record: ProcessRecord) => void;
  onChangeState?: (record: ProcessRecord, newState: string) => void;
}

const STATE_CONFIG = {
  iniciado: {
    label: 'Iniciado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: PlayCircle,
    bgColor: 'bg-gray-50',
  },
  en_progreso: {
    label: 'En Progreso',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock,
    bgColor: 'bg-blue-50',
  },
  revision: {
    label: 'En Revisión',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Pause,
    bgColor: 'bg-yellow-50',
  },
  aprobado: {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
  },
  completado: {
    label: 'Completado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    bgColor: 'bg-red-50',
  },
};

const PRIORITY_CONFIG = {
  baja: { 
    label: 'Baja', 
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-l-gray-400'
  },
  media: { 
    label: 'Media', 
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-l-blue-400'
  },
  alta: { 
    label: 'Alta', 
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-l-yellow-400'
  },
  crítica: { 
    label: 'Crítica', 
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-l-red-400'
  },
};

export function ProcessRecordCard({
  record,
  onEdit,
  onDelete,
  onView,
  onChangeState,
}: ProcessRecordCardProps) {
  const stateConfig = STATE_CONFIG[record.current_state];
  const priorityConfig = PRIORITY_CONFIG[record.prioridad];
  const StateIcon = stateConfig.icon;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return null;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isOverdue = () => {
    if (!record.fecha_fin) return false;
    const now = new Date();
    const endDate = new Date(record.fecha_fin);
    return now > endDate && record.current_state !== 'completado';
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 border-l-4 ${priorityConfig.borderColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {record.titulo}
            </CardTitle>
            {record.descripcion && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {record.descripcion}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(record)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(record)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {onChangeState && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onChangeState(record, 'en_progreso')}
                    disabled={record.current_state === 'en_progreso'}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Marcar en progreso
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onChangeState(record, 'completado')}
                    disabled={record.current_state === 'completado'}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar completado
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(record)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Estado y Prioridad */}
        <div className="flex items-center gap-2 mt-3">
          <Badge className={stateConfig.color}>
            <StateIcon className="h-3 w-3 mr-1" />
            {stateConfig.label}
          </Badge>
          <Badge className={priorityConfig.color}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {priorityConfig.label}
          </Badge>
          {isOverdue() && (
            <Badge className="bg-red-100 text-red-800">
              <Clock className="h-3 w-3 mr-1" />
              Vencido
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progreso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm font-semibold text-gray-900">
              {record.progress_percentage}%
            </span>
          </div>
          <Progress 
            value={record.progress_percentage} 
            className="h-2"
          />
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          {/* Responsable */}
          {record.responsable && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Responsable:</span>
              <span className="font-medium text-gray-900">{record.responsable}</span>
            </div>
          )}

          {/* Definición de proceso */}
          {record.process_definition?.nombre && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Definición:</span>
              <span className="font-medium text-gray-900 truncate">
                {record.process_definition.nombre}
              </span>
            </div>
          )}

          {/* Fechas */}
          <div className="space-y-1">
            {record.fecha_inicio && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Inicio:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(record.fecha_inicio)}
                </span>
              </div>
            )}
            {record.fecha_fin && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Fin:</span>
                <span className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(record.fecha_fin)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(record)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(record)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
