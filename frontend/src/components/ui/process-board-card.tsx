'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Users, AlertTriangle, CheckCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';

export interface ProcessBoardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
  owner?: string;
  recordsCount?: number;
  updatedAt?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProcessBoardCard = forwardRef<HTMLDivElement, ProcessBoardCardProps>(
  ({ 
    className,
    title,
    description,
    category,
    status = 'active',
    owner,
    recordsCount = 0,
    updatedAt,
    onEdit,
    onDelete,
    onClick,
    ...props 
  }, ref) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'success';
        case 'inactive': return 'secondary';
        case 'draft': return 'warning';
        default: return 'secondary';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'active': return 'Activo';
        case 'inactive': return 'Inactivo';
        case 'draft': return 'Borrador';
        default: return 'Desconocido';
      }
    };

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Si se hace click en los botones de acción, no ejecutar onClick del card
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }
      onClick?.(e);
    };

    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group',
          'hover:border-blue-300',
          className
        )}
        ref={ref}
        onClick={handleCardClick}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              {category && (
                <Badge variant="secondary">
                  {category}
                </Badge>
              )}
              <Badge variant={getStatusColor(status)}>
                {getStatusText(status)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Descripción */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-xl font-semibold text-gray-900">{recordsCount}</div>
            <div className="text-xs text-gray-500">Registros</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-xl font-semibold text-gray-900">{owner ? 1 : 0}</div>
            <div className="text-xs text-gray-500">Responsable</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Responsable */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {owner || 'Sin asignar'}
          </div>

          {/* Última actualización */}
          {updatedAt && (
            <div className="text-xs text-gray-500">
              Actualizado: {new Date(updatedAt).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProcessBoardCard.displayName = 'ProcessBoardCard';

export { ProcessBoardCard };