"use client";

import { performanceMonitor } from "@/lib/performance/ModulePerformanceMonitor";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Componente que monitorea performance de cada módulo
 * Se integra en el layout principal para tracking automático
 */
export function PerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    // Detectar módulo actual desde la ruta
    const moduleId = detectModuleFromPath(pathname);
    
    if (moduleId) {
      // Iniciar monitoreo
      performanceMonitor.startMonitoring(moduleId);

      // Registrar cuando termine de cargar
      const handleLoad = () => {
        performanceMonitor.recordLoadTime(moduleId);
      };

      // Esperar a que el DOM esté listo
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
      }

      // Cleanup
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [pathname]);

  // Este componente no renderiza nada
  return null;
}

/**
 * Detecta el módulo basándose en la ruta
 */
function detectModuleFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length === 0) return "home";
  
  // Mapear rutas a módulos
  const moduleMap: Record<string, string> = {
    crm: "CRM",
    rrhh: "RRHH",
    documentos: "Documentos",
    normas: "Normas",
    procesos: "Procesos",
    auditorias: "Auditorías",
    calidad: "Calidad",
    productos: "Productos",
    "super-admin": "SuperAdmin",
  };

  return moduleMap[segments[0]] || segments[0];
}

