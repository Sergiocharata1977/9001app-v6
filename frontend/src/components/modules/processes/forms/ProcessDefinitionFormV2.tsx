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
import { Plus, Save, X, Settings } from 'lucide-react'

// Esquema de validación usando Zod (compatible con backend)
const processDefinitionSchema = z.object({
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
  
  objetivo: z.string()
    .min(1, "El objetivo es obligatorio")
    .max(500, "El objetivo no puede exceder 500 caracteres"),
  
  alcance: z.string()
    .min(1, "El alcance es obligatorio")
    .max(500, "El alcance no puede exceder 500 caracteres"),
  
  responsable: z.string()
    .min(1, "El responsable es obligatorio")
    .max(100, "El responsable no puede exceder 100 caracteres"),
  
  tipo: z.enum(['estratégico', 'operativo', 'apoyo'], {
    required_error: "Selecciona un tipo de proceso"
  }),
  
  nivel_critico: z.enum(['bajo', 'medio', 'alto'], {
    required_error: "Selecciona el nivel crítico"
  }),
  
  categoria: z.string().default('proceso'),
  version: z.string().default('1.0'),
  entradas: z.string().optional(),
  salidas: z.string().optional(),
  
  // Nuevos campos para Claude IA (opcionales por ahora)
  clausulas_iso: z.array(z.string()).optional(),
  recursos_necesarios: z.array(z.string()).optional(),
  palabras_clave: z.array(z.string()).optional()
})

type ProcessDefinitionFormData = z.infer<typeof processDefinitionSchema>

interface ProcessDefinitionFormV2Props {
  initialData?: Partial<ProcessDefinitionFormData>
  onSubmit: (data: ProcessDefinitionFormData) => Promise<void>
  isLoading?: boolean
  triggerButton?: React.ReactNode
}

export function ProcessDefinitionFormV2({
  initialData,
  onSubmit,
  isLoading = false,
  triggerButton
}: ProcessDefinitionFormV2Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<ProcessDefinitionFormData>({
    resolver: zodResolver(processDefinitionSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      objetivo: initialData?.objetivo || '',
      alcance: initialData?.alcance || '',
      responsable: initialData?.responsable || '',
      tipo: initialData?.tipo || 'operativo',
      nivel_critico: initialData?.nivel_critico || 'medio',
      categoria: initialData?.categoria || 'proceso',
      version: initialData?.version || '1.0',
      entradas: initialData?.entradas || '',
      salidas: initialData?.salidas || '',
      clausulas_iso: initialData?.clausulas_iso || [],
      recursos_necesarios: initialData?.recursos_necesarios || [],
      palabras_clave: initialData?.palabras_clave || []
    }
  })

  const handleSubmit = async (data: ProcessDefinitionFormData) => {
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
            Nuevo Proceso
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            {initialData ? 'Editar Definición de Proceso' : 'Crear Nueva Definición de Proceso'}
          </DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? 'actualizar' : 'crear'} la definición de proceso ISO 9001.
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
                    <FormLabel>Código del Proceso *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="PRO-001" 
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      Código único del proceso (ej: PRO-001)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versión</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0" {...field} />
                    </FormControl>
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
                  <FormLabel>Nombre del Proceso *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Gestión de Compras" 
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
                      placeholder="Descripción detallada del proceso..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Proceso *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="estratégico">Estratégico</SelectItem>
                        <SelectItem value="operativo">Operativo</SelectItem>
                        <SelectItem value="apoyo">Apoyo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nivel_critico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel Crítico *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bajo">Bajo</SelectItem>
                        <SelectItem value="medio">Medio</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Definición del proceso */}
            <FormField
              control={form.control}
              name="objetivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Objetivo principal del proceso..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alcance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alcance *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Alcance y límites del proceso..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nombre del responsable del proceso" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Entradas y salidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entradas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entradas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Entradas del proceso..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Recursos, información o materiales que ingresan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salidas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salidas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Salidas del proceso..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Productos, servicios o resultados generados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isLoading ? 'Guardando...' : initialData ? 'Actualizar Proceso' : 'Crear Proceso'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}