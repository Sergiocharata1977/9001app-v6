'use client';

import { ChatDonCandidos } from '@/components/ia/ChatDonCandidos';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PerformanceMonitorWrapper } from '@/components/performance/PerformanceMonitorWrapper';
import { ToastProvider } from '@/components/ui/use-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { DonCandidoProvider } from '@/contexts/DonCandidoContext';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [chatAbierto, setChatAbierto] = useState(false);

  // Detectar si estamos en rutas que NO necesitan sidebar/header principal
  const isLandingPage = pathname === '/';
  const isLoginRoute = pathname === '/login';
  const isSuperAdminRoute = pathname?.startsWith('/super-admin');
  const isCRMRoute = pathname?.startsWith('/crm');
  const isRRHHRoute = pathname?.startsWith('/rrhh');
  const isStandaloneRoute = isLandingPage || isLoginRoute || isSuperAdminRoute || isCRMRoute || isRRHHRoute;


  // TODO: Obtener contexto real del usuario desde sistema de autenticación
  // const usuario = useAuth(); // Hook personalizado para autenticación
  // Por ahora usamos contexto simulado
  const contextoUsuarioSimulado = {
    id: 'user-1',
    nombre: 'Usuario Demo',
    puesto: 'Responsable de Calidad',
    departamento: 'Calidad',
    nivel_experiencia: 'intermedio' as const,
    procesos_asignados: ['Gestión de Calidad', 'Auditorías', 'Mejora Continua'],
    permisos: ['leer', 'escribir', 'aprobar']
  };

  // TODO: Detectar módulo y proceso actual desde la navegación
  // Inferir módulo basado en la ruta actual
  let moduloActual: 'rrhh' | 'crm' | 'iso' | 'auditoria' = 'iso';
  let procesoActual = 'Gestión de Calidad';

  if (pathname?.startsWith('/rrhh')) {
    moduloActual = 'rrhh';
    procesoActual = 'Gestión de Personal';
  } else if (pathname?.startsWith('/crm')) {
    moduloActual = 'crm';
    procesoActual = 'Gestión Comercial';
  } else if (pathname?.startsWith('/auditorias')) {
    moduloActual = 'auditoria';
    procesoActual = 'Auditorías Internas';
  }

  const contextoProcesoSimulado = {
    modulo: moduloActual,
    seccion: pathname?.split('/')[1] || 'Dashboard',
    proceso: procesoActual,
    documentos_relacionados: ['DOC-001', 'DOC-002'],
    clausulas_iso: ['4.1', '5.1', '8.1', '9.1']
  };

  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <DonCandidoProvider position="bottom-right" size="lg">
            <ToastProvider>
              <PerformanceMonitorWrapper />
              {isStandaloneRoute ? (
              // Layout para Landing, CRM, RRHH, SuperAdmin (sin sidebar principal ni header)
              <div className="h-screen bg-gray-50">
                {children}
              </div>
            ) : (
              // Layout normal para el resto de la aplicación
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-4 py-6">
                      {children}
                    </div>
                  </main>
                </div>

                {/* Botón flotante para abrir DON CANDIDOS */}
                <button
                  onClick={() => setChatAbierto(true)}
                  className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
                  title="Hablar con DON CANDIDOS - Asesor ISO 9001"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>

                {/* Componente de chat DON CANDIDOS */}
                {chatAbierto && (
                  <ChatDonCandidos
                    contextoUsuario={contextoUsuarioSimulado}
                    contextoProceso={contextoProcesoSimulado}
                    onClose={() => setChatAbierto(false)}
                  />
                )}
              </div>
            )}
            </ToastProvider>
          </DonCandidoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}