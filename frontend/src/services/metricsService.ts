export async function getRrhhMetrics() {
  const res = await fetch("/api/rrhh/metrics");
  return res.json();
}
export async function getCompetenciasCoverage() {
  const res = await fetch("/api/rrhh/competencias/coverage");
  return res.json();
}