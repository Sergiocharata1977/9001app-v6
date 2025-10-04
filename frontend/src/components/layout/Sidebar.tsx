'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Settings,
  Users,
  BarChart3,
  Shield,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  BookOpen,
  Workflow,
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle,
  CheckCircle,
  Zap,
  List,
  Package,
  ClipboardCheck,
  MessageSquare,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  children?: MenuItem[];
}

const navigation: MenuItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Procesos', href: '/procesos', icon: Workflow },
  { name: 'Auditorías', href: '/auditorias', icon: Search },
  {
    name: 'Mejoras',
    href: '/mejoras',
    icon: Zap,
    children: [
      { name: 'Hallazgos', href: '/hallazgos', icon: AlertTriangle },
      { name: 'Acciones', href: '/acciones', icon: CheckCircle }
    ]
  },
  {
    name: 'Módulo de Calidad',
    href: '/calidad',
    icon: Award,
    children: [
      { name: 'Dashboard', href: '/calidad', icon: BarChart3 },
      { name: 'Política de Calidad', href: '/calidad/politica', icon: FileText },
      { name: 'Análisis AMFE', href: '/calidad/amfe', icon: AlertTriangle },
      { name: 'Análisis FODA', href: '/calidad/foda', icon: TrendingUp },
      { name: 'Reuniones', href: '/calidad/reuniones', icon: Calendar },
      { name: 'Organigrama', href: '/calidad/organigrama', icon: Building2 }
    ]
  },
  { name: 'Diseño y desarrollo de Producto', href: '/diseno-producto', icon: Package },
  { name: 'Recursos Humanos', href: '/rrhh', icon: Users },
  { name: 'Comercial / CRM', href: '/crm/dashboard', icon: Briefcase },
        {
          name: 'Documentos',
          href: '/documentos',
          icon: FileText,
          children: [
            { name: 'Gestión de Documentos', href: '/documentos', icon: FileText },
            { name: 'Categorías', href: '/documentos/categorias', icon: FolderOpen },
            { name: 'Control de Versiones', href: '/documentos/versiones', icon: ClipboardCheck }
          ]
        },
  {
    name: 'Puntos de Norma',
    href: '/normas',
    icon: BookOpen,
    children: [
      { name: 'Cláusulas ISO', href: '/normas', icon: BookOpen },
      { name: 'Evaluaciones', href: '/normas/evaluaciones', icon: CheckCircle },
      { name: 'Hallazgos', href: '/normas/hallazgos', icon: AlertTriangle },
      { name: 'Plan de Cumplimiento', href: '/normas/plan', icon: Target }
    ]
  },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

export const Sidebar = memo(function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['Procesos']));
  const pathname = usePathname();

  // Optimización: Memoizar función de toggle para evitar recreación
  const toggleMenu = useCallback((menuName: string) => {
    // Usar requestAnimationFrame para animación más suave
    requestAnimationFrame(() => {
      setExpandedMenus(prev => {
        const newSet = new Set(prev);
        if (newSet.has(menuName)) {
          newSet.delete(menuName);
        } else {
          newSet.add(menuName);
        }
        return newSet;
      });
    });
  }, []);

  // Optimización: Memoizar cálculo de menús activos
  const activeMenus = useMemo(() => {
    const active = new Set<string>();
    navigation.forEach(item => {
      if (pathname === item.href || 
          item.children?.some(child => pathname === child.href)) {
        active.add(item.name);
      }
    });
    return active;
  }, [pathname]);

  // Optimización: Función de verificación usando el set memoizado
  const isMenuActive = useCallback((item: MenuItem): boolean => {
    return activeMenus.has(item.name);
  }, [activeMenus]);

  return (
    <div className={`bg-slate-800 text-white h-screen flex flex-col transition-[width] duration-200 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          {collapsed ? (
            <Logo variant="light" size="md" showText={false} />
          ) : (
            <Logo variant="light" size="md" showText={true} />
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-slate-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = isMenuActive(item);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.has(item.name);

            return (
              <div key={item.name}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'text-white hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`${collapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'text-white hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`${collapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {!collapsed && item.name}
                  </Link>
                )}

                {/* Submenú */}
                {hasChildren && isExpanded && !collapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                            isChildActive
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'text-white hover:bg-slate-600 hover:text-white'
                          }`}
                        >
                          <child.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-slate-700 mt-auto">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Usuario</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});