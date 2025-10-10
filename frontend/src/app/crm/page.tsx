'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CRMPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente al dashboard del CRM
    router.replace('/crm/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al CRM...</p>
      </div>
    </div>
  );
}
