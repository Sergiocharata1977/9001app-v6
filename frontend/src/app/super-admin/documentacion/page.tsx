'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Target,
  FileText,
  AlertTriangle,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdministracionProyectoPage() {
  const docSections = [
    {
      title: 'Objetivos del Proyecto',
      description: 'Metas, KPIs y objetivos estratégicos del sistema ISO 9001.',
      icon: <Target className="w-6 h-6" />,
      href: '/super-admin/administracion-proyecto/objetivos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Módulos del Sistema',
      description: 'Lista completa de módulos, estado de implementación y progreso.',
      icon: <FileText className="w-6 h-6" />,
      href: '/super-admin/administracion-proyecto/modulos',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Análisis de Gaps',
      description: 'Identificación de brechas, riesgos y áreas de mejora.',
      icon: <AlertTriangle className="w-6 h-6" />,
      href: '/super-admin/administracion-proyecto/gaps',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
          <h1 className="text-2xl font-bold text-gray-900">Administración de Proyecto</h1>
          <p className="text-gray-600">Gestión completa del proyecto ISO 9001: objetivos, módulos, análisis de gaps y progreso</p>
        </div>
      </div>

      {/* Secciones de Documentación */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docSections.map((section, index) => (
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
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ver Documentación
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen del Proyecto */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Ejecutivo del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Estado General</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Módulos Implementados:</span>
                  <span className="font-semibold text-green-600">19/24</span>
                </div>
                <div className="flex justify-between">
                  <span>Progreso Total:</span>
                  <span className="font-semibold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gaps Críticos:</span>
                  <span className="font-semibold text-orange-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Próximas Versiones:</span>
                  <span className="font-semibold text-purple-600">2</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Módulos Principales</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sistema de Procesos</li>
                <li>• Gestión de Calidad</li>
                <li>• Recursos Humanos</li>
                <li>• CRM Agro</li>
                <li>• Auditorías</li>
                <li>• Documentación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
