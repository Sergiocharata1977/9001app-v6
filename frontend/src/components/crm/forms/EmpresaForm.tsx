'use client';

import { useState } from 'react';
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
import { crmClienteService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';

// Esquema de validación con Zod
const empresaSchema = z.object({
  razon_social: z.string().min(3, 'La razón social debe tener al menos 3 caracteres'),
  tipo_cliente: z.string().min(1, 'Seleccione un tipo de cliente'),
  zona_geografica: z.string().min(1, 'Seleccione una zona geográfica'),
  ciudad: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  superficie_total: z.number().positive('La superficie debe ser mayor a 0'),
  rfc: z.string().min(10, 'El RFC debe tener al menos 10 caracteres').optional(),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').optional(),
  email: z.string().email('Ingrese un email válido').optional(),
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EmpresaForm({ initialData, onSuccess, onCancel }: EmpresaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organizationId } = useOrganization();
  
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: initialData || {
      razon_social: '',
      tipo_cliente: '',
      zona_geografica: '',
      ciudad: '',
      superficie_total: 0,
      rfc: '',
      telefono: '',
      email: '',
    },
  });

  const onSubmit = async (data: EmpresaFormValues) => {
    if (!organizationId) {
      toast.error('No se encontró el ID de la organización');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        // Actualizar empresa existente
        await crmClienteService.update(initialData.id, {
          ...data,
          organization_id: organizationId,
        });
        toast.success('Empresa actualizada correctamente');
      } else {
        // Crear nueva empresa
        await crmClienteService.create({
          ...data,
          organization_id: organizationId,
        });
        toast.success('Empresa creada correctamente');
      }
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar la empresa:', error);
      toast.error('Error al guardar la empresa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Empresa' : 'Nueva Empresa'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="razon_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social *</FormLabel>
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
                name="tipo_cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cliente *</FormLabel>
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
                        <SelectItem value="pequeño">Pequeño</SelectItem>
                        <SelectItem value="mediano">Mediano</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                        <SelectItem value="corporativo">Corporativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zona_geografica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona Geográfica *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione zona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pampa Húmeda">Pampa Húmeda</SelectItem>
                        <SelectItem value="Región Centro">Región Centro</SelectItem>
                        <SelectItem value="Litoral">Litoral</SelectItem>
                        <SelectItem value="Norte">Norte</SelectItem>
                        <SelectItem value="Cuyo">Cuyo</SelectItem>
                        <SelectItem value="Patagonia">Patagonia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ciudad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="superficie_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superficie Total (ha) *</FormLabel>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rfc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RFC</FormLabel>
                    <FormControl>
                      <Input placeholder="RFC" {...field} />
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
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
