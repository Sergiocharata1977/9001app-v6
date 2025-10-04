'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Edit, Trash2, Calendar, User, Tag } from 'lucide-react';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { cn } from '@/lib/utils';
import type { KanbanCardProps } from '@/types/unified-kanban';

export const KanbanCard: React.FC<KanbanCardProps> = ({
  item,
  onClick,
  onEdit,
  onDelete,
  readOnly = false,
  showActions = true,
  customRenderer
}) => {
  const dragRef = useKanbanDrag({
    itemId: item.id,
    columnId: item.columnId,
    item,
    onDragStart: () => {
      // Callback opcional para drag start
    },
    onDragEnd: () => {
      // Callback opcional para drag end
    }
  });

  const handleClick = () => {
    onClick?.(item);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (customRenderer) {
    return customRenderer(item);
  }

  return (
    <motion.div
      ref={dragRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
          readOnly && "cursor-default",
          item.priority && `border-l-${getPriorityColor(item.priority).split(' ')[0].replace('bg-', '')}-500`
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 flex-1 mr-2">
              {item.title}
            </h4>

            {showActions && !readOnly && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-6 w-6 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Priority */}
          {item.priority && (
            <div className="mb-3">
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(item.priority))}
              >
                {item.priority}
              </Badge>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {item.progress !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              {item.assignee && (
                <>
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-20">{item.assignee}</span>
                </>
              )}
            </div>

            {item.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(item.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KanbanCard;