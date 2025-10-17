'use client';

import { ModuleStatus } from '@/components/super-admin/ModuleStatus';
import { ModuleToggle } from '@/components/super-admin/ModuleToggle';
import { PerformanceMonitor } from '@/components/super-admin/PerformanceMonitor';
import { SuperAdminHeader } from '@/components/super-admin/SuperAdminHeader';
import { SuperAdminSidebar } from '@/components/super-admin/SuperAdminSidebar';
import { SuperAdminStats } from '@/components/super-admin/SuperAdminStats';
import { SystemLogs } from '@/components/super-admin/SystemLogs';
import { Card, CardContent } from '@/components/ui/card';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { MODULE_CONFIG, getEnabledModules } from '@/config/modules';
import { getCurrentUser } from '@/lib/auth-simple';
import { useEffect, useState } from 'react';

/**
 * Dashboard principal para Super Admin
 * 
 * Esta página muestra el estado general del sistema, métricas clave,
 * logs en tiempo real y permite gestionar la configuración de módulos.
 */
export default function SuperAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    modulesEnabled: 0,
    totalModules: 0,
    testsPass: 0,
    totalTests: 0,
    avgResponseTime: 0,
    errorCount: 0
  });

  // Cargar datos del usuario y estadísticas
  useEffect(() => {
    // Obtener usuario actual
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Calcular estadísticas para el dashboard
    const totalModules = Object.keys(MODULE_CONFIG).length;
    const enabledModules = getEnabledModules().length;

    // Simular estadísticas de tests para MVP
    const totalTests = 20;
    const testsPass = 12; // 60% de tests pasando inicialmente

    // Simular tiempo de respuesta promedio (entre 100ms y 300ms)
    const avgResponseTime = Math.floor(Math.random() * 200) + 100;

    // Simular conteo de errores (entre 0 y 5)
    const errorCount = Math.floor(Math.random() * 6);

    setStats({
      modulesEnabled: enabledModules,
      totalModules,
      testsPass,
      totalTests,
      avgResponseTime,
      errorCount
    });

    setLoading(false);
  }, []);

  // Calcular porcentaje de tests que pasan
  const testPassPercentage = (stats.testsPass / stats.totalTests) * 100;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Header */}
        <SuperAdminHeader>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dashboard Super Admin</h1>
            <span className="text-sm text-gray-500">MVP v1.0</span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                {user.name} ({user.role})
              </div>
            )}
            <LogoutButton />
          </div>
        </SuperAdminHeader>

        {/* Contenido del dashboard */}
        <main className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Estadísticas generales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {stats.modulesEnabled}/{stats.totalModules}
                    </div>
                    <p className="text-sm text-gray-500">Módulos Activos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {stats.testsPass}/{stats.totalTests}
                    </div>
                    <p className="text-sm text-gray-500">Tests Pasando ({testPassPercentage.toFixed(0)}%)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {stats.avgResponseTime}ms
                    </div>
                    <p className="text-sm text-gray-500">Tiempo de Respuesta</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {stats.errorCount}
                    </div>
                    <p className="text-sm text-gray-500">Errores Activos</p>
                  </CardContent>
                </Card>
              </div>

              {/* Estadísticas detalladas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <SuperAdminStats />
                </div>
                <div>
                  <ModuleStatus />
                </div>
              </div>

              {/* Rendimiento y Control de Módulos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <PerformanceMonitor />
                </div>
                <div>
                  <ModuleToggle />
                </div>
              </div>

              {/* Logs del sistema */}
              <div className="mb-6">
                <SystemLogs />
              </div>

              {/* Nota de MVP */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800 text-sm">
                <p className="font-medium">Nota para MVP:</p>
                <p className="mt-1">
                  Este dashboard muestra datos simulados para demostración. En la versión final,
                  se conectará con APIs reales para mostrar métricas en tiempo real.
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
