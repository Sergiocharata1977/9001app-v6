'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Calendar,
  FileText,
  Users
} from 'lucide-react';
import { relationService } from '@/services/relationService';
import type { ComplianceDashboard as ComplianceDashboardType } from '@/types/relation';

export default function DashboardCumplimientoPage() {
  const [dashboard, setDashboard] = useState<ComplianceDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await relationService.getComplianceDashboard();
      setDashboard(data);
    } catch (err) {
      setError('Error al cargar el dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const getChapterTitle = (chapter: number): string => {
    const titles: { [key: number]: string } = {
      4: 'Contexto de la Organización',
      5: 'Liderazgo',
      6: 'Planificación',
      7: 'Apoyo',
      8: 'Operación',
      9: 'Evaluación del Desempeño',
      10: 'Mejora'
    };
    return titles[chapter] || `Capítulo ${chapter}`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'alto': return 'text-red-600 bg-red-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'bajo': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Cumplimiento ISO 9001</h1>
        <p className="text-gray-600 mt-2">
          Seguimiento del cumplimiento normativo y estado de las relaciones proceso-documento
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Puntos Norma</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.total_norm_points}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Puntos Cubiertos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.covered_points}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Puntos Sin Cubrir</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.uncovered_points}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cumplimiento Global</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.compliance_percentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Chapter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cumplimiento por Capítulo ISO 9001
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboard.compliance_by_chapter.map((chapter) => (
              <div key={chapter.chapter} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {chapter.chapter}. {chapter.title}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {chapter.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={chapter.percentage} className="flex-1 h-3" />
                  <div className="text-xs text-gray-500 min-w-[80px] text-right">
                    {chapter.covered}/{chapter.total_points} cubiertos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Gaps and Upcoming Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Gaps Críticos - Puntos Obligatorios Sin Cubrir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.critical_gaps.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">¡Excelente! Todos los puntos obligatorios están cubiertos.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.critical_gaps.map((gap, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-blue-600">
                          {gap.norm_point.code}
                        </span>
                        <Badge className={getRiskColor(gap.risk_level)}>
                          Riesgo {gap.risk_level}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {gap.norm_point.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Capítulo {gap.norm_point.chapter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Próximas Revisiones (30 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.upcoming_reviews.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay revisiones programadas en los próximos 30 días.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.upcoming_reviews.map((review, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-blue-600">
                          {review.norm_point.code}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {review.days_until_review} días
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.norm_point.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Proceso: {review.process.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Revisión: {new Date(review.next_review_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}