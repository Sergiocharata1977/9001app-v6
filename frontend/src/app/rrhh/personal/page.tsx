'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Personnel } from '@/services/personnelService';
import { PersonnelForm } from '@/components/rrhh/personnel/PersonnelForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);
  const organizationId = 1; // En una aplicación real, esto vendría de un contexto o prop

  const handleViewPersonnel = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setShowDetails(true);
  };

  const handleEditPersonnel = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setShowForm(true);
  };

  const handleNewPersonnel = () => {
    setSelectedPersonnel(null);
    setShowForm(true);
  };

  const handleFormSuccess = (personnel: Personnel) => {
    setShowForm(false);
    // Aquí podrías actualizar la lista de personal o recargar los datos
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="space-y-6">
      {/* Listado de personal */}
      <PersonnelListing
        organizationId={organizationId}
        onViewPersonnel={handleViewPersonnel}
        onEditPersonnel={handleEditPersonnel}
        onNewPersonnel={handleNewPersonnel}
      />

      {/* Modal de formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <PersonnelForm
            personnel={selectedPersonnel}
            organizationId={organizationId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          {selectedPersonnel && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detalles del Personal</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCloseDetails}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Personal</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
                        <dd className="text-base">{selectedPersonnel.nombres} {selectedPersonnel.apellidos}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="text-base">{selectedPersonnel.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                        <dd className="text-base">{selectedPersonnel.telefono || 'No especificado'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Documento</dt>
                        <dd className="text-base">{selectedPersonnel.documento_identidad || 'No especificado'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nacionalidad</dt>
                        <dd className="text-base">{selectedPersonnel.nacionalidad || 'No especificada'}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Laboral</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tipo de Personal</dt>
                        <dd className="text-base capitalize">{selectedPersonnel.tipo_personal}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Número de Legajo</dt>
                        <dd className="text-base">{selectedPersonnel.numero_legajo || 'No asignado'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fecha de Contratación</dt>
                        <dd className="text-base">
                          {selectedPersonnel.fecha_contratacion
                            ? new Date(selectedPersonnel.fecha_contratacion).toLocaleDateString()
                            : 'No especificada'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Estado</dt>
                        <dd className="text-base">{selectedPersonnel.estado}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Información adicional para personal de ventas */}
                {selectedPersonnel.tipo_personal === 'ventas' && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Información de Ventas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Meta Mensual</dt>
                        <dd className="text-base">{selectedPersonnel.meta_mensual || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Comisión</dt>
                        <dd className="text-base">{selectedPersonnel.comision_porcentaje || 0}%</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Especialidad</dt>
                        <dd className="text-base">{selectedPersonnel.especialidad_ventas || 'No especificada'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Zona de Venta</dt>
                        <dd className="text-base">{selectedPersonnel.zona_venta || 'No asignada'}</dd>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => {
                      handleCloseDetails();
                      handleEditPersonnel(selectedPersonnel);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Editar Personal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}