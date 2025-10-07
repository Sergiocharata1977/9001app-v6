'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Personnel } from '@/services/personnelService';

// Lazy loading del componente pesado (490KB)
const PersonnelListing = dynamic(
  () => import('@/components/rrhh/personnel/PersonnelListing').then(mod => ({ default: mod.PersonnelListing })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false
  }
);

export default function PersonalPage() {
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleViewPersonnel = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    // Aquí podrías abrir un modal o navegar a la página de detalle
    console.log('Ver personal:', personnel);
  };

  const handleEditPersonnel = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setShowForm(true);
    // Aquí podrías abrir el formulario de edición
    console.log('Editar personal:', personnel);
  };

  const handleNewPersonnel = () => {
    setSelectedPersonnel(null);
    setShowForm(true);
    // Aquí podrías abrir el formulario para nuevo personal
    console.log('Nuevo personal');
  };

  return (
    <div className="space-y-6">
      <PersonnelListing
        organizationId={1}
        onViewPersonnel={handleViewPersonnel}
        onEditPersonnel={handleEditPersonnel}
        onNewPersonnel={handleNewPersonnel}
      />
    </div>
  );
}