'use client'

import { useState } from 'react'
import { ProcessDefinitionFormV2 } from '@/components/modules/processes/forms/ProcessDefinitionFormV2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export default function TestComponentsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    console.log('Datos del formulario:', data)

    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert('¡Proceso creado exitosamente!')
    setIsLoading(false)
  }

  const handleCancel = () => {
    console.log('Formulario cancelado')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          🧪 Prueba de Componentes V2
        </h1>
        <p className="text-muted-foreground">
          Validación del nuevo estándar UI con Radix + shadcn/ui
        </p>
      </div>

      {/* Formulario en modo modal */}
      <Card>
        <CardHeader>
          <CardTitle>Formulario Modal (Crear)</CardTitle>
          <CardDescription>
            Haz clic en el botón para abrir el formulario en modal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProcessDefinitionFormV2
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Formulario en modo card */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Formulario Card (Editar)</h2>
        <ProcessDefinitionFormV2
          mode="edit"
          initialData={{
            codigo: 'PRO-001',
            nombre: 'Gestión de Compras',
            descripcion: 'Proceso para gestionar la adquisición de materiales y servicios',
            objetivo: 'Asegurar la adquisición oportuna de materiales conformes a los requisitos',
            alcance: 'Desde la solicitud de compra hasta la recepción del material',
            responsable: 'Jefe de Compras',
            tipo: 'operativo',
            nivel_critico: 'alto',
            entradas: 'Solicitudes de compra, especificaciones técnicas',
            salidas: 'Órdenes de compra, materiales recibidos'
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>

      {/* Información del estándar */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">✅ Estándar V2 Implementado</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2">
            <li>• <strong>Radix UI + shadcn/ui:</strong> Componentes accesibles y modernos</li>
            <li>• <strong>React Hook Form + Zod:</strong> Validación robusta y performante</li>
            <li>• <strong>Responsive Design:</strong> Funciona en móvil y desktop</li>
            <li>• <strong>TypeScript:</strong> Tipado completo y autocompletado</li>
            <li>• <strong>Lucide Icons:</strong> Iconografía consistente</li>
            <li>• <strong>Estados de loading:</strong> UX fluida</li>
            <li>• <strong>Modo dual:</strong> Modal y Card según contexto</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}