'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatDonCandidos } from '@/components/ia/ChatDonCandidos';

export default function SuperAdminHeader() {
  const [showChat, setShowChat] = useState(false);

  // Contexto para Super Admin
  const contextoUsuario = {
    id: 'super-admin',
    nombre: 'Super Administrador',
    puesto: 'Administrador del Sistema',
    departamento: 'Administración',
    nivel_experiencia: 'avanzado' as const,
    procesos_asignados: ['super-admin', 'documentacion', 'sistema'],
    permisos: ['admin', 'super-admin', 'system-config']
  };

  const contextoProceso = {
    modulo: 'iso' as const,
    seccion: 'super-admin',
    proceso: 'Administración del Sistema',
    documentos_relacionados: ['Manual del Sistema', 'Procedimientos Administrativos'],
    clausulas_iso: ['4.1', '5.1', '9.3']
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
            <p className="text-sm text-gray-600">Panel de Administración del Sistema</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botón de Chat IA */}
            <Button
              onClick={() => setShowChat(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat IA
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4">
          <div className="relative">
            <ChatDonCandidos
              contextoUsuario={contextoUsuario}
              contextoProceso={contextoProceso}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
