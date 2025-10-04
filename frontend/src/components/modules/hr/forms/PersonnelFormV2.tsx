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
import { Plus, Save, X, Users } from 'lucide-react'

// Esquema de validación usando Zod
const personnelSchema = z.object({
  numero_empleado: z.string()
    .min(1, "El número de empleado es obligatorio")
    .max(20, "El número no puede exceder 20 caracteres"),
  
  nombres: z.string()
    .min(1, "Los nombres son obligatorios")
    .max(100, "Los nombres no pueden exceder 100 caracteres"),
  
  apellidos: z.string()
    .min(1, "Los apellidos son obligatorios")
    .max(100, "Los apellidos no pueden exceder 100 caracteres"),
  
  email: z.string()
    .email("Ingrese un email válido")
    .max(150, "El email no puede exceder 150 caracteres"),
  
  telefono: z.string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "Solo números, espacios y símbolos +, -, (, )"),
  
  fecha_ingreso: z.string()
    .min(1, "La fecha de ingreso es obligatoria"),
  
  departamento_id: z.string()
    .min(1, "Seleccione un departamento"),
  
  cargo: z.string()
    .min(1, "El cargo es obligatorio")
    .max(100, "El cargo no puede exceder 100 caracteres"),
  
  nivel_educativo: z.enum(['primaria', 'secundaria', 'tecnico', 'universitario', 'posgrado'], {
    required_error: "Seleccione el nivel educativo"
  }),
  
  estado: z.enum(['activo', 'inactivo', 'vacaciones', 'licencia'], {
    required_error: "Seleccione el estado"
  }),
  
  tipo_contrato: z.enum(['indefinido', 'temporal', 'practicante', 'consultor'], {
    required_error: "Seleccione el tipo de contrato"
  }),
  
  salario: z.number()
    .min(0, "El salario debe ser un número positivo")
    .max(999999999, "El salario no puede exceder 999,999,999"),
  
  // Campos opcionales
  fecha_nacimiento: z.string().optional(),
  direccion: z.string().max(200, "La dirección no puede exceder 200 caracteres").optional(),
  cedula: z.string().max(20, "La cédula no puede exceder 20 caracteres").optional(),
  competencias: z.string().optional(),
  observaciones: z.string().optional(),
  supervisor_id: z.string().optional(),
  fecha_salida: z.string().optional()
})

type PersonnelFormData = z.infer<typeof personnelSchema>

interface PersonnelFormV2Props {
  initialData?: Partial<PersonnelFormData>
  onSubmit: (data: PersonnelFormData) => Promise<void>
  isLoading?: boolean
  triggerButton?: React.ReactNode
  departments?: Array<{ id: string; nombre: string }>
  supervisors?: Array<{ id: string; nombres: string; apellidos: string }>
}

export function PersonnelFormV2({
  initialData,
  onSubmit,
  isLoading = false,
  triggerButton,
  departments = [],
  supervisors = []
}: PersonnelFormV2Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<PersonnelFormData>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      numero_empleado: initialData?.numero_empleado || '',
      nombres: initialData?.nombres || '',
      apellidos: initialData?.apellidos || '',
      email: initialData?.email || '',
      telefono: initialData?.telefono || '',
      fecha_ingreso: initialData?.fecha_ingreso || '',
      departamento_id: initialData?.departamento_id || '',
      cargo: initialData?.cargo || '',
      nivel_educativo: initialData?.nivel_educativo || 'universitario',
      estado: initialData?.estado || 'activo',
      tipo_contrato: initialData?.tipo_contrato || 'indefinido',
      salario: initialData?.salario || 0,
      fecha_nacimiento: initialData?.fecha_nacimiento || '',
      direccion: initialData?.direccion || '',
      cedula: initialData?.cedula || '',
      competencias: initialData?.competencias || '',
      observaciones: initialData?.observaciones || '',
      supervisor_id: initialData?.supervisor_id || '',
      fecha_salida: initialData?.fecha_salida || ''
    }
  })

  const handleSubmit = async (data: PersonnelFormData) => {
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
            Nuevo Empleado
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            {initialData ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
          </DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? 'actualizar' : 'registrar'} el empleado en el sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero_empleado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Empleado *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="EMP-001" 
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      Código único del empleado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula/DNI</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678" 
                        {...field}
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
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Juan Carlos" 
                        {...field}
                      />
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
                      <Input 
                        placeholder="García López" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="juan.garcia@empresa.com" 
                        {...field}
                      />
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
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+57 300 123 4567" 
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
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Calle 123 #45-67, Ciudad" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Información laboral */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.nombre}
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
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Analista de Calidad" 
                        {...field}
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
                name="supervisor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el supervisor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Sin supervisor</SelectItem>
                        {supervisors.map((supervisor) => (
                          <SelectItem key={supervisor.id} value={supervisor.id}>
                            {supervisor.nombres} {supervisor.apellidos}
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
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="2500000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Salario mensual en pesos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nivel_educativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel Educativo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primaria">Primaria</SelectItem>
                        <SelectItem value="secundaria">Secundaria</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="universitario">Universitario</SelectItem>
                        <SelectItem value="posgrado">Posgrado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_contrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contrato *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="indefinido">Indefinido</SelectItem>
                        <SelectItem value="temporal">Temporal</SelectItem>
                        <SelectItem value="practicante">Practicante</SelectItem>
                        <SelectItem value="consultor">Consultor</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="vacaciones">Vacaciones</SelectItem>
                        <SelectItem value="licencia">Licencia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fecha_nacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
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
                name="fecha_ingreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Ingreso *</FormLabel>
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
                name="fecha_salida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Salida</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Solo si el empleado ya no está activo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Competencias y observaciones */}
            <FormField
              control={form.control}
              name="competencias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competencias</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Competencias técnicas y blandas del empleado..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Habilidades, certificaciones, conocimientos especiales
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
                {isLoading ? 'Guardando...' : initialData ? 'Actualizar Empleado' : 'Registrar Empleado'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}