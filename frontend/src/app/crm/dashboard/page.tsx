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
  Briefcase,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function CRMDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CRM</h1>
          <p className="text-gray-600 mt-2">Resumen de gestión de relaciones con clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ver Reportes
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Acción Rápida
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Oportunidades Activas</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +2.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +5.2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ventas del Mes</p>
                <p className="text-2xl font-bold text-gray-900">$125,000</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.3%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actividades Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  -3.1%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/crm/oportunidades/nueva">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Nueva Oportunidad</h3>
                    <p className="text-sm text-gray-600">Crear una nueva oportunidad de venta</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/crm/empresas/nueva">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Nueva Empresa</h3>
                    <p className="text-sm text-gray-600">Registrar un nuevo cliente</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Actividad Reciente
            </CardTitle>
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Resumen del Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">3</div>
              <div className="text-sm text-gray-600">Prospectos</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Calificación</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Propuesta</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">Negociación</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Cierre</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}