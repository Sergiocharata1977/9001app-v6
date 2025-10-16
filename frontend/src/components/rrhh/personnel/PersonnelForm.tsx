'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Personnel, personnelService, CreatePersonnelData } from '@/services/personnelService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Esquema de validación con zod
const personnelSchema = z.object({
  nombres: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  apellidos: z.string().min(2, { message: 'Los apellidos deben tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Ingrese un email válido' }),
  telefono: z.string().optional(),
  documento_identidad: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  nacionalidad: z.string().optional(),
  direccion: z.string().optional(),
  telefono_emergencia: z.string().optional(),
  fecha_contratacion: z.string().optional(),
  numero_legajo: z.string().optional(),
  estado: z.string().default('Activo'),
  meta_mensual: z.coerce.number().optional(),
  comision_porcentaje: z.coerce.number().optional(),
  supervisor_id: z.string().optional(),
  especialidad_ventas: z.string().optional(),
  fecha_inicio_ventas: z.string().optional(),
  tipo_personal: z.string().default('administrativo'),
  zona_venta: z.string().optional(),
});

type PersonnelFormValues = z.infer<typeof personnelSchema>;

interface PersonnelFormProps {
  personnel?: Personnel;
  organizationId: number;
  onSuccess?: (personnel: Personnel) => void;
  onCancel?: () => void;
}

export function PersonnelForm({ personnel, organizationId, onSuccess, onCancel }: PersonnelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!personnel;

  // Inicializar el formulario con react-hook-form
  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      nombres: personnel?.nombres || '',
      apellidos: personnel?.apellidos || '',
      email: personnel?.email || '',
      telefono: personnel?.telefono || '',
      documento_identidad: personnel?.documento_identidad || '',
      fecha_nacimiento: personnel?.fecha_nacimiento ? new Date(personnel.fecha_nacimiento).toISOString().split('T')[0] : '',
      nacionalidad: personnel?.nacionalidad || '',
      direccion: personnel?.direccion || '',
      telefono_emergencia: personnel?.telefono_emergencia || '',
      fecha_contratacion: personnel?.fecha_contratacion ? new Date(personnel.fecha_contratacion).toISOString().split('T')[0] : '',
      numero_legajo: personnel?.numero_legajo || '',
      estado: personnel?.estado || 'Activo',
      meta_mensual: personnel?.meta_mensual || 0,
      comision_porcentaje: personnel?.comision_porcentaje || 0,
      supervisor_id: personnel?.supervisor_id || '',
      especialidad_ventas: personnel?.especialidad_ventas || '',
      fecha_inicio_ventas: personnel?.fecha_inicio_ventas ? new Date(personnel.fecha_inicio_ventas).toISOString().split('T')[0] : '',
      tipo_personal: personnel?.tipo_personal || 'administrativo',
      zona_venta: personnel?.zona_venta || '',
    },
  });

  // Manejar el envío del formulario
  const onSubmit = async (data: PersonnelFormValues) => {
    setIsSubmitting(true);
    try {
      let result;
      
      if (isEditing && personnel) {
        // Actualizar personal existente
        result = await personnelService.updatePersonnel(personnel.id, {
          ...data,
          organization_id: organizationId,
        });
        toast({
          title: "Personal actualizado",
          description: "Los datos del personal han sido actualizados correctamente",
        });
      } else {
        // Crear nuevo personal
        const newPersonnel: CreatePersonnelData = {
          ...data,
          id: uuidv4(),
          organization_id: organizationId,
        };
        result = await personnelService.createPersonnel(newPersonnel);
        toast({
          title: "Personal creado",
          description: "El nuevo personal ha sido creado correctamente",
        });
      }
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error al guardar personal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isEditing 
          ? "Error al actualizar el personal. Por favor, intenta de nuevo." 
          : "Error al crear el personal. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Personal' : 'Nuevo Personal'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Personal</h3>
                
                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombres" {...field} />
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
                        <Input placeholder="Teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documento_identidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento de Identidad</FormLabel>
                      <FormControl>
                        <Input placeholder="DNI/Pasaporte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fecha_nacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nacionalidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidad</FormLabel>
                      <FormControl>
                        <Input placeholder="Nacionalidad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Información laboral */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Laboral</h3>
                
                <FormField
                  control={form.control}
                  name="tipo_personal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Personal *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="administrativo">Administrativo</SelectItem>
                          <SelectItem value="técnico">Técnico</SelectItem>
                          <SelectItem value="ventas">Ventas</SelectItem>
                          <SelectItem value="gerencial">Gerencial</SelectItem>
                          <SelectItem value="operativo">Operativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numero_legajo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Legajo</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de legajo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fecha_contratacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Contratación</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                          <SelectItem value="Licencia">Licencia</SelectItem>
                          <SelectItem value="Suspendido">Suspendido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Dirección completa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telefono_emergencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Emergencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Teléfono de emergencia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Campos específicos para personal de ventas */}
            {form.watch('tipo_personal') === 'ventas' && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Información de Ventas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="meta_mensual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Mensual</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comision_porcentaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comisión (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="especialidad_ventas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialidad</FormLabel>
                        <FormControl>
                          <Input placeholder="Especialidad de ventas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zona_venta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona de Venta</FormLabel>
                        <FormControl>
                          <Input placeholder="Zona asignada" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fecha_inicio_ventas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio en Ventas</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  isEditing ? 'Actualizar Personal' : 'Crear Personal'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}