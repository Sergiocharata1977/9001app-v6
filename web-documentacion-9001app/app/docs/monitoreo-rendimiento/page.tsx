'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  Zap,
  TrendingUp,
  Clock,
  Server,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText,
  Play,
  Terminal,
  Code,
  Settings,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'

export default function MonitoreoRendimientoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Activity className="w-14 h-14 text-violet-400" />
              <h1 className="text-5xl font-bold">Sistema de Monitoreo de Rendimiento</h1>
            </div>
            <p className="text-xl text-violet-200 max-w-3xl mx-auto">
              Monitoreo automático de velocidad y rendimiento con propuestas de mejora inteligentes
            </p>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introducción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-8 shadow-lg border-2 border-violet-200 mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Zap className="w-8 h-8 text-violet-600" />
            ¿Qué es el Sistema de Monitoreo?
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            El sistema de monitoreo automático de rendimiento es una herramienta que mide continuamente la velocidad
            de carga de todas las páginas de la aplicación 9001app v6. Genera reportes detallados con métricas
            de rendimiento y propuestas de mejora automáticas basadas en umbrales configurables.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
              <Eye className="w-8 h-8 text-violet-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-1">Monitoreo Continuo</h3>
              <p className="text-sm text-slate-600">Análisis automático cada 15 minutos o bajo demanda</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <BarChart3 className="w-8 h-8 text-indigo-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-1">Métricas Detalladas</h3>
              <p className="text-sm text-slate-600">Tiempo de carga, tamaño de recursos, requests, y más</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-1">Recomendaciones IA</h3>
              <p className="text-sm text-slate-600">Propuestas de mejora automáticas y priorizadas</p>
            </div>
          </div>
        </motion.div>

        {/* Características Principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Características Principales
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Activity,
                title: 'Monitoreo de 10 Páginas Críticas',
                description: 'Landing, Dashboard, RRHH (3 páginas), Documentos, Normas, Procesos, Super Admin',
                color: 'violet'
              },
              {
                icon: Clock,
                title: 'Umbrales de Rendimiento',
                description: 'Excelente (<1s), Bueno (1-2s), Aceptable (2-3s), Lento (3-5s), Crítico (>5s)',
                color: 'indigo'
              },
              {
                icon: Server,
                title: 'Análisis de Recursos',
                description: 'JavaScript, CSS, imágenes, total de requests, y tamaño transferido',
                color: 'purple'
              },
              {
                icon: FileText,
                title: 'Reportes HTML Visuales',
                description: 'Dashboards interactivos con gráficos y métricas detalladas',
                color: 'blue'
              },
              {
                icon: AlertTriangle,
                title: 'Alertas Automáticas',
                description: 'Detección de páginas lentas, errores 404, y recursos pesados',
                color: 'orange'
              },
              {
                icon: TrendingUp,
                title: 'Recomendaciones Priorizadas',
                description: 'Críticas, altas, medias y bajas según impacto en rendimiento',
                color: 'green'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-${feature.color}-50 border-2 border-${feature.color}-200 rounded-xl p-6 hover:shadow-lg transition-all`}
              >
                <feature.icon className={`w-10 h-10 text-${feature.color}-600 mb-3`} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cómo Usar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Play className="w-8 h-8 text-violet-600" />
            Cómo Usar el Sistema
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Terminal className="w-6 h-6" />
                Ejecución de Tests
              </h3>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                {/* Opción 1: Monitoreo único */}
                <div className="border-l-4 border-violet-500 pl-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    1️⃣ Monitoreo Único (Bajo Demanda)
                  </h4>
                  <p className="text-slate-700 mb-4">
                    Ejecuta un análisis completo de todas las páginas una sola vez:
                  </p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                    # Windows (Batch)<br/>
                    <span className="text-violet-400">run-performance-monitor.bat</span><br/><br/>
                    # PowerShell<br/>
                    <span className="text-violet-400">./run-performance-monitor.ps1</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>⏱️ Tiempo estimado:</strong> 2-3 minutos<br/>
                      <strong>📊 Resultado:</strong> Reporte HTML en <code className="bg-white px-2 py-1 rounded">frontend/test-results/performance/</code>
                    </p>
                  </div>
                </div>

                {/* Opción 2: Monitoreo continuo */}
                <div className="border-l-4 border-indigo-500 pl-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    2️⃣ Monitoreo Continuo (Automático)
                  </h4>
                  <p className="text-slate-700 mb-4">
                    Ejecuta análisis cada 15 minutos durante 24 horas:
                  </p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                    # PowerShell<br/>
                    <span className="text-indigo-400">./run-performance-monitor-continuous.ps1</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-sm text-amber-900">
                      <strong>⏱️ Intervalo:</strong> Cada 15 minutos<br/>
                      <strong>🔄 Duración:</strong> 24 horas (96 iteraciones)<br/>
                      <strong>⏹️ Detener:</strong> Presiona <kbd className="bg-white px-2 py-1 rounded border">Ctrl+C</kbd>
                    </p>
                  </div>
                </div>

                {/* Opción 3: Suite completa */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    3️⃣ Suite Completa (Funcionalidad + Rendimiento)
                  </h4>
                  <p className="text-slate-700 mb-4">
                    Ejecuta tests funcionales de RRHH y monitoreo de rendimiento:
                  </p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                    # Windows (Batch)<br/>
                    <span className="text-purple-400">run-all-tests.bat</span><br/><br/>
                    # PowerShell<br/>
                    <span className="text-purple-400">./run-all-tests.ps1</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm text-green-900">
                      <strong>✅ Incluye:</strong><br/>
                      - Tests de Departamentos, Puestos, Personal<br/>
                      - Monitoreo de rendimiento de 10 páginas<br/>
                      - Reportes consolidados en JSON y HTML
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Métricas y Umbrales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-violet-600" />
            Métricas y Umbrales de Rendimiento
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Estado</th>
                  <th className="px-6 py-4 text-left font-bold">Tiempo de Carga</th>
                  <th className="px-6 py-4 text-left font-bold">Indicador</th>
                  <th className="px-6 py-4 text-left font-bold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { estado: 'Excelente', tiempo: '< 1 segundo', emoji: '🚀', color: 'green', accion: 'Ninguna - Mantener' },
                  { estado: 'Bueno', tiempo: '1-2 segundos', emoji: '✅', color: 'emerald', accion: 'Monitorear' },
                  { estado: 'Aceptable', tiempo: '2-3 segundos', emoji: '⚠️', color: 'yellow', accion: 'Revisar componentes' },
                  { estado: 'Lento', tiempo: '3-5 segundos', emoji: '🐌', color: 'orange', accion: 'Optimización necesaria' },
                  { estado: 'Crítico', tiempo: '> 5 segundos', emoji: '🔴', color: 'red', accion: 'Optimización urgente' }
                ].map((row, index) => (
                  <tr key={index} className={`border-b border-slate-200 hover:bg-${row.color}-50 transition-colors`}>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${row.color}-100 text-${row.color}-800 font-bold`}>
                        {row.emoji} {row.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">{row.tiempo}</td>
                    <td className="px-6 py-4">
                      <div className={`w-12 h-12 rounded-full bg-${row.color}-500 flex items-center justify-center text-white font-bold text-xl`}>
                        {row.emoji}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{row.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tipos de Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Settings className="w-8 h-8 text-violet-600" />
            Tipos de Recomendaciones Automáticas
          </h2>
          
          <div className="space-y-4">
            {[
              {
                severity: 'CRÍTICA',
                color: 'red',
                icon: '🚨',
                trigger: 'Página no accesible (404)',
                recommendation: 'Verificar rutas, componentes y configuración de Next.js'
              },
              {
                severity: 'ALTA',
                color: 'orange',
                icon: '⚠️',
                trigger: 'Tiempo de carga > 5 segundos',
                recommendation: 'Implementar lazy loading, code splitting, optimizar componentes pesados'
              },
              {
                severity: 'MEDIA',
                color: 'yellow',
                icon: '💡',
                trigger: 'JavaScript > 500 KB o Imágenes > 1 MB',
                recommendation: 'Optimizar bundles, comprimir imágenes, usar WebP'
              },
              {
                severity: 'BAJA',
                color: 'blue',
                icon: 'ℹ️',
                trigger: 'Más de 50 requests HTTP',
                recommendation: 'Considerar bundling de recursos, HTTP/2, CDN'
              }
            ].map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`bg-${rec.color}-50 border-l-4 border-${rec.color}-500 rounded-r-xl p-6 shadow hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{rec.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full bg-${rec.color}-500 text-white font-bold text-sm uppercase`}>
                        {rec.severity}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{rec.trigger}</h3>
                    </div>
                    <p className="text-slate-700">
                      <strong>Recomendación:</strong> {rec.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Archivos Generados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8 text-violet-600" />
            Archivos y Reportes Generados
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-violet-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-violet-600" />
                <h3 className="text-xl font-bold text-slate-900">performance-report.html</h3>
              </div>
              <p className="text-slate-700 mb-4">
                Dashboard visual interactivo con:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Métricas globales (total páginas, errores, promedio)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Resultados detallados por página con gráficos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Recomendaciones priorizadas con severidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Diseño responsive y moderno</span>
                </li>
              </ul>
              <button className="mt-4 w-full bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all">
                <Eye className="w-5 h-5" />
                Ver Ejemplo de Reporte
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-8 h-8 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">performance-report.json</h3>
              </div>
              <p className="text-slate-700 mb-4">
                Datos estructurados para integración:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Timestamp de ejecución</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Resultados completos por página</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Métricas de rendimiento del navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Array de recomendaciones estructuradas</span>
                </li>
              </ul>
              <button className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all">
                <Download className="w-5 h-5" />
                Descargar JSON de Ejemplo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Integración con Super Admin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
              <RefreshCw className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Integración con Super Admin</h2>
              <p className="text-violet-100">Monitoreo centralizado desde el panel de control</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-3">🎯 Vista Actual</h3>
              <p className="text-violet-100 mb-4">
                El sistema de monitoreo ya está integrado en el Super Admin con:
              </p>
              <ul className="space-y-2 text-violet-100">
                <li>• Tests funcionales por módulo</li>
                <li>• Métricas de progreso y estado</li>
                <li>• Enlaces a reportes detallados</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-3">🚀 Próximas Mejoras</h3>
              <p className="text-violet-100 mb-4">
                Futuras integraciones planificadas:
              </p>
              <ul className="space-y-2 text-violet-100">
                <li>• Dashboard en tiempo real</li>
                <li>• Gráficos históricos de rendimiento</li>
                <li>• Alertas automáticas por email/Slack</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-center bg-white rounded-xl p-8 border border-slate-200 shadow"
        >
          <Activity className="w-16 h-16 text-violet-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            ¿Listo para monitorear tu aplicación?
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Ejecuta el sistema de monitoreo ahora y obtén insights inmediatos sobre el rendimiento de tu aplicación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Play className="w-5 h-5" />
              Ejecutar Monitoreo
            </button>
            <button className="border-2 border-violet-500 text-violet-600 hover:bg-violet-50 font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
              <FileText className="w-5 h-5" />
              Ver Documentación Completa
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}





























