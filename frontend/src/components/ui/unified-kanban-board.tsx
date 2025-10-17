'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KanbanColumn } from './KanbanColumn';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './empty-state';
import type {
  UnifiedKanbanProps,
  KanbanColumn as KanbanColumnType,
  KanbanItem
} from '@/types/unified-kanban';

export const UnifiedKanbanBoard: React.FC<UnifiedKanbanProps> = ({
  columns,
  items,
  onItemMove,
  onItemClick,
  onItemEdit,
  onItemDelete,
  loading = false,
  error,
  readOnly = false,
  showActions = true,
  customCardRenderer
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar el tablero Kanban"
        message={error}
      />
    );
  }

  if (columns.length === 0) {
    return (
      <EmptyState
        title="No hay columnas configuradas"
        description="Configure las columnas del tablero para comenzar a organizar sus elementos."
        icon="Kanban"
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header con estadísticas */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold text-gray-900">Tablero Kanban</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{items.length} elementos</span>
              {columns.map(column => {
                const count = items.filter(item => item.columnId === column.id).length;
                return (
                  <div key={column.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color || '#6B7280' }}
                    />
                    <span>{column.title}: {count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <motion.div
          className="flex gap-6 min-w-max"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {columns.map((column, index) => {
              const columnItems = items.filter(item => item.columnId === column.id);

              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <KanbanColumn
                    column={column}
                    items={columnItems}
                    onItemMove={onItemMove}
                    onItemClick={onItemClick}
                    onItemEdit={onItemEdit}
                    onItemDelete={onItemDelete}
                    readOnly={readOnly}
                    showActions={showActions}
                    customCardRenderer={customCardRenderer}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedKanbanBoard;