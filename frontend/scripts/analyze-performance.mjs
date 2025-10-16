#!/usr/bin/env node

/**
 * Script de análisis de performance con Lighthouse
 * Ejecuta auditorías en todos los módulos principales
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Módulos a analizar
const modules = [
  { name: 'CRM - Legajos', url: '/crm/legajos' },
  { name: 'CRM - Análisis Riesgo', url: '/crm/analisis-riesgo' },
  { name: 'CRM - Oportunidades', url: '/crm/oportunidades' },
  { name: 'RRHH - Personal', url: '/rrhh/personal' },
  { name: 'RRHH - Departamentos', url: '/rrhh/departamentos' },
  { name: 'RRHH - Puestos', url: '/rrhh/puestos' },
  { name: 'Documentos', url: '/documentos' },
  { name: 'Normas', url: '/normas' },
  { name: 'Procesos', url: '/procesos' },
  { name: 'Auditorías', url: '/auditorias' },
  { name: 'Super Admin', url: '/super-admin' },
];

const baseUrl = 'http://localhost:3000';
const outputDir = path.join(__dirname, '..', 'performance-reports');

// Crear directorio de reportes
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Iniciando análisis de performance con Lighthouse...\n');

const results = [];

for (const module of modules) {
  const fullUrl = `${baseUrl}${module.url}`;
  const safeName = module.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  const reportPath = path.join(outputDir, `${safeName}.json`);

  console.log(`📊 Analizando: ${module.name}`);
  console.log(`   URL: ${fullUrl}`);

  try {
    // Ejecutar Lighthouse
    const command = `npx lighthouse ${fullUrl} --output=json --output-path=${reportPath} --chrome-flags="--headless" --only-categories=performance --quiet`;
    
    execSync(command, { stdio: 'pipe' });

    // Leer resultados
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    const score = report.categories.performance.score * 100;
    const metrics = report.audits;

    const result = {
      module: module.name,
      url: module.url,
      score: Math.round(score),
      fcp: metrics['first-contentful-paint']?.numericValue || 0,
      lcp: metrics['largest-contentful-paint']?.numericValue || 0,
      tti: metrics['interactive']?.numericValue || 0,
      tbt: metrics['total-blocking-time']?.numericValue || 0,
      cls: metrics['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: metrics['speed-index']?.numericValue || 0,
    };

    results.push(result);

    console.log(`   ✅ Score: ${result.score}/100`);
    console.log(`   ⏱️  LCP: ${(result.lcp / 1000).toFixed(2)}s`);
    console.log(`   ⏱️  TTI: ${(result.tti / 1000).toFixed(2)}s\n`);

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    results.push({
      module: module.name,
      url: module.url,
      error: error.message,
    });
  }
}

// Generar resumen
console.log('\n📋 RESUMEN DE RESULTADOS:\n');
console.log('┌─────────────────────────────┬─────────┬─────────┬─────────┐');
console.log('│ Módulo                      │ Score   │ LCP (s) │ TTI (s) │');
console.log('├─────────────────────────────┼─────────┼─────────┼─────────┤');

results.forEach(r => {
  if (!r.error) {
    const moduleName = r.module.padEnd(27);
    const score = r.score.toString().padStart(5);
    const lcp = (r.lcp / 1000).toFixed(2).padStart(7);
    const tti = (r.tti / 1000).toFixed(2).padStart(7);
    console.log(`│ ${moduleName} │ ${score}   │ ${lcp} │ ${tti} │`);
  }
});

console.log('└─────────────────────────────┴─────────┴─────────┴─────────┘\n');

// Identificar módulos lentos
const slowModules = results
  .filter(r => !r.error && (r.lcp > 2500 || r.tti > 3500))
  .sort((a, b) => b.lcp - a.lcp);

if (slowModules.length > 0) {
  console.log('⚠️  MÓDULOS LENTOS (requieren optimización):\n');
  slowModules.forEach((r, i) => {
    console.log(`${i + 1}. ${r.module}`);
    console.log(`   LCP: ${(r.lcp / 1000).toFixed(2)}s | TTI: ${(r.tti / 1000).toFixed(2)}s`);
    console.log(`   Score: ${r.score}/100\n`);
  });
}

// Guardar resumen JSON
const summaryPath = path.join(outputDir, 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify({ results, slowModules }, null, 2));

console.log(`\n✅ Reportes guardados en: ${outputDir}`);
console.log(`📊 Resumen disponible en: ${summaryPath}\n`);

