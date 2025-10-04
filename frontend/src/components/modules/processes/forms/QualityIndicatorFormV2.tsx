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
import { Plus, Save, X, BarChart3 } from 'lucide-react'

// Esquema de validación usando Zod
const qualityIndicatorSchema = z.object({
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
  
  formula_calculo: z.string()
    .min(1, "La fórmula de cálculo es obligatoria")
    .max(500, "La fórmula no puede exceder 500 caracteres"),
  
  unidad_medida: z.string()
    .min(1, "La unidad de medida es obligatoria")
    .max(50, "La unidad no puede exceder 50 caracteres"),
  
  tipo_indicador: z.enum(['eficacia', 'eficiencia', 'efectividad', 'calidad', 'productividad'], {
    required_error: "Selecciona el tipo de indicador"
  }),
  
  frecuencia_medicion: z.enum(['diaria', 'semanal', 'mensual', 'trimestral', 'semestral', 'anual'], {
    required_error: "Selecciona la frecuencia de medición"
  }),
  
  meta_minima: z.number()
    .min(0, "La meta mínima debe ser un número positivo"),
  
  meta_maxima: z.number()
    .min(0, "La meta máxima debe ser un número positivo"),
  
  responsable_medicion: z.string()
    .min(1, "El responsable es obligatorio")
    .max(100, "El responsable no puede exceder 100 caracteres"),
  
  fuente_datos: z.string()
    .min(1, "La fuente de datos es obligatoria")
    .max(200, "La fuente no puede exceder 200 caracteres"),
  
  estado: z.enum(['activo', 'inactivo', 'en_revision'], {
    required_error: "Selecciona el estado"
  }),
  
  // Campos opcionales
  objetivo_relacionado: z.string().optional(),
  proceso_relacionado: z.string().optional(),
  clausula_iso: z.string().optional(),
  observaciones: z.string().optional()
})

type QualityIndicatorFormData = z.infer<typeof qualityIndicatorSchema>

interface QualityIndicatorFormV2Props {
  initialData?: Partial<QualityIndicatorFormData>
  onSubmit: (data: QualityIndicatorFormData) => Promise<void>
  isLoading?: boolean
  triggerButton?: React.ReactNode
}

export function QualityIndicatorFormV2({
  initialData,
  onSubmit,
  isLoading = false,
  triggerButton
}: QualityIndicatorFormV2Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<QualityIndicatorFormData>({
    resolver: zodResolver(qualityIndicatorSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      formula_calculo: initialData?.formula_calculo || '',
      unidad_medida: initialData?.unidad_medida || '',
      tipo_indicador: initialData?.tipo_indicador || 'eficacia',
      frecuencia_medicion: initialData?.frecuencia_medicion || 'mensual',
      meta_minima: initialData?.meta_minima || 0,
      meta_maxima: initialData?.meta_maxima || 100,
      responsable_medicion: initialData?.responsable_medicion || '',
      fuente_datos: initialData?.fuente_datos || '',
      estado: initialData?.estado || 'activo',
      objetivo_relacionado: initialData?.objetivo_relacionado || '',
      proceso_relacionado: initialData?.proceso_relacionado || '',
      clausula_iso: initialData?.clausula_iso || '',
      observaciones: initialData?.observaciones || ''
    }
  })

  const handleSubmit = async (data: QualityIndicatorFormData) => {
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
            Nuevo Indicador
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            {initialData ? 'Editar Indicador de Calidad' : 'Crear Nuevo Indicador de Calidad'}
          </DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? 'actualizar' : 'crear'} el indicador de calidad ISO 9001.
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
                    <FormLabel>Código del Indicador *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="IND-001" 
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      Código único del indicador (ej: IND-001)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_indicador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Indicador *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="eficacia">Eficacia</SelectItem>
                        <SelectItem value="eficiencia">Eficiencia</SelectItem>
                        <SelectItem value="efectividad">Efectividad</SelectItem>
                        <SelectItem value="calidad">Calidad</SelectItem>
                        <SelectItem value="productividad">Productividad</SelectItem>
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
                  <FormLabel>Nombre del Indicador *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Porcentaje de satisfacción del cliente" 
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
                      placeholder="Descripción detallada del indicador..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fórmula y medición */}
            <FormField
              control={form.control}
              name="formula_calculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fórmula de Cálculo *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="(Clientes satisfechos / Total clientes encuestados) * 100"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe cómo se calcula el indicador
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Metas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meta_minima"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Mínima *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="80"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo aceptable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_maxima"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Máxima *</FormLabel>
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
            </div>

            {/* Responsabilidad y fuente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="responsable_medicion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable de Medición *</FormLabel>
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
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="en_revision">En Revisión</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fuente_datos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuente de Datos *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Sistema CRM, Encuestas de satisfacción, etc." 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    De dónde se obtienen los datos para el cálculo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos opcionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="objetivo_relacionado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo Relacionado</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="OBJ-001 - Mejorar satisfacción" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Objetivo al que contribuye este indicador
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proceso_relacionado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proceso Relacionado</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="PRO-001 - Atención al cliente" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Proceso que mide este indicador
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clausula_iso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cláusula ISO 9001</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="9.1 - Seguimiento, medición, análisis y evaluación" 
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
                {isLoading ? 'Guardando...' : initialData ? 'Actualizar Indicador' : 'Crear Indicador'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}