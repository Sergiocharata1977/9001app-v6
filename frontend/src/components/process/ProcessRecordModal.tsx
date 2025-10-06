'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Slider no existe, usaremos input range
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  descripcion: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'crítica']),
  responsable: z.string().min(1, 'El responsable es requerido').max(100, 'Máximo 100 caracteres'),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fecha_fin: z.string().min(1, 'La fecha de fin es requerida'),
  observaciones: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  evidence: z.string().max(500, 'Máximo 500 caracteres').optional(),
  progress_percentage: z.number().min(0).max(100),
}).refine((data) => new Date(data.fecha_inicio) <= new Date(data.fecha_fin), {
  message: 'La fecha de inicio no puede ser mayor a la fecha de fin',
  path: ['fecha_inicio'],
});

interface ProcessRecordModalProps {
  processId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProcessRecordModal({ processId, isOpen, onClose, onSuccess }: ProcessRecordModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      responsable: '',
      fecha_inicio: '',
      fecha_fin: '',
      observaciones: '',
      evidence: '',
      progress_percentage: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const requestData = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        prioridad: values.prioridad,
        responsable: values.responsable,
        fecha_inicio: values.fecha_inicio,
        fecha_fin: values.fecha_fin,
        observaciones: values.observaciones,
        evidence: values.evidence,
        progress_percentage: values.progress_percentage,
        processId: processId,
        process_definition_id: processId,
        current_state: 'iniciado',
        organization_id: '1',
        created_by: '68e1091fd2e5b6a2c385b778'
      };
      
      console.log('📤 Enviando datos al backend:', requestData);
      
      const response = await fetch('http://localhost:5000/api/process-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Error al crear la tarea');

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Éxito', description: 'Tarea creada exitosamente' });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo crear la tarea', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Tarea</DialogTitle>
          <p className="text-sm text-gray-600">Complete los campos para crear una nueva tarea del proceso</p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" {...form.register('titulo')} />
            {form.formState.errors.titulo && <p className="text-red-500 text-sm">{form.formState.errors.titulo.message}</p>}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" {...form.register('descripcion')} />
            {form.formState.errors.descripcion && <p className="text-red-500 text-sm">{form.formState.errors.descripcion.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select onValueChange={(value) => form.setValue('prioridad', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.prioridad && <p className="text-red-500 text-sm">{form.formState.errors.prioridad.message}</p>}
            </div>

            <div>
              <Label htmlFor="responsable">Responsable</Label>
              <Input id="responsable" {...form.register('responsable')} />
              {form.formState.errors.responsable && <p className="text-red-500 text-sm">{form.formState.errors.responsable.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
              <Input type="date" id="fecha_inicio" {...form.register('fecha_inicio')} />
              {form.formState.errors.fecha_inicio && <p className="text-red-500 text-sm">{form.formState.errors.fecha_inicio.message}</p>}
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha Fin</Label>
              <Input type="date" id="fecha_fin" {...form.register('fecha_fin')} />
              {form.formState.errors.fecha_fin && <p className="text-red-500 text-sm">{form.formState.errors.fecha_fin.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea id="observaciones" {...form.register('observaciones')} />
            {form.formState.errors.observaciones && <p className="text-red-500 text-sm">{form.formState.errors.observaciones.message}</p>}
          </div>

          <div>
            <Label htmlFor="evidence">Evidencia</Label>
            <Textarea id="evidence" {...form.register('evidence')} />
            {form.formState.errors.evidence && <p className="text-red-500 text-sm">{form.formState.errors.evidence.message}</p>}
          </div>

          <div>
            <Label>Progreso ({form.watch('progress_percentage')} %)</Label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={form.watch('progress_percentage')}
              onChange={(e) => form.setValue('progress_percentage', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Tarea'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}