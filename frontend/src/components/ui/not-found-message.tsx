'use client';

import React from 'react';
import { Button } from './button';
import { FileX, Plus } from 'lucide-react';

interface NotFoundMessageProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const NotFoundMessage: React.FC<NotFoundMessageProps> = ({
  title = 'No se encontraron resultados',
  message,
  actionLabel = 'Crear nuevo',
  onAction,
  showAction = true,
  icon: Icon = FileX,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Icon className="h-16 w-16 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {showAction && onAction && (
          <Button
            onClick={onAction}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFoundMessage;