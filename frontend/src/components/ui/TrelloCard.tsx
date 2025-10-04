'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, User, Paperclip, MessageSquare, CheckSquare } from 'lucide-react';
import { Badge } from './badge';

export interface TrelloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  assignedUser?: {
    name: string;
  };
  tags?: string[];
  attachmentCount?: number;
  commentCount?: number;
  checklistProgress?: {
    completed: number;
    total: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isDragging?: boolean;
}

const TrelloCard = forwardRef<HTMLDivElement, TrelloCardProps>(
  ({
    className,
    title,
    description,
    priority,
    dueDate,
    assignedUser,
    tags = [],
    attachmentCount = 0,
    commentCount = 0,
    checklistProgress,
    onEdit,
    onDelete,
    onView,
    isDragging = false,
    onClick,
    ...props
  }, ref) => {
    const priorityColors = {
      low: 'success',
      medium: 'warning',
      high: 'destructive',
      critical: 'destructive',
    } as const;

    const isOverdue = dueDate && new Date(dueDate) < new Date();

    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
          isDragging && 'opacity-50 rotate-2 shadow-lg',
          className
        )}
        ref={ref}
        onClick={onClick}
        {...props}
      >
        {/* Header con título */}
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-tight">
            {title}
          </h3>
        </div>

        {/* Descripción */}
        {description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="default">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="default">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer con metadatos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Fecha límite */}
            {dueDate && (
              <div className={cn(
                'flex items-center space-x-1 text-xs px-2 py-1 rounded',
                isOverdue
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              )}>
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(dueDate).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* Prioridad */}
            {priority && priority !== 'low' && (
              <Badge variant={priorityColors[priority]}>
                {priority === 'critical' ? 'Crítica' :
                 priority === 'high' ? 'Alta' :
                 priority === 'medium' ? 'Media' : 'Baja'}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Contadores */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {attachmentCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{attachmentCount}</span>
                </div>
              )}

              {commentCount > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{commentCount}</span>
                </div>
              )}

              {checklistProgress && checklistProgress.total > 0 && (
                <div className="flex items-center space-x-1">
                  <CheckSquare className="h-3 w-3" />
                  <span>{checklistProgress.completed}/{checklistProgress.total}</span>
                </div>
              )}
            </div>

            {/* Usuario asignado */}
            {assignedUser && (
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <User className="h-3 w-3" />
                <span>{assignedUser.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TrelloCard.displayName = 'TrelloCard';

export { TrelloCard };