'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/button';

export interface ProcessRecord {
  id: string;
  title: string;
  description?: string;
  processName: string;
  status: 'draft' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  tags?: string[];
  progress?: number;
}

export interface ProcessRecordCardProps {
  record: ProcessRecord;
  onView?: (record: ProcessRecord) => void;
  onEdit?: (record: ProcessRecord) => void;
  onDelete?: (record: ProcessRecord) => void;
  onClick?: (record: ProcessRecord) => void;
  className?: string;
}

const ProcessRecordCard: React.FC<ProcessRecordCardProps> = ({
  record,
  onView,
  onEdit,
  onDelete,
  onClick,
  className
}) => {
  const getStatusColor = (status: ProcessRecord['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'success';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: ProcessRecord['status']) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'overdue': return 'Vencido';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: ProcessRecord['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: ProcessRecord['priority']) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return 'Sin prioridad';
    }
  };

  const getStatusIcon = (status: ProcessRecord['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const isOverdue = record.dueDate && new Date(record.dueDate) < new Date() && record.status !== 'completed';

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.(record);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group',
        isOverdue && 'border-red-200 bg-red-50',
        className
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(record.status)}
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {record.title}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mb-2">{record.processName}</p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(record);
              }}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(record);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(record);
              }}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      {record.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {record.description}
        </p>
      )}

      {/* Status and Priority */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={getStatusColor(record.status)} className="text-xs">
          {getStatusText(record.status)}
        </Badge>
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          getPriorityColor(record.priority)
        )}>
          {getPriorityText(record.priority)}
        </span>
      </div>

      {/* Progress Bar */}
      {record.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progreso</span>
            <span className="text-xs text-gray-500">{record.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all',
                record.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
              )}
              style={{ width: `${record.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {record.tags && record.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {record.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {record.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{record.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{record.assignedTo}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {record.dueDate && (
            <div className={cn(
              'flex items-center gap-1',
              isOverdue && 'text-red-600'
            )}>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(record.dueDate)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(record.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessRecordCard;