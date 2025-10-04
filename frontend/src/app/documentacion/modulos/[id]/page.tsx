'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Target,
  Users,
  Workflow,
  FileText,
  BarChart3,
  Shield,
  Briefcase,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  TrendingUp,
  BookOpen,
  Settings,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ModuloDetallePage() {
  const params = useParams();
  const moduloId = params.id as string;
  const [activeTab, setActiveTab] = useState('objetivo');

  // Datos de los módulos (en un proyecto real vendría de una API)
  const modulosData = {
    'procesos': {
      id: 'procesos',
      nombre: 'Gestión de Procesos',
      codigo: 'MOD-001',
      icono: <Workflow className="w-8 h-8" />,
      objetivo: 'Definir, documentar y gestionar todos los procesos de la organización según ISO 9001:2015, permitiendo su trazabilidad y mejora continua.',
      alcance: 'Incluye la definición de procesos, subprocesos, responsables, documentación asociada y vinculación con objetivos de calidad. No incluye la ejecución de auditorías (módulo separado).',
      progreso: 85,
      estado: 'excelente',
      prioridad: 'critica',
      funcionalidades: [
        {
          nombre: 'ABM de Procesos',
          descripcion: 'Alta, Baja y Modificación de procesos',
          estado: 'implementado',
          prioridad: 'critica'
        },
        {
          nombre: 'Asignación de Responsables',
          descripcion: 'Vinculación de usuarios con procesos específicos',
          estado: 'implementado',
          prioridad: 'critica'
        },
        {
          nombre: 'Control de Versiones',
          descripcion: 'Versionado de documentación de procesos',
          estado: 'implementado',
          prioridad: 'alta'
        },
        {
          nombre: 'Vinculación con Objetivos',
          descripcion: 'Relación entre procesos y objetivos de calidad',
          estado: 'implementado',
          prioridad: 'alta'
        },
        {
          nombre: 'Dashboard de Procesos',
          descripcion: 'Visualización del estado de todos los procesos',
          estado: 'implementado',
          prioridad: 'media'
        }
      ],
      entregables: [
        'Base de datos de procesos documentados',
        'Matriz de responsabilidades por proceso',
        'Reportes de cumplimiento de objetivos',
        'Dashboard de procesos activos',
        'Exportación a PDF/Excel'
      ],
      dependencias: [
        { modulo: 'Documentos', tipo: 'requiere', descripcion: 'Para almacenar documentación de procesos' },
        { modulo: 'Objetivos', tipo: 'requiere', descripcion: 'Para vincular procesos con objetivos' },
        { modulo: 'RRHH', tipo: 'opcional', descripcion: 'Para asignar responsables' }
      ],
      estadoActual: {
        backend: 'Completado - MongoDB con esquemas normalizados',
        frontend: 'Completado - Interfaz de usuario funcional',
        integracion: 'Completado - API REST implementada',
        testing: 'En progreso - Pruebas de integración'
      },
      gaps: [
        {
          item: 'Integración con módulo de Indicadores',
          prioridad: 'alta',
          esfuerzo: '2 semanas',
          descripcion: 'Falta conectar procesos con indicadores de calidad'
        },
        {
          item: 'Exportación avanzada de reportes',
          prioridad: 'media',
          esfuerzo: '1 semana',
          descripcion: 'Mejorar formatos de exportación PDF/Excel'
        },
        {
          item: 'Notificaciones automáticas',
          prioridad: 'baja',
          esfuerzo: '1 semana',
          descripcion: 'Alertas por vencimiento de procesos'
        }
      ],
      indicadores: [
        { nombre: '% de procesos documentados', valor: 85, objetivo: 100, unidad: '%' },
        { nombre: 'Procesos con responsables asignados', valor: 12, objetivo: 15, unidad: 'procesos' },
        { nombre: 'Tiempo promedio de documentación', valor: 3, objetivo: 2, unidad: 'días' }
      ],
      puntosControl: [
        'Validación de campos obligatorios en creación de procesos',
        'Verificación de permisos para modificación',
        'Control de versiones automático',
        'Validación de vinculaciones con objetivos'
      ],
      factoresCriticos: [
        'Disponibilidad de la base de datos MongoDB',
        'Rendimiento de consultas complejas',
        'Integridad de datos relacionales',
        'Seguridad en acceso a documentos'
      ]
    },
    'auditorias': {
      id: 'auditorias',
      nombre: 'Sistema de Auditorías',
      codigo: 'MOD-002',
      icono: <Search className="w-8 h-8" />,
      objetivo: 'Gestionar auditorías internas y externas con seguimiento completo de hallazgos y acciones correctivas.',
      alcance: 'Incluye programación, ejecución, registro de hallazgos y seguimiento. No incluye la gestión de personal auditor (módulo RRHH).',
      progreso: 90,
      estado: 'excelente',
      prioridad: 'critica',
      funcionalidades: [
        {
          nombre: 'Programación de Auditorías',
          descripcion: 'Cronograma y planificación de auditorías',
          estado: 'implementado',
          prioridad: 'critica'
        },
        {
          nombre: 'Checklist de Verificación',
          descripcion: 'Listas de verificación por proceso',
          estado: 'implementado',
          prioridad: 'critica'
        },
        {
          nombre: 'Registro de Hallazgos',
          descripcion: 'Captura y clasificación de hallazgos',
          estado: 'implementado',
          prioridad: 'critica'
        },
        {
          nombre: 'Seguimiento de Acciones',
          descripcion: 'Monitoreo de acciones correctivas',
          estado: 'implementado',
          prioridad: 'alta'
        }
      ],
      entregables: [
        'Cronograma de auditorías',
        'Reportes de hallazgos',
        'Plan de acciones correctivas',
        'Certificados de cumplimiento'
      ],
      dependencias: [
        { modulo: 'Procesos', tipo: 'requiere', descripcion: 'Para auditar procesos definidos' },
        { modulo: 'Documentos', tipo: 'requiere', descripcion: 'Para evidencia documental' }
      ],
      estadoActual: {
        backend: 'Completado - Modelos y controladores implementados',
        frontend: 'Completado - Interfaz de usuario funcional',
        integracion: 'Completado - API REST implementada',
        testing: 'Completado - Pruebas realizadas'
      },
      gaps: [
        {
          item: 'Integración con módulo de Mejoras',
          prioridad: 'alta',
          esfuerzo: '1 semana',
          descripcion: 'Automatizar creación de acciones desde hallazgos'
        }
      ],
      indicadores: [
        { nombre: '% de auditorías programadas', valor: 100, objetivo: 100, unidad: '%' },
        { nombre: 'Hallazgos por auditoría', valor: 3.2, objetivo: 2, unidad: 'hallazgos' },
        { nombre: 'Tiempo de cierre de hallazgos', valor: 15, objetivo: 10, unidad: 'días' }
      ],
      puntosControl: [
        'Validación de fechas de auditoría',
        'Verificación de procesos a auditar',
        'Control de acceso a hallazgos',
        'Validación de acciones correctivas'
      ],
      factoresCriticos: [
        'Disponibilidad de procesos para auditar',
        'Calidad de la documentación',
        'Competencia de los auditores',
        'Tiempo de respuesta en correcciones'
      ]
    }
  };

  const modulo = modulosData[moduloId as keyof typeof modulosData];

  if (!modulo) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo no encontrado</h2>
          <p className="text-gray-600 mb-6">El módulo solicitado no existe o no está disponible.</p>
          <Link href="/documentacion/objetivos">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Objetivos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'implementado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/documentacion/objetivos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            {modulo.icono}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{modulo.nombre}</h1>
            <p className="text-gray-600">Código: {modulo.codigo}</p>
          </div>
        </div>
        
        {/* Progreso del Módulo */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Progreso del Módulo</h2>
              <div className="flex gap-2">
                <Badge className={getPrioridadColor(modulo.prioridad)}>
                  {modulo.prioridad.toUpperCase()}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {modulo.progreso}%
                </Badge>
              </div>
            </div>
            <Progress value={modulo.progreso} className="mb-4" />
            <p className="text-sm text-gray-600">{modulo.objetivo}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Navegación */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('objetivo')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'objetivo' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Objetivo
          </button>
          <button
            onClick={() => setActiveTab('funcionalidades')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'funcionalidades' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Funcionalidades
          </button>
          <button
            onClick={() => setActiveTab('estado')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'estado' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Estado Actual
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'gaps' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gaps
          </button>
          <button
            onClick={() => setActiveTab('indicadores')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'indicadores' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Indicadores
          </button>
        </div>
      </div>

      {/* Contenido de Tabs */}
      {activeTab === 'objetivo' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivo del Módulo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">¿Qué busca lograr?</h3>
                  <p className="text-gray-700 leading-relaxed">{modulo.objetivo}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alcance</h3>
                  <p className="text-gray-700 leading-relaxed">{modulo.alcance}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Entregables Esperados</h3>
                  <ul className="space-y-2">
                    {modulo.entregables.map((entregable, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{entregable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {modulo.dependencias.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Dependencias</h3>
                    <div className="space-y-2">
                      {modulo.dependencias.map((dep, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                          <LinkIcon className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{dep.modulo}</span>
                          <Badge variant="outline">{dep.tipo}</Badge>
                          <span className="text-sm text-gray-600">{dep.descripcion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'funcionalidades' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Funcionalidades del Módulo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modulo.funcionalidades.map((func, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{func.nombre}</h4>
                        <p className="text-sm text-gray-600">{func.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getPrioridadColor(func.prioridad)}>
                        {func.prioridad.toUpperCase()}
                      </Badge>
                      <Badge className={getEstadoColor(func.estado)}>
                        {func.estado.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'estado' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estado Actual del Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(modulo.estadoActual).map(([area, estado]) => (
                  <div key={area} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                      {area.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-gray-600">{estado}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Análisis de Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modulo.gaps.map((gap, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{gap.item}</h4>
                      <div className="flex gap-2">
                        <Badge className={getPrioridadColor(gap.prioridad)}>
                          {gap.prioridad.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{gap.esfuerzo}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{gap.descripcion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'indicadores' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Indicadores de Avance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modulo.indicadores.map((indicador, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{indicador.nombre}</h4>
                      <div className="text-sm text-gray-600">
                        {indicador.valor} {indicador.unidad} / {indicador.objetivo} {indicador.unidad}
                      </div>
                    </div>
                    <Progress 
                      value={(indicador.valor / indicador.objetivo) * 100} 
                      className="mb-2" 
                    />
                    <div className="text-xs text-gray-500">
                      Progreso: {Math.round((indicador.valor / indicador.objetivo) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Puntos de Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {modulo.puntosControl.map((punto, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">{punto}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Factores Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {modulo.factoresCriticos.map((factor, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

