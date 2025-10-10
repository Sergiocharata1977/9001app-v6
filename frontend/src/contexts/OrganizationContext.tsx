'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OrganizationContextType {
  organizationId: string;
  setOrganizationId: (id: string) => void;
  userId: string;
  setUserId: (id: string) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  // Por ahora usamos valores por defecto
  // TODO: Esto debería venir de autenticación/sesión
  const [organizationId, setOrganizationId] = useState<string>('ORG-2024-001');
  const [userId, setUserId] = useState<string>('USER-2024-001');

  // Cargar desde localStorage si existe
  useEffect(() => {
    const storedOrgId = localStorage.getItem('organizationId');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedOrgId) setOrganizationId(storedOrgId);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (organizationId) {
      localStorage.setItem('organizationId', organizationId);
    }
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [organizationId, userId]);

  return (
    <OrganizationContext.Provider value={{ organizationId, setOrganizationId, userId, setUserId }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}



