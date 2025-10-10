'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Shield,
  Settings,
  BookOpen,
  Target,
  Users,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  X,
  Menu,
  ClipboardList,
  TestTube2,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

const superAdminNavigation: MenuItem[] = [
  { name: 'Dashboard', href: '/super-admin', icon: BarChart3 },
  { name: 'Roadmap Kanban', href: '/super-admin/tareas', icon: ClipboardList },
  {
    name: 'Administración',
    icon: Shield,
    children: [
      { name: 'Usuarios', href: '/super-admin/administracion/usuarios', icon: Users },
      { name: 'Configuración', href: '/super-admin/administracion/configuracion', icon: Settings },
      { name: 'Auditorías', href: '/super-admin/administracion/auditorias', icon: FileText },
    ]
  },
  {
    name: 'Testing',
    icon: TestTube2,
    children: [
      { name: 'Dashboard Testing', href: '/super-admin/testing', icon: Monitor },
      { name: 'Tests RRHH', href: '/super-admin/testing/rrhh', icon: Users },
      { name: 'Tests CRM', href: '/super-admin/testing/crm', icon: Target },
      { name: 'Tests Auditorías', href: '/super-admin/testing/auditorias', icon: FileText },
    ]
  },
  {
    name: 'Documentación',
    icon: FileText,
    children: [
      { name: 'Casos de Uso', href: '/super-admin/casos-uso', icon: BookOpen },
      { name: 'Documentación Módulos', href: '/super-admin/documentacion', icon: FileText },
    ]
  },
];

interface SuperAdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function SuperAdminSidebar({ sidebarOpen, setSidebarOpen }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Administración', 'Documentación']);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href?: string) => pathname === href;

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              level === 0 ? 'text-blue-100 hover:bg-blue-700 hover:text-white' : 'text-blue-200 hover:bg-blue-800'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">{item.name}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href!}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive(item.href)
            ? 'bg-blue-600 text-white shadow-lg'
            : level === 0
            ? 'text-blue-100 hover:bg-blue-700 hover:text-white'
            : 'text-blue-200 hover:bg-blue-800'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.name}
      </Link>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Super Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Back to main button */}
        <div className="px-4 py-4 border-b border-blue-700">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start text-white border-blue-600 hover:bg-blue-700 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Sistema
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {superAdminNavigation.map(item => renderMenuItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <div className="bg-blue-900 rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Super Admin</p>
                <p className="text-xs text-blue-300">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
