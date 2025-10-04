import { useRef, useEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { KanbanColumn } from '@/types/unified-kanban';

interface UseKanbanDropProps {
  columnId: string;
  column: KanbanColumn;
  onDrop: (itemId: string, sourceColumnId: string, targetColumnId: string, index?: number) => void;
  onDragOver?: (isOver: boolean) => void;
  disabled?: boolean;
}

export const useKanbanDrop = ({
  columnId,
  column,
  onDrop,
  onDragOver,
  disabled = false
}: UseKanbanDropProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    return combine(
      dropTargetForElements({
        element,
        getData: () => ({
          columnId,
          column,
          type: 'kanban-column'
        }),
        onDragEnter: () => {
          onDragOver?.(true);
        },
        onDragLeave: () => {
          onDragOver?.(false);
        },
        onDrop: ({ source, location }) => {
          onDragOver?.(false);

          const sourceData = source.data;
          if (sourceData?.type === 'kanban-item' && sourceData.itemId && sourceData.columnId) {
            const itemId = sourceData.itemId as string;
            const sourceColumnId = sourceData.columnId as string;

            // Calcular el índice donde se soltó el elemento
            const dropTargets = location.current.dropTargets;
            let index = 0;

            if (dropTargets.length > 0) {
              const columnDropTarget = dropTargets.find(target =>
                target.data?.type === 'kanban-column' && target.data?.columnId === columnId
              );

              if (columnDropTarget) {
                // Aquí podríamos calcular el índice basado en la posición
                // Por simplicidad, agregamos al final
                index = -1; // -1 significa al final
              }
            }

            onDrop(itemId, sourceColumnId, columnId, index);
          }
        },
        canDrop: ({ source }) => {
          const sourceData = source.data;
          return sourceData?.type === 'kanban-item' &&
                 sourceData?.columnId !== columnId &&
                 column.allowDrop !== false;
        }
      })
    );
  }, [columnId, column, onDrop, onDragOver, disabled]);

  return elementRef;
};