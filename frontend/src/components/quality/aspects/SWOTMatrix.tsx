'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Plus, 
  Edit, 
  Trash2,
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Datos de ejemplo para FODA
const swotData = {
  strengths: [
    { 
      id: 1, 
      description: 'Experiencia de 15 años en el sector agrícola', 
      impact: 'high', 
      probability: 'high',
      category: 'recursos',
      actionPlan: 'Mantener y fortalecer experiencia del equipo',
      responsible: 'Director General',
      dueDate: '2024-03-01'
    },
    { 
      id: 2, 
      description: 'Personal altamente capacitado en control de calidad', 
      impact: 'high', 
      probability: 'medium',
      category: 'recursos-humanos',
      actionPlan: 'Programa de capacitación continua',
      responsible: 'Director RRHH',
      dueDate: '2024-02-15'
    },
    { 
      id: 3, 
      description: 'Relaciones sólidas con proveedores estratégicos', 
      impact: 'medium', 
      probability: 'high',
      category: 'relaciones',
      actionPlan: 'Renovar contratos a largo plazo',
      responsible: 'Director Compras',
      dueDate: '2024-04-01'
    }
  ],
  weaknesses: [
    { 
      id: 1, 
      description: 'Dependencia de pocos clientes grandes', 
      impact: 'high', 
      probability: 'high',
      category: 'mercado',
      actionPlan: 'Diversificar cartera de clientes',
      responsible: 'Director Comercial',
      dueDate: '2024-06-01'
    },
    { 
      id: 2, 
      description: 'Falta de automatización en procesos de control', 
      impact: 'medium', 
      probability: 'medium',
      category: 'tecnologia',
      actionPlan: 'Implementar sistema de gestión automatizado',
      responsible: 'Director IT',
      dueDate: '2024-08-01'
    },
    { 
      id: 3, 
      description: 'Limitada presencia en mercados digitales', 
      impact: 'medium', 
      probability: 'high',
      category: 'mercado',
      actionPlan: 'Desarrollar plataforma de ventas online',
      responsible: 'Director Marketing',
      dueDate: '2024-05-01'
    }
  ],
  opportunities: [
    { 
      id: 1, 
      description: 'Expansión a nuevos mercados regionales', 
      impact: 'high', 
      probability: 'medium',
      category: 'mercado',
      actionPlan: 'Estudio de mercado y plan de expansión',
      responsible: 'Director Comercial',
      dueDate: '2024-07-01'
    },
    { 
      id: 2, 
      description: 'Desarrollo de productos orgánicos y sostenibles', 
      impact: 'medium', 
      probability: 'high',
      category: 'productos',
      actionPlan: 'Investigación y desarrollo de línea orgánica',
      responsible: 'Director I+D',
      dueDate: '2024-09-01'
    },
    { 
      id: 3, 
      description: 'Alianzas estratégicas con cooperativas agrícolas', 
      impact: 'high', 
      probability: 'medium',
      category: 'alianzas',
      actionPlan: 'Negociación de acuerdos marco',
      responsible: 'Director General',
      dueDate: '2024-06-15'
    }
  ],
  threats: [
    { 
      id: 1, 
      description: 'Cambios en regulaciones ambientales', 
      impact: 'high', 
      probability: 'medium',
      category: 'regulatorio',
      actionPlan: 'Monitoreo regulatorio y adaptación proactiva',
      responsible: 'Director Legal',
      dueDate: '2024-04-01'
    },
    { 
      id: 2, 
      description: 'Competencia de empresas multinacionales', 
      impact: 'medium', 
      probability: 'high',
      category: 'competencia',
      actionPlan: 'Diferenciación por calidad y servicio',
      responsible: 'Director Estratégico',
      dueDate: '2024-03-01'
    },
    { 
      id: 3, 
      description: 'Volatilidad en precios de materias primas', 
      impact: 'high', 
      probability: 'high',
      category: 'economico',
      actionPlan: 'Estrategia de cobertura y contratos a plazo',
      responsible: 'Director Financiero',
      dueDate: '2024-02-28'
    }
  ]
};

const stakeholderAnalysis = [
  { name: 'Clientes Agricultores', influence: 'high', interest: 'high', strategy: 'Mantener satisfacción' },
  { name: 'Proveedores', influence: 'medium', interest: 'high', strategy: 'Relaciones estratégicas' },
  { name: 'Reguladores', influence: 'high', interest: 'medium', strategy: 'Cumplimiento proactivo' },
  { name: 'Competidores', influence: 'medium', interest: 'low', strategy: 'Diferenciación' },
  { name: 'Empleados', influence: 'medium', interest: 'high', strategy: 'Desarrollo y retención' }
];

export function SWOTMatrix() {
  const [activeTab, setActiveTab] = useState('matrix');

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recursos': return <Building2 className="w-4 h-4" />;
      case 'recursos-humanos': return <Users className="w-4 h-4" />;
      case 'mercado': return <Globe className="w-4 h-4" />;
      case 'tecnologia': return <TrendingUp className="w-4 h-4" />;
      case 'regulatorio': return <AlertTriangle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const SWOTCard = ({ title, items, color, icon }: { title: string; items: any[]; color: string; icon: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle className={`${color} flex items-center gap-2`}>
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {items.length} elementos identificados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`p-3 rounded-lg border-l-4 ${color.replace('text-', 'border-')}`}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium flex-1">{item.description}</p>
              <div className="flex gap-1 ml-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(item.category)}
              <span className="text-xs text-gray-500 capitalize">{item.category}</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <Badge className={getImpactColor(item.impact)} variant="outline">
                Impacto: {item.impact}
              </Badge>
              <Badge className={getProbabilityColor(item.probability)} variant="outline">
                Probabilidad: {item.probability}
              </Badge>
            </div>
            
            {item.actionPlan && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <strong>Plan de Acción:</strong> {item.actionPlan}
                <div className="mt-1 text-gray-600">
                  <span>Responsable: {item.responsible}</span> | 
                  <span> Vence: {item.dueDate}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Agregar {title.slice(0, -1)}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis FODA</h1>
          <p className="text-gray-600">Análisis de Fortalezas, Oportunidades, Debilidades y Amenazas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Análisis Estratégico
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Elemento
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matrix">Matriz FODA</TabsTrigger>
          <TabsTrigger value="stakeholders">Partes Interesadas</TabsTrigger>
          <TabsTrigger value="strategic">Plan Estratégico</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Contexto</TabsTrigger>
        </TabsList>

        {/* Matriz FODA */}
        <TabsContent value="matrix" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SWOTCard
              title="Fortalezas"
              items={swotData.strengths}
              color="text-green-700"
              icon={<CheckCircle className="w-5 h-5" />}
            />
            
            <SWOTCard
              title="Debilidades"
              items={swotData.weaknesses}
              color="text-red-700"
              icon={<AlertTriangle className="w-5 h-5" />}
            />
            
            <SWOTCard
              title="Oportunidades"
              items={swotData.opportunities}
              color="text-blue-700"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            
            <SWOTCard
              title="Amenazas"
              items={swotData.threats}
              color="text-orange-700"
              icon={<AlertTriangle className="w-5 h-5" />}
            />
          </div>
        </TabsContent>

        {/* Partes Interesadas */}
        <TabsContent value="stakeholders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Análisis de Partes Interesadas</CardTitle>
              <CardDescription>
                Mapeo de influencia e interés de stakeholders clave
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stakeholderAnalysis.map((stakeholder, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{stakeholder.name}</h4>
                      <div className="flex gap-2">
                        <Badge className={stakeholder.influence === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          Influencia: {stakeholder.influence}
                        </Badge>
                        <Badge className={stakeholder.interest === 'high' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          Interés: {stakeholder.interest}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Estrategia:</strong> {stakeholder.strategy}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Estratégico */}
        <TabsContent value="strategic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Objetivos Estratégicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800">Maximizar Fortalezas</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Aprovechar experiencia y relaciones para crecimiento sostenible
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800">Capitalizar Oportunidades</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Expansión a nuevos mercados y desarrollo de productos
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-800">Minimizar Debilidades</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Diversificación y automatización de procesos
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800">Mitigar Amenazas</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitoreo regulatorio y diferenciación competitiva
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Plan de Acción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { action: 'Diversificar cartera de clientes', priority: 'Alta', progress: 25 },
                    { action: 'Implementar automatización', priority: 'Media', progress: 60 },
                    { action: 'Desarrollar productos orgánicos', priority: 'Alta', progress: 40 },
                    { action: 'Expandir a nuevos mercados', priority: 'Media', progress: 15 }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.action}</span>
                        <Badge className={item.priority === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{item.progress}% completado</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análisis de Contexto */}
        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Contexto Interno</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Recursos Humanos</h4>
                  <p className="text-sm text-gray-600">Personal capacitado, experiencia sectorial</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Procesos</h4>
                  <p className="text-sm text-gray-600">Procesos establecidos, ISO 9001 certificado</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Tecnología</h4>
                  <p className="text-sm text-gray-600">Sistemas básicos, oportunidades de mejora</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Finanzas</h4>
                  <p className="text-sm text-gray-600">Situación estable, capacidad de inversión</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Contexto Externo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Mercado</h4>
                  <p className="text-sm text-gray-600">Demanda creciente, competencia intensa</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Regulatorio</h4>
                  <p className="text-sm text-gray-600">Normativas ambientales, certificaciones</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Económico</h4>
                  <p className="text-sm text-gray-600">Volatilidad precios, inflación</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Social</h4>
                  <p className="text-sm text-gray-600">Sostenibilidad, productos orgánicos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

