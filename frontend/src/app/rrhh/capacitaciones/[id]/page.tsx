"use client";
import React from "react";
import Link from "next/link";

export default function CapacitacionDetallePage() {
  return (
    <div className="p-6 space-y-3">
      <Link href="/rrhh/capacitaciones" className="text-blue-600">← Volver</Link>
      <h1 className="text-2xl font-semibold">Detalle de Capacitación</h1>
      <p className="text-sm text-muted-foreground">Sesiones, asistentes, notas y certificación.</p>
    </div>
  );
}