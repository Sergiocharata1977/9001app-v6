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

export default function CRMDashboardPage() {
  // Datos estáticos para evitar errores de API
  const stats = [
    {
      name: 'Clientes Activos',
      value: '248',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'blue'
    },
    {
      name: 'Oportunidades',
      value: '34',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'green'
    },
    {
      name: 'Contactos',
      value: '156',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'purple'
    },
    {
      name: 'Ventas del Mes',
      value: '$125K',
      change: '+23%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CRM</h1>
          <p className="text-gray-600 mt-2">
            Resumen ejecutivo de tu CRM Agropecuario
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Link href="/crm/oportunidades">
              <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                Nueva Oportunidad
              </Button>
            </Link>
            <Link href="/crm/empresas">
              <Button variant="outline" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Gestionar Empresas
              </Button>
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
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
            <Link href="/crm/oportunidades">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <Target className="h-6 w-6 text-emerald-600" />
                <span>Oportunidades</span>
              </Button>
            </Link>
            <Link href="/crm/empresas">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span>Empresas</span>
              </Button>
            </Link>
            <Link href="/crm/contactos">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <Users className="h-6 w-6 text-orange-600" />
                <span>Contactos</span>
              </Button>
            </Link>
            <Link href="/rrhh/personal?tipo=vendedor">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <Briefcase className="h-6 w-6 text-indigo-600" />
                <span>Vendedores</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}