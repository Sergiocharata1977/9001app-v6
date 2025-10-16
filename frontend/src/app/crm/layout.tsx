'use client';

import { Button } from '@/components/ui/button';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
// Import icons
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Briefcase,
    Building2,
    Calendar,
    FileText,
    Menu,
    Star,
    Target,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster } from 'sonner';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const crmNavigation: MenuItem[] = [
  { name: 'Dashboard', href: '/crm', icon: BarChart3 },
  { name: 'Oportunidades', href: '/crm/oportunidades', icon: Target },
  { name: 'Empresas', href: '/crm/empresas', icon: Building2 },
  { name: 'Satisfacción Clientes', href: '/crm/satisfaccion', icon: Star },
  { name: 'Acciones', href: '/crm/actividades', icon: Calendar },
  { name: 'Contactos', href: '/crm/contactos', icon: Users },
  { name: 'Vendedores', href: '/crm/vendedores', icon: Briefcase },
  { name: 'Análisis de Riesgo', href: '/crm/analisis-riesgo', icon: AlertTriangle },
  { name: 'Legajos', href: '/crm/legajos', icon: FileText },
];

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <OrganizationProvider>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-emerald-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-emerald-900">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CRM Agro</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-emerald-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Back to main button */}
          <div className="px-4 py-4 border-b border-emerald-700">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-start text-white border-emerald-600 hover:bg-emerald-700 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Sistema
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {crmNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-emerald-700">
            <div className="bg-emerald-900 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Usuario CRM</p>
                  <p className="text-xs text-emerald-300">Vendedor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-gray-900">CRM Agro</span>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
    </OrganizationProvider>
  );
}

