'use client';

import Link from 'next/link';
import { RRHHDashboardCard } from '@/components/rrhh/RRHHDashboardCard';
import { RRHHStats } from '@/components/rrhh/RRHHStats';
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
  Calendar,
  DollarSign,
  BarChart3,
  FileText
} from 'lucide-react';

export default function Page() {
  // Configuración de módulos RRHH
  const modulosRRHH = [
    {
      id: 'personal',
      titulo: 'Gestión de Personal',
      descripcion: 'Administración completa de empleados',
      icon: Users,
      ruta: '/rrhh/personal',
      color: 'blue',
      habilitado: true, // ✅ Funcional
      estadisticas: { total: 45, activos: 42 }
    },
    {
      id: 'departamentos',
      titulo: 'Departamentos',
      descripcion: 'Estructura organizacional',
      icon: Building2,
      ruta: '/rrhh/departamentos',
      color: 'purple',
      habilitado: true, // ✅ Funcional
      estadisticas: { total: 6 }
    },
    {
      id: 'puestos',
      titulo: 'Puestos de Trabajo',
      descripcion: 'Definición de roles y puestos',
      icon: Briefcase,
      ruta: '/rrhh/puestos',
      color: 'indigo',
      habilitado: true, // ✅ Funcional
      estadisticas: { total: 12 }
    },
    {
      id: 'competencias',
      titulo: 'Competencias',
      descripcion: 'Gestión de competencias del personal',
      icon: GraduationCap,
      ruta: '/rrhh/competencias',
      color: 'teal',
      habilitado: true, // ✅ Funcional
      estadisticas: { total: 25 }
    },
    {
      id: 'capacitaciones',
      titulo: 'Capacitaciones',
      descripcion: 'Programación y seguimiento de capacitaciones',
      icon: GraduationCap,
      ruta: '/rrhh/capacitaciones',
      color: 'green',
      habilitado: true, // ✅ Funcional
      estadisticas: { programadas: 8, completadas: 15 }
    },
    {
      id: 'evaluaciones',
      titulo: 'Evaluaciones de Desempeño',
      descripcion: 'Evaluaciones individuales y por objetivos',
      icon: ClipboardCheck,
      ruta: '/rrhh/evaluaciones',
      color: 'orange',
      habilitado: true, // ✅ Funcional
      estadisticas: { pendientes: 5, completadas: 32 }
    },
    {
      id: 'clima-laboral',
      titulo: 'Clima Laboral',
      descripcion: 'Encuestas y análisis de clima organizacional',
      icon: TrendingUp,
      ruta: '/rrhh/clima-laboral',
      color: 'cyan',
      habilitado: true, // 🆕 Nuevo módulo
      estadisticas: { ultima_encuesta: '85% satisfacción' }
    },
    {
      id: 'desempeno',
      titulo: 'Gestión de Desempeño',
      descripcion: 'Objetivos y seguimiento continuo',
      icon: BarChart3,
      ruta: '/rrhh/desempeno',
      color: 'emerald',
      habilitado: true, // 🆕 Nuevo módulo
      estadisticas: { objetivos_activos: 120 }
    },
    {
      id: 'ausencias',
      titulo: 'Control de Ausencias',
      descripcion: 'Vacaciones, permisos y licencias',
      icon: Calendar,
      ruta: '/rrhh/ausencias',
      color: 'amber',
      habilitado: true, // 🆕 Nuevo módulo
      estadisticas: { solicitudes_pendientes: 3 }
    },
    {
      id: 'reclutamiento',
      titulo: 'Reclutamiento y Selección',
      descripcion: 'Gestión de vacantes y candidatos',
      icon: UserPlus,
      ruta: '/rrhh/reclutamiento',
      color: 'pink',
      habilitado: true, // 🆕 Nuevo módulo
      estadisticas: { vacantes_abiertas: 2 }
    },
    {
      id: 'nomina',
      titulo: 'Gestión de Nómina',
      descripcion: 'Procesamiento de nómina y pagos',
      icon: DollarSign,
      ruta: '/rrhh/nomina',
      color: 'gray',
      habilitado: false, // ❌ BLOQUEADO - Próximamente
      estadisticas: null
    },
    {
      id: 'indicadores',
      titulo: 'Indicadores RRHH',
      descripcion: 'KPIs y métricas de recursos humanos',
      icon: BarChart3,
      ruta: '/rrhh/indicadores-rrhh',
      color: 'violet',
      habilitado: true, // 🆕 Nuevo módulo
      estadisticas: { indicadores: 8 }
    },
    {
      id: 'reportes',
      titulo: 'Reportes e Informes',
      descripcion: 'Generación de reportes gerenciales',
      icon: FileText,
      ruta: '/rrhh/reportes',
      color: 'slate',
      habilitado: true, // 🆕 Nuevo módulo
      estadisticas: { reportes_generados: 12 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Recursos Humanos
        </h1>
        <p className="text-gray-600 mt-2">
          Gestión integral del capital humano según ISO 9001
        </p>
      </div>

      {/* Métricas RRHH */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Métricas RRHH</h2>
        {/* @ts-expect-error Server/Client boundary */}
        {/* RRHHMetrics es cliente, este contenedor es servidor */}
        <div>
          {/* Render del componente cliente */}
        </div>
      </section>

      {/* Estadísticas Principales */}
      <RRHHStats />

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulosRRHH.map((modulo) => (
          <RRHHDashboardCard
            key={modulo.id}
            {...modulo}
          />
        ))}
      </div>

      {/* Acceso Rápido a Otros Módulos */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Acceso a CRM</h3>
            <p className="text-sm text-green-700">Módulo comercial y análisis de riesgo</p>
          </div>
        </div>
        <Link 
          href="/crm/dashboard" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          Ir a CRM Comercial
        </Link>
      </div>

      {/* Alertas IA */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Asistente IA</h3>
            <p className="text-sm text-blue-700">Sugerencias inteligentes</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• 3 capacitaciones pendientes de programar</li>
          <li>• 5 evaluaciones de desempeño vencen esta semana</li>
          <li>• Rotación de personal aumentó 15% - Análisis recomendado</li>
        </ul>
      </div>
    </div>
  );
}