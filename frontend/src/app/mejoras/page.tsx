'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MejorasPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mejoras</h1>
        <p className="text-gray-600 mt-2">
          Gestiona hallazgos y acciones para la mejora continua
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hallazgos Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Hallazgos
            </CardTitle>
            <CardDescription>
              Gestiona los hallazgos identificados en auditorías y procesos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/hallazgos">
              <Button className="w-full justify-between">
                <span>Ver Hallazgos</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Acciones Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Acciones
            </CardTitle>
            <CardDescription>
              Gestiona las acciones correctivas y preventivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/acciones">
              <Button className="w-full justify-between">
                <span>Ver Acciones</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


