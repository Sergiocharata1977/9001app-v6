import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '9001app - Documentación y Casos de Estudio',
  description: 'Documentación completa, manuales de usuario y casos de estudio de 9001app',
  keywords: 'documentación, manuales, casos de estudio, ISO 9001, tutoriales',
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



