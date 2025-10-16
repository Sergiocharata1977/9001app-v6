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
import { crmActividadService, crmOportunidadService, crmClienteService, crmContactoService } from '@/services/crmService';
import { toast } from 'sonner';
import type { UpdateCRMActividadDTO } from '@/types/crm';

interface EditarActividadModalProps {
  isOpen: boolean;
  onClose: () => void;
  actividad: any;
  onSuccess?: () => void;
}

export default function EditarActividadModal({ 
  isOpen, 
  onClose, 
  actividad,
  onSuccess 
}: EditarActividadModalProps) {
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [contactos, setContactos] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<UpdateCRMActividadDTO>({
    tipo: 'llamada',
    titulo: '',
    descripcion: '',
    fecha_programada: '',
    duracion_minutos: 30,
    estado: 'programada',
    resultado: '',
    oportunidad_id: '',
    cliente_id: '',
    contacto_id: '',
    vendedor_id: '',
    notas: '',
    updated_by: 'current_user'
  });

  useEffect(() => {
    if (isOpen && actividad) {
      loadData();
      populateForm();
    }
  }, [isOpen, actividad, organizationId]);

  const populateForm = () => {
    if (actividad) {
      setFormData({
        tipo: actividad.tipo || 'llamada',
        titulo: actividad.titulo || '',
        descripcion: actividad.descripcion || '',
        fecha_programada: actividad.fecha_programada || '',
        duracion_minutos: actividad.duracion_minutos || 30,
        estado: actividad.estado || 'programada',
        resultado: actividad.resultado || '',
        oportunidad_id: actividad.oportunidad_id || '',
        cliente_id: actividad.cliente_id || '',
        contacto_id: actividad.contacto_id || '',
        vendedor_id: actividad.vendedor_id || '',
        notas: actividad.notas || '',
        updated_by: 'current_user'
      });
    }
  };

  const loadData = async () => {
    try {
      const [oportunidadesRes, clientesRes] = await Promise.all([
        crmOportunidadService.getAll(organizationId, { limit: 100 }),
        crmClienteService.getAll(organizationId, { limit: 100 })
      ]);

      if (oportunidadesRes.success && oportunidadesRes.data) {
        setOportunidades(oportunidadesRes.data);
      }
      if (clientesRes.success && clientesRes.data) {
        setClientes(clientesRes.data);
      }

      // Cargar contactos si hay cliente seleccionado
      if (actividad?.cliente_id) {
        const contactosRes = await crmContactoService.getAll(organizationId, { 
          empresa_id: actividad.cliente_id, 
          limit: 100 
        });
        if (contactosRes.success && contactosRes.data) {
          setContactos(contactosRes.data);
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
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
    
    if (!formData.titulo || !formData.fecha_programada) {
      toast.error('Título y Fecha Programada son campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await crmActividadService.update(actividad.id, formData);
      
      if (response.success) {
        toast.success('Actividad actualizada exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al actualizar la actividad');
      }
    } catch (error) {
      console.error('Error actualizando actividad:', error);
      toast.error('Error al actualizar la actividad');
    } finally {
      setLoading(false);
    }
  };

  if (!actividad) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Actividad</DialogTitle>
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
                  placeholder="Ej: Llamada de seguimiento - Propuesta"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Actividad</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llamada">Llamada</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="reunion">Reunión</SelectItem>
                    <SelectItem value="visita">Visita</SelectItem>
                    <SelectItem value="presentacion">Presentación</SelectItem>
                    <SelectItem value="propuesta">Propuesta</SelectItem>
                    <SelectItem value="seguimiento">Seguimiento</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Descripción detallada de la actividad..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_programada">Fecha Programada *</Label>
                  <Input
                    id="fecha_programada"
                    type="datetime-local"
                    value={formData.fecha_programada}
                    onChange={(e) => handleInputChange('fecha_programada', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duracion_minutos">Duración (minutos)</Label>
                  <Input
                    id="duracion_minutos"
                    type="number"
                    value={formData.duracion_minutos}
                    onChange={(e) => handleInputChange('duracion_minutos', Number(e.target.value))}
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programada">Programada</SelectItem>
                    <SelectItem value="en_curso">En Curso</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resultado">Resultado</Label>
                <Textarea
                  id="resultado"
                  value={formData.resultado}
                  onChange={(e) => handleInputChange('resultado', e.target.value)}
                  placeholder="Resultado de la actividad..."
                  rows={2}
                />
              </div>
            </div>

            {/* Relaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Relaciones</h3>
              
              <div>
                <Label htmlFor="oportunidad_id">Oportunidad</Label>
                <Select 
                  value={formData.oportunidad_id} 
                  onValueChange={(value) => handleInputChange('oportunidad_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar oportunidad..." />
                  </SelectTrigger>
                  <SelectContent>
                    {oportunidades.map((oportunidad) => (
                      <SelectItem key={oportunidad.id} value={oportunidad.id}>
                        {oportunidad.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cliente_id">Cliente</Label>
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
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => handleInputChange('notas', e.target.value)}
                  placeholder="Notas adicionales..."
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
              {loading ? 'Actualizando...' : 'Actualizar Actividad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
























