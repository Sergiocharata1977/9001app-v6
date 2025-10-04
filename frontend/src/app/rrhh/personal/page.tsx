'use client';

import { useState } from 'react';
import { PersonnelListing } from '@/components/rrhh/personnel/PersonnelListing';
import { Personnel } from '@/services/personnelService';

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