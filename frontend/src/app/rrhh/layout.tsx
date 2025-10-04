'use client';

import { RRHHSidebar } from '@/components/rrhh/RRHHSidebar';
import { RRHHHeader } from '@/components/rrhh/RRHHHeader';
import { ChatAsistente } from '@/components/ia/ChatAsistente';
import { useState } from 'react';

export default function RRHHLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar RRHH */}
      <RRHHSidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <RRHHHeader onToggleChat={() => setShowChat(!showChat)} />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Chat IA Asistente (flotante) */}
      {showChat && (
        <ChatAsistente
          modulo="rrhh"
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}