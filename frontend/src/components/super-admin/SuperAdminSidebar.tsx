'use client';

import { MODULE_CONFIG } from '@/config/modules';
import {
    AlertCircle,
    BarChart,
    CheckSquare,
    Database,
    FileText,
    LayoutDashboard,
    Menu,
    Settings,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Componente de barra lateral para el dashboard de Super Admin
 * 
 * Versión simplificada para MVP que muestra enlaces a los módulos principales.
 */
interface SuperAdminSidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function SuperAdminSidebar({ sidebarOpen = false, setSidebarOpen }: SuperAdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Obtener módulos habilitados
  const enabledModules = Object.entries(MODULE_CONFIG)
    .filter(([_, config]) => config.enabled)
    .sort((a, b) => a[1].priority - b[1].priority);

  // Función para obtener el icono según el módulo
  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case 'rrhh':
        return <Users className="w-5 h-5" />;
      case 'crm':
        return <Users className="w-5 h-5" />;
      case 'documentos':
        return <FileText className="w-5 h-5" />;
      case 'auditorias':
        return <CheckSquare className="w-5 h-5" />;
      case 'indicadores':
        return <BarChart className="w-5 h-5" />;
      case 'procesos':
        return <Database className="w-5 h-5" />;
      case 'calidad':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
        }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="text-xl font-bold">9001app MVP</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-800"
        >
          {collapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              href="/super-admin"
              className={`flex items-center px-4 py-3 hover:bg-gray-800 ${collapsed ? 'justify-center' : 'space-x-3'
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Módulos habilitados */}
          {enabledModules.map(([key, config]) => (
            <li key={key}>
              <Link
                href={`/${key}`}
                className={`flex items-center px-4 py-3 hover:bg-gray-800 ${collapsed ? 'justify-center' : 'space-x-3'
                  }`}
              >
                {getModuleIcon(key)}
                {!collapsed && <span>{config.label}</span>}
              </Link>
            </li>
          ))}

          {/* Configuración */}
          <li>
            <Link
              href="/super-admin/config"
              className={`flex items-center px-4 py-3 hover:bg-gray-800 ${collapsed ? 'justify-center' : 'space-x-3'
                }`}
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span>Configuración</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Versión */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          v1.0.0 MVP
        </div>
      )}
    </aside>
  );
}
