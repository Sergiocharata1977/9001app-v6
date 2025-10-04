import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '9001app - Sistema de Gestión ISO 9001',
  description: 'Plataforma integral de gestión de calidad ISO 9001. Automatiza procesos, auditorías, documentación y RRHH.',
  keywords: 'ISO 9001, gestión de calidad, auditorías, RRHH, documentación',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



