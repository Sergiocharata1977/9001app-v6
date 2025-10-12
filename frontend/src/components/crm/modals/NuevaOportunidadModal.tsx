'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmOportunidadService, crmClienteService, crmContactoService } from '@/services/crmService';
import { toast } from 'sonner';
import type { CreateCRMOportunidadDTO } from '@/types/crm';

interface NuevaOportunidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NuevaOportunidadModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: NuevaOportunidadModalProps) {
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCRMOportunidadDTO>({
    organization_id: organizationId,
    titulo: '',
    descripcion: '',
    valor_estimado: 0,
    moneda: 'MXN',
    probabilidad: 50,
    etapa: 'prospecto',
    fecha_cierre_esperada: '',
    cliente_id: '',
    contacto_id: '',
    vendedor_id: '',
    productos_incluidos: [],
    observaciones: '',
    created_by: 'current_user'
  });

  const [clientes, setClientes] = useState<any[]>([]);
  const [contactos, setContactos] = useState<any[]>([]);

  // Cargar clientes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadClientes();
      resetForm();
    }
  }, [isOpen, organizationId]);

  const resetForm = () => {
    setFormData({
      organization_id: organizationId,
      titulo: '',
      descripcion: '',
      valor_estimado: 0,
      moneda: 'MXN',
      probabilidad: 50,
      etapa: 'prospecto',
      fecha_cierre_esperada: '',
      cliente_id: '',
      contacto_id: '',
      vendedor_id: '',
      productos_incluidos: [],
      observaciones: '',
      created_by: 'current_user'
    });
    setContactos([]);
  };

  const loadClientes = async () => {
    try {
      const response = await crmClienteService.getAll(organizationId, { limit: 100 });
      if (response.success && response.data) {
        setClientes(response.data);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleClienteChange = async (clienteId: string) => {
    setFormData(prev => ({ ...prev, cliente_id: clienteId, contacto_id: '' }));
    
    if (clienteId) {
      try {
        const response = await crmContactoService.getAll(organizationId, { 
          empresa_id: clienteId, 
          limit: 100 
        });
        if (response.success && response.data) {
          setContactos(response.data);
        }
      } catch (error) {
        console.error('Error cargando contactos:', error);
      }
    } else {
      setContactos([]);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.cliente_id) {
      toast.error('Título y Cliente son campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await crmOportunidadService.create(formData);
      
      if (response.success) {
        toast.success('Oportunidad creada exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al crear la oportunidad');
      }
    } catch (error) {
      console.error('Error creando oportunidad:', error);
      toast.error('Error al crear la oportunidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nueva Oportunidad</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
              
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Ej: Venta de Semillas de Soja"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Descripción detallada de la oportunidad..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor_estimado">Valor Estimado</Label>
                  <Input
                    id="valor_estimado"
                    type="number"
                    value={formData.valor_estimado}
                    onChange={(e) => handleInputChange('valor_estimado', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select value={formData.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="probabilidad">Probabilidad (%)</Label>
                <Input
                  id="probabilidad"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probabilidad}
                  onChange={(e) => handleInputChange('probabilidad', Number(e.target.value))}
                  placeholder="50"
                />
              </div>

              <div>
                <Label htmlFor="etapa">Etapa</Label>
                <Select value={formData.etapa} onValueChange={(value) => handleInputChange('etapa', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecto">Prospecto</SelectItem>
                    <SelectItem value="calificacion">Calificación</SelectItem>
                    <SelectItem value="propuesta">Propuesta</SelectItem>
                    <SelectItem value="negociacion">Negociación</SelectItem>
                    <SelectItem value="cierre">Cierre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fecha_cierre_esperada">Fecha de Cierre Esperada</Label>
                <Input
                  id="fecha_cierre_esperada"
                  type="date"
                  value={formData.fecha_cierre_esperada}
                  onChange={(e) => handleInputChange('fecha_cierre_esperada', e.target.value)}
                />
              </div>
            </div>

            {/* Relaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Relaciones</h3>
              
              <div>
                <Label htmlFor="cliente_id">Cliente *</Label>
                <Select 
                  value={formData.cliente_id} 
                  onValueChange={handleClienteChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.razon_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contacto_id">Contacto</Label>
                <Select 
                  value={formData.contacto_id} 
                  onValueChange={(value) => handleInputChange('contacto_id', value)}
                  disabled={!formData.cliente_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.cliente_id ? "Seleccionar contacto..." : "Primero selecciona un cliente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {contactos.map((contacto) => (
                      <SelectItem key={contacto.id} value={contacto.id}>
                        {contacto.nombre} {contacto.apellidos} - {contacto.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vendedor_id">Vendedor Asignado</Label>
                <Input
                  id="vendedor_id"
                  value={formData.vendedor_id}
                  onChange={(e) => handleInputChange('vendedor_id', e.target.value)}
                  placeholder="ID del vendedor"
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
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
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Creando...' : 'Crear Oportunidad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}








