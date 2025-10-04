'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Workflow,
  ArrowRight,
  ArrowDown,
  Plus,
  Edit,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Datos de ejemplo para organigrama
const orgChartData = {
  ceo: {
    id: 'ceo',
    name: 'Juan Pérez',
    position: 'Director General',
    department: 'Dirección',
    email: 'jperez@senoresdelagro.com',
    phone: '+54 11 1234-5678',
    location: 'Oficina Principal',
    startDate: '2019-01-15',
    competencies: ['Liderazgo Estratégico', 'Gestión de Negocios', 'Relaciones Públicas'],
    responsibilities: ['Dirección general', 'Estrategia corporativa', 'Relaciones institucionales'],
    image: '/avatars/ceo.jpg'
  },
  directors: [
    {
      id: 'quality-director',
      name: 'María García',
      position: 'Director de Calidad',
      department: 'Calidad',
      email: 'mgarcia@senoresdelagro.com',
      phone: '+54 11 1234-5679',
      location: 'Planta Principal',
      startDate: '2020-03-01',
      competencies: ['ISO 9001', 'Gestión de Calidad', 'Auditorías'],
      responsibilities: ['Sistema de gestión', 'Certificaciones', 'Mejora continua'],
      parentId: 'ceo',
      reports: 3
    },
    {
      id: 'operations-director',
      name: 'Carlos López',
      position: 'Director de Operaciones',
      department: 'Operaciones',
      email: 'clopez@senoresdelagro.com',
      phone: '+54 11 1234-5680',
      location: 'Planta Principal',
      startDate: '2019-06-15',
      competencies: ['Gestión de Producción', 'Logística', 'Optimización'],
      responsibilities: ['Producción', 'Logística', 'Mantenimiento'],
      parentId: 'ceo',
      reports: 4
    },
    {
      id: 'commercial-director',
      name: 'Ana Martínez',
      position: 'Director Comercial',
      department: 'Comercial',
      email: 'amartinez@senoresdelagro.com',
      phone: '+54 11 1234-5681',
      location: 'Oficina Comercial',
      startDate: '2020-01-10',
      competencies: ['Ventas', 'Marketing', 'CRM'],
      responsibilities: ['Ventas', 'Marketing', 'Atención al cliente'],
      parentId: 'ceo',
      reports: 2
    }
  ],
  managers: [
    {
      id: 'quality-manager',
      name: 'Roberto Silva',
      position: 'Supervisor de Calidad',
      department: 'Calidad',
      email: 'rsilva@senoresdelagro.com',
      phone: '+54 11 1234-5682',
      location: 'Planta Principal',
      startDate: '2021-02-01',
      competencies: ['Control de Calidad', 'Análisis AMFE', 'Inspecciones'],
      responsibilities: ['Control de procesos', 'Análisis de riesgos', 'Inspecciones'],
      parentId: 'quality-director',
      reports: 2
    },
    {
      id: 'production-manager',
      name: 'Patricia Vega',
      position: 'Supervisor de Producción',
      department: 'Operaciones',
      email: 'pvega@senoresdelagro.com',
      phone: '+54 11 1234-5683',
      location: 'Planta Principal',
      startDate: '2020-09-15',
      competencies: ['Gestión de Producción', 'Optimización', 'Equipos'],
      responsibilities: ['Línea de producción', 'Embalaje', 'Control de inventarios'],
      parentId: 'operations-director',
      reports: 8
    },
    {
      id: 'logistics-manager',
      name: 'Luis Rodríguez',
      position: 'Supervisor de Logística',
      department: 'Operaciones',
      email: 'lrodriguez@senoresdelagro.com',
      phone: '+54 11 1234-5684',
      location: 'Depósito Central',
      startDate: '2021-05-01',
      competencies: ['Logística', 'Transporte', 'Almacenamiento'],
      responsibilities: ['Transporte', 'Almacenamiento', 'Distribución'],
      parentId: 'operations-director',
      reports: 6
    }
  ]
};

// Datos de ejemplo para procesos ISO 9001
const processData = [
  {
    id: 1,
    name: 'Gestión de Riesgos',
    type: 'management',
    isoClause: '6.1',
    description: 'Identificación, evaluación y gestión de riesgos',
    responsible: 'María García',
    inputs: ['Contexto organizacional', 'Partes interesadas'],
    outputs: ['Matriz de riesgos', 'Planes de mitigación'],
    controls: ['Análisis AMFE', 'Evaluación de proveedores'],
    indicators: [
      { name: 'Riesgos identificados', target: 100, current: 85, unit: '%' },
      { name: 'Riesgos mitigados', target: 90, current: 78, unit: '%' }
    ]
  },
  {
    id: 2,
    name: 'Revisión por la Dirección',
    type: 'management',
    isoClause: '9.3',
    description: 'Evaluación periódica del sistema de gestión',
    responsible: 'Juan Pérez',
    inputs: ['Indicadores de calidad', 'Auditorías', 'Feedback cliente'],
    outputs: ['Decisiones estratégicas', 'Plan de mejoras'],
    controls: ['Reuniones mensuales', 'Reportes ejecutivos'],
    indicators: [
      { name: 'Reuniones realizadas', target: 12, current: 12, unit: '/año' },
      { name: 'Decisiones implementadas', target: 95, current: 88, unit: '%' }
    ]
  },
  {
    id: 3,
    name: 'Gestión de Proveedores',
    type: 'operational',
    isoClause: '8.4',
    description: 'Evaluación y control de proveedores',
    responsible: 'Luis Rodríguez',
    inputs: ['Requisitos de compra', 'Especificaciones'],
    outputs: ['Productos conformes', 'Evaluaciones'],
    controls: ['Inspecciones', 'Auditorías de proveedores'],
    indicators: [
      { name: 'Proveedores evaluados', target: 100, current: 95, unit: '%' },
      { name: 'Productos conformes', target: 98, current: 96, unit: '%' }
    ]
  },
  {
    id: 4,
    name: 'Control de Producción',
    type: 'operational',
    isoClause: '8.5',
    description: 'Control de procesos de producción',
    responsible: 'Patricia Vega',
    inputs: ['Especificaciones', 'Materias primas'],
    outputs: ['Productos terminados', 'Registros de producción'],
    controls: ['Inspecciones', 'Pruebas de calidad'],
    indicators: [
      { name: 'Eficiencia de producción', target: 95, current: 92, unit: '%' },
      { name: 'Productos no conformes', target: '<2', current: 1.8, unit: '%' }
    ]
  }
];

export function OrgChart() {
  const [activeTab, setActiveTab] = useState('organization');
  const [selectedPerson, setSelectedPerson] = useState(orgChartData.ceo);

  const getProcessTypeColor = (type: string) => {
    switch (type) {
      case 'management': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'operational': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'support': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessTypeIcon = (type: string) => {
    switch (type) {
      case 'management': return <TrendingUp className="w-4 h-4" />;
      case 'operational': return <Workflow className="w-4 h-4" />;
      case 'support': return <Target className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organigrama y Procesos</h1>
          <p className="text-gray-600">Estructura organizacional y mapa de procesos ISO 9001</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Posición
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organization">Organigrama</TabsTrigger>
          <TabsTrigger value="processes">Procesos ISO</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsabilidades</TabsTrigger>
        </TabsList>

        {/* Organigrama */}
        <TabsContent value="organization" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Organigrama Visual */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-700">Estructura Organizacional</CardTitle>
                  <CardDescription>
                    Jerarquía y relaciones organizacionales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* CEO */}
                    <div className="flex justify-center">
                      <div 
                        className="w-64 p-4 bg-emerald-100 border-2 border-emerald-500 rounded-lg cursor-pointer hover:bg-emerald-200 transition-colors"
                        onClick={() => setSelectedPerson(orgChartData.ceo)}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-emerald-800">{orgChartData.ceo.name}</h3>
                          <p className="text-sm text-emerald-700">{orgChartData.ceo.position}</p>
                          <p className="text-xs text-emerald-600">{orgChartData.ceo.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Flechas */}
                    <div className="flex justify-center">
                      <ArrowDown className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* Directores */}
                    <div className="grid grid-cols-3 gap-4">
                      {orgChartData.directors.map((director) => (
                        <div key={director.id} className="flex flex-col items-center">
                          <div 
                            className="w-56 p-3 bg-blue-100 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => setSelectedPerson(director)}
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-semibold text-blue-800">{director.name}</h4>
                              <p className="text-xs text-blue-700">{director.position}</p>
                              <p className="text-xs text-blue-600">{director.department}</p>
                            </div>
                          </div>
                          
                          {/* Flecha hacia supervisores */}
                          {director.reports > 0 && (
                            <div className="mt-2">
                              <ArrowDown className="w-4 h-4 text-gray-400 mx-auto" />
                              <p className="text-xs text-gray-500 text-center">{director.reports} reportes</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Supervisores */}
                    <div className="grid grid-cols-3 gap-4">
                      {orgChartData.managers.map((manager) => (
                        <div key={manager.id} className="flex flex-col items-center">
                          <div 
                            className="w-48 p-3 bg-green-100 border-2 border-green-500 rounded-lg cursor-pointer hover:bg-green-200 transition-colors"
                            onClick={() => setSelectedPerson(manager)}
                          >
                            <div className="text-center">
                              <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="font-medium text-green-800">{manager.name}</h4>
                              <p className="text-xs text-green-700">{manager.position}</p>
                              <p className="text-xs text-green-600">{manager.department}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalles de Persona */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-700">Detalles del Personal</CardTitle>
                  <CardDescription>
                    Información detallada del empleado seleccionado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">{selectedPerson.name}</h3>
                    <p className="text-emerald-600 font-medium">{selectedPerson.position}</p>
                    <p className="text-sm text-gray-600">{selectedPerson.department}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedPerson.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedPerson.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedPerson.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Desde: {selectedPerson.startDate}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Competencias</h4>
                    <div className="space-y-1">
                      {selectedPerson.competencies.map((competency, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {competency}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Responsabilidades</h4>
                    <div className="space-y-1">
                      {selectedPerson.responsibilities.map((responsibility, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {responsibility}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Procesos ISO */}
        <TabsContent value="processes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Mapa de Procesos ISO 9001:2015</CardTitle>
              <CardDescription>
                Procesos del sistema de gestión de calidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {processData.map((process) => (
                  <Card key={process.id} className="border-l-4 border-emerald-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getProcessTypeIcon(process.type)}
                          <CardTitle className="text-lg">{process.name}</CardTitle>
                        </div>
                        <Badge className={getProcessTypeColor(process.type)}>
                          {process.type}
                        </Badge>
                      </div>
                      <CardDescription>
                        Cláusula ISO: {process.isoClause} | Responsable: {process.responsible}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{process.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Entradas</h5>
                          <div className="space-y-1">
                            {process.inputs.map((input, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                <ArrowRight className="w-3 h-3" />
                                <span>{input}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-2">Salidas</h5>
                          <div className="space-y-1">
                            {process.outputs.map((output, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                <ArrowRight className="w-3 h-3" />
                                <span>{output}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Indicadores</h5>
                        <div className="space-y-2">
                          {process.indicators.map((indicator, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{indicator.name}</span>
                                <span>{indicator.current}{indicator.unit} / {indicator.target}{indicator.unit}</span>
                              </div>
                              <Progress value={(indicator.current / indicator.target) * 100} className="h-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Responsabilidades */}
        <TabsContent value="responsibilities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Matriz de Responsabilidades</CardTitle>
              <CardDescription>
                Asignación de responsabilidades por proceso ISO 9001
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left font-medium">Proceso</th>
                      <th className="border p-3 text-center font-medium">Responsable</th>
                      <th className="border p-3 text-center font-medium">Colaborador</th>
                      <th className="border p-3 text-center font-medium">Consultado</th>
                      <th className="border p-3 text-center font-medium">Informado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processData.map((process) => (
                      <tr key={process.id} className="hover:bg-gray-50">
                        <td className="border p-3 text-sm font-medium">{process.name}</td>
                        <td className="border p-3 text-center">
                          <Badge className="bg-red-100 text-red-800">R</Badge>
                        </td>
                        <td className="border p-3 text-center">
                          <Badge className="bg-blue-100 text-blue-800">C</Badge>
                        </td>
                        <td className="border p-3 text-center">
                          <Badge className="bg-green-100 text-green-800">A</Badge>
                        </td>
                        <td className="border p-3 text-center">
                          <Badge className="bg-gray-100 text-gray-800">I</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Leyenda</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">R</Badge>
                    <span className="text-sm">Responsable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">C</Badge>
                    <span className="text-sm">Colaborador</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">A</Badge>
                    <span className="text-sm">Consultado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-800">I</Badge>
                    <span className="text-sm">Informado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

