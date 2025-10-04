'use client';

import { cn } from '@/lib/utils';
import { LayoutGrid, List, Kanban } from 'lucide-react';

export interface ViewToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ViewToggleProps {
  options?: ViewToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  viewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

export function ViewToggle({ 
  options = processViewOptions, 
  value, 
  onChange, 
  className,
  viewMode,
  onViewModeChange
}: ViewToggleProps) {
  // Si se pasan viewMode y onViewModeChange, usar esos en su lugar
  const currentValue = viewMode || value;
  const handleChange = onViewModeChange || onChange;
  return (
    <div className={cn('inline-flex rounded-lg border border-gray-200 bg-white p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={cn(
            'inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            currentValue === option.value
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

// Opciones predefinidas para el sistema de procesos
export const processViewOptions: ViewToggleOption[] = [
  {
    value: 'boards',
    label: 'Tableros',
    icon: <LayoutGrid className="h-4 w-4" />
  },
  {
    value: 'kanban',
    label: 'Kanban',
    icon: <Kanban className="h-4 w-4" />
  },
  {
    value: 'list',
    label: 'Lista',
    icon: <List className="h-4 w-4" />
  }
];