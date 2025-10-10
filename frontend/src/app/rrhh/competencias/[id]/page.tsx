"use client";
import React from "react";
import Link from "next/link";

export default function CompetenciaDetallePage() {
  return (
    <div className="p-6 space-y-3">
      <Link href="/rrhh/competencias" className="text-blue-600">← Volver</Link>
      <h1 className="text-2xl font-semibold">Detalle de Competencia</h1>
      <p className="text-sm text-muted-foreground">Información de la competencia y versiones.</p>
    </div>
  );
}