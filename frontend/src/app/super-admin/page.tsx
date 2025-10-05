'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Users,
  Settings,
  Database,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  BarChart3,
  Target,
  Clock,
  BookOpen,
  FileText,
  TrendingUp
} from 'lucide-react';
import SuperAdminStats from '@/components/super-admin/SuperAdminStats';
import Link from 'next/link';

export default function SuperAdminPage() {

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <SuperAdminStats />

      {/* Secciones principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sección Super Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Super Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Gestión completa del sistema, usuarios, configuración y auditorías.
            </p>
            <div className="grid gap-2">
              <Link href="/super-admin/administracion">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gestión de Usuarios
                </Button>
              </Link>
              <Link href="/super-admin/administracion/configuracion">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración del Sistema
                </Button>
              </Link>
              <Link href="/super-admin/administracion/auditorias">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Auditorías y Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sección Gestión de Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Gestión de Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Dashboard, análisis técnico-funcional y seguimiento del proyecto ISO 9001.
            </p>
            <div className="grid gap-2">
              <Link href="/super-admin/proyecto">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard Proyecto
                </Button>
              </Link>
              <Link href="/super-admin/proyecto/analisis-tecnico">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Análisis Técnico-Funcional
                </Button>
              </Link>
              <Link href="/super-admin/proyecto/analisis">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Todos los Análisis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso del Proyecto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Progreso General del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progreso Total</span>
              <span className="text-sm font-semibold">78%</span>
            </div>
            <Progress value={78} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">19</p>
                <p className="text-xs text-gray-600">Módulos Completados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-xs text-gray-600">Módulos en Desarrollo</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-xs text-gray-600">Gaps Críticos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">2</p>
                <p className="text-xs text-gray-600">Próximas Versiones</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
