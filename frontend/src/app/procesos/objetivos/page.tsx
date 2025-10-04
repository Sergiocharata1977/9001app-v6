'use client'

import { useState, useEffect } from 'react'
import { QualityObjectiveTable } from '@/components/modules/processes/tables/QualityObjectiveTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Target, TrendingUp, Calendar, AlertCircle } from 'lucide-react'

// Datos de ejemplo - en producción vendrían de la API
const mockObjectives = [
  {
    id: '1',
    codigo: 'OBJ-001',
    nombre: 'Reducir tiempo de respuesta al cliente',
    descripcion: 'Mejorar la satisfacción del cliente reduciendo el tiempo promedio de respuesta a consultas',
    meta_numerica: 24,
    unidad_medida: 'horas',
    frecuencia_medicion: 'mensual',
    responsable_seguimiento: 'Ana García',
    fecha_inicio: '2024-01-01',
    fecha_fin: '2024-12-31',
    estado: 'en_progreso' as const,
    prioridad: 'alta' as const,
    proceso_relacionado: 'PRO-001 - Atención al Cliente',
    clausula_iso: '6.2 - Objetivos de calidad',
    progreso_actual: 18
  },
  {
    id: '2',
    codigo: 'OBJ-002',
    nombre: 'Aumentar satisfacción del cliente',
    descripcion: 'Alcanzar un 95% de satisfacción en las encuestas de servicio al cliente',
    meta_numerica: 95,
    unidad_medida: '%',
    frecuencia_medicion: 'trimestral',
    responsable_seguimiento: 'Carlos López',
    fecha_inicio: '2024-01-01',
    fecha_fin: '2024-12-31',
    estado: 'en_progreso' as const,
    prioridad: 'critica' as const,
    proceso_relacionado: 'PRO-002 - Gestión de Calidad',
    clausula_iso: '8.2.1 - Satisfacción del cliente',
    progreso_actual: 87
  },
  {
    id: '3',
    codigo: 'OBJ-003',
    nombre: 'Reducir defectos en producción',
    descripcion: 'Disminuir la tasa de defectos en el proceso productivo a menos del 2%',
    meta_numerica: 2,
    unidad_medida: '%',
    frecuencia_medicion: 'mensual',
    responsable_seguimiento: 'María Rodríguez',
    fecha_inicio: '2024-02-01',
    fecha_fin: '2024-11-30',
    estado: 'planificado' as const,
    prioridad: 'alta' as const,
    proceso_relacionado: 'PRO-003 - Producción',
    clausula_iso: '8.5 - Producción y provisión del servicio'
  }
]

export default function QualityObjectivesPage() {
  const [objectives, setObjectives] = useState(mockObjectives)
  const [isLoading, setIsLoading] = useState(false)

  // Estadísticas calculadas
  const stats = {
    total: objectives.length,
    enProgreso: objectives.filter(obj => obj.estado === 'en_progreso').length,
    completados: objectives.filter(obj => obj.estado === 'completado').length,
    criticos: objectives.filter(obj => obj.prioridad === 'critica').length
  }

  const handleCreate = async (data: any) => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newObjective = {
        id: Date.now().toString(),
        ...data
      }
      
      setObjectives(prev => [...prev, newObjective])
      console.log('Objetivo creado:', newObjective)
    } catch (error) {
      console.error('Error al crear objetivo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (updatedObjective: any) => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setObjectives(prev => 
        prev.map(obj => obj.id === updatedObjective.id ? updatedObjective : obj)
      )
      console.log('Objetivo actualizado:', updatedObjective)
    } catch (error) {
      console.error('Error al actualizar objetivo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este objetivo?')) return
    
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setObjectives(prev => prev.filter(obj => obj.id !== id))
      console.log('Objetivo eliminado:', id)
    } catch (error) {
      console.error('Error al eliminar objetivo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Objetivos de Calidad</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de objetivos de calidad ISO 9001
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Objetivos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Objetivos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enProgreso}</div>
            <p className="text-xs text-muted-foreground">
              Objetivos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completados}</div>
            <p className="text-xs text-muted-foreground">
              Objetivos logrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticos}</div>
            <p className="text-xs text-muted-foreground">
              Prioridad crítica
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de objetivos */}
      <QualityObjectiveTable
        data={objectives}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />
    </div>
  )
}