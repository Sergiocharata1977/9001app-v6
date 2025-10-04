'use client'

import { useState, useEffect } from 'react'
import { QualityIndicatorTable } from '@/components/modules/processes/tables/QualityIndicatorTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { BarChart3, Activity, TrendingUp, AlertTriangle } from 'lucide-react'

// Datos de ejemplo - en producción vendrían de la API
const mockIndicators = [
  {
    id: '1',
    codigo: 'IND-001',
    nombre: 'Porcentaje de satisfacción del cliente',
    descripcion: 'Mide el nivel de satisfacción de los clientes con nuestros productos y servicios',
    formula_calculo: '(Clientes satisfechos / Total clientes encuestados) * 100',
    unidad_medida: '%',
    tipo_indicador: 'eficacia' as const,
    frecuencia_medicion: 'mensual',
    meta_minima: 80,
    meta_maxima: 95,
    responsable_medicion: 'Ana García',
    fuente_datos: 'Encuestas de satisfacción CRM',
    estado: 'activo' as const,
    objetivo_relacionado: 'OBJ-002 - Aumentar satisfacción',
    proceso_relacionado: 'PRO-001 - Atención al Cliente',
    clausula_iso: '8.2.1 - Satisfacción del cliente',
    valor_actual: 87
  },
  {
    id: '2',
    codigo: 'IND-002',
    nombre: 'Tiempo promedio de respuesta',
    descripcion: 'Tiempo promedio que toma responder a las consultas de los clientes',
    formula_calculo: 'Suma de tiempos de respuesta / Número total de consultas',
    unidad_medida: 'horas',
    tipo_indicador: 'eficiencia' as const,
    frecuencia_medicion: 'semanal',
    meta_minima: 24,
    meta_maxima: 12,
    responsable_medicion: 'Carlos López',
    fuente_datos: 'Sistema de tickets de soporte',
    estado: 'activo' as const,
    objetivo_relacionado: 'OBJ-001 - Reducir tiempo respuesta',
    proceso_relacionado: 'PRO-001 - Atención al Cliente',
    clausula_iso: '8.5.1 - Control de la producción',
    valor_actual: 18
  },
  {
    id: '3',
    codigo: 'IND-003',
    nombre: 'Tasa de defectos en producción',
    descripcion: 'Porcentaje de productos defectuosos en el proceso de producción',
    formula_calculo: '(Productos defectuosos / Total productos) * 100',
    unidad_medida: '%',
    tipo_indicador: 'calidad' as const,
    frecuencia_medicion: 'diaria',
    meta_minima: 5,
    meta_maxima: 2,
    responsable_medicion: 'María Rodríguez',
    fuente_datos: 'Sistema de control de calidad',
    estado: 'activo' as const,
    objetivo_relacionado: 'OBJ-003 - Reducir defectos',
    proceso_relacionado: 'PRO-003 - Producción',
    clausula_iso: '8.5 - Producción y provisión del servicio',
    valor_actual: 3.2
  },
  {
    id: '4',
    codigo: 'IND-004',
    nombre: 'Productividad por empleado',
    descripcion: 'Unidades producidas por empleado por día',
    formula_calculo: 'Total unidades producidas / Número de empleados / Días trabajados',
    unidad_medida: 'unidades/día',
    tipo_indicador: 'productividad' as const,
    frecuencia_medicion: 'mensual',
    meta_minima: 50,
    meta_maxima: 80,
    responsable_medicion: 'Luis Martínez',
    fuente_datos: 'Sistema ERP de producción',
    estado: 'en_revision' as const,
    proceso_relacionado: 'PRO-003 - Producción',
    clausula_iso: '7.1.2 - Personas',
    valor_actual: 65
  }
]

export default function QualityIndicatorsPage() {
  const [indicators, setIndicators] = useState(mockIndicators)
  const [isLoading, setIsLoading] = useState(false)

  // Estadísticas calculadas
  const stats = {
    total: indicators.length,
    activos: indicators.filter(ind => ind.estado === 'activo').length,
    enMeta: indicators.filter(ind => 
      ind.valor_actual !== undefined && 
      ind.valor_actual >= ind.meta_minima
    ).length,
    criticos: indicators.filter(ind => 
      ind.valor_actual !== undefined && 
      ind.valor_actual < ind.meta_minima
    ).length
  }

  const handleCreate = async (data: any) => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newIndicator = {
        id: Date.now().toString(),
        ...data
      }
      
      setIndicators(prev => [...prev, newIndicator])
      console.log('Indicador creado:', newIndicator)
    } catch (error) {
      console.error('Error al crear indicador:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (updatedIndicator: any) => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIndicators(prev => 
        prev.map(ind => ind.id === updatedIndicator.id ? updatedIndicator : ind)
      )
      console.log('Indicador actualizado:', updatedIndicator)
    } catch (error) {
      console.error('Error al actualizar indicador:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este indicador?')) return
    
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIndicators(prev => prev.filter(ind => ind.id !== id))
      console.log('Indicador eliminado:', id)
    } catch (error) {
      console.error('Error al eliminar indicador:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Indicadores de Calidad</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de indicadores de desempeño ISO 9001
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Indicadores</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Indicadores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
            <p className="text-xs text-muted-foreground">
              Indicadores en uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Meta</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enMeta}</div>
            <p className="text-xs text-muted-foreground">
              Cumpliendo objetivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticos}</div>
            <p className="text-xs text-muted-foreground">
              Bajo rendimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de indicadores */}
      <QualityIndicatorTable
        data={indicators}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />
    </div>
  )
}