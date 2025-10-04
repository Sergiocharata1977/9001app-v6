'use client';

import { cn } from '@/lib/utils';
import { FileX, Plus } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  const defaultIcon = <FileX className="h-12 w-12 text-gray-400" />;

  return (
    <div className={cn('text-center py-12', className)}>
      <div className="flex justify-center mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

// Componentes predefinidos para casos comunes
export function EmptyProcesses({ onCreateProcess }: { onCreateProcess: () => void }) {
  return (
    <EmptyState
      title="No hay procesos"
      description="Comienza creando tu primer proceso para organizar tu trabajo."
      icon={<Plus className="h-12 w-12 text-gray-400" />}
      action={
        <Button onClick={onCreateProcess} icon={<Plus className="h-4 w-4" />}>
          Crear Proceso
        </Button>
      }
    />
  );
}

export function EmptyRecords({ onCreateRecord }: { onCreateRecord: () => void }) {
  return (
    <EmptyState
      title="No hay registros"
      description="Agrega el primer registro a este proceso."
      action={
        <Button onClick={onCreateRecord} icon={<Plus className="h-4 w-4" />}>
          Agregar Registro
        </Button>
      }
    />
  );
}