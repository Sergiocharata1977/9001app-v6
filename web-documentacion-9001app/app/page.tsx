'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  FileText,
  Search,
  ArrowRight,
  CheckCircle,
  Code,
  Users,
  Lightbulb,
  Download,
  ExternalLink,
  Filter,
  Star,
  Clock,
  Tag
} from 'lucide-react'

export default function DocumentacionPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const categories = [
    { id: 'todos', label: 'Todos', icon: BookOpen },
    { id: 'casos-uso', label: 'Casos de Uso', icon: Lightbulb },
    { id: 'manuales', label: 'Manuales', icon: FileText },
    { id: 'tutoriales', label: 'Tutoriales', icon: Users },
    { id: 'api', label: 'API Docs', icon: Code }
  ]

  const documentos = [
    {
      id: 13,
      titulo: 'Vistas Single CRM - Implementación Completa',
      descripcion: 'Sistema completo de vistas detalladas para Oportunidades, Empresas, Contactos y Actividades del CRM. Componentes reutilizables y datos cruzados.',
      categoria: 'api',
      modulos: ['CRM', 'React', 'TypeScript', 'Componentes', 'UI/UX'],
      fecha: '2025-01-18',
      autor: 'Equipo Desarrollo',
      tiempo_lectura: '30 min',
      nivel: 'Avanzado',
      destacado: true,
      url: '/docs/vistas-single-crm'
    },
    {
      id: 12,
      titulo: 'Sistema de Monitoreo de Rendimiento',
      descripcion: 'Monitoreo automático de velocidad y rendimiento con propuestas de mejora inteligentes. Testing continuo con reportes HTML visuales.',
      categoria: 'api',
      modulos: ['Testing', 'Rendimiento', 'Monitoreo', 'Playwright', 'DevOps'],
      fecha: '2025-01-17',
      autor: 'Equipo Desarrollo',
      tiempo_lectura: '25 min',
      nivel: 'Avanzado',
      destacado: true,
      url: '/docs/monitoreo-rendimiento'
    },
    {
      id: 10,
      titulo: 'Lógica de Registros Opcionales',
      descripcion: 'Sistema inteligente de habilitación de registros por tipo de proceso. Documentación completa de la lógica de negocio.',
      categoria: 'casos-uso',
      modulos: ['Procesos', 'Registros', 'Lógica de Negocio', 'UI/UX'],
      fecha: '2025-01-16',
      autor: 'Equipo Desarrollo',
      tiempo_lectura: '20 min',
      nivel: 'Intermedio',
      destacado: true,
      url: '/docs/logica-registros-opcionales'
    },
    {
      id: 11,
      titulo: 'Implementación Técnica - Registros Opcionales',
      descripcion: 'Guía de implementación paso a paso para desarrolladores. Código, modelos de datos y casos de prueba.',
      categoria: 'api',
      modulos: ['Backend', 'Frontend', 'Base de Datos', 'Validaciones'],
      fecha: '2025-01-16',
      autor: 'Equipo Desarrollo',
      tiempo_lectura: '35 min',
      nivel: 'Avanzado',
      destacado: false,
      url: '/docs/implementacion-registros-opcionales'
    },
    {
      id: 9,
      titulo: 'ROADMAP - ABM Críticos de Desarrollo',
      descripcion: 'Plan detallado de desarrollo para los 3 módulos críticos: Procesos, Documentación y Puntos de la Norma',
      categoria: 'casos-uso',
      modulos: ['Procesos', 'Documentación', 'Puntos de Norma', 'Desarrollo'],
      fecha: '2025-01-15',
      autor: 'Equipo Desarrollo',
      tiempo_lectura: '30 min',
      nivel: 'Avanzado',
      destacado: true,
      url: '/docs/roadmap-abm-criticos'
    },
    {
      id: 1,
      titulo: 'Casos de Uso - Sistema Completo',
      descripcion: 'Documentación detallada de todos los casos de uso del sistema ISO 9001 App v6',
      categoria: 'casos-uso',
      modulos: ['Norma ISO', 'Documentos', 'Procesos', 'Auditorías'],
      fecha: '2025-01-10',
      autor: 'Equipo 9001app',
      tiempo_lectura: '45 min',
      nivel: 'Intermedio',
      destacado: true,
      url: '/docs/casos-de-uso-completo'
    },
    {
      id: 2,
      titulo: 'Manual de Gestión de Calidad ISO 9001',
      descripcion: 'Guía completa para implementar y gestionar el módulo de calidad',
      categoria: 'manuales',
      modulos: ['Sistema de Calidad', 'Indicadores', 'Objetivos'],
      fecha: '2025-01-08',
      autor: 'Consultor ISO',
      tiempo_lectura: '30 min',
      nivel: 'Básico',
      destacado: true,
      url: '/docs/manual-gestion-calidad'
    },
    {
      id: 3,
      titulo: 'Tutorial: Gestión de Documentos',
      descripcion: 'Paso a paso para gestionar documentos con control de versiones',
      categoria: 'tutoriales',
      modulos: ['Documentos'],
      fecha: '2025-01-05',
      autor: 'Equipo Soporte',
      tiempo_lectura: '15 min',
      nivel: 'Básico',
      destacado: false,
      url: '/docs/tutorial-documentos'
    },
    {
      id: 4,
      titulo: 'Caso de Estudio: Los Señores del Agro',
      descripcion: 'Implementación exitosa del sistema en empresa agrícola',
      categoria: 'casos-uso',
      modulos: ['CRM Agro', 'Gestión de Clientes', 'Oportunidades'],
      fecha: '2025-01-03',
      autor: 'Cliente Destacado',
      tiempo_lectura: '20 min',
      nivel: 'Intermedio',
      destacado: true,
      url: '/docs/caso-estudio-agro'
    },
    {
      id: 5,
      titulo: 'Manual de RRHH y Competencias',
      descripcion: 'Gestión integral de personal, capacitaciones y evaluaciones',
      categoria: 'manuales',
      modulos: ['RRHH', 'Capacitaciones', 'Evaluaciones'],
      fecha: '2025-01-02',
      autor: 'Experto RRHH',
      tiempo_lectura: '35 min',
      nivel: 'Intermedio',
      destacado: false,
      url: '/docs/manual-rrhh'
    },
    {
      id: 6,
      titulo: 'API Reference - Endpoints REST',
      descripcion: 'Documentación completa de la API REST del sistema',
      categoria: 'api',
      modulos: ['API', 'Backend', 'Integración'],
      fecha: '2025-01-01',
      autor: 'Equipo Dev',
      tiempo_lectura: '60 min',
      nivel: 'Avanzado',
      destacado: false,
      url: '/docs/api-reference'
    },
    {
      id: 7,
      titulo: 'Tutorial: Auditorías Internas',
      descripcion: 'Cómo programar y ejecutar auditorías internas automáticamente',
      categoria: 'tutoriales',
      modulos: ['Auditorías', 'Hallazgos', 'Acciones Correctivas'],
      fecha: '2024-12-28',
      autor: 'Auditor Senior',
      tiempo_lectura: '25 min',
      nivel: 'Intermedio',
      destacado: false,
      url: '/docs/tutorial-auditorias'
    },
    {
      id: 8,
      titulo: 'Manual de Procesos y Productos',
      descripcion: 'Gestión de procesos organizacionales y control de productos',
      categoria: 'manuales',
      modulos: ['Procesos', 'Productos', 'Indicadores'],
      fecha: '2024-12-25',
      autor: 'Consultor ISO',
      tiempo_lectura: '40 min',
      nivel: 'Intermedio',
      destacado: false,
      url: '/docs/manual-procesos'
    }
  ]

  const filteredDocumentos = documentos.filter(doc => {
    const matchesCategory = selectedCategory === 'todos' || doc.categoria === selectedCategory
    const matchesSearch = doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.modulos.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico': return 'bg-green-100 text-green-700 border-green-200'
      case 'Intermedio': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Avanzado': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
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
              <BookOpen className="w-12 h-12 text-emerald-400" />
              <h1 className="text-5xl md:text-6xl font-bold">
                Documentación 9001app
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Casos de estudio, manuales de usuario, tutoriales y documentación técnica completa
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar en la documentación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Filtrar por categoría</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:shadow'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Documentos', value: documentos.length, icon: FileText },
            { label: 'Casos de Uso', value: documentos.filter(d => d.categoria === 'casos-uso').length, icon: Lightbulb },
            { label: 'Manuales', value: documentos.filter(d => d.categoria === 'manuales').length, icon: BookOpen },
            { label: 'API Docs', value: documentos.filter(d => d.categoria === 'api').length, icon: Code }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Documentos Destacados */}
        {selectedCategory === 'todos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Documentos Destacados
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {documentos.filter(doc => doc.destacado).map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {doc.titulo}
                      </h3>
                      <p className="text-slate-700 mb-4">{doc.descripcion}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.modulos.map((modulo, i) => (
                      <span key={i} className="text-xs bg-white/80 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                        {modulo}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {doc.tiempo_lectura}
                      </span>
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${getNivelColor(doc.nivel)}`}>
                        {doc.nivel}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200">
                    Leer Documento
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Todos los Documentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {selectedCategory === 'todos' ? 'Toda la Documentación' : `${categories.find(c => c.id === selectedCategory)?.label}`}
            <span className="ml-3 text-lg text-slate-500">({filteredDocumentos.length})</span>
          </h2>

          {filteredDocumentos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No se encontraron documentos</p>
              <p className="text-slate-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDocumentos.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                          <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                            {doc.titulo}
                          </h3>
                          <p className="text-slate-600 mb-4">{doc.descripcion}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {doc.modulos.map((modulo, i) => (
                              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 font-medium">
                                <Tag className="w-3 h-3 inline mr-1" />
                                {modulo}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {doc.tiempo_lectura}
                            </span>
                            <span>Por {doc.autor}</span>
                            <span>{new Date(doc.fecha).toLocaleDateString('es-ES')}</span>
                            <span className={`px-2 py-1 rounded border text-xs font-medium ${getNivelColor(doc.nivel)}`}>
                              {doc.nivel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-all duration-200">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-all duration-200">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-lg text-emerald-100 mb-6 max-w-2xl mx-auto">
            Estamos constantemente actualizando nuestra documentación. Contáctanos si necesitas ayuda específica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 font-semibold py-3 px-8 rounded-xl hover:bg-slate-100 transition-all duration-200">
              Solicitar Documentación
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-200">
              Contactar Soporte
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              9001app Documentación
            </h3>
            <p className="text-slate-400 mb-6">
              Tu guía completa para dominar el sistema ISO 9001
            </p>
            <div className="border-t border-slate-800 pt-6">
              <p className="text-slate-500 text-sm">
                © 2024-2025 9001app. Documentación actualizada continuamente.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



