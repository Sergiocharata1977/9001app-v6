#!/usr/bin/env node

/**
 * Análisis simple de performance usando Playwright
 * No requiere Lighthouse, más rápido de ejecutar
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules = [
  { name: 'Home', url: '/' },
  { name: 'CRM - Legajos', url: '/crm/legajos' },
  { name: 'CRM - Análisis Riesgo', url: '/crm/analisis-riesgo' },
  { name: 'CRM - Oportunidades', url: '/crm/oportunidades' },
  { name: 'RRHH - Personal', url: '/rrhh/personal' },
  { name: 'RRHH - Departamentos', url: '/rrhh/departamentos' },
  { name: 'Documentos', url: '/documentos' },
  { name: 'Normas', url: '/normas' },
  { name: 'Procesos', url: '/procesos' },
  { name: 'Auditorías', url: '/auditorias' },
  { name: 'Super Admin', url: '/super-admin' },
];

const baseUrl = 'http://localhost:3000';
const outputDir = path.join(__dirname, '..', 'performance-reports');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Analizando performance de módulos...\n');
console.log('⚠️  Asegúrate de que el frontend esté corriendo en http://localhost:3000\n');

const results = [];

async function analyzeModule(module) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`📊 ${module.name}`);
    
    const startTime = Date.now();
    
    // Navegar y medir
    await page.goto(`${baseUrl}${module.url}`, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    const loadTime = Date.now() - startTime;

    // Obtener métricas de performance
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        responseTime: perf.responseEnd - perf.requestStart,
        domInteractive: perf.domInteractive - perf.fetchStart,
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // Contar elementos DOM
    const domSize = await page.evaluate(() => document.querySelectorAll('*').length);

    // Detectar errores de consola
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const result = {
      module: module.name,
      url: module.url,
      loadTime: loadTime,
      domContentLoaded: Math.round(metrics.domContentLoaded),
      responseTime: Math.round(metrics.responseTime),
      domInteractive: Math.round(metrics.domInteractive),
      fcp: Math.round(metrics.fcp),
      domSize: domSize,
      errors: errors.length,
      status: loadTime < 2000 ? 'excelente' : loadTime < 3000 ? 'bueno' : 'lento',
    };

    results.push(result);

    const statusIcon = result.status === 'excelente' ? '✅' : result.status === 'bueno' ? '⚠️' : '❌';
    console.log(`   ${statusIcon} Tiempo total: ${(result.loadTime / 1000).toFixed(2)}s`);
    console.log(`   📄 DOM: ${result.domSize} elementos`);
    console.log(`   ⚡ FCP: ${(result.fcp / 1000).toFixed(2)}s`);
    if (result.errors > 0) {
      console.log(`   ⚠️  Errores en consola: ${result.errors}`);
    }
    console.log('');

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    results.push({
      module: module.name,
      url: module.url,
      error: error.message,
    });
  } finally {
    await browser.close();
  }
}

// Ejecutar análisis secuencial
(async () => {
  for (const module of modules) {
    await analyzeModule(module);
  }

  // Generar resumen
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE PERFORMANCE');
  console.log('='.repeat(80) + '\n');

  console.log('┌─────────────────────────────┬───────────┬──────────┬────────────┐');
  console.log('│ Módulo                      │ Tiempo    │ FCP      │ Estado     │');
  console.log('├─────────────────────────────┼───────────┼──────────┼────────────┤');

  results
    .filter(r => !r.error)
    .forEach(r => {
      const moduleName = r.module.padEnd(27);
      const loadTime = (r.loadTime / 1000).toFixed(2) + 's';
      const fcp = (r.fcp / 1000).toFixed(2) + 's';
      const status = r.status.padEnd(10);
      console.log(`│ ${moduleName} │ ${loadTime.padStart(9)} │ ${fcp.padStart(8)} │ ${status} │`);
    });

  console.log('└─────────────────────────────┴───────────┴──────────┴────────────┘\n');

  // Módulos críticos
  const slowModules = results
    .filter(r => !r.error && r.loadTime > 3000)
    .sort((a, b) => b.loadTime - a.loadTime);

  if (slowModules.length > 0) {
    console.log('🔴 MÓDULOS CRÍTICOS (> 3 segundos):\n');
    slowModules.forEach((r, i) => {
      console.log(`${i + 1}. ${r.module}: ${(r.loadTime / 1000).toFixed(2)}s`);
      console.log(`   - DOM: ${r.domSize} elementos`);
      console.log(`   - Acción: OPTIMIZACIÓN URGENTE\n`);
    });
  }

  // Módulos a mejorar
  const okModules = results
    .filter(r => !r.error && r.loadTime >= 2000 && r.loadTime <= 3000)
    .sort((a, b) => b.loadTime - a.loadTime);

  if (okModules.length > 0) {
    console.log('⚠️  MÓDULOS A MEJORAR (2-3 segundos):\n');
    okModules.forEach((r, i) => {
      console.log(`${i + 1}. ${r.module}: ${(r.loadTime / 1000).toFixed(2)}s`);
    });
    console.log('');
  }

  // Módulos excelentes
  const goodModules = results.filter(r => !r.error && r.loadTime < 2000);
  if (goodModules.length > 0) {
    console.log(`✅ MÓDULOS EXCELENTES (< 2 segundos): ${goodModules.length}/${results.length}\n`);
  }

  // Guardar resultados
  const summaryPath = path.join(outputDir, 'analysis-summary.json');
  const summary = {
    timestamp: new Date().toISOString(),
    totalModules: results.length,
    excellent: goodModules.length,
    needsWork: okModules.length,
    critical: slowModules.length,
    results: results,
  };

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\n💾 Resultados guardados en: ${summaryPath}`);
  console.log('\n' + '='.repeat(80) + '\n');

  // Recomendaciones
  if (slowModules.length > 0) {
    console.log('🎯 PRÓXIMOS PASOS RECOMENDADOS:\n');
    console.log('1. Optimizar módulos críticos primero (Task 10: Lazy Loading)');
    console.log('2. Revisar queries de MongoDB (Task 11)');
    console.log('3. Implementar paginación donde hay > 1000 elementos DOM');
    console.log('4. Considerar virtualización para tablas grandes\n');
  } else {
    console.log('🎉 ¡Excelente! Todos los módulos cargan en tiempo aceptable.\n');
  }
})();

