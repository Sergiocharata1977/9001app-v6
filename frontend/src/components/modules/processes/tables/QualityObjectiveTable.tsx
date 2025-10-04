'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Target,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react'
import { QualityObjectiveFormV2 } from '../forms/QualityObjectiveFormV2'

// Tipo para los datos de la tabla
interface QualityObjective {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  meta_numerica: number
  unidad_medida: string
  frecuencia_medicion: string
  responsable_seguimiento: string
  fecha_inicio: string
  fecha_fin: string
  estado: 'planificado' | 'en_progreso' | 'completado' | 'suspendido'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  proceso_relacionado?: string
  clausula_iso?: string
  progreso_actual?: number
}

interface QualityObjectiveTableProps {
  data: QualityObjective[]
  onEdit: (objective: QualityObjective) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCreate: (data: any) => Promise<void>
  isLoading?: boolean
}

export function QualityObjectiveTable({
  data,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false
}: QualityObjectiveTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Filtrar datos
  const filteredData = data.filter(objective => {
    const matchesSearch = 
      objective.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objective.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objective.responsable_seguimiento.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || objective.estado === statusFilter
    const matchesPriority = priorityFilter === 'all' || objective.prioridad === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completado': return 'default'
      case 'en_progreso': return 'secondary'
      case 'planificado': return 'outline'
      case 'suspendido': return 'destructive'
      default: return 'outline'
    }
  }

  // Función para obtener el color del badge según la prioridad
  const getPriorityBadgeVariant = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'destructive'
      case 'alta': return 'secondary'
      case 'media': return 'outline'
      case 'baja': return 'outline'
      default: return 'outline'
    }
  }

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  // Función para calcular el progreso (simulado)
  const calculateProgress = (objetivo: QualityObjective) => {
    if (objetivo.progreso_actual !== undefined) {
      return Math.round((objetivo.progreso_actual / objetivo.meta_numerica) * 100)
    }
    // Simulación basada en fechas
    const inicio = new Date(objetivo.fecha_inicio)
    const fin = new Date(objetivo.fecha_fin)
    const ahora = new Date()
    
    if (ahora < inicio) return 0
    if (ahora > fin) return 100
    
    const totalTime = fin.getTime() - inicio.getTime()
    const elapsedTime = ahora.getTime() - inicio.getTime()
    return Math.round((elapsedTime / totalTime) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Objetivos de Calidad
            </CardTitle>
            <CardDescription>
              Gestión de objetivos de calidad ISO 9001
            </CardDescription>
          </div>
          <QualityObjectiveFormV2 
            onSubmit={onCreate}
            isLoading={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por código, nombre o responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="planificado">Planificado</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="suspendido">Suspendido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las prioridades</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'No se encontraron objetivos con los filtros aplicados'
                      : 'No hay objetivos de calidad registrados'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((objective) => {
                  const progress = calculateProgress(objective)
                  return (
                    <TableRow key={objective.id}>
                      <TableCell className="font-mono text-sm">
                        {objective.codigo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{objective.nombre}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {objective.descripcion}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">
                            {objective.meta_numerica} {objective.unidad_medida}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {objective.frecuencia_medicion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(objective.estado)}>
                          {objective.estado.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(objective.prioridad)}>
                          {objective.prioridad}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{objective.responsable_seguimiento}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div>{formatDate(objective.fecha_inicio)}</div>
                            <div className="text-gray-500">
                              {formatDate(objective.fecha_fin)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <QualityObjectiveFormV2
                            initialData={objective}
                            onSubmit={(data) => onEdit({ ...objective, ...data })}
                            isLoading={isLoading}
                            triggerButton={
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDelete(objective.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información adicional */}
        {filteredData.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredData.length} de {data.length} objetivos
          </div>
        )}
      </CardContent>
    </Card>
  )
}