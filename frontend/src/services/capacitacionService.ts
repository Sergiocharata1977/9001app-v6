export const capacitacionService = {
  listCapacitaciones: async () => {
    const res = await fetch("/api/rrhh/capacitaciones");
    return res.json();
  },
  
  getCapacitacion: async (id: string) => {
    const res = await fetch(`/api/rrhh/capacitaciones/${id}`);
    return res.json();
  },
  
  listSesiones: async () => {
    const res = await fetch("/api/rrhh/capacitaciones/sesiones");
    return res.json();
  },
  
  getSesion: async (id: string) => {
    const res = await fetch(`/api/rrhh/capacitaciones/sesiones/${id}`);
    return res.json();
  },
  
  createCapacitacion: async (data: any) => {
    const res = await fetch("/api/rrhh/capacitaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  updateCapacitacion: async (id: string, data: any) => {
    const res = await fetch(`/api/rrhh/capacitaciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  deleteCapacitacion: async (id: string) => {
    const res = await fetch(`/api/rrhh/capacitaciones/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
  
  registrarAsistencia: async (sesionId: string, empleadoId: string, presente: boolean) => {
    const res = await fetch(`/api/rrhh/capacitaciones/sesiones/${sesionId}/asistencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empleadoId, presente }),
    });
    return res.json();
  }
};

// Mantener exports individuales para compatibilidad
export async function listCapacitaciones() {
  const res = await fetch("/api/rrhh/capacitaciones");
  return res.json();
}

export async function getCapacitacion(id: string) {
  const res = await fetch(`/api/rrhh/capacitaciones/${id}`);
  return res.json();
}

export async function listSesiones() {
  const res = await fetch("/api/rrhh/capacitaciones/sesiones");
  return res.json();
}

export async function getSesion(id: string) {
  const res = await fetch(`/api/rrhh/capacitaciones/sesiones/${id}`);
  return res.json();
}

export async function createCapacitacion(data: any) {
  const res = await fetch("/api/rrhh/capacitaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCapacitacion(id: string, data: any) {
  const res = await fetch(`/api/rrhh/capacitaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCapacitacion(id: string) {
  const res = await fetch(`/api/rrhh/capacitaciones/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function registrarAsistencia(sesionId: string, empleadoId: string, presente: boolean) {
  const res = await fetch(`/api/rrhh/capacitaciones/sesiones/${sesionId}/asistencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ empleadoId, presente }),
  });
  return res.json();
}







