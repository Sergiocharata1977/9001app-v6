'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Settings,
  FileText,
  Shield,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdministracionPage() {
  const adminSections = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administración completa de usuarios, roles y permisos del sistema.',
      icon: <Users className="w-6 h-6" />,
      href: '/super-admin/administracion/usuarios',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Configuración del Sistema',
      description: 'Parámetros globales, integraciones y personalización del sistema.',
      icon: <Settings className="w-6 h-6" />,
      href: '/super-admin/administracion/configuracion',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Auditorías y Logs',
      description: 'Monitoreo de actividades, logs del sistema y reportes de auditoría.',
      icon: <FileText className="w-6 h-6" />,
      href: '/super-admin/administracion/auditorias',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/super-admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración del Sistema</h1>
          <p className="text-gray-600">Gestión completa de usuarios, configuración y auditorías</p>
        </div>
      </div>

      {/* Secciones de Administración */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${section.bgColor}`}>
                  <div className={section.color}>{section.icon}</div>
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{section.description}</p>
              <Link href={section.href}>
                <Button className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Funcionalidades Principales</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gestión completa de usuarios y roles</li>
                <li>• Configuración del sistema</li>
                <li>• Auditorías y monitoreo</li>
                <li>• Backup y restauración</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Estado Actual</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Módulos pendientes de implementación</p>
                <p>• Estructura preparada para desarrollo</p>
                <p>• Navegación completa configurada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
