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
import { crmClienteService } from '@/services/crmService';
import { toast } from 'sonner';
import type { UpdateCRMClienteDTO } from '@/types/crm';

interface EditarEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresa: any;
  onSuccess?: () => void;
}

export default function EditarEmpresaModal({ 
  isOpen, 
  onClose, 
  empresa,
  onSuccess 
}: EditarEmpresaModalProps) {
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateCRMClienteDTO>({
    razon_social: '',
    nombre_comercial: '',
    rfc: '',
    tipo_persona: 'moral',
    industria: '',
    tamaño_empresa: 'mediana',
    direccion: '',
    ciudad: '',
    estado: '',
    codigo_postal: '',
    pais: 'México',
    telefono: '',
    email: '',
    sitio_web: '',
    numero_empleados: 0,
    facturacion_anual: 0,
    contacto_principal: '',
    observaciones: '',
    updated_by: 'current_user'
  });

  useEffect(() => {
    if (isOpen && empresa) {
      populateForm();
    }
  }, [isOpen, empresa]);

  const populateForm = () => {
    if (empresa) {
      setFormData({
        razon_social: empresa.razon_social || '',
        nombre_comercial: empresa.nombre_comercial || '',
        rfc: empresa.rfc || '',
        tipo_persona: empresa.tipo_persona || 'moral',
        industria: empresa.industria || '',
        tamaño_empresa: empresa.tamaño_empresa || 'mediana',
        direccion: empresa.direccion || '',
        ciudad: empresa.ciudad || '',
        estado: empresa.estado || '',
        codigo_postal: empresa.codigo_postal || '',
        pais: empresa.pais || 'México',
        telefono: empresa.telefono || '',
        email: empresa.email || '',
        sitio_web: empresa.sitio_web || '',
        numero_empleados: empresa.numero_empleados || 0,
        facturacion_anual: empresa.facturacion_anual || 0,
        contacto_principal: empresa.contacto_principal || '',
        observaciones: empresa.observaciones || '',
        updated_by: 'current_user'
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.razon_social || !formData.rfc) {
      toast.error('Razón Social y RFC son campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await crmClienteService.update(empresa.id, formData);
      
      if (response.success) {
        toast.success('Empresa actualizada exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al actualizar la empresa');
      }
    } catch (error) {
      console.error('Error actualizando empresa:', error);
      toast.error('Error al actualizar la empresa');
    } finally {
      setLoading(false);
    }
  };

  if (!empresa) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Información Fiscal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Fiscal</h3>
              
              <div>
                <Label htmlFor="razon_social">Razón Social *</Label>
                <Input
                  id="razon_social"
                  value={formData.razon_social}
                  onChange={(e) => handleInputChange('razon_social', e.target.value)}
                  placeholder="Ej: Agropecuaria del Norte S.A. de C.V."
                  required
                />
              </div>

              <div>
                <Label htmlFor="nombre_comercial">Nombre Comercial</Label>
                <Input
                  id="nombre_comercial"
                  value={formData.nombre_comercial}
                  onChange={(e) => handleInputChange('nombre_comercial', e.target.value)}
                  placeholder="Ej: Agro Norte"
                />
              </div>

              <div>
                <Label htmlFor="rfc">RFC *</Label>
                <Input
                  id="rfc"
                  value={formData.rfc}
                  onChange={(e) => handleInputChange('rfc', e.target.value.toUpperCase())}
                  placeholder="Ej: ANO123456789"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo_persona">Tipo de Persona</Label>
                <Select value={formData.tipo_persona} onValueChange={(value) => handleInputChange('tipo_persona', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moral">Moral (Empresa)</SelectItem>
                    <SelectItem value="fisica">Física (Persona)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información de Negocio */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información de Negocio</h3>
              
              <div>
                <Label htmlFor="industria">Industria</Label>
                <Select value={formData.industria} onValueChange={(value) => handleInputChange('industria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar industria..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agricultura">Agricultura</SelectItem>
                    <SelectItem value="ganaderia">Ganadería</SelectItem>
                    <SelectItem value="agroindustria">Agroindustria</SelectItem>
                    <SelectItem value="comercializacion">Comercialización</SelectItem>
                    <SelectItem value="distribucion">Distribución</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tamaño_empresa">Tamaño de Empresa</Label>
                <Select value={formData.tamaño_empresa} onValueChange={(value) => handleInputChange('tamaño_empresa', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro (1-10 empleados)</SelectItem>
                    <SelectItem value="pequeña">Pequeña (11-50 empleados)</SelectItem>
                    <SelectItem value="mediana">Mediana (51-250 empleados)</SelectItem>
                    <SelectItem value="grande">Grande (250+ empleados)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero_empleados">Número de Empleados</Label>
                  <Input
                    id="numero_empleados"
                    type="number"
                    value={formData.numero_empleados}
                    onChange={(e) => handleInputChange('numero_empleados', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="facturacion_anual">Facturación Anual (MXN)</Label>
                  <Input
                    id="facturacion_anual"
                    type="number"
                    value={formData.facturacion_anual}
                    onChange={(e) => handleInputChange('facturacion_anual', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contacto_principal">Contacto Principal</Label>
                <Input
                  id="contacto_principal"
                  value={formData.contacto_principal}
                  onChange={(e) => handleInputChange('contacto_principal', e.target.value)}
                  placeholder="Nombre del contacto principal"
                />
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
              
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="sitio_web">Sitio Web</Label>
                <Input
                  id="sitio_web"
                  value={formData.sitio_web}
                  onChange={(e) => handleInputChange('sitio_web', e.target.value)}
                  placeholder="https://www.empresa.com"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Dirección</h3>
              
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Calle, número, colonia..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    placeholder="Estado"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codigo_postal">Código Postal</Label>
                  <Input
                    id="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    placeholder="México"
                  />
                </div>
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
              {loading ? 'Actualizando...' : 'Actualizar Empresa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
























