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
  Building2,
  Users,
  UserCheck,
  DollarSign,
  Plus
} from 'lucide-react'
import { DepartmentFormV2 } from '../forms/DepartmentFormV2'

// Tipo para los datos de la tabla
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
}

interface DepartmentTableProps {
  data?: Department[]
  onEdit?: (department: Department) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onCreate?: (data: any) => Promise<void>
  isLoading?: boolean
  managers?: Array<{ id: string; nombres: string; apellidos: string }>
}

export function DepartmentTable({
  data = [],
  onEdit = async () => {},
  onDelete = async () => {},
  onCreate = async () => {},
  isLoading = false,
  managers = []
}: DepartmentTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filtrar datos - Asegurar que data nunca sea undefined
  const filteredData = (data || []).filter(dept => {
    // Validación segura de propiedades con valores por defecto
    const nombre = dept?.nombre?.toLowerCase() || '';
    const descripcion = dept?.descripcion?.toLowerCase() || '';
    const gerente = dept?.gerente_nombre?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      nombre.includes(searchLower) ||
      descripcion.includes(searchLower) ||
      gerente.includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || dept?.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  })

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'activo': return 'default'
      case 'inactivo': return 'secondary'
      default: return 'outline'
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

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Departamentos
            </CardTitle>
            <CardDescription>
              Gestión de departamentos y estructura organizacional
            </CardDescription>
          </div>
          <DepartmentFormV2 
            onSubmit={onCreate}
            isLoading={isLoading}
            managers={managers}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, descripción o gerente..."
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
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departamento</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Gerente</TableHead>
                <TableHead>Empleados</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No se encontraron departamentos con los filtros aplicados'
                      : 'No hay departamentos registrados'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          {dept.nombre}
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-1">
                          ID: {dept.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {dept.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {dept.gerente_nombre || 'Sin asignar'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sm">
                          {dept.cantidad_empleados || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm">
                          {formatBudget(dept.presupuesto)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(dept.estado)}>
                        {dept.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DepartmentFormV2
                          initialData={dept}
                          onSubmit={(data) => onEdit({ ...dept, ...data })}
                          isLoading={isLoading}
                          managers={managers}
                          triggerButton={
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onDelete(dept.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información adicional */}
        {filteredData.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredData.length} de {data.length} departamentos
          </div>
        )}
      </CardContent>
    </Card>
  )
}

