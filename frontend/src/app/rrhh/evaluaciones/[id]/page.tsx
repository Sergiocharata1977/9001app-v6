"use client";
import React from "react";
import Link from "next/link";

export default function EvaluacionDetallePage() {
  return (
    <div className="p-6 space-y-3">
      <Link href="/rrhh/evaluaciones" className="text-blue-600">← Volver</Link>
      <h1 className="text-2xl font-semibold">Detalle de Evaluación</h1>
      <p className="text-sm text-muted-foreground">Competencias evaluadas, ponderación y evidencias.</p>
    </div>
  );
}