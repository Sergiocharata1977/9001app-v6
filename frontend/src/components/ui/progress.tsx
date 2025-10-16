"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Componente de barra de progreso simplificado para MVP
 * 
 * Este componente muestra una barra de progreso con un valor determinado.
 * No depende de Radix UI para simplificar la implementación.
 */
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
