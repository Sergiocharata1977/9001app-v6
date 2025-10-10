'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { crmOportunidadService, crmClienteService, crmContactoService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { CRMCliente, CRMContacto } from '@/types/crm';

// Esquema de validación con Zod
const oportunidadSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  etapa: z.string().min(1, 'Seleccione una etapa'),
  valor_estimado: z.number().positive('El valor debe ser mayor a 0'),
  moneda: z.string().min(1, 'Seleccione una moneda'),
  probabilidad: z.number().min(0, 'La probabilidad debe ser entre 0 y 100').max(100, 'La probabilidad debe ser entre 0 y 100'),
  cliente_id: z.string().min(1, 'Seleccione un cliente'),
  contacto_id: z.string().min(1, 'Seleccione un contacto'),
  vendedor_id: z.string().default('USER-2024-001'), // Valor por defecto para pruebas
  fecha_cierre_esperada: z.string().min(1, 'Seleccione una fecha de cierre esperada'),
});

type OportunidadFormValues = z.infer<typeof oportunidadSchema>;

interface OportunidadFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OportunidadForm({ initialData, onSuccess, onCancel }: OportunidadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<CRMCliente[]>([]);
  const [contactos, setContactos] = useState<CRMContacto[]>([]);
  const [filteredContactos, setFilteredContactos] = useState<CRMContacto[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [isLoadingContactos, setIsLoadingContactos] = useState(false);
  const { organizationId } = useOrganization();
  
  const form = useForm<OportunidadFormValues>({
    resolver: zodResolver(oportunidadSchema),
    defaultValues: initialData || {
      titulo: '',
      descripcion: '',
      etapa: initialData?.etapa || 'prospecto',
      valor_estimado: 0,
      moneda: 'USD',
      probabilidad: 0,
      cliente_id: '',
      contacto_id: '',
      vendedor_id: 'USER-2024-001', // Valor por defecto para pruebas
      fecha_cierre_esperada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días en el futuro
    },
  });

  // Cargar clientes para el dropdown
  useEffect(() => {
    const loadClientes = async () => {
      if (!organizationId) return;
      
      setIsLoadingClientes(true);
      try {
        const response = await crmClienteService.getAll(organizationId, { limit: 100 });
        setClientes(response.data);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        toast.error('Error al cargar la lista de clientes');
      } finally {
        setIsLoadingClientes(false);
      }
    };
    
    loadClientes();
  }, [organizationId]);

  // Cargar contactos para el dropdown
  useEffect(() => {
    const loadContactos = async () => {
      if (!organizationId) return;
      
      setIsLoadingContactos(true);
      try {
        const response = await crmContactoService.getAll(organizationId, { limit: 100 });
        setContactos(response.data);
      } catch (error) {
        console.error('Error al cargar contactos:', error);
        toast.error('Error al cargar la lista de contactos');
      } finally {
        setIsLoadingContactos(false);
      }
    };
    
    loadContactos();
  }, [organizationId]);

  // Filtrar contactos cuando cambia el cliente seleccionado
  useEffect(() => {
    const clienteId = form.watch('cliente_id');
    if (clienteId && contactos.length > 0) {
      const filtered = contactos.filter(contacto => {
        // Buscar el cliente por ID y comparar con la empresa del contacto
        const cliente = clientes.find(c => c.id === clienteId);
        return cliente && contacto.empresa === cliente.razon_social;
      });
      setFilteredContactos(filtered.length > 0 ? filtered : contactos);
    } else {
      setFilteredContactos(contactos);
    }
  }, [form.watch('cliente_id'), contactos, clientes]);

  const onSubmit = async (data: OportunidadFormValues) => {
    if (!organizationId) {
      toast.error('No se encontró el ID de la organización');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        // Actualizar oportunidad existente
        await crmOportunidadService.update(initialData.id, {
          ...data,
          organization_id: organizationId,
        });
        toast.success('Oportunidad actualizada correctamente');
      } else {
        // Crear nueva oportunidad
        await crmOportunidadService.create({
          ...data,
          organization_id: organizationId,
        });
        toast.success('Oportunidad creada correctamente');
      }
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar la oportunidad:', error);
      toast.error('Error al guardar la oportunidad');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Oportunidad' : 'Nueva Oportunidad'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la oportunidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción detallada de la oportunidad" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cliente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoadingClientes}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingClientes ? "Cargando clientes..." : "Seleccione cliente"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.razon_social}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contacto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoadingContactos || !form.watch('cliente_id')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isLoadingContactos 
                              ? "Cargando contactos..." 
                              : !form.watch('cliente_id') 
                                ? "Seleccione un cliente primero" 
                                : "Seleccione contacto"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredContactos.map((contacto) => (
                          <SelectItem key={contacto.id} value={contacto.id}>
                            {contacto.nombre} {contacto.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="valor_estimado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Estimado *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="moneda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD - Dólar</SelectItem>
                        <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="probabilidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probabilidad (%) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="etapa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etapa *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione etapa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="prospecto">Prospecto</SelectItem>
                        <SelectItem value="calificacion">Calificación</SelectItem>
                        <SelectItem value="propuesta">Propuesta</SelectItem>
                        <SelectItem value="negociacion">Negociación</SelectItem>
                        <SelectItem value="cierre">Cierre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fecha_cierre_esperada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Cierre Esperada *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Guardar'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
