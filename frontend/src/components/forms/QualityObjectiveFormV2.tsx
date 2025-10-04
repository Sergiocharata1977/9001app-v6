'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Input,
  Label,
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

// Esquema de validación para Objetivos de Calidad
const qualityObjectiveSchema = z.object({
  codigo: z.string()
    .min(1, "El código es obligatorio")
    .max(20, "El código no puede exceder 20 caracteres")
    .regex(/^OBJ-\d{3}$/, "Formato: OBJ-001"),
  
  titulo: z.string()
    .min(1, "El título es obligatorio")
    .max(200, "El título no puede exceder 200 caracteres"),
  
  descripcion: z.string()
    .min(1, "La descripción es obligatoria")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  
  meta_numerica: z.number()
    .min(0, "La meta debe ser positiva")
    .max(100, "La meta no puede exceder 100"),
  
  unidad_medida: z.string()
    .min(1, "La unidad de medida es obligatoria")
    .max(50, "La unidad no puede exceder 50 caracteres"),
  
  frecuencia_medicion: z.enum(['diaria', 'semanal', 'mensual', 'trimestral', 'anual'], {
    required_error: "Selecciona la frecuencia de medición"
  }),
  
  responsable: z.string()
    .min(1, "El responsable es obligatorio")
    .max(100, "El responsable no puede exceder 100 caracteres"),
  
  fecha_inicio: z.string()
    .min(1, "La fecha de inicio es obligatoria"),
  
  fecha_objetivo: z.string()
    .min(1, "La fecha objetivo es obligatoria"),
  
  estado: z.enum(['planificado', 'en_progreso', 'cumplido', 'vencido'], {
    required_error: "Selecciona el estado"
  }),
  
  prioridad: z.enum(['baja', 'media', 'alta', 'critica'], {
    required_error: "Selecciona la prioridad"
  }),
  
  // Campos para Claude IA (opcionales)
  clausulas_iso: z.array(z.string()).optional(),
  procesos_relacionados: z.array(z.string()).optional(),
  indicadores_asociados: z.array(z.string()).optional()
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
      titulo: initialData?.titulo || '',
      descripcion: initialData?.descripcion || '',
      meta_numerica: initialData?.meta_numerica || 0,
      unidad_medida: initialData?.unidad_medida || '',
      frecuencia_medicion: initialData?.frecuencia_medicion || 'mensual',
      responsable: initialData?.responsable || '',
      fecha_inicio: initialData?.fecha_inicio || '',
      fecha_objetivo: initialData?.fecha_objetivo || '',
      estado: initialData?.estado || 'planificado',
      prioridad: initialData?.prioridad || 'media',
      clausulas_iso: initialData?.clausulas_iso || [],
      procesos_relacionados: initialData?.procesos_relacionados || [],
      indicadores_asociados: initialData?.indicadores_asociados || []
    }
  })

  const handleSubmit = async (data: QualityObjectiveFormData) => {
    try {
      await onSubmit(data)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error al guardar objetivo:', error)
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
            Nuevo Objetivo de Calidad
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
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
                      Formato: OBJ-001, OBJ-002, etc.
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
                        <SelectItem value="baja">🟢 Baja</SelectItem>
                        <SelectItem value="media">🟡 Media</SelectItem>
                        <SelectItem value="alta">🟠 Alta</SelectItem>
                        <SelectItem value="critica">🔴 Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Objetivo *</FormLabel>
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
                      placeholder="Descripción detallada del objetivo de calidad..."
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
                    <FormDescription>
                      Valor objetivo a alcanzar
                    </FormDescription>
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
                        placeholder="%, días, unidades"
                        {...field}
                      />
                    </FormControl>
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
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Responsabilidad y fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="responsable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable *</FormLabel>
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
                name="fecha_objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Objetivo *</FormLabel>
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

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Actual *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planificado">📋 Planificado</SelectItem>
                      <SelectItem value="en_progreso">⚡ En Progreso</SelectItem>
                      <SelectItem value="cumplido">✅ Cumplido</SelectItem>
                      <SelectItem value="vencido">❌ Vencido</SelectItem>
                    </SelectContent>
                  </Select>
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