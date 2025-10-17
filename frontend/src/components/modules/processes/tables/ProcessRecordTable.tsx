'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Pause
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

interface ProcessRecordTableProps {
  data: ProcessRecord[];
  onEdit: (record: ProcessRecord) => void;
  onDelete: (record: ProcessRecord) => void;
  onView: (record: ProcessRecord) => void;
  onChangeState?: (record: ProcessRecord, newState: string) => void;
  isLoading?: boolean;
}

const STATE_CONFIG = {
  iniciado: {
    label: 'Iniciado',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
  },
  en_progreso: {
    label: 'En Progreso',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  revision: {
    label: 'En Revisión',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Pause,
  },
  aprobado: {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  completado: {
    label: 'Completado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

const PRIORITY_CONFIG = {
  baja: { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  media: { label: 'Media', color: 'bg-blue-100 text-blue-800' },
  alta: { label: 'Alta', color: 'bg-yellow-100 text-yellow-800' },
  crítica: { label: 'Crítica', color: 'bg-red-100 text-red-800' },
};

export function ProcessRecordTable({
  data,
  onEdit,
  onDelete,
  onView,
  onChangeState,
  isLoading = false,
}: ProcessRecordTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return '-';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registros de Procesos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registros de Procesos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay registros de procesos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando un nuevo registro de proceso.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Registros de Procesos ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proceso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Definición</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => {
                const stateConfig = STATE_CONFIG[record.current_state];
                const priorityConfig = PRIORITY_CONFIG[record.prioridad];
                const StateIcon = stateConfig.icon;

                return (
                  <TableRow key={record._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {record.titulo}
                        </div>
                        {record.descripcion && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {record.descripcion}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={stateConfig.color}>
                        <StateIcon className="h-3 w-3 mr-1" />
                        {stateConfig.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={priorityConfig.color}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {priorityConfig.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(record.progress_percentage)}`}
                              style={{ width: `${record.progress_percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {record.progress_percentage}%
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {record.responsable ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{record.responsable}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin asignar</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {record.fecha_inicio && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Inicio:</span>
                            <span>{formatDate(record.fecha_inicio)}</span>
                          </div>
                        )}
                        {record.fecha_fin && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Fin:</span>
                            <span>{formatDate(record.fecha_fin)}</span>
                          </div>
                        )}
                        {!record.fecha_inicio && !record.fecha_fin && (
                          <span className="text-gray-400">Sin fechas</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {record.process_definition?.nombre || 'Sin definición'}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
