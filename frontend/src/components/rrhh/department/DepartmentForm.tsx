'use client';

import { useState } from 'react';
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
import { departmentService } from '@/services/departmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2 } from 'lucide-react';

// Esquema de validación con zod
const departmentSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  descripcion: z.string().optional(),
  gerente_id: z.string().optional(),
  presupuesto: z.coerce.number().optional(),
  cantidad_empleados: z.coerce.number().optional(),
  estado: z.enum(['activo', 'inactivo']).default('activo'),
  objetivos: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: any;
  organizationId: number;
  managers?: Array<{ id: string; nombres: string; apellidos: string }>;
  onSuccess?: (department: any) => void;
  onCancel?: () => void;
}

export function DepartmentForm({ 
  department, 
  organizationId, 
  managers = [], 
  onSuccess, 
  onCancel 
}: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!department;

  // Inicializar el formulario con react-hook-form
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      nombre: department?.nombre || '',
      descripcion: department?.descripcion || '',
      gerente_id: department?.gerente_id || '',
      presupuesto: department?.presupuesto || 0,
      cantidad_empleados: department?.cantidad_empleados || 0,
      estado: department?.estado || 'activo',
      objetivos: department?.objetivos || '',
    },
  });

  // Manejar el envío del formulario
  const onSubmit = async (data: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      let result;
      
      if (isEditing && department) {
        // Actualizar departamento existente
        result = await departmentService.updateDepartment(department.id, {
          ...data,
          organization_id: organizationId,
        });
        toast({
          title: "Departamento actualizado",
          description: "Los datos del departamento han sido actualizados correctamente",
        });
      } else {
        // Crear nuevo departamento
        const newDepartment = {
          ...data,
          id: `dept_${Date.now()}`,
          organization_id: organizationId,
        };
        result = await departmentService.createDepartment(newDepartment);
        toast({
          title: "Departamento creado",
          description: "El nuevo departamento ha sido creado correctamente",
        });
      }
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error al guardar departamento:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isEditing 
          ? "Error al actualizar el departamento. Por favor, intenta de nuevo." 
          : "Error al crear el departamento. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          {isEditing ? 'Editar Departamento' : 'Nuevo Departamento'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Básica</h3>
                
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Departamento *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Recursos Humanos" {...field} />
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
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe las responsabilidades y funciones del departamento..." 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="objetivos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivos</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Objetivos principales del departamento..." 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Información adicional */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Adicional</h3>
                
                <FormField
                  control={form.control}
                  name="gerente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gerente / Responsable</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar gerente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Sin asignar</SelectItem>
                          {managers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.nombres} {manager.apellidos}
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
                  name="presupuesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presupuesto Anual</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          min="0"
                          step="1000"
                        />
                      </FormControl>
                      <FormDescription>
                        Presupuesto anual asignado en pesos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cantidad_empleados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad de Empleados</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          min="0"
                        />
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
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  isEditing ? 'Actualizar Departamento' : 'Crear Departamento'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}