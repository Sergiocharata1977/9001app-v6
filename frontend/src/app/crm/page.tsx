'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  Target,
  DollarSign,
  Plus,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function CRMPage() {
  // Datos estáticos para evitar errores de API
  const stats = [
    {
      title: 'Oportunidades Activas',
      value: '12',
      change: '+2.5%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Clientes Activos',
      value: '45',
      change: '+5.2%',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Ventas del Mes',
      value: '$125,000',
      change: '+12.3%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Actividades Pendientes',
      value: '8',
      change: '-3.1%',
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Nueva Oportunidad',
      description: 'Crear una nueva oportunidad de venta',
      href: '/crm/oportunidades/nueva',
      icon: Target,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Nueva Empresa',
      description: 'Registrar un nuevo cliente',
      href: '/crm/empresas/nueva',
      icon: Building2,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Nuevo Contacto',
      description: 'Agregar un contacto',
      href: '/crm/contactos/nuevo',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Nueva Actividad',
      description: 'Programar una actividad',
      href: '/crm/actividades/nueva',
      icon: Briefcase,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CRM</h1>
          <p className="text-gray-600 mt-2">Gestión de relaciones con clientes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Acción Rápida
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Nueva oportunidad creada</p>
                <p className="text-sm text-gray-600">Estancia San Miguel - $25,000</p>
              </div>
              <span className="text-xs text-gray-500">Hace 2 horas</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Cliente actualizado</p>
                <p className="text-sm text-gray-600">Campo Verde SA - Información de contacto</p>
              </div>
              <span className="text-xs text-gray-500">Hace 4 horas</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Actividad completada</p>
                <p className="text-sm text-gray-600">Llamada de seguimiento - Agropecuaria Los Pinos</p>
              </div>
              <span className="text-xs text-gray-500">Hace 6 horas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}