'use client';

import React from 'react';

interface SuperAdminHeaderProps {
  children?: React.ReactNode;
}

/**
 * Componente de encabezado para el dashboard de Super Admin
 * 
 * Versión simplificada para MVP que muestra el título y controles básicos.
 */
export function SuperAdminHeader({ children }: SuperAdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {children}
      </div>
    </header>
  );
}
