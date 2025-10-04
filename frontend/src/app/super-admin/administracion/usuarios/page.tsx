'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowLeft, UserPlus, UserCheck, Shield } from 'lucide-react';
import Link from 'next/link';

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/super-admin/administracion">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Administración
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administración completa de usuarios del sistema</p>
        </div>
      </div>

      {/* Estado del Módulo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Estado del Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Módulo Pendiente de Implementación</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              La gestión de usuarios está planificada para futuras versiones del sistema.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades Planificadas */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Planificadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Gestión de Usuarios</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Crear y editar usuarios</li>
                <li>• Asignar roles y permisos</li>
                <li>• Resetear contraseñas</li>
                <li>• Activar/desactivar cuentas</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Seguridad</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Auditoría de accesos</li>
                <li>• Control de sesiones</li>
                <li>• Políticas de contraseña</li>
                <li>• Logs de actividad</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
