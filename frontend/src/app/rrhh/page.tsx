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
  FileText,
  Target,
  Clock
} from 'lucide-react';

export default function Page() {
  // Configuración de módulos RRHH ACTUALIZADA
  const modulosRRHH = [
    {
      id: 'personal',
      titulo: 'Gestión de Personal',
      descripcion: 'Administración completa de empleados',
      icon: Users,
      ruta: '/rrhh/personal',
      color: 'blue',
      habilitado: true,
      estadisticas: { total: 45, activos: 42 }
    },
    {
      id: 'departamentos',
      titulo: 'Departamentos',
      descripcion: 'Estructura organizacional',
      icon: Building2,
      ruta: '/rrhh/departamentos',
      color: 'purple',
      habilitado: true,
      estadisticas: { total: 6 }
    },
    {
      id: 'puestos',
      titulo: 'Puestos de Trabajo',
      descripcion: 'Definición de roles y puestos',
      icon: Briefcase,
      ruta: '/rrhh/puestos',
      color: 'indigo',
      habilitado: true,
      estadisticas: { total: 12 }
    },
    {
      id: 'competencias',
      titulo: 'Competencias',
      descripcion: 'Gestión de competencias del personal',
      icon: GraduationCap,
      ruta: '/rrhh/competencias',
      color: 'teal',
      habilitado: true,
      estadisticas: { total: 25 }
    },
    {
      id: 'capacitaciones',
      titulo: 'Capacitaciones',
      descripcion: 'Programación y seguimiento de capacitaciones',
      icon: GraduationCap,
      ruta: '/rrhh/capacitaciones',
      color: 'green',
      habilitado: true,
      estadisticas: { programadas: 8, completadas: 15 }
    },
    {
      id: 'evaluaciones',
      titulo: 'Evaluaciones de Desempeño',
      descripcion: 'Evaluaciones individuales y por objetivos',
      icon: ClipboardCheck,
      ruta: '/rrhh/evaluaciones',
      color: 'orange',
      habilitado: true,
      estadisticas: { pendientes: 5, completadas: 32 }
    },
    // 🆕 NUEVOS MÓDULOS IMPLEMENTADOS
    {
      id: 'clima-laboral',
      titulo: 'Clima Laboral',
      descripcion: 'Encuestas y análisis de clima organizacional',
      icon: TrendingUp,
      ruta: '/rrhh/clima-laboral',
      color: 'cyan',
      habilitado: true,
      estadisticas: { satisfaccion: '85%', respuestas: 42 }
    },
    {
      id: 'desempeno',
      titulo: 'Gestión de Desempeño',
      descripcion: 'Objetivos y seguimiento continuo',
      icon: Target,
      ruta: '/rrhh/desempeno',
      color: 'emerald',
      habilitado: true,
      estadisticas: { objetivos_activos: 156, cumplimiento: '78%' }
    },
    {
      id: 'ausencias',
      titulo: 'Control de Ausencias',
      descripcion: 'Licencias, vacaciones y ausencias',
      icon: Calendar,
      ruta: '/rrhh/ausencias',
      color: 'amber',
      habilitado: true,
      estadisticas: { pendientes: 3, aprobadas: 28 }
    },
    {
      id: 'reclutamiento',
      titulo: 'Reclutamiento y Selección',
      descripcion: 'Vacantes y proceso de contratación',
      icon: UserPlus,
      ruta: '/rrhh/reclutamiento',
      color: 'violet',
      habilitado: true,
      estadisticas: { vacantes_activas: 4, candidatos: 23 }
    },
    {
      id: 'nomina',
      titulo: 'Gestión de Nómina',
      descripcion: 'Cálculo de salarios y liquidaciones',
      icon: DollarSign,
      ruta: '/rrhh/nomina',
      color: 'rose',
      habilitado: false, // 🚧 Pendiente de planificación específica
      estadisticas: { periodo_actual: 'Nov 2024' }
    },
    {
      id: 'indicadores',
      titulo: 'Indicadores RRHH',
      descripcion: 'Dashboard de métricas y KPIs',
      icon: BarChart3,
      ruta: '/rrhh/indicadores',
      color: 'slate',
      habilitado: true,
      estadisticas: { kpis_actualizados: 6 }
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recursos Humanos</h1>
        <p className="text-muted-foreground">
          Sistema integral de gestión de recursos humanos ISO 9001
        </p>
      </div>

      {/* Estadísticas Generales */}
      <RRHHStats />

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {modulosRRHH.map((modulo) => (
          <RRHHDashboardCard
            key={modulo.id}
            modulo={modulo}
          />
        ))}
      </div>

      {/* Accesos Rápidos */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/rrhh/clima-laboral" className="p-4 border rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-cyan-600" />
            <div>
              <p className="font-medium">Nueva Encuesta</p>
              <p className="text-sm text-muted-foreground">Clima laboral</p>
            </div>
          </div>
        </Link>

        <Link href="/rrhh/ausencias" className="p-4 border rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium">Solicitar Ausencia</p>
              <p className="text-sm text-muted-foreground">Licencias y vacaciones</p>
            </div>
          </div>
        </Link>

        <Link href="/rrhh/desempeno" className="p-4 border rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium">Mis Objetivos</p>
              <p className="text-sm text-muted-foreground">Seguimiento de metas</p>
            </div>
          </div>
        </Link>

        <Link href="/rrhh/indicadores" className="p-4 border rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            <div>
              <p className="font-medium">Dashboard KPIs</p>
              <p className="text-sm text-muted-foreground">Métricas RRHH</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}