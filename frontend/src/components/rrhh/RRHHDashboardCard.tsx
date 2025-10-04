'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { Lock } from 'lucide-react';

interface RRHHDashboardCardProps {
  id: string;
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
  ruta: string;
  color: string;
  habilitado: boolean;
  estadisticas?: any;
}

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  teal: 'from-teal-500 to-teal-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  pink: 'from-pink-500 to-pink-600',
  gray: 'from-gray-400 to-gray-500',
  violet: 'from-violet-500 to-violet-600',
  slate: 'from-slate-500 to-slate-600',
};

export function RRHHDashboardCard({
  titulo,
  descripcion,
  icon: Icon,
  ruta,
  color,
  habilitado,
  estadisticas
}: RRHHDashboardCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (habilitado) {
      router.push(ruta);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-xl border-2
        ${habilitado
          ? 'border-slate-200 hover:border-emerald-300 hover:shadow-xl cursor-pointer'
          : 'border-gray-300 opacity-60 cursor-not-allowed'
        }
        bg-white p-6 transition-all duration-300
        ${habilitado ? 'transform hover:scale-105' : ''}
      `}
    >
      {/* Badge de estado */}
      {!habilitado && (
        <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Próximamente
        </div>
      )}

      {/* Icono con gradiente */}
      <div className={`
        w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[color as keyof typeof colorMap] || colorMap.blue}
        flex items-center justify-center mb-4 shadow-lg
        ${!habilitado && 'grayscale'}
      `}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Contenido */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {titulo}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {descripcion}
      </p>

      {/* Estadísticas */}
      {habilitado && estadisticas && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(estadisticas).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="ml-1 font-semibold text-gray-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de acción */}
      {habilitado && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">→</span>
          </div>
        </div>
      )}
    </div>
  );
}