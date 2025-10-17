'use client';

import { ArrowRight, Award, CheckCircle, Clock, FileText, LogIn, MessageSquare, Shield, Sparkles, Star, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { DonCandidoAnimation } from '@/components/ui/DonCandidoAnimation'; // Comentado para mejor rendimiento

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // useEffect optimizado para mejor rendimiento
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { 
      icon: <Shield className="w-12 h-12 text-emerald-500" />, 
      title: 'Sistema ISO 9001', 
      description: 'Cumplimiento normativo completo con módulos integrados de política, AMFE y FODA',
      badge: 'Certificado'
    },
    { 
      icon: <Users className="w-12 h-12 text-blue-500" />, 
      title: 'Gestión de RRHH', 
      description: 'Administración completa de personal, departamentos y competencias',
      badge: 'Completo'
    },
    { 
      icon: <FileText className="w-12 h-12 text-purple-500" />, 
      title: 'Documentación Inteligente', 
      description: 'Control de versiones, aprobaciones y trazabilidad total',
      badge: 'Automático'
    },
    { 
      icon: <Award className="w-12 h-12 text-orange-500" />, 
      title: 'Auditorías', 
      description: 'Gestión de hallazgos, acciones correctivas y seguimiento',
      badge: 'Integrado'
    },
    { 
      icon: <TrendingUp className="w-12 h-12 text-green-500" />, 
      title: 'Análisis y Reportes', 
      description: 'Dashboards en tiempo real con KPIs y métricas de calidad',
      badge: 'En tiempo real'
    },
    { 
      icon: <MessageSquare className="w-12 h-12 text-indigo-500" />, 
      title: 'Don Cándido IA', 
      description: 'Asistente virtual especializado en ISO 9001 que responde tus dudas',
      badge: 'IA Avanzada'
    }
  ];

  const benefits = [
    { icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, text: 'Reducción del 70% en tiempo de gestión documental' },
    { icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, text: 'Cumplimiento ISO 9001:2015 garantizado' },
    { icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, text: 'Acceso desde cualquier dispositivo, 24/7' },
    { icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, text: 'Soporte técnico especializado incluido' },
  ];

  const stats = [
    { value: '500+', label: 'Empresas certificadas' },
    { value: '99.9%', label: 'Disponibilidad' },
    { value: '24/7', label: 'Soporte técnico' },
    { value: '15+', label: 'Módulos integrados' },
  ];

  const testimonials = [
    {
      name: 'María García',
      role: 'Directora de Calidad',
      company: 'Los Señores del Agro',
      text: 'Implementamos 9001app y logramos la certificación ISO en tiempo récord. El sistema es intuitivo y completo.',
      rating: 5
    },
    {
      name: 'Carlos López',
      role: 'Gerente de Operaciones',
      company: 'Industrias XYZ',
      text: 'La gestión documental y el seguimiento de auditorías nunca fue tan fácil. Don Cándido nos ayuda constantemente.',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      role: 'Responsable de Calidad',
      company: 'TechCorp SA',
      text: 'El módulo AMFE y los dashboards en tiempo real han transformado nuestra gestión de riesgos.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${scrolled ? 'text-slate-900' : 'text-white'}`}>9001app.com</h1>
                <p className={`text-xs ${scrolled ? 'text-slate-600' : 'text-emerald-100'}`}>ISO 9001 Quality Management</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/documentacion" className={`hidden md:block ${scrolled ? 'text-slate-700 hover:text-emerald-600' : 'text-white hover:text-emerald-300'} transition-colors font-medium`}>
                Documentación
              </Link>
            <Link href="/login">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
                <LogIn className="w-4 h-4" />
                Acceder
              </button>
            </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white pt-32 pb-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">Plataforma ISO 9001 Completa</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Gestión de Calidad
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Inteligente
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
                Automatiza tu sistema ISO 9001:2015 con la plataforma más completa del mercado
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/login">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 shadow-xl transition-all transform hover:scale-105">
                  <LogIn className="w-5 h-5" />
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
                <Link href="/procesos">
                  <button className="border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105">
                    Ver Demo
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Don Cándido Animation Area */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 shadow-2xl">
                {/* Don Cándido Lottie Animation */}
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto mb-6 relative">
                      {/* Animación optimizada para mejor rendimiento */}
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-white" />
                      </div>
                      {/* Círculo de fondo con gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl -z-10"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Don Cándido</h3>
                    <p className="text-emerald-300 font-semibold">Tu Asistente IA Especializado</p>
                    <p className="text-sm text-slate-400 mt-2">Disponible 24/7 para ayudarte con ISO 9001</p>
                    
                    {/* Badges de características */}
                    <div className="flex gap-2 justify-center mt-4">
                      <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                        GPT-4
                      </span>
                      <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
                        Experto ISO
                      </span>
                      <span className="inline-block bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
                        24/7
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-2xl animate-bounce">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">IA Potenciada</div>
                    <div className="text-xs text-slate-600">GPT-4 Integrado</div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge - Respuestas instantáneas */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Respuestas al Instante</div>
                    <div className="text-xs text-slate-600">Experto en ISO 9001</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                {benefit.icon}
                <span className="text-sm font-medium text-slate-700">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Todo lo que Necesitas en un Solo Lugar
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Módulos completos e integrados para una gestión ISO 9001 sin complicaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute top-4 right-4">
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <Link href="/login" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-4 transition-all">
                    Explorar módulo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-slate-600">
              Empresas que confían en 9001app para su gestión de calidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-xs text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-8">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Prueba gratuita por 30 días</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ¿Listo para Transformar tu Gestión de Calidad?
          </h2>
          <p className="text-xl md:text-2xl text-emerald-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Únete a cientos de empresas que ya optimizaron su sistema ISO 9001 con 9001app
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <button className="bg-white text-emerald-600 font-bold py-5 px-10 rounded-xl hover:bg-slate-100 transition-all inline-flex items-center gap-3 transform hover:scale-105 shadow-2xl">
                <LogIn className="w-6 h-6" />
                Comenzar Ahora Gratis
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/documentacion">
              <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-5 px-10 rounded-xl transition-all inline-flex items-center gap-3 transform hover:scale-105">
                Ver Documentación
              </button>
            </Link>
          </div>

          <p className="mt-8 text-emerald-100 text-sm">
            ✓ Sin tarjeta de crédito | ✓ Soporte incluido | ✓ Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">9001app.com</h3>
                  <p className="text-sm text-slate-400">ISO 9001 Quality Management</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                La plataforma más completa para la gestión de sistemas de calidad ISO 9001:2015. 
                Automatiza procesos, mejora la eficiencia y garantiza el cumplimiento normativo.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
                <button className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-slate-400 hover:text-emerald-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/documentacion" className="text-slate-400 hover:text-emerald-400 transition-colors">Documentación</Link></li>
                <li><Link href="/calidad" className="text-slate-400 hover:text-emerald-400 transition-colors">Módulo de Calidad</Link></li>
                <li><Link href="/rrhh" className="text-slate-400 hover:text-emerald-400 transition-colors">RRHH</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-slate-400">
                <li>Email: info@9001app.com</li>
                <li>Soporte: soporte@9001app.com</li>
                <li>Tel: +54 11 1234-5678</li>
                <li>WhatsApp: +54 11 9876-5432</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2024 9001app.com - ISO 9001:2015 Quality Management System. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/privacidad" className="hover:text-emerald-400">Privacidad</Link>
              <Link href="/terminos" className="hover:text-emerald-400">Términos</Link>
              <Link href="/cookies" className="hover:text-emerald-400">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
