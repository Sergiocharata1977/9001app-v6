'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Plus, 
  Grid3X3, 
  List, 
  Building2,
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Target
} from 'lucide-react'
import { DepartmentFormV2 } from '../forms/DepartmentFormV2'

// Tipo para los datos de departamentos
interface Department {
  id: string
  nombre: string
  descripcion?: string
  gerente_id?: string
  gerente_nombre?: string
  cantidad_empleados?: number
  presupuesto?: number
  estado: 'activo' | 'inactivo'
  organization_id: string
  created_at?: string
  updated_at?: string
  objetivos?: string
}

interface DepartmentListingProps {
  data?: Department[]
  onEdit?: (department: Department) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onCreate?: (data: any) => Promise<void>
  isLoading?: boolean
  managers?: Array<{ id: string; nombres: string; apellidos: string }>
}

export function DepartmentListing({
  data = [],
  onEdit = async () => {},
  onDelete = async () => {},
  onCreate = async () => {},
  isLoading = false,
  managers = []
}: DepartmentListingProps) {
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

  // Filtrar departamentos
  const filterDepartments = () => {
    let filtered = data

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (dept.gerente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      )
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(dept => dept.estado === filterEstado)
    }

    setFilteredDepartments(filtered)
  }

  useEffect(() => {
    filterDepartments()
  }, [searchTerm, filterEstado, data])

  const handleDepartmentClick = (department: Department) => {
    // Navegar a los detalles del departamento
    console.log('Ver detalles de:', department.nombre)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para formatear presupuesto
  const formatBudget = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Función para obtener iniciales del departamento
  const getInitials = (nombre: string) => {
    return nombre.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, descripción o gerente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Vista toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Vista Tarjetas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            Vista Lista
          </button>
        </div>

        <DepartmentFormV2 
          onSubmit={onCreate}
          isLoading={isLoading}
          managers={managers}
        />
      </div>

      {/* Contenido */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDepartmentClick(dept)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Icono del departamento */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(dept.nombre)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dept.nombre}</h3>
                    <p className="text-sm text-gray-600">{dept.gerente_nombre || 'Sin gerente asignado'}</p>
                    <p className="text-xs text-gray-500 font-mono">ID: {dept.id}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dept.descripcion || 'Sin descripción'}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{dept.cantidad_empleados || 0} empleados</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Gerente: {dept.gerente_nombre || 'Sin asignar'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Presupuesto: {formatBudget(dept.presupuesto)}</span>
                </div>
                {dept.objetivos && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="line-clamp-1">{dept.objetivos}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getEstadoColor(dept.estado)}>
                  {dept.estado}
                </Badge>
                <Badge variant="outline">
                  {dept.cantidad_empleados || 0} empleados
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDepartmentClick(dept);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalles
                  </Button>
                  <DepartmentFormV2
                    initialData={dept}
                    onSubmit={(data) => onEdit({ ...dept, ...data })}
                    isLoading={isLoading}
                    managers={managers}
                    triggerButton={
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(dept.id);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDepartmentClick(dept)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icono del departamento */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(dept.nombre)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900">{dept.nombre}</h3>
                      <Badge className={getEstadoColor(dept.estado)}>
                        {dept.estado}
                      </Badge>
                      <Badge variant="outline">
                        {dept.cantidad_empleados || 0} empleados
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{dept.descripcion || 'Sin descripción'}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Gerente: {dept.gerente_nombre || 'Sin asignar'}</span>
                      <span>Empleados: {dept.cantidad_empleados || 0}</span>
                      <span>Presupuesto: {formatBudget(dept.presupuesto)}</span>
                      {dept.objetivos && <span>Objetivos: {dept.objetivos}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDepartmentClick(dept);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  <DepartmentFormV2
                    initialData={dept}
                    onSubmit={(data) => onEdit({ ...dept, ...data })}
                    isLoading={isLoading}
                    managers={managers}
                    triggerButton={
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(dept.id);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron departamentos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}




