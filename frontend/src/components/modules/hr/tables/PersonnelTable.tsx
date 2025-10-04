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
  Users,
  Mail,
  Phone,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react'
import { PersonnelFormV2 } from '../forms/PersonnelFormV2'

// Tipo para los datos de la tabla
interface Personnel {
  id: string
  numero_empleado: string
  nombres: string
  apellidos: string
  email: string
  telefono: string
  fecha_ingreso: string
  departamento_id: string
  departamento_nombre?: string
  cargo: string
  nivel_educativo: 'primaria' | 'secundaria' | 'tecnico' | 'universitario' | 'posgrado'
  estado: 'activo' | 'inactivo' | 'vacaciones' | 'licencia'
  tipo_contrato: 'indefinido' | 'temporal' | 'practicante' | 'consultor'
  salario: number
  fecha_nacimiento?: string
  direccion?: string
  cedula?: string
  competencias?: string
  supervisor_id?: string
  supervisor_nombre?: string
  fecha_salida?: string
}

interface PersonnelTableProps {
  data?: Personnel[]
  onEdit?: (personnel: Personnel) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onCreate?: (data: any) => Promise<void>
  isLoading?: boolean
  departments?: Array<{ id: string; nombre: string }>
  supervisors?: Array<{ id: string; nombres: string; apellidos: string }>
}

export function PersonnelTable({
  data = [],
  onEdit = async () => {},
  onDelete = async () => {},
  onCreate = async () => {},
  isLoading = false,
  departments = [],
  supervisors = []
}: PersonnelTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  // Filtrar datos - Asegurar que data nunca sea undefined y propiedades sean seguras
  const filteredData = (data || []).filter(person => {
    // Validación segura de propiedades con valores por defecto
    const numero = person?.numero_empleado?.toLowerCase() || '';
    const nombres = person?.nombres?.toLowerCase() || '';
    const apellidos = person?.apellidos?.toLowerCase() || '';
    const email = person?.email?.toLowerCase() || '';
    const cargo = person?.cargo?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      numero.includes(searchLower) ||
      nombres.includes(searchLower) ||
      apellidos.includes(searchLower) ||
      email.includes(searchLower) ||
      cargo.includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || person?.estado === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || person?.departamento_id === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  })

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'activo': return 'default'
      case 'inactivo': return 'secondary'
      case 'vacaciones': return 'outline'
      case 'licencia': return 'destructive'
      default: return 'outline'
    }
  }

  // Función para obtener el color del badge según el tipo de contrato
  const getContractBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'indefinido': return 'default'
      case 'temporal': return 'secondary'
      case 'practicante': return 'outline'
      case 'consultor': return 'destructive'
      default: return 'outline'
    }
  }

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  // Función para formatear salario
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Función para calcular años de servicio
  const calculateYearsOfService = (fechaIngreso: string) => {
    const ingreso = new Date(fechaIngreso)
    const hoy = new Date()
    const años = hoy.getFullYear() - ingreso.getFullYear()
    const meses = hoy.getMonth() - ingreso.getMonth()
    
    if (meses < 0 || (meses === 0 && hoy.getDate() < ingreso.getDate())) {
      return años - 1
    }
    return años
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Personal
            </CardTitle>
            <CardDescription>
              Gestión de empleados y recursos humanos
            </CardDescription>
          </div>
          <PersonnelFormV2 
            onSubmit={onCreate}
            isLoading={isLoading}
            departments={departments}
            supervisors={supervisors}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email, cargo o número de empleado..."
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
              <SelectItem value="vacaciones">Vacaciones</SelectItem>
              <SelectItem value="licencia">Licencia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Ingreso</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' 
                      ? 'No se encontraron empleados con los filtros aplicados'
                      : 'No hay empleados registrados'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((person) => {
                  const yearsOfService = calculateYearsOfService(person.fecha_ingreso)
                  return (
                    <TableRow key={person.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {person.nombres} {person.apellidos}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            {person.numero_empleado}
                          </div>
                          {person.cedula && (
                            <div className="text-xs text-gray-400">
                              CC: {person.cedula}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-[150px]">{person.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{person.telefono}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{person.cargo}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {person.nivel_educativo.replace('_', ' ')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {person.departamento_nombre || 'Sin asignar'}
                          </span>
                        </div>
                        {person.supervisor_nombre && (
                          <div className="text-xs text-gray-500">
                            Supervisor: {person.supervisor_nombre}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(person.estado)}>
                          {person.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getContractBadgeVariant(person.tipo_contrato)}>
                          {person.tipo_contrato}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div>{formatDate(person.fecha_ingreso)}</div>
                            <div className="text-xs text-gray-500">
                              {yearsOfService} año{yearsOfService !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-sm">
                            {formatSalary(person.salario)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <PersonnelFormV2
                            initialData={person}
                            onSubmit={(data) => onEdit({ ...person, ...data })}
                            isLoading={isLoading}
                            departments={departments}
                            supervisors={supervisors}
                            triggerButton={
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDelete(person.id)}
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
            Mostrando {filteredData.length} de {data.length} empleados
          </div>
        )}
      </CardContent>
    </Card>
  )
}