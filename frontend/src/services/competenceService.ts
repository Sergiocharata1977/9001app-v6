export async function listCompetencias() {
  const res = await fetch("/api/rrhh/competencias");
  return res.json();
}
export async function getCompetencia(id: string) {
  const res = await fetch(`/api/rrhh/competencias/${id}`);
  return res.json();
}
export async function listAsignaciones() {
  const res = await fetch("/api/rrhh/competencias/asignaciones");
  return res.json();
}