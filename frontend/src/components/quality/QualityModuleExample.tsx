'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Target, 
  Calendar, 
  Building2,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  BarChart3,
  Grid3X3,
  Bell,
  ClipboardCheck,
  MoreHorizontal
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Datos de ejemplo para AMFE
const amfeData = [
  { 
    id: 1,
    process: 'Recepción de Fertilizantes',
    failure: 'Contaminación del producto',
    effects: 'Producto no conforme',
    causes: 'Almacenamiento inadecuado',
    controls: 'Inspección visual',
    severity: 8,
    occurrence: 3,
    detection: 6,
    rpn: 144,
    actions: 'Implementar control de temperatura',
    responsible: 'Supervisor Almacén',
    status: 'in-progress'
  },
  {
    id: 2,
    process: 'Embalaje de Semillas',
    failure: 'Etiquetado incorrecto',
    effects: 'Confusión del cliente',
    causes: 'Error humano',
    controls: 'Verificación doble',
    severity: 6,
    occurrence: 4,
    detection: 7,
    rpn: 168,
    actions: 'Capacitación del personal',
    responsible: 'Jefe de Producción',
    status: 'pending'
  }
];

// Datos de ejemplo para reuniones
const meetings = [
  {
    id: 1,
    title: 'Revisión Mensual de Calidad - Enero 2024',
    date: '2024-01-15',
    type: 'quality-review',
    participants: 8,
    status: 'completed',
    actionItems: 5,
    completed: 4
  },
  {
    id: 2,
    title: 'Análisis AMFE - Proceso de Embalaje',
    date: '2024-01-20',
    type: 'amfe-analysis',
    participants: 6,
    status: 'scheduled',
    actionItems: 3,
    completed: 0
  }
];

// Datos de ejemplo para FODA
const swotData = {
  strengths: [
    { id: 1, description: 'Experiencia de 15 años en el sector agrícola', impact: 'high', probability: 'high' },
    { id: 2, description: 'Personal altamente capacitado', impact: 'high', probability: 'medium' },
    { id: 3, description: 'Relaciones sólidas con proveedores', impact: 'medium', probability: 'high' }
  ],
  weaknesses: [
    { id: 1, description: 'Dependencia de pocos clientes grandes', impact: 'high', probability: 'high' },
    { id: 2, description: 'Falta de automatización en procesos', impact: 'medium', probability: 'medium' }
  ],
  opportunities: [
    { id: 1, description: 'Expansión a nuevos mercados regionales', impact: 'high', probability: 'medium' },
    { id: 2, description: 'Desarrollo de productos orgánicos', impact: 'medium', probability: 'high' }
  ],
  threats: [
    { id: 1, description: 'Cambios en regulaciones ambientales', impact: 'high', probability: 'medium' },
    { id: 2, description: 'Competencia de empresas multinacionales', impact: 'medium', probability: 'high' }
  ]
};

export default function QualityModuleExample() {
  const [activeTab, setActiveTab] = useState('policy');
  const [viewMode, setViewMode] = useState('cards');

  const getRPNColor = (rpn: number) => {
    if (rpn >= 150) return 'bg-red-100 text-red-800';
    if (rpn >= 100) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Módulo Calidad</h1>
              <p className="text-xs text-slate-400">ISO 9001:2015</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-800 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="text-sm">Notificaciones</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-800 transition-colors">
            <Grid3X3 className="w-5 h-5" />
            <span className="text-sm">Tablero Central</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Gestión de Calidad ISO 9001
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión integral de calidad, AMFE, análisis organizacional y procesos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Registro
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Buscar políticas, AMFE, reuniones..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100 rounded-lg">
                <TabsTrigger
                  value="policy"
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4" />
                  Política de Calidad
                </TabsTrigger>
                <TabsTrigger
                  value="amfe"
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Análisis AMFE
                </TabsTrigger>
                <TabsTrigger
                  value="swot"
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  <TrendingUp className="w-4 h-4" />
                  Análisis FODA
                </TabsTrigger>
                <TabsTrigger
                  value="meetings"
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  <Calendar className="w-4 h-4" />
                  Reuniones
                </TabsTrigger>
                <TabsTrigger
                  value="organization"
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  <Building2 className="w-4 h-4" />
                  Organigrama
                </TabsTrigger>
              </TabsList>

              {/* Política de Calidad */}
              <TabsContent value="policy" className="mt-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-emerald-700">Política de Calidad</CardTitle>
                      <CardDescription>
                        Versión 2.1 - Última actualización: 15 de Enero, 2024
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
                        <h3 className="font-semibold text-emerald-800 mb-3">Compromiso con la Excelencia</h3>
                        <p className="text-gray-700 mb-4">
                          "Los Señores del Agro" se compromete a ser el proveedor líder de fertilizantes, semillas y
                          servicios logísticos de alta calidad para el sector agrícola, implementando un Sistema de
                          Gestión de Calidad basado en ISO 9001:2015.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-emerald-700">Objetivos de Calidad:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• Satisfacción del cliente ≥ 95%</li>
                              <li>• Productos conformes ≥ 98%</li>
                              <li>• Tiempo de entrega ≤ 24 horas</li>
                              <li>• Mejora continua de procesos</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-emerald-700">Compromisos:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• Cumplimiento normativo</li>
                              <li>• Desarrollo del personal</li>
                              <li>• Responsabilidad social</li>
                              <li>• Mejora continua</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Nueva Versión
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Análisis AMFE */}
              <TabsContent value="amfe" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-emerald-700">Análisis Modal de Fallos y Efectos (AMFE)</CardTitle>
                      <CardDescription>
                        Identificación y gestión de riesgos en procesos críticos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-3 text-left font-medium">Proceso</th>
                              <th className="border p-3 text-left font-medium">Fallo Potencial</th>
                              <th className="border p-3 text-left font-medium">S</th>
                              <th className="border p-3 text-left font-medium">O</th>
                              <th className="border p-3 text-left font-medium">D</th>
                              <th className="border p-3 text-left font-medium">RPN</th>
                              <th className="border p-3 text-left font-medium">Acciones</th>
                              <th className="border p-3 text-left font-medium">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {amfeData.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border p-3 text-sm">{item.process}</td>
                                <td className="border p-3 text-sm">{item.failure}</td>
                                <td className="border p-3 text-center">{item.severity}</td>
                                <td className="border p-3 text-center">{item.occurrence}</td>
                                <td className="border p-3 text-center">{item.detection}</td>
                                <td className="border p-3 text-center">
                                  <Badge className={getRPNColor(item.rpn)}>
                                    {item.rpn}
                                  </Badge>
                                </td>
                                <td className="border p-3 text-sm">{item.actions}</td>
                                <td className="border p-3">
                                  <Badge className={getStatusColor(item.status)}>
                                    {item.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Análisis FODA */}
              <TabsContent value="swot" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700">Fortalezas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotData.strengths.map((item) => (
                        <div key={item.id} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <p className="text-sm font-medium text-green-800">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Impacto: {item.impact}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Probabilidad: {item.probability}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700">Debilidades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotData.weaknesses.map((item) => (
                        <div key={item.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                          <p className="text-sm font-medium text-red-800">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Impacto: {item.impact}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Probabilidad: {item.probability}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">Oportunidades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotData.opportunities.map((item) => (
                        <div key={item.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <p className="text-sm font-medium text-blue-800">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Impacto: {item.impact}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Probabilidad: {item.probability}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-orange-700">Amenazas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotData.threats.map((item) => (
                        <div key={item.id} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <p className="text-sm font-medium text-orange-800">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Impacto: {item.impact}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Probabilidad: {item.probability}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reuniones */}
              <TabsContent value="meetings" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-emerald-700">Gestión de Reuniones</CardTitle>
                      <CardDescription>
                        Planificación, seguimiento y minutas de reuniones de calidad
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {meetings.map((meeting) => (
                          <div key={meeting.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{meeting.title}</h3>
                                  <p className="text-sm text-gray-600">{meeting.date}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">{meeting.participants} participantes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">{meeting.completed}/{meeting.actionItems} acuerdos</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(meeting.status)}>
                                  {meeting.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Generar minuta</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Organigrama */}
              <TabsContent value="organization" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-emerald-700">Organigrama</CardTitle>
                      <CardDescription>
                        Estructura organizacional y responsabilidades
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                          <h4 className="font-semibold text-emerald-800">Director General</h4>
                          <p className="text-sm text-gray-600">Juan Pérez</p>
                        </div>
                        <div className="ml-8 space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <h5 className="font-medium text-blue-800">Director de Calidad</h5>
                            <p className="text-sm text-gray-600">María García</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                            <h5 className="font-medium text-purple-800">Director de Operaciones</h5>
                            <p className="text-sm text-gray-600">Carlos López</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-emerald-700">Mapa de Procesos ISO 9001</CardTitle>
                      <CardDescription>
                        Relación entre procesos del sistema de gestión
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <h5 className="font-medium">Procesos de Dirección</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-emerald-100 rounded text-center text-sm">
                              Gestión de Riesgos
                            </div>
                            <div className="p-2 bg-emerald-100 rounded text-center text-sm">
                              Revisión por la Dirección
                            </div>
                          </div>
                          <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <h5 className="font-medium">Procesos Operacionales</h5>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-blue-100 rounded text-center text-sm">
                              Compras
                            </div>
                            <div className="p-2 bg-blue-100 rounded text-center text-sm">
                              Producción
                            </div>
                            <div className="p-2 bg-blue-100 rounded text-center text-sm">
                              Entrega
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
