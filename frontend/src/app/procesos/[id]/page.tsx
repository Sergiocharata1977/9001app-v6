'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProcessSingleView } from '@/components/process/ProcessSingleView';
import { ProcessDefinition } from '@/shared-types/processes';

export default function ProcesoPage() {
  const params = useParams();
  const processId = params.id as string;
  const [process, setProcess] = useState<ProcessDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProcess();
  }, [processId]);

  const loadProcess = async () => {
    try {
      const response = await fetch(`/api/processes/definitions/${processId}`);
      if (response.ok) {
        const data = await response.json();
        setProcess(data.data);
      }
    } catch (error) {
      console.error('Error cargando proceso:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Proceso no encontrado</p>
        </div>
      </div>
    );
  }

  // Determinar si el proceso tiene registros habilitados
  // Por ejemplo, CRM y Hallazgos NO tienen registros propios
  const hasRegistros = !['CRM', 'Hallazgos', 'Análisis de Riesgo'].includes(process.name);

  return (
    <ProcessSingleView 
      processId={processId} 
      processName={process.name}
      hasRegistros={hasRegistros}
    />
  );
}