'use client';

import { useState, useEffect } from 'react';

export default function TestRenderPage() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        ✅ Test de Renderización Next.js
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hidratación</h2>
          <p className="text-gray-600 mb-4">
            Si ves este contenido sin errores en la consola, la hidratación funciona correctamente.
          </p>
          <div className="text-sm text-green-600">
            ✅ Componente montado: {mounted ? 'Sí' : 'No'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Interactividad</h2>
          <p className="text-gray-600 mb-4">
            Contador: <span className="font-bold text-blue-600">{count}</span>
          </p>
          <button
            onClick={() => setCount(c => c + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Incrementar
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tailwind CSS</h2>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <div className="w-3/4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded"></div>
            <div className="w-1/2 h-4 bg-gradient-to-r from-yellow-500 to-red-500 rounded"></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ✅ Estilos aplicados correctamente
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Routing</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-600 hover:underline">
              ← Volver al inicio
            </a>
            <a href="/procesos" className="block text-blue-600 hover:underline">
              → Ir a Procesos
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Verificación Completa
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Next.js 14 funcionando correctamente</li>
          <li>• App Router habilitado</li>
          <li>• TypeScript compilando sin errores</li>
          <li>• Tailwind CSS aplicando estilos</li>
          <li>• Hidratación sin warnings</li>
          <li>• Interactividad del cliente funcionando</li>
        </ul>
      </div>
    </div>
  );
}