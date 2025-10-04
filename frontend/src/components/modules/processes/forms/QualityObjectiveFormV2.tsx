'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from '@/components/ui'
import { Plus, Save, X, Target } from 'lucide-react'

// Esquema de validación usando Zod
const qualityObjectiveSchema = z.object({
  codigo: z.string()
    .min(1, "El código es obligatorio")
    .max(20, "El código no puede exceder 20 caracteres")
    .regex(/^[A-Z0-9-]+$/, "Solo letras mayúsculas, números y guiones"),
  
  nombre: z.string()
    .min(1, "El nombre es obligatorio")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  
  descripcion: z.string()
    .min(1, "La descripción es obligatoria")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  
  meta_numerica: z.number()
    .min(0, "La meta debe ser un número positivo")
    .max(999999, "La meta no puede exceder 999,999"),
  
  unidad_medida: z.string()
    .min(1, "La unidad de medida es obligatoria")
    .max(50, "La unidad no puede exceder 50 caracteres"),
  
  frecuencia_medicion: z.enum(['diaria', 'semanal', 'mensual', 'trimestral', 'semestral', 'anual'], {
    required_error: "Selecciona la frecuencia de medición"
  }),
  
  responsable_seguimiento: z.string()
    .min(1, "El responsable es obligatorio")
    .max(100, "El responsable no puede exceder 100 caracteres"),
  
  fecha_inicio: z.string()
    .min(1, "La fecha de inicio es obligatoria"),
  
  fecha_fin: z.string()
    .min(1, "La fecha de fin es obligatoria"),
  
  estado: z.enum(['planificado', 'en_progreso', 'completado', 'suspendido'], {
    required_error: "Selecciona el estado"
  }),
  
  prioridad: z.enum(['baja', 'media', 'alta', 'critica'], {
    required_error: "Selecciona la prioridad"
  }),
  
  // Campos opcionales
  proceso_relacionado: z.string().optional(),
  clausula_iso: z.string().optional(),
  observaciones: z.string().optional()
})

type QualityObjectiveFormData = z.infer<typeof qualityObjectiveSchema>

interface QualityObjectiveFormV2Props {
  initialData?: Partial<QualityObjectiveFormData>
  onSubmit: (data: QualityObjectiveFormData) => Promise<void>
  isLoading?: boolean
  triggerButton?: React.ReactNode
}

export function QualityObjectiveFormV2({
  initialData,
  onSubmit,
  isLoading = false,
  triggerButton
}: QualityObjectiveFormV2Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<QualityObjectiveFormData>({
    resolver: zodResolver(qualityObjectiveSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      meta_numerica: initialData?.meta_numerica || 0,
      unidad_medida: initialData?.unidad_medida || '',
      frecuencia_medicion: initialData?.frecuencia_medicion || 'mensual',
      responsable_seguimiento: initialData?.responsable_seguimiento || '',
      fecha_inicio: initialData?.fecha_inicio || '',
      fecha_fin: initialData?.fecha_fin || '',
      estado: initialData?.estado || 'planificado',
      prioridad: initialData?.prioridad || 'media',
      proceso_relacionado: initialData?.proceso_relacionado || '',
      clausula_iso: initialData?.clausula_iso || '',
      observaciones: initialData?.observaciones || ''
    }
  })

  const handleSubmit = async (data: QualityObjectiveFormData) => {
    try {
      await onSubmit(data)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Objetivo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            {initialData ? 'Editar Objetivo de Calidad' : 'Crear Nuevo Objetivo de Calidad'}
          </DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? 'actualizar' : 'crear'} el objetivo de calidad ISO 9001.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código del Objetivo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="OBJ-001" 
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      Código único del objetivo (ej: OBJ-001)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prioridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la prioridad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Objetivo *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Reducir tiempo de respuesta al cliente" 
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
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción detallada del objetivo..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meta y medición */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="meta_numerica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Numérica *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="95"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidad_medida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de Medida *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="%" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      %, horas, días, unidades, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frecuencia_medicion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia de Medición *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona frecuencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="diaria">Diaria</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Responsabilidad y fechas */}
            <FormField
              control={form.control}
              name="responsable_seguimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable del Seguimiento *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nombre del responsable" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio *</FormLabel>
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

              <FormField
                control={form.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin *</FormLabel>
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

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planificado">Planificado</SelectItem>
                        <SelectItem value="en_progreso">En Progreso</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos opcionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="proceso_relacionado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proceso Relacionado</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="PRO-001 - Gestión de Compras" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Proceso al que está vinculado este objetivo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clausula_iso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cláusula ISO 9001</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="6.2 - Objetivos de calidad" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cláusula ISO relacionada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observaciones adicionales..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Guardando...' : initialData ? 'Actualizar Objetivo' : 'Crear Objetivo'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}