"use client";
import React, { useEffect, useState } from "react";
import { getRrhhMetrics } from "@/src/services/metricsService";

export default function RRHHMetrics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    getRrhhMetrics().then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <div className="text-sm">Cargando métricas…</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="card p-4">
        <div className="text-xs text-muted-foreground">Competencias activas</div>
        <div className="text-xl font-semibold">{data.competencias_activas ?? "-"}</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-muted-foreground">Brechas críticas</div>
        <div className="text-xl font-semibold">{data.brechas_criticas ?? "-"}</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-muted-foreground">Capacitaciones activas</div>
        <div className="text-xl font-semibold">{data.capacitaciones_activas ?? "-"}</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-muted-foreground">Asistencia promedio</div>
        <div className="text-xl font-semibold">{data.asistencia_promedio ?? "-"}%</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-muted-foreground">Evaluaciones pendientes</div>
        <div className="text-xl font-semibold">{data.evaluaciones_pendientes ?? "-"}</div>
      </div>
    </div>
  );
}