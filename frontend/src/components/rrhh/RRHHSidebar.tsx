'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
  Calendar,
  BarChart3,
  FileText,
  Home,
  ChevronLeft
} from 'lucide-react';

export function RRHHSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      titulo: 'Dashboard RRHH',
      ruta: '/rrhh',
      icon: Home,
      exact: true
    },
    {
      titulo: 'Personal',
      ruta: '/rrhh/personal',
      icon: Users
    },
    {
      titulo: 'Departamentos',
      ruta: '/rrhh/departamentos',
      icon: Building2
    },
    {
      titulo: 'Puestos',
      ruta: '/rrhh/puestos',
      icon: Briefcase
    },
    {
      titulo: 'Competencias',
      ruta: '/rrhh/competencias',
      icon: GraduationCap
    },
    {
      titulo: 'Capacitaciones',
      ruta: '/rrhh/capacitaciones',
      icon: GraduationCap
    },
    {
      titulo: 'Evaluaciones',
      ruta: '/rrhh/evaluaciones',
      icon: ClipboardCheck
    },
    {
      titulo: 'Clima Laboral',
      ruta: '/rrhh/clima-laboral',
      icon: TrendingUp
    },
    {
      titulo: 'Gestión Desempeño',
      ruta: '/rrhh/desempeno',
      icon: BarChart3
    },
    {
      titulo: 'Ausencias',
      ruta: '/rrhh/ausencias',
      icon: Calendar
    },
    {
      titulo: 'Reclutamiento',
      ruta: '/rrhh/reclutamiento',
      icon: UserPlus
    },
    {
      titulo: 'Indicadores',
      ruta: '/rrhh/indicadores-rrhh',
      icon: BarChart3
    },
    {
      titulo: 'Reportes',
      ruta: '/rrhh/reportes',
      icon: FileText
    }
  ];

  const isActive = (ruta: string, exact?: boolean) => {
    if (exact) return pathname === ruta;
    return pathname?.startsWith(ruta);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">RRHH</h2>
          <Link
            href="/dashboard"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Volver al menú principal"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-sm text-slate-400">Recursos Humanos</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.ruta}>
              <Link
                href={item.ruta}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive(item.ruta, item.exact)
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.titulo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-blue-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🤖</span>
            <span className="text-sm font-semibold">Asistente IA</span>
          </div>
          <p className="text-xs text-slate-300">
            Haz clic en el chat para obtener ayuda
          </p>
        </div>
      </div>
    </aside>
  );
}