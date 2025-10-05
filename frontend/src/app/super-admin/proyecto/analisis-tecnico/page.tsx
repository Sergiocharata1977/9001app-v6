'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Building2,
  Globe,
  ArrowLeft,
  ArrowRight,
  Zap,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function AnalisisTecnicoPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  // Datos del análisis FODA
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

  // Roadmap de fases
  const roadmapFases = [
    {
      fase: 'Fase 1 - MVP Realista',
      duracion: '2-4 semanas',
      objetivo: 'Funcionalidades básicas para lanzamiento',
      color: 'bg-red-100 text-red-800 border-red-300',
      elementos: [
        'Auth básico NextAuth',
        'CRUD esencial',
        'Deploy Vercel simple',
        'UI funcional mínima'
      ],
      recomendaciones: [
        'MVP CRÍTICO: Auth simple (3-5 días) ❌ No OAuth complejo',
        'MVP CRÍTICO: Deploy Vercel directo (1-2 días) ❌ No pipelines complejos',
        'MVP FUNCIONAL: BD mínima 4-5 colecciones ❌ No 64+ modelos'
      ]
    },
    {
      fase: 'Fase 2 - Control & Escalabilidad',
      duracion: '4-8 semanas',
      objetivo: 'Mejoras de control y escalabilidad',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      elementos: [
        'Roles y permisos',
        'UI avanzada drag & drop',
        'CI/CD automatizado',
        'Métricas y logs'
      ],
      recomendaciones: [
        'VERSIÓN 2.0: Don Cándido básico ❌ No entrenamiento custom inicial',
        'Implementar sistema de roles robusto',
        'Dashboard avanzado con métricas'
      ]
    },
    {
      fase: 'Fase 3 - IA Avanzada',
      duracion: '6-12 semanas',
      objetivo: 'Inteligencia artificial y funcionalidades avanzadas',
      color: 'bg-green-100 text-green-800 border-green-300',
      elementos: [
        'Don Cándido entrenamiento específico',
        'Analytics IA',
        'Integraciones complejas',
        'Microservicios'
      ],
      recomendaciones: [
        'Entrenamiento específico de Don Cándido',
        'Analytics avanzados con IA',
        'Arquitectura de microservicios'
      ]
    }
  ];

  // Sprint de próximos 7 días
  const sprintProximos7Dias = [
    { dia: 'Día 1-2', tarea: 'NextAuth implementación', responsable: 'Dev Team', estado: 'pendiente' },
    { dia: 'Día 3-4', tarea: 'Deploy Vercel production', responsable: 'DevOps', estado: 'pendiente' },
    { dia: 'Día 5-6', tarea: 'Testing componentes clave', responsable: 'QA Team', estado: 'pendiente' },
    { dia: 'Día 7', tarea: 'Demo funcional preparado', responsable: 'Product Owner', estado: 'pendiente' }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
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
        <p className="text-sm text-gray-600">
          {items.length} elementos identificados
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-lg border-l-4 border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium flex-1">{item.description}</p>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(item.category)}
              <span className="text-xs text-gray-500 capitalize">{item.category}</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <Badge className={getImpactColor(item.impact)} variant="outline">
                Impacto: {item.impact}
              </Badge>
              <Badge className={getImpactColor(item.probability)} variant="outline">
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
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/super-admin/proyecto">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis Técnico-Funcional</h1>
          <p className="text-gray-600">Análisis FODA completo con priorización MVP vs versión completa</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumen">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="foda">Análisis FODA</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="sprint">Sprint MVP</TabsTrigger>
        </TabsList>

        {/* Resumen Ejecutivo */}
        <TabsContent value="resumen" className="mt-6">
          <div className="space-y-6">
            {/* Reflexión MVP vs Versión Completa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Reflexión MVP vs Versión Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Lo bueno del análisis</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Estructura FODA clara</li>
                      <li>• Puntos críticos identificados</li>
                      <li>• Análisis de contexto organizacional</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Lo excesivo para MVP</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Seguridad compleja</li>
                      <li>• CI/CD avanzado</li>
                      <li>• Dashboards sofisticados</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">🎯 Conclusión</h4>
                  <p className="text-sm text-blue-700">
                    Filtrado por prioridad MVP necesario. Enfoque en funcionalidades esenciales para lanzamiento.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Métricas del Proyecto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Métricas Actuales del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">75%</div>
                    <div className="text-sm text-blue-800">MVP</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">90%</div>
                    <div className="text-sm text-green-800">ISO</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">25%</div>
                    <div className="text-sm text-yellow-800">Testing</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">60%</div>
                    <div className="text-sm text-purple-800">Docs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análisis FODA */}
        <TabsContent value="foda" className="mt-6">
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

        {/* Roadmap */}
        <TabsContent value="roadmap" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Roadmap Ejecutivo - 3 Fases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {roadmapFases.map((fase, index) => (
                    <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{fase.fase}</h3>
                          <p className="text-emerald-600 font-semibold flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {fase.duracion}
                          </p>
                        </div>
                        <Badge className={fase.color}>
                          Fase {index + 1}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Objetivo:</h4>
                        <p className="text-gray-700">{fase.objetivo}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Elementos Clave:</h4>
                        <ul className="space-y-1">
                          {fase.elementos.map((elemento, elIndex) => (
                            <li key={elIndex} className="text-sm text-gray-700 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              {elemento}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones:</h4>
                        <ul className="space-y-1">
                          {fase.recomendaciones.map((recomendacion, recIndex) => (
                            <li key={recIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              {recomendacion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sprint MVP */}
        <TabsContent value="sprint" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Próximos 7 días - Sprint MVP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sprintProximos7Dias.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {item.dia}
                        </Badge>
                        <h4 className="font-semibold text-gray-900">{item.tarea}</h4>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {item.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Responsable: {item.responsable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



