'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuditoriaSinglePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/auditorias">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Auditoría #{id}</h1>
      </div>

      <Card className="p-6">
        <p className="text-gray-600">
          Esta es una vista placeholder para la auditoría {id}. Implementa aquí los detalles reales o
          reutiliza un componente de detalle cuando esté listo.
        </p>
      </Card>
    </div>
  );
}






