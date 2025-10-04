'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Archive,
  TrendingUp,
  Users
} from 'lucide-react';
import { DocumentTable } from '@/components/modules/documents/tables/DocumentTable';

export default function DocumentosPage() {
  const stats = [
    {
      title: 'Total Documentos',
      value: '247',
      change: '+12',
      changeType: 'positive',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Documentos Publicados',
      value: '189',
      change: '+8',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'En Revisión',
      value: '23',
      change: '+5',
      changeType: 'neutral',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Pendientes Aprobación',
      value: '15',
      change: '-3',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Descargas del Mes',
      value: '1,234',
      change: '+18%',
      changeType: 'positive',
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Usuarios Activos',
      value: '89',
      change: '+7',
      changeType: 'positive',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const categoryStats = [
    {
      name: 'Manuales de Calidad',
      count: 12,
      percentage: 5,
      color: 'bg-blue-500'
    },
    {
      name: 'Procedimientos',
      count: 45,
      percentage: 18,
      color: 'bg-green-500'
    },
    {
      name: 'Instrucciones de Trabajo',
      count: 67,
      percentage: 27,
      color: 'bg-orange-500'
    },
    {
      name: 'Formatos',
      count: 89,
      percentage: 36,
      color: 'bg-purple-500'
    },
    {
      name: 'Registros',
      count: 23,
      percentage: 9,
      color: 'bg-red-500'
    },
    {
      name: 'Políticas',
      count: 11,
      percentage: 5,
      color: 'bg-indigo-500'
    }
  ];

  const recentActivity = [
    {
      action: 'Documento subido',
      document: 'Manual de Calidad v3.1',
      user: 'Ana García',
      time: 'Hace 2 horas',
      type: 'upload'
    },
    {
      action: 'Documento aprobado',
      document: 'Procedimiento de Compras',
      user: 'Carlos Rodríguez',
      time: 'Hace 4 horas',
      type: 'approved'
    },
    {
      action: 'Documento descargado',
      document: 'Formato de Solicitud',
      user: 'María López',
      time: 'Hace 6 horas',
      type: 'download'
    },
    {
      action: 'Documento revisado',
      document: 'Política de Calidad 2024',
      user: 'José Martínez',
      time: 'Hace 1 día',
      type: 'review'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="h-4 w-4 text-blue-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'download': return <Download className="h-4 w-4 text-purple-500" />;
      case 'review': return <Eye className="h-4 w-4 text-orange-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Documentos</h1>
        <p className="text-gray-600 mt-2">
          Control y administración de documentos del Sistema de Gestión de Calidad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Categories */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Documentos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8 text-right">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-gray-100 flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.document}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Administración de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentTable 
            onView={(document) => {
              console.log('Ver documento:', document);
              // Implementar vista de documento
            }}
            onDownload={(document) => {
              console.log('Descargar documento:', document);
              // Implementar descarga
            }}
            onEdit={(document) => {
              console.log('Editar documento:', document);
            }}
            onDelete={(id) => {
              console.log('Eliminar documento:', id);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}