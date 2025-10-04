'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  Plus, 
  Grid3X3, 
  List, 
  Briefcase,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  Eye,
  Users,
  GraduationCap,
  Building2
} from 'lucide-react';

// Interface basada en la tabla PUESTOS del bd-turso.md.txt
interface Puesto {
  id: string;
  nombre: string;
  descripcion_responsabilidades?: string;
  requisitos_experiencia?: string;
  requisitos_formacion?: string;
  departamento_id?: string;
  reporta_a_id?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  // Campos adicionales para mostrar en la UI
  departamento_nombre?: string;
  reporta_a_nombre?: string;
  cantidad_empleados?: number;
  nivel_jerarquico?: string;
  salario_rango?: string;
}

// Mock data basado en la estructura de la tabla PUESTOS
const mockPuestos: Puesto[] = [
  {
    id: '1',
    nombre: 'Director General',
    descripcion_responsabilidades: 'Liderar la organización, definir estrategias y tomar decisiones ejecutivas',
    requisitos_experiencia: 'Mínimo 10 años en puestos directivos',
    requisitos_formacion: 'Licenciatura en Administración, Ingeniería o afín. Maestría preferible',
    departamento_id: '1',
    reporta_a_id: null,
    organization_id: '1',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    departamento_nombre: 'Dirección General',
    reporta_a_nombre: null,
    cantidad_empleados: 1,
    nivel_jerarquico: 'Ejecutivo',
    salario_rango: '$50,000 - $80,000'
  },
  {
    id: '2',
    nombre: 'Gerente de Recursos Humanos',
    descripcion_responsabilidades: 'Gestionar el talento humano, desarrollo organizacional y políticas de personal',
    requisitos_experiencia: 'Mínimo 5 años en gestión de RRHH',
    requisitos_formacion: 'Licenciatura en Psicología, Administración o afín',
    departamento_id: '2',
    reporta_a_id: '1',
    organization_id: '1',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    departamento_nombre: 'Recursos Humanos',
    reporta_a_nombre: 'Director General',
    cantidad_empleados: 1,
    nivel_jerarquico: 'Gerencial',
    salario_rango: '$25,000 - $35,000'
  },
  {
    id: '3',
    nombre: 'Coordinador de Calidad',
    descripcion_responsabilidades: 'Coordinar el sistema de gestión de calidad y procesos de mejora continua',
    requisitos_experiencia: 'Mínimo 3 años en sistemas de calidad',
    requisitos_formacion: 'Ingeniería Industrial, Química o afín. Certificación ISO 9001',
    departamento_id: '3',
    reporta_a_id: '1',
    organization_id: '1',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-25T09:15:00Z',
    departamento_nombre: 'Calidad y Sistemas',
    reporta_a_nombre: 'Director General',
    cantidad_empleados: 1,
    nivel_jerarquico: 'Coordinación',
    salario_rango: '$18,000 - $25,000'
  },
  {
    id: '4',
    nombre: 'Supervisor de Producción',
    descripcion_responsabilidades: 'Supervisar procesos productivos, control de calidad y gestión de equipos',
    requisitos_experiencia: 'Mínimo 4 años en supervisión de producción',
    requisitos_formacion: 'Ingeniería Industrial, Mecánica o afín',
    departamento_id: '4',
    reporta_a_id: '1',
    organization_id: '1',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-18T16:20:00Z',
    departamento_nombre: 'Operaciones',
    reporta_a_nombre: 'Director General',
    cantidad_empleados: 3,
    nivel_jerarquico: 'Supervisión',
    salario_rango: '$15,000 - $22,000'
  },
  {
    id: '5',
    nombre: 'Analista Financiero',
    descripcion_responsabilidades: 'Análisis financiero, presupuestos y reportes de gestión',
    requisitos_experiencia: 'Mínimo 2 años en análisis financiero',
    requisitos_formacion: 'Licenciatura en Contaduría, Finanzas o afín',
    departamento_id: '5',
    reporta_a_id: '1',
    organization_id: '1',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-22T11:45:00Z',
    departamento_nombre: 'Finanzas',
    reporta_a_nombre: 'Director General',
    cantidad_empleados: 2,
    nivel_jerarquico: 'Analista',
    salario_rango: '$12,000 - $18,000'
  },
  {
    id: '6',
    nombre: 'Desarrollador de Software',
    descripcion_responsabilidades: 'Desarrollo de aplicaciones, mantenimiento de sistemas y soporte técnico',
    requisitos_experiencia: 'Mínimo 2 años en desarrollo de software',
    requisitos_formacion: 'Ingeniería en Sistemas, Computación o afín',
    departamento_id: '6',
    reporta_a_id: '1',
    organization_id: '1',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-28T13:10:00Z',
    departamento_nombre: 'Tecnología e Innovación',
    reporta_a_nombre: 'Director General',
    cantidad_empleados: 5,
    nivel_jerarquico: 'Técnico',
    salario_rango: '$15,000 - $25,000'
  }
];

export default function PuestosPage() {
  const router = useRouter();
  const [puestos, setPuestos] = useState<Puesto[]>(mockPuestos);
  const [filteredPuestos, setFilteredPuestos] = useState<Puesto[]>(mockPuestos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('todos');
  const [filterNivel, setFilterNivel] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  // Función para filtrar puestos
  const filterPuestos = () => {
    let filtered = puestos;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(puesto =>
        puesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        puesto.descripcion_responsabilidades?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        puesto.departamento_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        puesto.requisitos_formacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por departamento
    if (filterDepartamento !== 'todos') {
      filtered = filtered.filter(puesto => puesto.departamento_id === filterDepartamento);
    }

    // Filtro por nivel jerárquico
    if (filterNivel !== 'todos') {
      filtered = filtered.filter(puesto => puesto.nivel_jerarquico === filterNivel);
    }

    setFilteredPuestos(filtered);
  };

  useEffect(() => {
    filterPuestos();
  }, [searchTerm, filterDepartamento, filterNivel, puestos]);

  const handlePuestoClick = (puesto: Puesto) => {
    // Navegar a los detalles del puesto
    router.push(`/puestos/${puesto.id}`);
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Ejecutivo': return 'bg-purple-100 text-purple-800';
      case 'Gerencial': return 'bg-blue-100 text-blue-800';
      case 'Coordinación': return 'bg-green-100 text-green-800';
      case 'Supervisión': return 'bg-yellow-100 text-yellow-800';
      case 'Analista': return 'bg-orange-100 text-orange-800';
      case 'Técnico': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-500" />
              Puestos
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de puestos de trabajo y estructura organizacional
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Puesto
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, responsabilidades, departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterDepartamento}
              onChange={(e) => setFilterDepartamento(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos los departamentos</option>
              <option value="1">Dirección General</option>
              <option value="2">Recursos Humanos</option>
              <option value="3">Calidad y Sistemas</option>
              <option value="4">Operaciones</option>
              <option value="5">Finanzas</option>
              <option value="6">Tecnología e Innovación</option>
            </select>
            <select
              value={filterNivel}
              onChange={(e) => setFilterNivel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos los niveles</option>
              <option value="Ejecutivo">Ejecutivo</option>
              <option value="Gerencial">Gerencial</option>
              <option value="Coordinación">Coordinación</option>
              <option value="Supervisión">Supervisión</option>
              <option value="Analista">Analista</option>
              <option value="Técnico">Técnico</option>
            </select>
          </div>
        </div>

        {/* Vista toggle */}
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
      </div>

      {/* Contenido */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPuestos.map((puesto) => (
            <Card key={puesto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePuestoClick(puesto)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{puesto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">{puesto.departamento_nombre}</p>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{puesto.descripcion_responsabilidades}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getNivelColor(puesto.nivel_jerarquico || '')}>
                  {puesto.nivel_jerarquico}
                </Badge>
                <Badge variant="outline">
                  {puesto.cantidad_empleados} empleados
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Departamento: {puesto.departamento_nombre}</span>
                </div>
                {puesto.reporta_a_nombre && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Reporta a: {puesto.reporta_a_nombre}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Formación: {puesto.requisitos_formacion}</span>
                </div>
                {puesto.salario_rango && (
                  <div className="flex items-center gap-2">
                    <span>Salario: {puesto.salario_rango}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePuestoClick(puesto);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPuestos.map((puesto) => (
            <Card key={puesto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePuestoClick(puesto)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{puesto.nombre}</h3>
                    <Badge className={getNivelColor(puesto.nivel_jerarquico || '')}>
                      {puesto.nivel_jerarquico}
                    </Badge>
                    <Badge variant="outline">
                      {puesto.cantidad_empleados} empleados
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{puesto.departamento_nombre}</p>
                  <p className="text-sm text-gray-500 mb-3">{puesto.descripcion_responsabilidades}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Departamento: {puesto.departamento_nombre}</span>
                    {puesto.reporta_a_nombre && <span>Reporta a: {puesto.reporta_a_nombre}</span>}
                    {puesto.salario_rango && <span>Salario: {puesto.salario_rango}</span>}
                    <span>Formación: {puesto.requisitos_formacion}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePuestoClick(puesto);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredPuestos.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron puestos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}

