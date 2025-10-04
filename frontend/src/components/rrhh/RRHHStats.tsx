'use client';

import { Users, Building2, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

export function RRHHStats() {
  const estadisticas = [
    {
      titulo: 'Total Empleados',
      valor: '45',
      cambio: '+5%',
      icon: Users,
      color: 'blue'
    },
    {
      titulo: 'Departamentos',
      valor: '6',
      cambio: '0%',
      icon: Building2,
      color: 'purple'
    },
    {
      titulo: 'Puestos Activos',
      valor: '12',
      cambio: '+2',
      icon: Briefcase,
      color: 'indigo'
    },
    {
      titulo: 'Capacitaciones',
      valor: '23',
      cambio: '+8',
      icon: GraduationCap,
      color: 'green'
    },
    {
      titulo: 'Satisfacción',
      valor: '85%',
      cambio: '+3%',
      icon: TrendingUp,
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {estadisticas.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.titulo}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.valor}</p>
              <p className={`text-sm mt-1 ${
                stat.cambio.startsWith('+') ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.cambio} vs mes anterior
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}