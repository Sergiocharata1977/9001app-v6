'use client';

import {
    ArrowRight,
    Award,
    BarChart3,
    FileText,
    LogOut,
    Plus,
    Shield,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Si no hay usuario, redirigir al login
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Se redirigirá automáticamente
  }

  const modules = [
    {
      title: 'CRM',
      description: 'Gestión de clientes y oportunidades',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      href: '/crm',
      stats: '12 empresas',
      color: 'bg-blue-500'
    },
    {
      title: 'RRHH',
      description: 'Gestión de personal y departamentos',
      icon: <Users className="w-8 h-8 text-green-500" />,
      href: '/personal',
      stats: '25 empleados',
      color: 'bg-green-500'
    },
    {
      title: 'Documentos',
      description: 'Control documental ISO 9001',
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      href: '/documentos',
      stats: '47 documentos',
      color: 'bg-purple-500'
    },
    {
      title: 'Auditorías',
      description: 'Gestión de auditorías internas',
      icon: <Award className="w-8 h-8 text-orange-500" />,
      href: '/auditorias',
      stats: '3 programadas',
      color: 'bg-orange-500'
    },
    {
      title: 'Procesos',
      description: 'Mapeo y gestión de procesos',
      icon: <TrendingUp className="w-8 h-8 text-teal-500" />,
      href: '/procesos',
      stats: '8 procesos',
      color: 'bg-teal-500'
    },
    {
      title: 'Normas',
      description: 'Puntos de norma ISO 9001',
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      href: '/normas',
      stats: '78% cumplimiento',
      color: 'bg-emerald-500'
    }
  ];

  const quickActions = [
    { title: 'Nueva Empresa', href: '/crm/empresas', icon: <Plus className="w-4 h-4" /> },
    { title: 'Nuevo Empleado', href: '/personal', icon: <Plus className="w-4 h-4" /> },
    { title: 'Nuevo Documento', href: '/documentos', icon: <Plus className="w-4 h-4" /> },
    { title: 'Ver Reportes', href: '/super-admin', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">9001app</h1>
                <p className="text-sm text-gray-500">Dashboard Principal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bienvenido, <strong>{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a tu Sistema de Gestión de Calidad!
          </h2>
          <p className="text-lg text-gray-600">
            Gestiona todos los aspectos de tu sistema ISO 9001:2015 desde un solo lugar
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Empresas CRM</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Empleados</p>
                <p className="text-2xl font-bold text-gray-900">25</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documentos</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cumplimiento</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Módulos del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link
                key={index}
                href={module.href}
                className="group bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-white`}>
                    {module.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h4>
                <p className="text-gray-600 mb-3">{module.description}</p>
                <p className="text-sm text-gray-500">{module.stats}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
              >
                {action.icon}
                <span className="text-sm font-medium text-gray-900">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}