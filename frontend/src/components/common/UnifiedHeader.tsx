'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Download, LayoutGrid, List, FileText, Calendar, LucideIcon } from 'lucide-react';

interface UnifiedHeaderProps {
  title: string;
  description: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNew?: () => void;
  onExport?: () => void;
  viewMode: 'grid' | 'list' | 'kanban';
  onViewModeChange: (mode: 'grid' | 'list' | 'kanban') => void;
  showViewToggle?: boolean;
  showExport?: boolean;
  newButtonText?: string;
  totalCount?: number;
  lastUpdated?: string | null;
  icon?: LucideIcon;
  primaryColor?: 'emerald' | 'blue' | 'purple' | 'orange';
}

interface ColorClasses {
  gradient: string;
  button: string;
  badge: string;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  title, 
  description, 
  searchTerm, 
  onSearchChange, 
  onNew, 
  onExport, 
  viewMode, 
  onViewModeChange, 
  showViewToggle = true,
  showExport = true,
  newButtonText = "Nuevo",
  totalCount = 0,
  lastUpdated = null,
  icon: Icon = FileText,
  primaryColor = "emerald"
}) => {
  const getColorClasses = (): ColorClasses => {
    switch (primaryColor) {
      case 'emerald':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          badge: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
          badge: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'orange':
        return {
          gradient: 'from-orange-500 to-orange-600',
          button: 'bg-orange-600 hover:bg-orange-700 text-white',
          badge: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      default:
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-white/90 text-sm mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {totalCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <FileText className="h-3 w-3 mr-1" />
                {totalCount} {totalCount === 1 ? 'elemento' : 'elementos'}
              </Badge>
            )}
            {lastUpdated && (
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Calendar className="h-3 w-3" />
                <span>Última actualización {lastUpdated}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Buscar ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            {showViewToggle && (
              <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('grid')}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('kanban')}
                  className="h-8 w-8 p-0"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {showExport && onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
            
            {onNew && (
              <Button size="sm" className={colors.button} onClick={onNew}>
                <Plus className="h-4 w-4 mr-2" />
                {newButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedHeader;