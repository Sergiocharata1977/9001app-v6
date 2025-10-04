'use client';

import { Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ title, value, description, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function SuperAdminStats() {
  // Datos de ejemplo - en producción vendrían de una API
  const stats = [
    {
      title: 'Usuarios Activos',
      value: '156',
      description: '+12% desde el mes pasado',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Módulos del Sistema',
      value: '24',
      description: '8 completados, 16 en desarrollo',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Progreso General',
      value: '78%',
      description: 'Objetivos del proyecto',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Gaps Identificados',
      value: '12',
      description: '3 críticos, 9 menores',
      icon: AlertTriangle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
