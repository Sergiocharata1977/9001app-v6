'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from '@/components/ui'
import { Plus, Building2, Loader2 } from 'lucide-react'

interface DepartmentFormData {
  nombre: string
  descripcion?: string
  gerente_id?: string
  presupuesto?: number
  estado: 'activo' | 'inactivo'
}

interface DepartmentFormV2Props {
  initialData?: Partial<DepartmentFormData & { id: string }>
  onSubmit: (data: DepartmentFormData) => Promise<void>
  isLoading?: boolean
  managers?: Array<{ id: string; nombres: string; apellidos: string }>
  triggerButton?: React.ReactNode
}

export function DepartmentFormV2({
  initialData,
  onSubmit,
  isLoading = false,
  managers = [],
  triggerButton
}: DepartmentFormV2Props) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<DepartmentFormData>({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    gerente_id: initialData?.gerente_id || '',
    presupuesto: initialData?.presupuesto || 0,
    estado: initialData?.estado || 'activo'
  })
  const [errors, setErrors] = useState<Partial<Record<keyof DepartmentFormData, string>>>({})

  const handleChange = (field: keyof DepartmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DepartmentFormData, string>> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (formData.presupuesto && formData.presupuesto < 0) {
      newErrors.presupuesto = 'El presupuesto no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(formData)
      setOpen(false)
      // Resetear formulario
      if (!initialData) {
        setFormData({
          nombre: '',
          descripcion: '',
          gerente_id: '',
          presupuesto: 0,
          estado: 'activo'
        })
      }
    } catch (error) {
      console.error('Error al guardar departamento:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = !!initialData?.id

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Departamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {isEditing ? 'Editar Departamento' : 'Crear Nuevo Departamento'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Actualiza la información del departamento'
              : 'Completa los datos para crear un nuevo departamento'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="required">
                Nombre del Departamento *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Ej: Recursos Humanos"
                className={errors.nombre ? 'border-red-500' : ''}
                disabled={isLoading || submitting}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Describe las responsabilidades y funciones del departamento..."
                rows={3}
                disabled={isLoading || submitting}
              />
            </div>
          </div>

          {/* Gerente y Presupuesto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gerente_id">
                Gerente / Responsable
              </Label>
              <Select
                value={formData.gerente_id}
                onValueChange={(value) => handleChange('gerente_id', value)}
                disabled={isLoading || submitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar gerente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.nombres} {manager.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="presupuesto">
                Presupuesto Anual (COP)
              </Label>
              <Input
                id="presupuesto"
                type="number"
                min="0"
                step="1000"
                value={formData.presupuesto}
                onChange={(e) => handleChange('presupuesto', Number(e.target.value))}
                placeholder="0"
                className={errors.presupuesto ? 'border-red-500' : ''}
                disabled={isLoading || submitting}
              />
              {errors.presupuesto && (
                <p className="text-sm text-red-500">{errors.presupuesto}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">
              Estado
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(value: 'activo' | 'inactivo') => handleChange('estado', value)}
              disabled={isLoading || submitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading || submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  {isEditing ? 'Actualizar' : 'Crear'} Departamento
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}