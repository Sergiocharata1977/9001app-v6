'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Wheat,
  MapPin,
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function CRMDashboardPage() {
  // Datos de ejemplo (en producción vendrían del backend)
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
      name: 'Legajos Pendientes',
      value: '34',
      change: '-8%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'green'
    },
    {
      name: 'Análisis en Proceso',
      value: '18',
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      name: 'Créditos Aprobados',
      value: '156',
      change: '+23%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      name: 'Tasa de Aprobación',
      value: '78%',
      change: '+3%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      name: 'Score Promedio',
      value: '72',
      change: '+5',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'blue'
    },
  ];

  const recentOpportunities = [
    {
      id: 1,
      company: 'Estancia San Miguel',
      contact: 'Carlos Rodriguez',
      value: '$125,000',
      stage: 'Negociación',
      risk: 'Bajo',
      product: 'Semillas de Soja',
      probability: 75,
    },
    {
      id: 2,
      company: 'Agropecuaria Los Pinos',
      contact: 'María González',
      value: '$89,500',
      stage: 'Propuesta',
      risk: 'Medio',
      product: 'Agroquímicos',
      probability: 60,
    },
    {
      id: 3,
      company: 'Campo Verde SA',
      contact: 'Roberto Silva',
      value: '$210,000',
      stage: 'Calificación',
      risk: 'Alto',
      product: 'Fertilizantes',
      probability: 40,
    },
  ];

  const riskAlerts = [
    {
      id: 1,
      company: 'Estancia El Progreso',
      type: 'Financiero',
      severity: 'Alto',
      message: 'Flujo de caja negativo en los últimos 3 meses',
      date: '2024-01-15',
    },
    {
      id: 2,
      company: 'Agro Santa Fe',
      type: 'Climático',
      severity: 'Medio',
      message: 'Zona afectada por sequía prolongada',
      date: '2024-01-14',
    },
    {
      id: 3,
      company: 'Campo Dorado',
      type: 'Agronómico',
      severity: 'Bajo',
      message: 'Plagas detectadas en cultivos de maíz',
      date: '2024-01-13',
    },
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

  const getRiskBadgeColor = (risk: string) => {
    if (risk === 'Bajo') return 'bg-green-100 text-green-800 border-green-200';
    if (risk === 'Medio') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getSeverityBadgeColor = (severity: string) => {
    if (severity === 'Bajo') return 'bg-green-100 text-green-800 border-green-200';
    if (severity === 'Medio') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
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
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Oportunidad
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ml-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Opportunities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Oportunidades Recientes</CardTitle>
              <Link href="/crm/oportunidades">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
            <CardDescription>Últimas oportunidades de negocio registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{opportunity.company}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskBadgeColor(opportunity.risk)}`}>
                        {opportunity.risk}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{opportunity.contact}</p>
                    <p className="text-sm text-gray-500">{opportunity.product}</p>
                  </div>
                  <div className="text-right space-y-1 ml-4">
                    <p className="font-semibold text-gray-900">{opportunity.value}</p>
                    <p className="text-sm text-gray-600">{opportunity.stage}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${opportunity.probability}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{opportunity.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alertas de Riesgo</CardTitle>
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </div>
            <CardDescription>Alertas de riesgo financiero y agronómico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {alert.type === 'Financiero' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                    {alert.type === 'Climático' && <MapPin className="h-5 w-5 text-green-600" />}
                    {alert.type === 'Agronómico' && <Wheat className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{alert.company}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityBadgeColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{alert.date}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">{alert.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Accesos directos a las funciones más utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/crm/clientes">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <Building2 className="h-6 w-6" />
                <span>Nuevo Cliente</span>
              </Button>
            </Link>
            <Link href="/crm/analisis-riesgo">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Nuevo Análisis</span>
              </Button>
            </Link>
            <Link href="/crm/aprobacion">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span>Aprobar Crédito</span>
              </Button>
            </Link>
            <Link href="/crm/legajos">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Nuevo Legajo</span>
              </Button>
            </Link>
            <Link href="/rrhh">
              <Button variant="outline" className="h-20 w-full flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Recursos Humanos</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}