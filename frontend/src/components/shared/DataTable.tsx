'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  LayoutGrid, 
  List, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Download
} from 'lucide-react';

export interface Column<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface Action<T = any> {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (row: T) => void;
  variant?: 'ghost' | 'outline' | 'primary' | 'secondary' | 'destructive';
  className?: string;
}

export interface KanbanColumn<T = any> {
  key: string;
  label: string;
  color?: string;
  filter: (row: T) => boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onCreate?: () => void;
  
  // Búsqueda
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  
  // Paginación
  paginated?: boolean;
  pageSize?: number;
  
  // Exportación
  exportable?: boolean;
  
  // Metadatos
  title?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
  
  // Estilos de tabla
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  
  // Identificador único
  rowKey?: keyof T;
  
  // Vistas múltiples
  viewModes?: ('list' | 'grid' | 'kanban')[];
  defaultView?: 'list' | 'grid' | 'kanban';
  
  // Configuración Kanban
  kanbanColumns?: KanbanColumn<T>[];
  
  // Configuración Grid
  gridColumns?: number;
  
  // Renderizado personalizado para vistas
  renderCard?: (row: T, actions: Action<T>[]) => React.ReactNode;
  renderKanbanCard?: (row: T, actions: Action<T>[]) => React.ReactNode;
  
  // Eventos de vista
  onCardClick?: (row: T) => void;
  onKanbanCardMove?: (row: T, fromColumn: string, toColumn: string) => void;
}

function DataTable<T extends Record<string, any>>({
  data = [],
  columns = [],
  actions = [],
  loading = false,
  error = null,
  onRefresh,
  onCreate,
  searchable = false,
  searchPlaceholder = "Buscar...",
  searchFields = [],
  paginated = false,
  pageSize = 10,
  exportable = false,
  title,
  description,
  emptyMessage = "No hay datos disponibles",
  className = "",
  striped = false,
  bordered = false,
  compact = false,
  rowKey = 'id' as keyof T,
  viewModes = ['list'],
  defaultView = 'list',
  kanbanColumns = [],
  gridColumns = 4,
  renderCard,
  renderKanbanCard,
  onCardClick,
  onKanbanCardMove,
}: DataTableProps<T>) {
  // ========== ESTADO ==========
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>(defaultView);

  // ========== FUNCIONES AUXILIARES ==========
  const getRowKey = (row: T): string | number => {
    return row[rowKey] || Math.random().toString();
  };

  // Filtrado por búsqueda
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const value = row[field];
          return value && String(value).toLowerCase().includes(term);
        });
      }
      
      // Si no se especifican campos, buscar en todas las columnas
      return columns.some(column => {
        const value = row[column.key];
        return value && String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields, columns, searchable]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // ========== MANEJADORES DE EVENTOS ==========
  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleExport = () => {
    // Implementar lógica de exportación
    console.log('Exportando datos...', sortedData);
  };

  // ========== RENDERIZADO ==========
  
  // Renderizado por defecto de tarjeta
  const renderDefaultCard = (row: T, actions: Action<T>[]) => {
    const key = getRowKey(row);
    
    return (
      <div 
        key={key}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onCardClick?.(row)}
      >
        <div className="p-4 space-y-3">
          {columns.slice(0, 3).map((column) => (
            <div key={String(column.key)} className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
              </div>
            </div>
          ))}
          
          {actions.length > 0 && (
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              {actions.map((action, actionIndex) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    className={action.className}
                    title={action.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizado por defecto de tarjeta Kanban
  const renderDefaultKanbanCard = (row: T, actions: Action<T>[]) => {
    const key = getRowKey(row);
    
    return (
      <div 
        key={key}
        className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-lg mb-3"
        onClick={() => onCardClick?.(row)}
      >
        <div className="p-3">
          <div className="space-y-2">
            {columns.slice(0, 2).map((column) => (
              <div key={String(column.key)} className="text-sm">
                <span className="font-medium text-gray-900">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                </span>
              </div>
            ))}
          </div>
          
          {actions.length > 0 && (
            <div className="flex gap-1 mt-3 pt-2 border-t">
              {actions.map((action, actionIndex) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    className={`${action.className} h-6 w-6 p-0`}
                    title={action.label}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Vista Kanban
  const renderKanbanView = () => {
    const displayData = paginated ? paginatedData : sortedData;
    
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (kanbanColumns.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No hay columnas configuradas para la vista Kanban
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((column) => {
          const columnData = displayData.filter(column.filter);
          
          return (
            <div key={column.key} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  {column.color && (
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {column.label}
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {columnData.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {columnData.map((row) => {
                    const cardRenderer = renderKanbanCard || renderDefaultKanbanCard;
                    return cardRenderer(row, actions);
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Vista Grid
  const renderGridView = () => {
    const displayData = paginated ? paginatedData : sortedData;
    
    if (loading) {
      return (
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
          {Array.from({ length: gridColumns * 2 }).map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48 animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (displayData.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">{emptyMessage}</p>
          {onCreate && (
            <Button onClick={onCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Crear primero
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
        {displayData.map((row) => {
          const cardRenderer = renderCard || renderDefaultCard;
          return cardRenderer(row, actions);
        })}
      </div>
    );
  };

  // Vista Lista
  const renderListView = () => {
    const displayData = paginated ? paginatedData : sortedData;
    
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className={`min-w-full bg-white dark:bg-gray-800 ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''} rounded-lg`}>
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`${striped ? 'divide-y divide-gray-200 dark:divide-gray-700' : ''}`}>
            {displayData.map((row, index) => (
              <tr
                key={getRowKey(row)}
                className={`${striped && index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  onCardClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onCardClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={`px-6 py-4 ${compact ? 'py-2' : 'py-4'} whitespace-nowrap`}>
                    {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className={`px-6 py-4 ${compact ? 'py-2' : 'py-4'} text-right`}>
                    <div className="flex gap-2">
                      {actions.map((action, actionIndex) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={actionIndex}
                            variant={action.variant || 'ghost'}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={action.className}
                            title={action.label}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="sr-only">{action.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {displayData.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">{emptyMessage}</p>
            {onCreate && (
              <Button onClick={onCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear primero
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {(title || description || searchable || viewModes.length > 1 || exportable || onCreate) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Búsqueda */}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}
            
            {/* Selector de vista */}
            {viewModes.length > 1 && (
              <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                {viewModes.includes('list') && (
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </Button>
                )}
                {viewModes.includes('grid') && (
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Tarjetas
                  </Button>
                )}
                {viewModes.includes('kanban') && (
                  <Button
                    variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    className="h-8 px-3"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Kanban
                  </Button>
                )}
              </div>
            )}
            
            {/* Exportar */}
            {exportable && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
            
            {/* Crear */}
            {onCreate && (
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Vista Lista */}
        {viewMode === 'list' && renderListView()}

        {/* Vista Grid */}
        {viewMode === 'grid' && renderGridView()}

        {/* Vista Kanban */}
        {viewMode === 'kanban' && renderKanbanView()}
      </div>

      {/* Paginación */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} resultados
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;