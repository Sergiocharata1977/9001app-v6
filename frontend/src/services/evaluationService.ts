export async function listEvaluaciones() {
  const res = await fetch("/api/rrhh/evaluaciones");
  return res.json();
}
export async function getEvaluacion(id: string) {
  const res = await fetch(`/api/rrhh/evaluaciones/${id}`);
  return res.json();
}