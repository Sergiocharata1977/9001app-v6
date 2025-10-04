'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProcessListing from '@/components/process/ProcessListing';
import { useDonCandidoActions } from '@/contexts/DonCandidoContext';

export default function ProcesosPage() {
  const router = useRouter();
  const donCandido = useDonCandidoActions();

  // Mostrar Don Candido cuando se carga la página
  useEffect(() => {
    const timer = setTimeout(() => {
      donCandido.welcome();
    }, 1000);

    return () => clearTimeout(timer);
  }, [donCandido]);

  const handleProcessSelect = (process: any) => {
    // Mostrar Don Candido cuando se selecciona un proceso
    donCandido.notify(`Abriendo proceso: ${process.name}`, 'info');
    
    // Navegar a la vista Single de Proceso con tabs
    router.push(`/procesos/${process._id || process.id}`);
  };

  const handleNewProcess = () => {
    // Mostrar Don Candido cuando se crea un nuevo proceso
    donCandido.notify('Creando nuevo proceso...', 'info');
    router.push('/procesos/nuevo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Procesos</h1>
          <p className="text-gray-600 mt-1">
            Lista de procesos del sistema ISO 9001
          </p>
        </div>
        
        <ProcessListing
          onProcessSelect={handleProcessSelect}
          onNewProcess={handleNewProcess}
        />
      </div>
    </div>
  );
}