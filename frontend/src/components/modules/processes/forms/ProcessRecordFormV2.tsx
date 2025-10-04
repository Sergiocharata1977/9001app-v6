'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';

// Schema de validación
const processRecordFormSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  descripcion: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  process_definition_id: z.string().min(1, 'Debe seleccionar una definición de proceso'),
  responsible_user_id: z.string().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'crítica']).default('media'),
  observaciones: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});

type ProcessRecordFormData = z.infer<typeof processRecordFormSchema>;

interface ProcessRecordFormV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProcessRecordFormData>;
  onSubmit: (data: ProcessRecordFormData) => void;
  processDefinitions?: Array<{ _id: string; nombre: string }>;
  users?: Array<{ _id: string; nombre: string }>;
  isLoading?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: 'baja', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  { value: 'media', label: 'Media', color: 'bg-blue-100 text-blue-800' },
  { value: 'alta', label: 'Alta', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'crítica', label: 'Crítica', color: 'bg-red-100 text-red-800' },
];

export function ProcessRecordFormV2({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  processDefinitions = [],
  users = [],
  isLoading = false,
}: ProcessRecordFormV2Props) {
  const form = useForm<ProcessRecordFormData>({
    resolver: zodResolver(processRecordFormSchema),
    defaultValues: {
      titulo: initialData?.titulo || '',
      descripcion: initialData?.descripcion || '',
      process_definition_id: initialData?.process_definition_id || '',
      responsible_user_id: initialData?.responsible_user_id || '',
      fecha_inicio: initialData?.fecha_inicio || '',
      fecha_fin: initialData?.fecha_fin || '',
      prioridad: initialData?.prioridad || 'media',
      observaciones: initialData?.observaciones || '',
    },
  });

  const handleSubmit = (data: ProcessRecordFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const selectedPriority = PRIORITY_OPTIONS.find(
    option => option.value === form.watch('prioridad')
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {initialData ? 'Editar Registro de Proceso' : 'Nuevo Registro de Proceso'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
              
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Proceso *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Revisión de calidad Q1 2024"
                        {...field}
                      />
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
                        placeholder="Descripción detallada del proceso..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="process_definition_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Definición de Proceso *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar definición de proceso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {processDefinitions.map((definition) => (
                          <SelectItem key={definition._id} value={definition._id}>
                            {definition.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Asignación y prioridad */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Asignación y Prioridad</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsible_user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Responsable
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar responsable" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.nombre}
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
                  name="prioridad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Prioridad
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={option.color}>
                                  {option.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedPriority && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Prioridad seleccionada:</span>
                    <Badge className={selectedPriority.color}>
                      {selectedPriority.label}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Planificación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha_inicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Fecha de Inicio
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_fin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Fecha de Fin
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones adicionales..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Proceso'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}