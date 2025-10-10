'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { crmContactoService, crmClienteService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { CRMCliente } from '@/types/crm';

// Esquema de validación con Zod
const contactoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  cargo: z.string().min(2, 'El cargo debe tener al menos 2 caracteres'),
  empresa: z.string().min(2, 'La empresa debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un email válido'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').optional(),
  tipo_contacto: z.string().min(1, 'Seleccione un tipo de contacto'),
  cliente_id: z.string().min(1, 'Seleccione un cliente'),
});

type ContactoFormValues = z.infer<typeof contactoSchema>;

interface ContactoFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ContactoForm({ initialData, onSuccess, onCancel }: ContactoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<CRMCliente[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const { organizationId } = useOrganization();
  
  const form = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: initialData || {
      nombre: '',
      apellidos: '',
      cargo: '',
      empresa: '',
      email: '',
      telefono: '',
      tipo_contacto: '',
      cliente_id: '',
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

  // Al seleccionar un cliente, auto-rellenar el campo empresa
  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente) {
      form.setValue('empresa', cliente.razon_social);
    }
  };

  const onSubmit = async (data: ContactoFormValues) => {
    if (!organizationId) {
      toast.error('No se encontró el ID de la organización');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        // Actualizar contacto existente
        await crmContactoService.update(initialData.id, {
          ...data,
          organization_id: organizationId,
        });
        toast.success('Contacto actualizado correctamente');
      } else {
        // Crear nuevo contacto
        await crmContactoService.create({
          ...data,
          organization_id: organizationId,
        });
        toast.success('Contacto creado correctamente');
      }
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar el contacto:', error);
      toast.error('Error al guardar el contacto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Contacto' : 'Nuevo Contacto'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos *</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="cliente_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleClienteChange(value);
                    }} 
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Cargo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo_contacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contacto *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="proveedor">Proveedor</SelectItem>
                        <SelectItem value="socio">Socio</SelectItem>
                        <SelectItem value="empleado">Empleado</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+54 11 1234-5678" {...field} />
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
