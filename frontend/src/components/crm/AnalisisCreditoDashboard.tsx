'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { EstadisticasAnalisis, CLASIFICACION_RIESGO } from '@/types/analisisCredito';

interface AnalisisCreditoDashboardProps {
  estadisticas: EstadisticasAnalisis;
}

export default function AnalisisCreditoDashboard({ estadisticas }: AnalisisCreditoDashboardProps) {
  const stats = [
    {
      titulo: 'Total Análisis',
      valor: estadisticas.total.toString(),
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      titulo: 'Score Promedio',
      valor: estadisticas.promedio_score.toFixed(2),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      titulo: 'Pendientes Revisión',
      valor: estadisticas.pendientes_revision.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      titulo: 'Riesgo Alto/Crítico',
      valor: (estadisticas.categoria_D + estadisticas.categoria_E).toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }