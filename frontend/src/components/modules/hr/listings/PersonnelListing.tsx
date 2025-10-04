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
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  User
} from 'lucide-react'
import { PersonnelFormV2 } from '../forms/PersonnelFormV2'

// Tipo para los datos del personal
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
  foto_perfil?: string
}

interface PersonnelListingProps {
  data?: Personnel[]
  onEdit?: (personnel: Personnel) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onCreate?: (data: any) => Promise<void>
  isLoading?: boolean
  departments?: Array<{ id: string; nombre: string }>
  supervisors?: Array<{ id: string; nombres: string; apellidos: string }>
}

export function PersonnelListing({
  data = [],
  onEdit = async () => {},
  onDelete = async () => {},
  onCreate = async () => {},
  isLoading = false,
  departments = [],
  supervisors = []
}: PersonnelListingProps) {
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [filterDepartamento, setFilterDepartamento] = useState<string>('todos')
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

  // Filtrar personal
  const filterPersonnel = () => {
    let filtered = data

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.numero_empleado.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(person => person.estado === filterEstado)
    }

    // Filtro por departamento
    if (filterDepartamento !== 'todos') {
      filtered = filtered.filter(person => person.departamento_id === filterDepartamento)
    }

    setFilteredPersonnel(filtered)
  }

  useEffect(() => {
    filterPersonnel()
  }, [searchTerm, filterEstado, filterDepartamento, data])

  const handlePersonnelClick = (personnel: Personnel) => {
    // Navegar a los detalles del personal
    console.log('Ver detalles de:', personnel.nombres)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-gray-100 text-gray-800'
      case 'vacaciones': return 'bg-blue-100 text-blue-800'
      case 'licencia': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getContratoColor = (tipo: string) => {
    switch (tipo) {
      case 'indefinido': return 'bg-green-100 text-green-800'
      case 'temporal': return 'bg-yellow-100 text-yellow-800'
      case 'practicante': return 'bg-blue-100 text-blue-800'
      case 'consultor': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  // Función para obtener iniciales del nombre
  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, email, cargo o número de empleado..."
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
            <option value="vacaciones">Vacaciones</option>
            <option value="licencia">Licencia</option>
          </select>
          <select
            value={filterDepartamento}
            onChange={(e) => setFilterDepartamento(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los departamentos</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.nombre}
              </option>
            ))}
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

        <PersonnelFormV2 
          onSubmit={onCreate}
          isLoading={isLoading}
          departments={departments}
          supervisors={supervisors}
        />
      </div>

      {/* Contenido */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonnel.map((person) => (
            <Card key={person.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePersonnelClick(person)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Foto de perfil */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {person.foto_perfil ? (
                      <img 
                        src={person.foto_perfil} 
                        alt={`${person.nombres} ${person.apellidos}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(person.nombres, person.apellidos)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{person.nombres} {person.apellidos}</h3>
                    <p className="text-sm text-gray-600">{person.cargo}</p>
                    <p className="text-xs text-gray-500 font-mono">#{person.numero_empleado}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{person.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{person.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{person.departamento_nombre || 'Sin asignar'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(person.salario)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{calculateYearsOfService(person.fecha_ingreso)} año(s) de servicio</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getEstadoColor(person.estado)}>
                  {person.estado}
                </Badge>
                <Badge className={getContratoColor(person.tipo_contrato)}>
                  {person.tipo_contrato}
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePersonnelClick(person);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalles
                  </Button>
                  <PersonnelFormV2
                    initialData={person}
                    onSubmit={(data) => onEdit({ ...person, ...data })}
                    isLoading={isLoading}
                    departments={departments}
                    supervisors={supervisors}
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
                      onDelete(person.id);
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
          {filteredPersonnel.map((person) => (
            <Card key={person.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePersonnelClick(person)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Foto de perfil */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {person.foto_perfil ? (
                      <img 
                        src={person.foto_perfil} 
                        alt={`${person.nombres} ${person.apellidos}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(person.nombres, person.apellidos)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900">{person.nombres} {person.apellidos}</h3>
                      <Badge className={getEstadoColor(person.estado)}>
                        {person.estado}
                      </Badge>
                      <Badge className={getContratoColor(person.tipo_contrato)}>
                        {person.tipo_contrato}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{person.cargo} - {person.departamento_nombre}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Email: {person.email}</span>
                      <span>Tel: {person.telefono}</span>
                      <span>Salario: {formatSalary(person.salario)}</span>
                      <span>Servicio: {calculateYearsOfService(person.fecha_ingreso)} años</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePersonnelClick(person);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  <PersonnelFormV2
                    initialData={person}
                    onSubmit={(data) => onEdit({ ...person, ...data })}
                    isLoading={isLoading}
                    departments={departments}
                    supervisors={supervisors}
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
                      onDelete(person.id);
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

      {filteredPersonnel.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontró personal</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}




