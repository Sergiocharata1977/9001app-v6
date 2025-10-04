'use client'

import { motion } from 'framer-motion'
import {
  Workflow,
  FileText,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Code,
  Database,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
  Shield
} from 'lucide-react'

export default function RoadmapABMCriticos() {
  const abmCriticos = [
    {
      id: 1,
      nombre: 'Procesos',
      descripcion: 'Sistema completo de gestión de procesos que FUNCIONE correctamente',
      prioridad: 'CRÍTICA',
      estado: 'en-desarrollo',
      progreso: 65,
      icono: Workflow,
      color: 'emerald',
      aspectos: [
        {
          titulo: 'Definición de Procesos',
          descripcion: 'CRUD completo de procesos con todas sus propiedades',
          elementos: [
            'Crear proceso nuevo',
            'Editar proceso existente',
            'Eliminar proceso',
            'Listar procesos por organización',
            'Filtros y búsqueda',
            'Ordenamiento dinámico'
          ],
          estado: 'funcional'
        },
        {
          titulo: 'Gestión de Registros',
          descripcion: 'Registros de proceso con workflow y estados',
          elementos: [
            'Crear registros de proceso',
            'Gestión de etapas (stages)',
            'Cambio de estado',
            'Kanban board funcional',
            'Vista de tarjetas',
            'Vista de lista'
          ],
          estado: 'en-desarrollo'
        },
        {
          titulo: 'Indicadores y Objetivos',
          descripcion: 'Medición y seguimiento de procesos',
          elementos: [
            'Indicadores de calidad',
            'Objetivos de calidad',
            'Cálculos automáticos',
            'Dashboards de proceso',
            'Gráficos de tendencias',
            'Alertas automáticas'
          ],
          estado: 'parcial'
        },
        {
          titulo: 'Relaciones y Documentos',
          descripcion: 'Integración con otros módulos',
          elementos: [
            'Documentos de proceso',
            'Procesos relacionados',
            'Productos asociados',
            'Personal asignado',
            'Auditorías del proceso',
            'Hallazgos vinculados'
          ],
          estado: 'pendiente'
        }
      ],
      problemasActuales: [
        'Backend no inicia por errores de TypeScript',
        'CORS errors en frontend',
        'Timeout de conexión a API',
        'Modelos no están bien exportados',
        'Servicios no conectan correctamente'
      ],
      solucionesImplementadas: [
        'Corrección de exports en CustomerSurvey model',
        'Fix de tipos TypeScript en controller',
        'Reinicio de backend'
      ],
      proximosPasos: [
        '1. Verificar que backend está corriendo',
        '2. Probar endpoints de procesos',
        '3. Corregir errores de conexión',
        '4. Implementar tests unitarios',
        '5. Documentar API endpoints'
      ]
    },
    {
      id: 2,
      nombre: 'Documentación',
      descripcion: 'Sistema de gestión documental con control de versiones',
      prioridad: 'CRÍTICA',
      estado: 'en-desarrollo',
      progreso: 55,
      icono: FileText,
      color: 'blue',
      aspectos: [
        {
          titulo: 'Gestión de Documentos',
          descripcion: 'CRUD completo de documentos',
          elementos: [
            'Crear documento',
            'Editar metadata',
            'Eliminar documento',
            'Buscar y filtrar',
            'Categorización',
            'Etiquetas'
          ],
          estado: 'funcional'
        },
        {
          titulo: 'Control de Versiones',
          descripcion: 'Versionado automático de documentos',
          elementos: [
            'Crear nueva versión',
            'Comparar versiones',
            'Restaurar versión anterior',
            'Historial completo',
            'Aprobación de versiones',
            'Bloqueo de edición'
          ],
          estado: 'en-desarrollo'
        },
        {
          titulo: 'Workflow de Aprobación',
          descripcion: 'Proceso de revisión y aprobación',
          elementos: [
            'Estados del documento',
            'Flujo de aprobación',
            'Notificaciones automáticas',
            'Firma digital',
            'Registro de cambios',
            'Trazabilidad completa'
          ],
          estado: 'pendiente'
        },
        {
          titulo: 'Almacenamiento y Seguridad',
          descripcion: 'Storage y permisos',
          elementos: [
            'Upload de archivos',
            'Storage en cloud',
            'Permisos por rol',
            'Auditoría de acceso',
            'Encriptación',
            'Backup automático'
          ],
          estado: 'pendiente'
        }
      ],
      problemasActuales: [
        'Upload de archivos grandes falla',
        'Versionado no actualiza correctamente',
        'Permisos no se validan',
        'Preview de documentos no funciona',
        'Búsqueda es lenta'
      ],
      proximosPasos: [
        '1. Implementar upload chunked',
        '2. Corregir lógica de versiones',
        '3. Sistema de permisos robusto',
        '4. Preview con diferentes formatos',
        '5. Índices en base de datos'
      ]
    },
    {
      id: 3,
      nombre: 'Puntos de la Norma',
      descripcion: 'Gestión de cláusulas ISO 9001 y cumplimiento normativo',
      prioridad: 'CRÍTICA',
      estado: 'planificado',
      progreso: 35,
      icono: BookOpen,
      color: 'purple',
      aspectos: [
        {
          titulo: 'Cláusulas ISO 9001',
          descripcion: 'Catálogo completo de la norma',
          elementos: [
            'Todas las cláusulas 4-10',
            'Sub-cláusulas organizadas',
            'Requisitos detallados',
            'Interpretación práctica',
            'Ejemplos de evidencias',
            'Check-lists de cumplimiento'
          ],
          estado: 'funcional'
        },
        {
          titulo: 'Evaluación de Cumplimiento',
          descripcion: 'Medición del nivel de implementación',
          elementos: [
            'Evaluaciones por cláusula',
            'Scoring automático',
            'Estado de cumplimiento',
            'Gap analysis',
            'Tendencias temporales',
            'Reportes ejecutivos'
          ],
          estado: 'en-desarrollo'
        },
        {
          titulo: 'Plan de Cumplimiento',
          descripcion: 'Roadmap de implementación ISO',
          elementos: [
            'Planificación por cláusula',
            'Asignación de responsables',
            'Fechas objetivo',
            'Seguimiento de avance',
            'Hitos críticos',
            'Alertas de vencimiento'
          ],
          estado: 'parcial'
        },
        {
          titulo: 'Evidencias y Hallazgos',
          descripcion: 'Documentación de cumplimiento',
          elementos: [
            'Evidencias por cláusula',
            'Hallazgos vinculados',
            'No conformidades',
            'Oportunidades de mejora',
            'Acciones correctivas',
            'Verificación de cierre'
          ],
          estado: 'pendiente'
        }
      ],
      problemasActuales: [
        'Catálogo de cláusulas incompleto',
        'Evaluaciones no calculan correctamente',
        'Plan de cumplimiento no es dinámico',
        'No hay vinculación con auditorías',
        'Reportes no se generan'
      ],
      proximosPasos: [
        '1. Completar catálogo ISO 9001:2015',
        '2. Implementar lógica de scoring',
        '3. Crear sistema de planificación',
        '4. Vincular con auditorías',
        '5. Generar reportes ejecutivos'
      ]
    }
  ]

  const timeline = [
    {
      fase: 'Fase 1 - Estabilización',
      duracion: 'Semana 1-2',
      objetivo: 'Corregir problemas críticos y estabilizar backend',
      tareas: [
        'Corregir errores TypeScript en backend',
        'Solucionar problemas CORS',
        'Verificar conexión frontend-backend',
        'Probar todos los endpoints críticos',
        'Documentar problemas resueltos'
      ],
      abms: ['Procesos', 'Documentación', 'Puntos de Norma']
    },
    {
      fase: 'Fase 2 - Procesos Funcionales',
      duracion: 'Semana 3-4',
      objetivo: 'ABM de Procesos completamente funcional',
      tareas: [
        'CRUD de procesos 100% funcional',
        'Registros de proceso con workflow',
        'Kanban board optimizado',
        'Indicadores y objetivos operativos',
        'Tests unitarios completos'
      ],
      abms: ['Procesos']
    },
    {
      fase: 'Fase 3 - Documentación Completa',
      duracion: 'Semana 5-6',
      objetivo: 'Sistema documental con versionado',
      tareas: [
        'Upload y storage robusto',
        'Control de versiones funcional',
        'Workflow de aprobación',
        'Permisos y seguridad',
        'Preview de múltiples formatos'
      ],
      abms: ['Documentación']
    },
    {
      fase: 'Fase 4 - Cumplimiento ISO',
      duracion: 'Semana 7-8',
      objetivo: 'Gestión completa de normas ISO',
      tareas: [
        'Catálogo ISO 9001 completo',
        'Sistema de evaluación',
        'Plan de cumplimiento dinámico',
        'Vinculación con evidencias',
        'Reportes ejecutivos'
      ],
      abms: ['Puntos de Norma']
    },
    {
      fase: 'Fase 5 - Integración',
      duracion: 'Semana 9-10',
      objetivo: 'Integración completa de los 3 ABMs',
      tareas: [
        'Vinculación procesos-documentos',
        'Relación normas-procesos',
        'Dashboard unificado',
        'Reportes integrados',
        'Auditoría completa del sistema'
      ],
      abms: ['Procesos', 'Documentación', 'Puntos de Norma']
    }
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'funcional': return 'bg-green-100 text-green-700 border-green-300'
      case 'en-desarrollo': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'parcial': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'pendiente': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'CRÍTICA': return 'bg-red-100 text-red-700 border-red-300'
      case 'ALTA': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'MEDIA': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'BAJA': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target className="w-12 h-12 text-emerald-400" />
              <h1 className="text-5xl md:text-6xl font-bold">
                ROADMAP - ABM Críticos
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              Plan de desarrollo para los 3 módulos ABM críticos del sistema: <br/>
              <span className="text-emerald-400 font-semibold">Procesos | Documentación | Puntos de la Norma</span>
            </p>
            
            {/* Alert */}
            <div className="max-w-3xl mx-auto bg-red-900/30 border-2 border-red-500 rounded-xl p-6 backdrop-blur-lg">
              <div className="flex items-center justify-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-300">ESTADO CRÍTICO - ACCIÓN REQUERIDA</h3>
              </div>
              <p className="text-red-200">
                Backend no está funcionando correctamente. Errores de TypeScript impiden el inicio del servidor.
                Frontend no puede conectarse a la API. <strong>Prioridad máxima de resolución.</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Resumen Ejecutivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              Resumen Ejecutivo
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <div className="text-5xl font-bold text-emerald-600 mb-2">3</div>
                <div className="text-slate-700 font-semibold">ABMs Críticos</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="text-5xl font-bold text-blue-600 mb-2">10</div>
                <div className="text-slate-700 font-semibold">Semanas Timeline</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="text-5xl font-bold text-purple-600 mb-2">52%</div>
                <div className="text-slate-700 font-semibold">Progreso Global</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ABMs Críticos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">ABMs Críticos a Desarrollar</h2>
          
          <div className="space-y-8">
            {abmCriticos.map((abm, index) => {
              const Icon = abm.icono
              return (
                <motion.div
                  key={abm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Header del ABM */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 bg-${abm.color}-100 rounded-xl`}>
                        <Icon className={`w-8 h-8 text-${abm.color}-600`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{abm.nombre}</h3>
                        <p className="text-slate-600 mt-1">{abm.descripcion}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg border-2 font-bold ${getPrioridadColor(abm.prioridad)}`}>
                      {abm.prioridad}
                    </span>
                  </div>

                  {/* Progreso */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Progreso General</span>
                      <span className="text-sm font-bold text-slate-900">{abm.progreso}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${abm.color}-500 to-${abm.color}-600 rounded-full transition-all duration-500`}
                        style={{ width: `${abm.progreso}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Aspectos */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Aspectos Principales</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {abm.aspectos.map((aspecto, aspIndex) => (
                        <div key={aspIndex} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-slate-900">{aspecto.titulo}</h5>
                            <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getEstadoColor(aspecto.estado)}`}>
                              {aspecto.estado}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{aspecto.descripcion}</p>
                          <ul className="space-y-1">
                            {aspecto.elementos.map((elemento, elIndex) => (
                              <li key={elIndex} className="text-xs text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                {elemento}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Problemas Actuales */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Problemas Actuales
                    </h4>
                    <ul className="space-y-2">
                      {abm.problemasActuales.map((problema, pIndex) => (
                        <li key={pIndex} className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <span className="text-red-500 font-bold">✗</span>
                          {problema}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Soluciones Implementadas (si existen) */}
                  {abm.solucionesImplementadas && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Soluciones Implementadas
                      </h4>
                      <ul className="space-y-2">
                        {abm.solucionesImplementadas.map((solucion, sIndex) => (
                          <li key={sIndex} className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {solucion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Próximos Pasos */}
                  <div>
                    <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      Próximos Pasos
                    </h4>
                    <ul className="space-y-2">
                      {abm.proximosPasos.map((paso, pasoIndex) => (
                        <li key={pasoIndex} className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                          <span className="text-blue-500 font-bold flex-shrink-0">{pasoIndex + 1}.</span>
                          {paso.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-600" />
            Timeline de Desarrollo - 10 Semanas
          </h2>

          <div className="space-y-6">
            {timeline.map((fase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-1 h-full bg-emerald-200 my-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{fase.fase}</h3>
                        <p className="text-emerald-600 font-semibold flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          {fase.duracion}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {fase.abms.map((abm, abmIndex) => (
                          <span key={abmIndex} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                            {abm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-slate-600" />
                        <span className="font-bold text-slate-900">Objetivo:</span>
                      </div>
                      <p className="text-slate-700">{fase.objetivo}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">Tareas:</h4>
                      <ul className="space-y-2">
                        {fase.tareas.map((tarea, tareaIndex) => (
                          <li key={tareaIndex} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {tarea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Comencemos el Desarrollo</h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Este roadmap establece un camino claro para completar los 3 ABMs críticos en 10 semanas.
            Prioridad máxima: solucionar problemas actuales de backend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-all duration-200 inline-flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Iniciar Fase 1
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-200 inline-flex items-center justify-center gap-2">
              <Code className="w-5 h-5" />
              Ver Repositorio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

