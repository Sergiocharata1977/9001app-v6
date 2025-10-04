'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, Users, Workflow, FileText, BarChart3, Shield, Briefcase, Zap,
  AlertTriangle, CheckCircle, TrendingUp, BookOpen, Settings, ArrowRight,
  Star, Search, ArrowLeft, Brain, Sparkles, Globe, Award
} from 'lucide-react';
import Link from 'next/link';

export default function ObjetivosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/super-admin/documentacion">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Administración de Proyecto
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Objetivos del Proyecto</h1>
          <p className="text-gray-600">Visión, misión y objetivos estratégicos del Sistema ISO 9001 App</p>
        </div>
      </div>

      {/* Visión Filosófica */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Visión Filosófica del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-blue-600">ISO 9001 App</strong> nace de la convicción de que la <strong>calidad no es un proceso burocrático</strong>, 
            sino una <strong>filosofía de trabajo</strong> que debe estar al alcance de todas las organizaciones. Creemos que la tecnología debe 
            <strong> democratizar el acceso a sistemas de gestión de calidad profesionales</strong>, eliminando las barreras de complejidad, 
            costo y conocimiento técnico.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 italic">
              "La calidad es el resultado de una cultura empresarial consciente, no un conjunto de procedimientos. 
              Nuestro objetivo es transformar esta cultura a través de la tecnología inteligente."
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Reconocemos que cada colaborador, desde el operario de planta hasta el director general, tiene un rol fundamental 
            en el sistema de calidad. Por ello, <strong>ISO 9001 App</strong> está diseñado para <strong>empoderar a cada nivel organizacional</strong> 
            con herramientas específicas, contextualizadas y accesibles que facilitan su participación activa en la mejora continua.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-900">Excelencia</h4>
                <p className="text-sm text-blue-700">Compromiso con la calidad en cada detalle</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-900">Inclusión</h4>
                <p className="text-sm text-green-700">Tecnología accesible para todos</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-900">Evolución</h4>
                <p className="text-sm text-purple-700">Mejora continua e innovación constante</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Visión Funcional y de Mercado */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Propuesta de Valor y Posicionamiento de Mercado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Problema que Resolvemos</h3>
          <p className="text-gray-700 leading-relaxed">
            Las organizaciones enfrentan múltiples desafíos al implementar y mantener sistemas de gestión de calidad ISO 9001:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Complejidad Técnica</h4>
                    <p className="text-sm text-red-700">Los sistemas tradicionales requieren consultores externos costosos y conocimiento especializado profundo.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Fragmentación de Procesos</h4>
                    <p className="text-sm text-red-700">Documentos dispersos, sistemas desconectados y falta de trazabilidad entre procesos, auditorías y mejoras.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Resistencia al Cambio</h4>
                    <p className="text-sm text-red-700">Los colaboradores perciben la ISO como burocracia adicional, no como herramienta de valor.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Falta de Inteligencia</h4>
                    <p className="text-sm text-red-700">Ausencia de asesoramiento contextual y personalizado según el rol, proceso y necesidad específica.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-semibold text-lg text-gray-900 mt-6">Nuestra Solución Diferenciadora</h3>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-800">
              <strong>ISO 9001 App</strong> es el <strong>primer sistema integral de gestión de calidad con inteligencia artificial integrada</strong>, 
              que unifica todos los módulos necesarios para implementar, mantener y mejorar continuamente un SGC, 
              con un <strong>asesor virtual experto</strong> disponible 24/7 para cada usuario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Integración Total</h4>
                    <p className="text-sm text-gray-700">8 módulos completamente integrados: Procesos, Auditorías, RRHH, Documentos, Mejoras, CRM, Indicadores y Super Admin.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">IA Contextual</h4>
                    <p className="text-sm text-gray-700">Don Candidos adapta sus respuestas según el puesto, proceso y nivel de experiencia del usuario.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Experiencia de Usuario</h4>
                    <p className="text-sm text-gray-700">Interfaz moderna e intuitiva inspirada en las mejores prácticas de UX contemporáneas.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Trazabilidad Completa</h4>
                    <p className="text-sm text-gray-700">Seguimiento total desde requisitos ISO hasta auditorías, hallazgos, acciones y verificaciones.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Don Candidos - Asesor IA */}
      <Card className="mb-6 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Don Candidos: El Asesor de Calidad Inteligente
            <Badge className="ml-2 bg-purple-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-purple-600">Don Candidos</strong> es el <strong>corazón inteligente</strong> de ISO 9001 App. 
            No es simplemente un chatbot, sino un <strong>asesor experto multinivel</strong> que combina conocimiento profundo de ISO 9001, 
            experiencia en gestión de calidad y comprensión contextual del negocio.
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">Capacidades del Asesor</h4>
            <ul className="space-y-2 text-purple-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span><strong>Asesoramiento en Implementación:</strong> Guía paso a paso en la implementación de requisitos ISO 9001</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span><strong>Capacitación Continua:</strong> Explica conceptos de calidad adaptados al nivel de comprensión del usuario</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span><strong>Simplificación de Tareas:</strong> Ayuda a completar formularios, redactar objetivos y documentar procesos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span><strong>Auditoría Inteligente:</strong> Asiste en la preparación, ejecución y seguimiento de auditorías internas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span><strong>Análisis de Riesgos:</strong> Evalúa riesgos de negocio y propone acciones preventivas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span><strong>Generación de Informes:</strong> Crea reportes automáticos con análisis y recomendaciones</span>
              </li>
            </ul>
          </div>

          <h4 className="font-semibold text-gray-900 mt-4">Roles de Don Candidos</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h5 className="font-semibold text-blue-900 mb-1">Consultor de Calidad</h5>
                <p className="text-sm text-blue-700">Experto en ISO 9001 que asesora en interpretación y aplicación de la norma</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                <h5 className="font-semibold text-green-900 mb-1">Asesor de Gestión</h5>
                <p className="text-sm text-green-700">Analiza procesos de negocio y propone mejoras en eficiencia y eficacia</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <Search className="w-8 h-8 text-orange-600 mb-2" />
                <h5 className="font-semibold text-orange-900 mb-1">Auditor Virtual</h5>
                <p className="text-sm text-orange-700">Evalúa cumplimiento normativo y detecta no conformidades potenciales</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg mt-4">
            <p className="text-sm text-gray-800">
              <strong>💡 Innovación clave:</strong> Don Candidos aprende del contexto de cada organización, adaptando sus respuestas 
              a la industria, tamaño, madurez del SGC y objetivos específicos. No ofrece respuestas genéricas, sino 
              <strong> asesoramiento personalizado y accionable</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Arquitectura Técnica - PARTE 2 EN SIGUIENTE MENSAJE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-700" />
            Arquitectura Técnica del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            ISO 9001 App está construido con tecnologías de vanguardia que garantizan <strong>escalabilidad, seguridad y rendimiento</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Frontend Moderno</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Next.js 14</strong> con App Router</li>
                  <li>• <strong>TypeScript</strong> para seguridad de tipos</li>
                  <li>• <strong>Tailwind CSS</strong> para diseño responsive</li>
                  <li>• <strong>Shadcn/ui</strong> componentes reutilizables</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Backend Robusto</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Node.js + Express</strong> API RESTful</li>
                  <li>• <strong>MongoDB Atlas</strong> base de datos escalable</li>
                  <li>• <strong>Mongoose</strong> ODM con validación Zod</li>
                  <li>• <strong>JWT</strong> autenticación segura</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Inteligencia Artificial</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Claude API (Anthropic)</strong></li>
                  <li>• Prompts contextuales dinámicos</li>
                  <li>• Base de conocimiento ISO 9001</li>
                  <li>• Memoria de conversación persistente</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Infraestructura</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Multi-tenant</strong> architecture</li>
                  <li>• Rate limiting y CORS</li>
                  <li>• Logging completo de auditoría</li>
                  <li>• Backup automático diario</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Módulos del Sistema */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-6 h-6 text-blue-600" />
            Módulos Integrados del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            El sistema está compuesto por <strong>8 módulos principales</strong> que cubren todo el ciclo de gestión de calidad:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/super-admin/documentacion/modulos/procesos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
                <CardContent className="p-4 text-center">
                  <Workflow className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Gestión de Procesos</h4>
                  <Badge className="bg-green-100 text-green-800 text-xs">85%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Define y documenta procesos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/auditorias">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
                <CardContent className="p-4 text-center">
                  <Search className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Auditorías</h4>
                  <Badge className="bg-green-100 text-green-800 text-xs">90%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Auditorías completas</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/rrhh">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">RRHH</h4>
                  <Badge className="bg-green-100 text-green-800 text-xs">85%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Gestión de personal</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/documentos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Documentos</h4>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">75%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Control documental</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/mejoras">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Mejoras</h4>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">70%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Hallazgos y acciones</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/crm">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200">
                <CardContent className="p-4 text-center">
                  <Briefcase className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">CRM Agro</h4>
                  <Badge className="bg-green-100 text-green-800 text-xs">80%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Gestión de clientes</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/indicadores">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-200">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Indicadores</h4>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">60%</Badge>
                  <p className="text-xs text-gray-600 mt-2">KPIs de calidad</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/super-admin/documentacion/modulos/superadmin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Super Admin</h4>
                  <Badge className="bg-red-100 text-red-800 text-xs">15%</Badge>
                  <p className="text-xs text-gray-600 mt-2">Administración</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/super-admin/documentacion/modulos">
              <Button variant="outline" className="gap-2">
                Ver Detalles de Todos los Módulos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos Estratégicos 2025 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-red-600" />
            Objetivos Estratégicos 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                num: "1",
                title: "Completar Funcionalidades Core",
                desc: "Finalizar los módulos críticos (Procesos, Auditorías, Mejoras) al 100% de funcionalidad operativa.",
                badge: "Q1 2025",
                color: "blue"
              },
              {
                num: "2",
                title: "Potenciar Don Candidos",
                desc: "Expandir la base de conocimiento de la IA y mejorar la contextualización por industria y tamaño de empresa.",
                badge: "Q2 2025",
                color: "green"
              },
              {
                num: "3",
                title: "Validación con Usuarios Reales",
                desc: "Implementar el sistema en 5 organizaciones piloto de diferentes sectores para validar usabilidad y efectividad.",
                badge: "Q2-Q3 2025",
                color: "purple"
              },
              {
                num: "4",
                title: "Certificación ISO 9001",
                desc: "Lograr que las organizaciones piloto obtengan certificación ISO 9001 utilizando exclusivamente nuestra plataforma.",
                badge: "Q4 2025",
                color: "orange"
              },
              {
                num: "5",
                title: "Escalabilidad Enterprise",
                desc: "Preparar la infraestructura para soportar 1000+ organizaciones con multi-tenancy robusto.",
                badge: "Q3-Q4 2025",
                color: "red"
              },
              {
                num: "6",
                title: "Lanzamiento Comercial",
                desc: "Iniciar estrategia de marketing y ventas B2B con modelo SaaS por suscripción mensual.",
                badge: "Q4 2025",
                color: "indigo"
              }
            ].map((obj) => (
              <Card key={obj.num} className={`border-${obj.color}-200`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 bg-${obj.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-${obj.color}-600 font-bold`}>{obj.num}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{obj.title}</h4>
                      <p className="text-sm text-gray-700">{obj.desc}</p>
                      <Badge className={`mt-2 bg-${obj.color}-100 text-${obj.color}-800`}>{obj.badge}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Llamado a la Acción */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Construyendo el Futuro de la Calidad</h3>
          <p className="text-blue-100 mb-4">
            ISO 9001 App no es solo software, es una <strong>revolución en la forma de entender y aplicar la gestión de calidad</strong>. 
            Cada línea de código, cada funcionalidad, cada respuesta de Don Candidos está diseñada para hacer que la excelencia 
            sea accesible, medible y sostenible.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/super-admin/documentacion/modulos">
              <Button variant="secondary" className="gap-2">
                <FileText className="w-4 h-4" />
                Explorar Módulos
              </Button>
            </Link>
            <Link href="/super-admin/documentacion/gaps">
              <Button variant="secondary" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Ver Análisis de Gaps
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






