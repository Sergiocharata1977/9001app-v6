'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Download, Printer, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CasosDeUsoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-emerald-900 text-white py-8 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Volver a Documentación
            </Link>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-emerald-500" />
              <h1 className="text-5xl font-bold text-slate-900">
                Casos de Uso - Sistema Completo
              </h1>
            </div>
            <p className="text-xl text-slate-600 mb-4">
              Documento de referencia con casos de uso reales de cada módulo del sistema
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>📅 Actualizado: 10 Enero 2025</span>
              <span>👤 Por: Equipo 9001app</span>
              <span>⏱️ Lectura: 45 min</span>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-slate-50 rounded-xl p-8 mb-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">📑 Índice de Contenidos</h2>
            <ul className="space-y-2">
              <li><a href="#norma" className="text-emerald-600 hover:text-emerald-700 hover:underline">1. Puntos de la Norma ISO 9001</a></li>
              <li><a href="#documentos" className="text-emerald-600 hover:text-emerald-700 hover:underline">2. Documentos</a></li>
              <li><a href="#procesos" className="text-emerald-600 hover:text-emerald-700 hover:underline">3. Procesos</a></li>
              <li><a href="#auditorias" className="text-emerald-600 hover:text-emerald-700 hover:underline">4. Auditorías</a></li>
              <li><a href="#rrhh" className="text-emerald-600 hover:text-emerald-700 hover:underline">5. Recursos Humanos</a></li>
            </ul>
          </div>

          {/* Section 1: Norma ISO */}
          <section id="norma" className="mb-16 prose prose-lg max-w-none">
            <h2 className="text-4xl font-bold text-slate-900 border-b-4 border-emerald-500 pb-3 mb-6">
              1. PUNTOS DE LA NORMA ISO 9001
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
              <h3 className="text-2xl font-semibold text-blue-900 mb-2">🎯 Objetivo del Módulo</h3>
              <p className="text-blue-800">
                Gestionar los 32 requisitos de ISO 9001:2015 (capítulos 4-10), vincularlos con procesos, 
                documentos, objetivos e indicadores para garantizar trazabilidad completa.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">📊 Estructura de Datos</h3>
            <h4 className="text-xl font-semibold text-emerald-700 mb-3">Punto de Norma (NormPoint)</h4>
            <div className="bg-slate-900 text-white p-6 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`{
  // IDENTIFICACIÓN
  code: "8.3",
  title: "Diseño y desarrollo",
  chapter: 8,
  section: "8.3",
  
  // CONTENIDO ISO
  requirements: "La organización debe...",
  guidance: "Incluye planificación...",
  examples: "Por ejemplo...",
  
  // CLASIFICACIÓN
  category: "operacion",
  keywords: ["diseño", "desarrollo"],
  is_mandatory: true,
  priority: "alta",
  
  // RELACIONES (multi-tenant)
  related_processes: [ObjectId],
  related_documents: [ObjectId],
  related_objectives: [ObjectId],
  related_indicators: [ObjectId]
}`}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
              <p className="text-yellow-900">
                <strong>NOTA:</strong> NormPoint es <strong>GLOBAL</strong> (sin organization_id) porque 
                ISO 9001:2015 es la misma norma para todos.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">📝 Casos de Uso</h3>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6 hover:border-emerald-300 transition-all">
              <h4 className="text-xl font-bold text-emerald-700 mb-3">
                CASO 1: Consultor implementando ISO - Ver requisitos
              </h4>
              <p><strong className="text-slate-700">Actor:</strong> Consultor de Calidad</p>
              <p><strong className="text-slate-700">Objetivo:</strong> Entender qué requisitos debe cumplir la organización</p>
              
              <p className="font-semibold mt-4 mb-2">Flujo:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Usuario ingresa a <code className="bg-slate-100 px-2 py-1 rounded text-emerald-600">/norm-points</code></li>
                <li>Ve tabla con 32 puntos organizados por capítulos (4-10)</li>
                <li>Usa filtros para buscar por capítulo, categoría o prioridad</li>
                <li>Resultado: Lista filtrada de puntos relevantes</li>
              </ol>

              <div className="bg-slate-50 p-4 rounded-lg mt-4 font-mono text-sm">
                <pre>
{`┌─────────────────────────────────────────────┐
│ PUNTOS DE LA NORMA ISO 9001:2015          │
├─────────────────────────────────────────────┤
│ [Filtros] Capítulo: [8 ▼] Categoría: [...] │
│                                             │
│ ► 8. Operación                             │
│   ├─ 8.1 Planificación operacional  🔗 3   │
│   ├─ 8.2 Requisitos productos       🔗 2   │
│   ├─ 8.3 Diseño y desarrollo        🔗 1   │
│   └─ 8.7 Control no conformes       🔗 0   │
└─────────────────────────────────────────────┘`}
                </pre>
              </div>

              <p className="mt-4 text-emerald-700 font-semibold">
                ✅ Resultado: Usuario identifica qué requisitos aplicar.
              </p>
            </div>

            {/* Caso 2 */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6 hover:border-emerald-300 transition-all">
              <h4 className="text-xl font-bold text-emerald-700 mb-3">
                CASO 2: Ver detalle de un requisito ISO
              </h4>
              <p><strong className="text-slate-700">Actor:</strong> Responsable de Calidad</p>
              <p><strong className="text-slate-700">Objetivo:</strong> Entender en detalle qué exige la norma</p>
              
              <p className="font-semibold mt-4 mb-2">Flujo:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Usuario hace click en "8.3 Diseño y desarrollo"</li>
                <li>Ve modal con:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Texto oficial del requisito ISO</li>
                    <li>Guía práctica de implementación</li>
                    <li>Ejemplos de aplicación</li>
                    <li>Lista de procesos relacionados</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          {/* Section 2: Documentos */}
          <section id="documentos" className="mb-16 prose prose-lg max-w-none">
            <h2 className="text-4xl font-bold text-slate-900 border-b-4 border-blue-500 pb-3 mb-6">
              2. DOCUMENTOS
            </h2>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6 rounded-r-lg">
              <h3 className="text-2xl font-semibold text-purple-900 mb-2">🎯 Objetivo del Módulo</h3>
              <p className="text-purple-800">
                Gestionar documentos del Sistema de Gestión de Calidad (PDFs, Word, etc.) con control de versiones, 
                estados de aprobación y vinculación a procesos.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">📊 Estructura de Datos</h3>
            <div className="bg-slate-900 text-white p-6 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`{
  // IDENTIFICACIÓN
  process_id: ObjectId,
  titulo: "Manual de Calidad",
  descripcion: "Manual del SGC v2",
  
  // CLASIFICACIÓN
  tipo_documento: "manual",
  // procedimiento|instructivo|formato|manual|politica
  
  // VERSIONAMIENTO
  version: "2.0",
  estado: "aprobado",
  // borrador|revision|aprobado|obsoleto
  
  // ARCHIVO FÍSICO
  archivo_url: "/uploads/manual_v2.pdf",
  archivo_nombre: "manual_calidad_v2.pdf",
  archivo_tamaño: 2048000,
  
  // CONTROL
  fecha_creacion: Date,
  fecha_revision: Date,
  creado_por: ObjectId,
  revisado_por: ObjectId,
  
  // MULTI-TENANT
  organization_id: "org-001"
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">📝 Casos de Uso</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-3">📤 CASO 1: Subir nuevo documento</h4>
                <p className="text-sm text-blue-800">
                  El usuario sube un procedimiento documentado que queda en estado "borrador" hasta su aprobación.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-900 mb-3">✅ CASO 2: Aprobar documento</h4>
                <p className="text-sm text-green-800">
                  Responsable de Calidad revisa y aprueba documentos en estado "revisión".
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-purple-900 mb-3">🔄 CASO 3: Nueva versión</h4>
                <p className="text-sm text-purple-800">
                  Al crear v2.0 de un documento, la v1.0 pasa automáticamente a estado "obsoleto".
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-orange-900 mb-3">🔍 CASO 4: Buscar documentos</h4>
                <p className="text-sm text-orange-800">
                  Búsqueda avanzada por título, tipo, estado, versión o contenido.
                </p>
              </div>
            </div>
          </section>

          {/* Diagrama de Relaciones */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold text-slate-900 border-b-4 border-purple-500 pb-3 mb-6">
              📊 RESUMEN DE RELACIONES
            </h2>
            <div className="bg-gradient-to-br from-slate-900 to-emerald-900 text-white p-8 rounded-xl">
              <pre className="text-sm font-mono">
{`
Punto de Norma ─────┬──── Proceso ──────┬──── Documento
                    │                    │
                    ├──── Objetivo       │
                    │                    │
                    └──── Indicador ─────┘
`}
              </pre>
              <div className="mt-6 space-y-2 text-sm">
                <p>1. <strong className="text-emerald-400">Punto ISO 8.3</strong> (Diseño) → Implementado en → <strong className="text-blue-400">Proceso "Diseño de Productos"</strong></p>
                <p>2. <strong className="text-blue-400">Proceso</strong> → Documentado en → <strong className="text-purple-400">Documento "Procedimiento v2.0"</strong></p>
                <p>3. <strong className="text-yellow-400">Objetivo</strong> → "Reducir tiempo 20%" → Mide cumplimiento</p>
                <p>4. <strong className="text-pink-400">Indicador</strong> → "Tiempo promedio" → Evidencia mejora continua</p>
              </div>
            </div>
          </section>

          {/* Footer del documento */}
          <div className="border-t-2 border-slate-200 pt-8 mt-12 text-center text-slate-600">
            <p className="font-bold text-lg mb-2">Sistema ISO 9001 App v6</p>
            <p className="text-sm">Última actualización: 10/01/2025 | Versión: 1.0</p>
            <p className="text-xs mt-4 text-slate-500">
              Este documento se actualiza continuamente a medida que el sistema evoluciona
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}



