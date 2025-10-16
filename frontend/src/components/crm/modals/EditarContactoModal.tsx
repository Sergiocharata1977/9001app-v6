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
import { crmContactoService, crmClienteService } from '@/services/crmService';
import { toast } from 'sonner';
import type { UpdateCRMContactoDTO } from '@/types/crm';

interface EditarContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacto: any;
  onSuccess?: () => void;
}

export default function EditarContactoModal({ 
  isOpen, 
  onClose, 
  contacto,
  onSuccess 
}: EditarContactoModalProps) {
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [formData, setFormData] = useState<UpdateCRMContactoDTO>({
    nombre: '',
    apellidos: '',
    cargo: '',
    departamento: '',
    email: '',
    telefono: '',
    telefono_movil: '',
    empresa_id: '',
    tipo_contacto: 'comercial',
    nivel_influencia: 'medio',
    canal_preferido: 'email',
    observaciones: '',
    updated_by: 'current_user'
  });

  useEffect(() => {
    if (isOpen && contacto) {
      loadClientes();
      populateForm();
    }
  }, [isOpen, contacto, organizationId]);

  const populateForm = () => {
    if (contacto) {
      setFormData({
        nombre: contacto.nombre || '',
        apellidos: contacto.apellidos || '',
        cargo: contacto.cargo || '',
        departamento: contacto.departamento || '',
        email: contacto.email || '',
        telefono: contacto.telefono || '',
        telefono_movil: contacto.telefono_movil || '',
        empresa_id: contacto.empresa_id || '',
        tipo_contacto: contacto.tipo_contacto || 'comercial',
        nivel_influencia: contacto.nivel_influencia || 'medio',
        canal_preferido: contacto.canal_preferido || 'email',
        observaciones: contacto.observaciones || '',
        updated_by: 'current_user'
      });
    }
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellidos || !formData.empresa_id) {
      toast.error('Nombre, Apellidos y Empresa son campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await crmContactoService.update(contacto.id, formData);
      
      if (response.success) {
        toast.success('Contacto actualizado exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al actualizar el contacto');
      }
    } catch (error) {
      console.error('Error actualizando contacto:', error);
      toast.error('Error al actualizar el contacto');
    } finally {
      setLoading(false);
    }
  };

  if (!contacto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Contacto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                    placeholder="Pérez García"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleInputChange('cargo', e.target.value)}
                    placeholder="Gerente de Compras"
                  />
                </div>
                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => handleInputChange('departamento', e.target.value)}
                    placeholder="Compras"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="juan.perez@empresa.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="+52 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono_movil">Teléfono Móvil</Label>
                  <Input
                    id="telefono_movil"
                    value={formData.telefono_movil}
                    onChange={(e) => handleInputChange('telefono_movil', e.target.value)}
                    placeholder="+52 (555) 987-6543"
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Profesional</h3>
              
              <div>
                <Label htmlFor="empresa_id">Empresa *</Label>
                <Select 
                  value={formData.empresa_id} 
                  onValueChange={(value) => handleInputChange('empresa_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa..." />
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
                <Label htmlFor="tipo_contacto">Tipo de Contacto</Label>
                <Select value={formData.tipo_contacto} onValueChange={(value) => handleInputChange('tipo_contacto', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="decision">Tomador de Decisiones</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="usuario_final">Usuario Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nivel_influencia">Nivel de Influencia</Label>
                <Select value={formData.nivel_influencia} onValueChange={(value) => handleInputChange('nivel_influencia', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="bajo">Bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="canal_preferido">Canal de Comunicación Preferido</Label>
                <Select value={formData.canal_preferido} onValueChange={(value) => handleInputChange('canal_preferido', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="telefono">Teléfono</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales sobre el contacto..."
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
              {loading ? 'Actualizando...' : 'Actualizar Contacto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
























