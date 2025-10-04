'use client'

import { useState } from 'react'
import { ProcessDefinitionFormV2 } from '@/components/modules/processes/forms/ProcessDefinitionFormV2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Settings, FileText, Users, BarChart3 } from 'lucide-react'

// Datos de ejemplo - en producción vendrían de la API
const mockProcesses = [
  {
    id: '1',
    codigo: 'PRO-001',
    nombre: 'Gestión de Compras',
    descripcion: 'Proceso para la adquisición de bienes y servicios necesarios para la operación',
    objetivo: 'Garantizar la adquisición oportuna y eficiente de bienes y servicios de calidad',
    alcance: 'Desde la identificación de necesidades hasta la recepción y pago de bienes/servicios',
    responsable: 'Jefe de Compras',
    tipo: 'operativo' as const,
    nivel_critico: 'alto' as const,
    categoria: 'proceso',
    version: '2.1',
    entradas: 'Solicitudes de compra, especificaciones técnicas, presupuesto aprobado',
    salidas: 'Bienes/servicios adquiridos, facturas, contratos'
  },
  {
    id: '2',
    codigo: 'PRO-002',
    nombre: 'Atención al Cliente',
    descripcion: 'Proceso para brindar soporte y atención a los clientes',
    objetivo: 'Proporcionar un servicio de calidad que satisfaga las necesidades del cliente',
    alcance: 'Desde el primer contacto hasta la resolución de consultas y reclamos',
    responsable: 'Coordinador de Servicio al Cliente',
    tipo: 'operativo' as const,
    nivel_critico: 'alto' as const,
    categoria: 'proceso',
    version: '1.5',
    entradas: 'Consultas, reclamos, solicitudes de información',
    salidas: 'Respuestas, soluciones, reportes de satisfacción'
  }
]

export default function ProcessDefinitionsPage() {
  const [processes, setProcesses] = useState(mockProcesses)
  const [isLoading, setIsLoading] = useState(false)

  // Estadísticas calculadas
  const stats = {
    total: processes.length,
    estrategicos: processes.filter(p => p.tipo === 'estratégico').length,
    operativos: processes.filter(p => p.tipo === 'operativo').length,
    apoyo: processes.filter(p => p.tipo === 'apoyo').length
  }

  const handleCreate = async (data: any) => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newProcess = {
        id: Date.now().toString(),
        ...data
      }
      
      setProcesses(prev => [...prev, newProcess])
      console.log('Proceso creado:', newProcess)
    } catch (error) {
      console.error('Error al crear proceso:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (updatedProcess: any) => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProcesses(prev => 
        prev.map(p => p.id === updatedProcess.id ? updatedProcess : p)
      )
      console.log('Proceso actualizado:', updatedProcess)
    } catch (error) {
      console.error('Error al actualizar proceso:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este proceso?')) return
    
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProcesses(prev => prev.filter(p => p.id !== id))
      console.log('Proceso eliminado:', id)
    } catch (error) {
      console.error('Error al eliminar proceso:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Definiciones de Procesos</h1>
          <p className="text-muted-foreground">
            Gestión y documentación de procesos ISO 9001
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Procesos</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Procesos documentados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estratégicos</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.estrategicos}</div>
            <p className="text-xs text-muted-foreground">
              Procesos estratégicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operativos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.operativos}</div>
            <p className="text-xs text-muted-foreground">
              Procesos operativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apoyo</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.apoyo}</div>
            <p className="text-xs text-muted-foreground">
              Procesos de apoyo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de procesos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Botón para crear nuevo proceso */}
        <Card className="border-dashed border-2 hover:border-blue-500 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-6 min-h-[200px]">
            <ProcessDefinitionFormV2 
              onSubmit={handleCreate}
              isLoading={isLoading}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Crear nueva definición de proceso
            </p>
          </CardContent>
        </Card>

        {/* Procesos existentes */}
        {processes.map((process) => (
          <Card key={process.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{process.nombre}</CardTitle>
                <div className="flex gap-2">
                  <ProcessDefinitionFormV2
                    initialData={process}
                    onSubmit={(data) => handleEdit({ ...process, ...data })}
                    isLoading={isLoading}
                    triggerButton={
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Settings className="w-4 h-4" />
                      </button>
                    }
                  />
                  <button 
                    onClick={() => handleDelete(process.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-500"
                    disabled={isLoading}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <CardDescription>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {process.codigo}
                </span>
                <span className="ml-2">v{process.version}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {process.descripcion}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Tipo:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    process.tipo === 'estratégico' ? 'bg-purple-100 text-purple-800' :
                    process.tipo === 'operativo' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {process.tipo}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Criticidad:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    process.nivel_critico === 'alto' ? 'bg-red-100 text-red-800' :
                    process.nivel_critico === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {process.nivel_critico}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Responsable:</span>
                  <span className="font-medium">{process.responsable}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}