'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useDonCandidoActions } from '@/contexts/DonCandidoContext';
import { cn } from '@/lib/utils';

interface DonCandidoButtonProps {
  /** Tipo de acción */
  action?: 'welcome' | 'help' | 'thinking' | 'happy' | 'sad' | 'surprised';
  /** Mensaje personalizado */
  message?: string;
  /** Variante del botón */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Tamaño del botón */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Contenido del botón */
  children?: React.ReactNode;
  /** Icono personalizado */
  icon?: React.ReactNode;
}

export const DonCandidoButton: React.FC<DonCandidoButtonProps> = ({
  action = 'welcome',
  message,
  variant = 'outline',
  size = 'default',
  disabled = false,
  className,
  children,
  icon
}) => {
  const donCandido = useDonCandidoActions();

  const handleClick = () => {
    switch (action) {
      case 'welcome':
        donCandido.welcome();
        break;
      case 'help':
        donCandido.help();
        break;
      case 'thinking':
        donCandido.loading(message || 'Pensando...');
        break;
      case 'happy':
        donCandido.success(message || '¡Excelente!');
        break;
      case 'sad':
        donCandido.error(message || 'Algo salió mal...');
        break;
      case 'surprised':
        donCandido.notify(message || '¡Wow!', 'warning');
        break;
      default:
        donCandido.welcome();
    }
  };

  const defaultIcons = {
    welcome: '👋',
    help: '❓',
    thinking: '🤔',
    happy: '😊',
    sad: '😢',
    surprised: '😲'
  };

  const defaultText = {
    welcome: 'Saludar',
    help: 'Ayuda',
    thinking: 'Pensando',
    happy: 'Feliz',
    sad: 'Triste',
    surprised: 'Sorprendido'
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn('transition-all duration-200 hover:scale-105', className)}
    >
      {icon || <span className="mr-2">{defaultIcons[action]}</span>}
      {children || defaultText[action]}
    </Button>
  );
};

// Componente de botón flotante para Don Candido
export const DonCandidoFloatingButton: React.FC<{
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}> = ({ position = 'bottom-right', className }) => {
  const donCandido = useDonCandidoActions();

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <button
      onClick={() => donCandido.help()}
      className={cn(
        'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        'text-white p-4 rounded-full shadow-lg transition-all duration-200',
        'hover:scale-110 hover:shadow-xl z-50',
        'flex items-center justify-center',
        positionClasses[position],
        className
      )}
      title="Hablar con Don Candido"
    >
      <span className="text-2xl">👨‍💼</span>
    </button>
  );
};

export default DonCandidoButton;
