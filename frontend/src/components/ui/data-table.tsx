'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from './button';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  onSort,
  sortColumn,
  sortDirection,
  className
}: DataTableProps<T>) {
  const [internalSortColumn, setInternalSortColumn] = useState<keyof T | null>(sortColumn || null);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(sortDirection || 'asc');

  const handleSort = (column: keyof T) => {
    if (!columns.find(col => col.key === column)?.sortable) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (internalSortColumn === column) {
      newDirection = internalSortDirection === 'asc' ? 'desc' : 'asc';
    }

    setInternalSortColumn(column);
    setInternalSortDirection(newDirection);
    
    if (onSort) {
      onSort(column, newDirection);
    }
  };

  const getSortedData = () => {
    if (!internalSortColumn || onSort) return data; // Si hay onSort externo, no ordenamos internamente

    return [...data].sort((a, b) => {
      const aVal = a[internalSortColumn];
      const bVal = b[internalSortColumn];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return internalSortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const sortedData = getSortedData();
  const currentSortColumn = sortColumn || internalSortColumn;
  const currentSortDirection = sortDirection || internalSortDirection;

  if (loading) {
    return (
      <div className={cn('border border-gray-200 rounded-lg', className)}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className={cn('border border-gray-200 rounded-lg p-8 text-center', className)}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 select-none',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            'h-3 w-3',
                            currentSortColumn === column.key && currentSortDirection === 'asc'
                              ? 'text-primary-600' 
                              : 'text-gray-400'
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            'h-3 w-3 -mt-1',
                            currentSortColumn === column.key && currentSortDirection === 'desc'
                              ? 'text-primary-600' 
                              : 'text-gray-400'
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr
                key={item._id || index}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render 
                      ? column.render(item, index)
                      : String(item[column.key] || '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}