'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  Grid3X3, 
  LayoutGrid,
  SortAsc,
  SortDesc,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import ProcessRecordCard, { ProcessRecord } from './ProcessRecordCard';

export interface ProcessRecordsCardViewProps {
  records: ProcessRecord[];
  onRecordClick?: (record: ProcessRecord) => void;
  onRecordEdit?: (record: ProcessRecord) => void;
  onRecordDelete?: (record: ProcessRecord) => void;
  onRecordView?: (record: ProcessRecord) => void;
  onCreateRecord?: () => void;
  isLoading?: boolean;
}

type GroupBy = 'none' | 'status' | 'priority' | 'assignedTo' | 'process';
type SortBy = 'title' | 'createdAt' | 'updatedAt' | 'dueDate' | 'priority';
type SortOrder = 'asc' | 'desc';

const ProcessRecordsCardView: React.FC<ProcessRecordsCardViewProps> = ({
  records,
  onRecordClick,
  onRecordEdit,
  onRecordDelete,
  onRecordView,
  onCreateRecord,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records.filter(record => {
      const matchesSearch = !searchTerm || 
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.processName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || record.assignedTo === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });

    // Sort records
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'priority') {
        const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
      } else if (sortBy.includes('At') || sortBy === 'dueDate') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [records, searchTerm, statusFilter, priorityFilter, assigneeFilter, sortBy, sortOrder]);

  // Group records
  const groupedRecords = useMemo(() => {
    if (groupBy === 'none') {
      return { 'Todos los registros': filteredAndSortedRecords };
    }

    const groups: Record<string, ProcessRecord[]> = {};
    
    filteredAndSortedRecords.forEach(record => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'status':
          groupKey = getStatusText(record.status);
          break;
        case 'priority':
          groupKey = getPriorityText(record.priority);
          break;
        case 'assignedTo':
          groupKey = record.assignedTo;
          break;
        case 'process':
          groupKey = record.processName;
          break;
        default:
          groupKey = 'Sin agrupar';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(record);
    });

    return groups;
  }, [filteredAndSortedRecords, groupBy]);

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

  const getPriorityText = (priority: ProcessRecord['priority']) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return 'Sin prioridad';
    }
  };

  const getGridColumns = () => {
    switch (gridSize) {
      case 'small': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5';
      case 'medium': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'large': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const uniqueAssignees = useMemo(() => {
    return Array.from(new Set(records.map(r => r.assignedTo)));
  }, [records]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registros de Procesos</h1>
          <p className="text-gray-600">
            {filteredAndSortedRecords.length} de {records.length} registros
          </p>
        </div>
        
        {onCreateRecord && (
          <Button onClick={onCreateRecord}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Registro
          </Button>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completado</option>
            <option value="overdue">Vencido</option>
            <option value="cancelled">Cancelado</option>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={setPriorityFilter}
          >
            <option value="all">Todas las prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </Select>

          <Select
            value={assigneeFilter}
            onValueChange={setAssigneeFilter}
          >
            <option value="all">Todos los asignados</option>
            {uniqueAssignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as GroupBy)}
          >
            <option value="none">Sin agrupar</option>
            <option value="status">Por estado</option>
            <option value="priority">Por prioridad</option>
            <option value="assignedTo">Por asignado</option>
            <option value="process">Por proceso</option>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortBy)}
          >
            <option value="updatedAt">Última actualización</option>
            <option value="createdAt">Fecha de creación</option>
            <option value="dueDate">Fecha de vencimiento</option>
            <option value="title">Título</option>
            <option value="priority">Prioridad</option>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={gridSize === 'small' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGridSize('small')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridSize === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGridSize('medium')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={gridSize === 'large' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGridSize('large')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredAndSortedRecords.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No se encontraron registros"
          description={searchTerm ? "No hay registros que coincidan con tu búsqueda" : "Aún no hay registros creados"}
          action={onCreateRecord && (
            <Button onClick={onCreateRecord}>
              <Plus className="h-4 w-4 mr-2" />
              Crear primer registro
            </Button>
          )}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRecords).map(([groupName, groupRecords]) => (
            <div key={groupName}>
              {groupBy !== 'none' && (
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {groupName} ({groupRecords.length})
                </h2>
              )}
              
              <motion.div 
                layout 
                className={`grid ${getGridColumns()} gap-4`}
              >
                {groupRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProcessRecordCard
                      record={record}
                      onClick={onRecordClick}
                      onView={onRecordView}
                      onEdit={onRecordEdit}
                      onDelete={onRecordDelete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessRecordsCardView;