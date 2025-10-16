'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Save, Building2 } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { departmentService } from '@/services/departmentService';
import { toast } from 'sonner';
import { DepartmentForm } from '../DepartmentForm';

interface NuevoDepartamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  managers?: Array<{ id: string; nombres: string; apellidos: string }>;
}

export default function NuevoDepartamentoModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  managers = []
}: NuevoDepartamentoModalProps) {
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      const departmentData = {
        ...data,
        id: `dept_${Date.now()}`,
        organization_id: organizationId,
      };
      
      const response = await departmentService.createDepartment(departmentData);
      
      toast.success('Departamento creado exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creando departamento:', error);
      toast.error('Error al crear el departamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="h-5 w-5 text-blue-600" />
            Nuevo Departamento
          </DialogTitle>
        </DialogHeader>

        <DepartmentForm 
          organizationId={organizationId} 
          managers={managers}
          onSuccess={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}