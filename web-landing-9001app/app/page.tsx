'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Users,
  FileText,
  Award,
  Building2,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Play,
  Star,
  Check,
  LogIn
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular envío (aquí conectarías con tu backend)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
    
    // Reset después de 3 segundos
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail('')
      setEmpresa('')
    }, 3000)
  }

  const features = [
    {
      icon: <Shield className="w-10 h-10 text-emerald-500" />,
      title: 'Sistema de Gestión ISO 9001',
      description: 'Cumplimiento normativo automático con auditorías programadas y gestión de no conformidades',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Users className="w-10 h-10 text-blue-500" />,
      title: 'Gestión de RRHH Integral',
      description: 'Administración completa de personal, competencias, capacitaciones y evaluaciones',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FileText className="w-10 h-10 text-purple-500" />,
      title: 'Documentación Inteligente',
      description: 'Control de versiones, aprobaciones digitales y búsqueda avanzada de documentos',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Award className="w-10 h-10 text-orange-500" />,
      title: 'Auditorías Automatizadas',
      description: 'Programación automática, gestión de hallazgos y acciones correctivas',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Building2 className="w-10 h-10 text-indigo-500" />,
      title: 'Multi-Organización',
      description: 'Soporte para múltiples empresas con separación completa de datos',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-green-500" />,
      title: 'Indicadores en Tiempo Real',
      description: 'Dashboard con KPIs, métricas de calidad y reportes automáticos',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const stats = [
    { number: '500+', label: 'Organizaciones', icon: Building2 },
    { number: '50K+', label: 'Documentos Gestionados', icon: FileText },
    { number: '10K+', label: 'Auditorías Realizadas', icon: Award },
    { number: '99.9%', label: 'Uptime Garantizado', icon: Zap }
  ]

  const benefits = [
    'Cumplimiento normativo ISO 9001:2015',
    'Reducción de 60% en tiempo administrativo',
    'Auditorías automatizadas y programadas',
    'Dashboard con indicadores en tiempo real',
    'Gestión documental con control de versiones',
    'Soporte multi-organización',
    'Seguridad y encriptación de datos',
    'Actualizaciones automáticas incluidas'
  ]

  const testimonials = [
    {
      name: 'María González',
      role: 'Directora de Calidad',
      company: 'TechCorp SA',
      content: 'Implementar 9001app fue la mejor decisión. Reducimos el tiempo de auditoría en un 70%.',
      rating: 5
    },
    {
      name: 'Carlos Rodríguez',
      role: 'CEO',
      company: 'Agro Solutions',
      content: 'Sistema intuitivo y completo. Toda nuestra documentación ISO ahora está digitalizada y accesible.',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      role: 'Gerente de RRHH',
      company: 'Industrias del Sur',
      content: 'La gestión de competencias y capacitaciones nunca fue tan fácil. Ahorro de horas cada semana.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo y Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">Próximo Lanzamiento 2025</span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              Gestión ISO 9001
              <br />
              <span className="text-emerald-400">Nueva Generación</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              La plataforma más completa para <span className="text-emerald-400 font-semibold">automatizar</span> tu sistema de gestión de calidad.
              <br />
              Auditorías, documentación, RRHH y más en un solo lugar.
            </p>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleWaitlistSubmit}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-300">
                    🚀 Únete a la Lista de Espera
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Nombre de tu empresa (opcional)"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Obtener Acceso Anticipado
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Sé de los primeros en probar 9001app. Sin compromiso.
                  </p>
                  
                  {/* Botón de acceso directo */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm text-slate-300 mb-3">¿Ya tienes acceso?</p>
                    <button 
                      onClick={() => window.open('http://localhost:3000', '_blank')}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Acceder al Sistema
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-8"
              >
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-300 mb-2">¡Bienvenido a la Lista!</h3>
                <p className="text-slate-300">Te avisaremos cuando lancemos. Revisa tu email.</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Números que Hablan por Sí Solos
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Empresas de todo tipo confían en nuestra plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Todo lo que Necesitas en una Plataforma
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Funcionalidades diseñadas para simplificar tu gestión de calidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Por Qué Elegir 9001app?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Beneficios que transformarán tu organización
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-slate-200">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Empresas que ya transformaron su gestión de calidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-sm text-emerald-600">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transforma tu Gestión de Calidad Hoy
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresas que ya están revolucionando su sistema ISO 9001
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Solicitar Demo Gratuita
              </button>
              <button 
                onClick={() => window.open('http://localhost:3000', '_blank')}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Acceder al Sistema
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                9001app
              </h3>
              <p className="text-slate-400">
                La plataforma más completa para tu sistema de gestión ISO 9001
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-3 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@9001app.com</span>
              </div>
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <a href="http://localhost:3000" className="hover:text-emerald-400 transition-colors">Acceder al Sistema</a>
              </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+54 11 1234-5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <div className="space-y-2 text-slate-400">
                <div><a href="#" className="hover:text-emerald-400 transition-colors">Características</a></div>
                <div><a href="#" className="hover:text-emerald-400 transition-colors">Documentación</a></div>
                <div><a href="#" className="hover:text-emerald-400 transition-colors">Casos de Estudio</a></div>
                <div><a href="#" className="hover:text-emerald-400 transition-colors">Soporte</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 9001app. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


