/**
 * 🚀 COMPONENTE DE LOADING OPTIMIZADO
 * 
 * Componente de carga optimizado para mejorar la percepción de velocidad
 */

'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingOptimizedProps {
  isLoading: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inline' | 'overlay';
  className?: string;
}

export function LoadingOptimized({
  isLoading,
  isSuccess = false,
  isError = false,
  message = 'Cargando...',
  size = 'md',
  variant = 'default',
  className
}: LoadingOptimizedProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const messageSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getIcon = () => {
    if (isError) {
      return <AlertCircle className={cn(sizeClasses[size], 'text-red-500')} />;
    }
    if (isSuccess) {
      return <CheckCircle className={cn(sizeClasses[size], 'text-green-500')} />;
    }
    if (isLoading) {
      return <Loader2 className={cn(sizeClasses[size], 'text-blue-500 animate-spin')} />;
    }
    return null;
  };

  const getMessage = () => {
    if (isError) return 'Error al cargar';
    if (isSuccess) return 'Completado';
    if (isLoading) return message;
    return '';
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'inline':
        return 'flex items-center gap-2 py-2';
      case 'overlay':
        return 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50';
      default:
        return 'flex flex-col items-center justify-center p-8 space-y-4';
    }
  };

  return (
    <div className={cn(getVariantClasses(), className)} data-testid="loading-state">
      <div className="flex items-center gap-2">
        {getIcon()}
        {message && (
          <span className={cn(messageSizes[size], 'font-medium text-gray-700')}>
            {getMessage()}
          </span>
        )}
      </div>
      
      {/* Barra de progreso animada para cargas largas */}
      {isLoading && variant === 'default' && (
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}

// Componente específico para listas
export function LoadingList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" data-testid="loading-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-20 w-full" />
        </div>
      ))}
    </div>
  );
}

// Componente específico para tarjetas
export function LoadingCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg border p-6" data-testid="loading-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

// Hook para manejar estados de carga
export function useLoadingState() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const startLoading = (msg = 'Cargando...') => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setMessage(msg);
  };

  const setSuccess = (msg = 'Completado') => {
    setIsLoading(false);
    setIsSuccess(true);
    setIsError(false);
    setMessage(msg);
    
    // Auto-hide success after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setMessage('');
    }, 2000);
  };

  const setError = (msg = 'Error al cargar') => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(true);
    setMessage(msg);
  };

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setMessage('');
  };

  return {
    isLoading,
    isSuccess,
    isError,
    message,
    startLoading,
    setSuccess,
    setError,
    reset
  };
}

export default LoadingOptimized;














