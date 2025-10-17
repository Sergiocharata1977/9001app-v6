'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Dropdown } from './dropdown';
import { KanbanCard } from './kanban-card';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import type { KanbanColumnProps } from '@/types/unified-kanban';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  items,
  onItemMove,
  onItemClick,
  onItemEdit,
  onItemDelete,
  readOnly = false,
  showActions = true,
  customCardRenderer,
  draggedItem,
  onDragStart,
  onDragEnd
}) => {
  const [isDropTarget, setIsDropTarget] = useState(false);

  const dropRef = useKanbanDrop({
    columnId: column.id,
    column,
    onDrop: (itemId, sourceColumnId, targetColumnId, index) => {
      onItemMove(itemId, sourceColumnId, targetColumnId, index || 0);
    },
    onDragOver: setIsDropTarget,
    disabled: readOnly
  });

  const dropdownOptions = [
    { value: 'edit', label: 'Editar columna' },
    { value: 'divider', label: '', divider: true },
    { value: 'delete', label: 'Eliminar columna' },
  ];

  const handleDropdownSelect = (value: string) => {
    // TODO: Implementar acciones de columna
    console.log('Column action:', value, column.id);
  };

  const handleAddItem = () => {
    // TODO: Implementar agregar item
    console.log('Add item to column:', column.id);
  };

  const isAtLimit = column.maxItems && items.length >= column.maxItems;

  return (
    <motion.div
      ref={dropRef}
      className={cn(
        'flex flex-col bg-white border border-gray-200 rounded-lg p-4 min-h-96 w-80 flex-shrink-0 transition-all duration-200',
        isDropTarget && 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 border-blue-300',
        'hover:shadow-md'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header de la columna */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color || '#6B7280' }}
          />
          <h3 className="font-medium text-gray-900 text-sm">{column.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
          {isAtLimit && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
              Límite
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {!readOnly && !isAtLimit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddItem}
              className="p-1 h-6 w-6 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 text-gray-500" />
            </Button>
          )}

          {showActions && (
            <Dropdown
              trigger={
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>
              }
              options={dropdownOptions}
              onSelect={handleDropdownSelect}
              placement="bottom-end"
            />
          )}
        </div>
      </div>

      {/* Contenido de la columna */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <KanbanCard
              item={item}
              onClick={onItemClick}
              onEdit={onItemEdit}
              onDelete={onItemDelete}
              readOnly={readOnly}
              showActions={showActions}
              customRenderer={customCardRenderer}
            />
          </motion.div>
        ))}

        {/* Placeholder cuando no hay items */}
        {items.length === 0 && (
          <motion.div
            className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isDropTarget ? 'Soltar aquí' : 'Sin elementos'}
          </motion.div>
        )}
      </div>

      {/* Footer para agregar elementos */}
      {!readOnly && !isAtLimit && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddItem}
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar elemento
          </Button>
        </div>
      )}

      {/* Indicador de límite alcanzado */}
      {isAtLimit && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Límite de {column.maxItems} elementos alcanzado
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default KanbanColumn;
