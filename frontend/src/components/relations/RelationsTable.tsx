'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import type { NormProcessDocRelation } from '@/types/relation';

interface RelationsTableProps {
  relations: NormProcessDocRelation[];
  isLoading: boolean;
  onEdit: (relation: NormProcessDocRelation) => void;
  onDelete: (id: string) => void;
}

export function RelationsTable({ relations, isLoading, onEdit, onDelete }: RelationsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completo': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'parcial': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pendiente': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'no_aplica': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completo': return 'bg-green-100 text-green-800';
      case 'parcial': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-red-100 text-red-800';
      case 'no_aplica': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completo': return 'Completo';
      case 'parcial': return 'Parcial';
      case 'pendiente': return 'Pendiente';
      case 'no_aplica': return 'No Aplica';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (relations.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay relaciones</h3>
        <p className="text-gray-600">
          No se encontraron relaciones que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Punto de Norma</TableHead>
            <TableHead>Proceso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Cumplimiento</TableHead>
            <TableHead>Documentos</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Próxima Revisión</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relations.map((relation) => (
            <TableRow key={relation._id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-blue-600">
                    {relation.norm_point_id.code}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {relation.norm_point_id.title}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Capítulo {relation.norm_point_id.chapter}
                  </Badge>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {relation.process_id.name}
                  </div>
                  {relation.process_id.codigo && (
                    <div className="text-sm text-gray-600">
                      {relation.process_id.codigo}
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      relation.process_id.tipo === 'estratégico' ? 'border-purple-200 text-purple-700' :
                      relation.process_id.tipo === 'operativo' ? 'border-blue-200 text-blue-700' :
                      'border-green-200 text-green-700'
                    }`}
                  >
                    {relation.process_id.tipo}
                  </Badge>
                </div>
              </TableCell>

              <TableCell>
                <Badge className={getStatusColor(relation.compliance_status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(relation.compliance_status)}
                    {getStatusText(relation.compliance_status)}
                  </div>
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    {relation.compliance_percentage}%
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        relation.compliance_percentage >= 80 ? 'bg-green-500' :
                        relation.compliance_percentage >= 60 ? 'bg-yellow-500' :
                        relation.compliance_percentage >= 40 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${relation.compliance_percentage}%` }}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {relation.document_ids.length} documento{relation.document_ids.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                {relation.responsible_user_id ? (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{relation.responsible_user_id.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No asignado</span>
                )}
              </TableCell>

              <TableCell>
                {relation.next_review_date ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {formatDate(relation.next_review_date)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No definida</span>
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(relation)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(relation._id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}