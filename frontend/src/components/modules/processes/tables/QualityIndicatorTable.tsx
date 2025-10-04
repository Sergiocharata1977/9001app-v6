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
  BarChart3,
  Calculator,
  Database,
  User,
  Activity
} from 'lucide-react'
import { QualityIndicatorFormV2 } from '../forms/QualityIndicatorFormV2'

// Tipo para los datos de la tabla
interface QualityIndicator {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  formula_calculo: string
  unidad_medida: string
  tipo_indicador: 'eficacia' | 'eficiencia' | 'efectividad' | 'calidad' | 'productividad'
  frecuencia_medicion: string
  meta_minima: number
  meta_maxima: number
  responsable_medicion: string
  fuente_datos: string
  estado: 'activo' | 'inactivo' | 'en_revision'
  objetivo_relacionado?: string
  proceso_relacionado?: string
  clausula_iso?: string
  valor_actual?: number
}

interface QualityIndicatorTableProps {
  data: QualityIndicator[]
  onEdit: (indicator: QualityIndicator) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCreate: (data: any) => Promise<void>
  isLoading?: boolean
}

export function QualityIndicatorTable({
  data,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false
}: QualityIndicatorTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Filtrar datos
  const filteredData = data.filter(indicator => {
    const matchesSearch = 
      indicator.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.responsable_medicion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || indicator.estado === statusFilter
    const matchesType = typeFilter === 'all' || indicator.tipo_indicador === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'activo': return 'default'
      case 'inactivo': return 'secondary'
      case 'en_revision': return 'outline'
      default: return 'outline'
    }
  }

  // Función para obtener el color del badge según el tipo
  const getTypeBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'eficacia': return 'default'
      case 'eficiencia': return 'secondary'
      case 'efectividad': return 'outline'
      case 'calidad': return 'destructive'
      case 'productividad': return 'outline'
      default: return 'outline'
    }
  }

  // Función para evaluar el rendimiento del indicador
  const evaluatePerformance = (indicator: QualityIndicator) => {
    if (indicator.valor_actual === undefined) return null
    
    const { valor_actual, meta_minima, meta_maxima } = indicator
    
    if (valor_actual >= meta_maxima) {
      return { status: 'excelente', color: 'text-green-600', icon: '🎯' }
    } else if (valor_actual >= meta_minima) {
      return { status: 'bueno', color: 'text-blue-600', icon: '✅' }
    } else {
      return { status: 'bajo', color: 'text-red-600', icon: '⚠️' }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Indicadores de Calidad
            </CardTitle>
            <CardDescription>
              Gestión de indicadores de calidad ISO 9001
            </CardDescription>
          </div>
          <QualityIndicatorFormV2 
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
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="en_revision">En Revisión</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="eficacia">Eficacia</SelectItem>
              <SelectItem value="eficiencia">Eficiencia</SelectItem>
              <SelectItem value="efectividad">Efectividad</SelectItem>
              <SelectItem value="calidad">Calidad</SelectItem>
              <SelectItem value="productividad">Productividad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Metas</TableHead>
                <TableHead>Rendimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'No se encontraron indicadores con los filtros aplicados'
                      : 'No hay indicadores de calidad registrados'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((indicator) => {
                  const performance = evaluatePerformance(indicator)
                  return (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-mono text-sm">
                        {indicator.codigo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{indicator.nombre}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {indicator.descripcion}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(indicator.tipo_indicador)}>
                          {indicator.tipo_indicador}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {indicator.frecuencia_medicion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-500">Min:</span>
                            <span className="font-medium">
                              {indicator.meta_minima} {indicator.unidad_medida}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-500">Max:</span>
                            <span className="font-medium">
                              {indicator.meta_maxima} {indicator.unidad_medida}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {performance ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{performance.icon}</span>
                            <div>
                              <div className={`font-medium ${performance.color}`}>
                                {indicator.valor_actual} {indicator.unidad_medida}
                              </div>
                              <div className={`text-xs ${performance.color}`}>
                                {performance.status}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            Sin datos
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(indicator.estado)}>
                          {indicator.estado.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{indicator.responsable_medicion}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4 text-gray-400" />
                          <span className="text-sm truncate max-w-[120px]">
                            {indicator.fuente_datos}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <QualityIndicatorFormV2
                            initialData={indicator}
                            onSubmit={(data) => onEdit({ ...indicator, ...data })}
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
                            onClick={() => onDelete(indicator.id)}
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
            Mostrando {filteredData.length} de {data.length} indicadores
          </div>
        )}
      </CardContent>
    </Card>
  )
}