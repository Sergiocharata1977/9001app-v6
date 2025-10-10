'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { crmClienteService } from '@/services/crmService';
import { toast } from 'sonner';

interface EliminarEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresa: any;
  onSuccess?: () => void;
}

export default function EliminarEmpresaModal({ 
  isOpen, 
  onClose, 
  empresa,
  onSuccess 
}: EliminarEmpresaModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!empresa) return;

    try {
      setLoading(true);
      const response = await crmClienteService.delete(empresa.id);
      
      if (response.success) {
        toast.success('Empresa eliminada exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al eliminar la empresa');
      }
    } catch (error) {
      console.error('Error eliminando empresa:', error);
      toast.error('Error al eliminar la empresa');
    } finally {
      setLoading(false);
    }
  };

  if (!empresa) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Empresa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ¿Estás seguro de que deseas eliminar esta empresa?
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Empresa a eliminar:</h4>
            <p className="text-sm text-gray-700">
              <strong>Razón Social:</strong> {empresa.razon_social}
            </p>
            <p className="text-sm text-gray-700">
              <strong>RFC:</strong> {empresa.rfc}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Industria:</strong> {empresa.industria || 'No especificada'}
            </p>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. 
              Se eliminarán todos los datos relacionados con esta empresa, incluyendo contactos y oportunidades.
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Eliminando...' : 'Eliminar Empresa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}




