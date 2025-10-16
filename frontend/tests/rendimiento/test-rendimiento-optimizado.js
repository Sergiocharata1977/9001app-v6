/**
 * 🚀 TEST DE RENDIMIENTO OPTIMIZADO - 9001app v6
 * 
 * Test específico para medir y optimizar el rendimiento del sistema
 * - Métricas de Core Web Vitals
 * - Tiempos de API
 * - Rendimiento de componentes
 * - Optimización de bundle
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Importar configuración centralizada
const config = require('../config/test-config.js');

// Configuración específica para rendimiento
const PERFORMANCE_CONFIG = {
  browser: {
    ...config.BROWSER_CONFIG,
    headless: true, // Mejor para métricas de rendimiento
    args: [
      '--disable-web-security',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-background-timer-throttling',
      '--disable-background-networking',
      '--disable-breakpad'
    ]
  },
  metrics: {
    // Core Web Vitals
    LCP: 2500,  // Largest Contentful Paint < 2.5s
    FID: 100,   // First Input Delay < 100ms
    CLS: 0.1,   // Cumulative Layout Shift < 0.1
    // Métricas adicionales
    FCP: 1800,  // First Contentful Paint < 1.8s
    TTI: 3800,  // Time to Interactive < 3.8s
    TBT: 200,   // Total Blocking Time < 200ms
    // API Performance
    API_TIMEOUT: 5000,
    API_SLOW: 2000
  }
};

// Páginas críticas para testear
const PAGINAS_CRITICAS = [
  { nombre: 'Home', url: '/', prioridad: 'alta' },
  { nombre: 'Super Admin', url: '/super-admin', prioridad: 'alta' },
  { nombre: 'CRM Dashboard', url: '/crm', prioridad: 'alta' },
  { nombre: 'CRM Empresas', url: '/crm/empresas', prioridad: 'media' },
  { nombre: 'RRHH Dashboard', url: '/rrhh', prioridad: 'media' }
];

// Función para medir Core Web Vitals
async function medirCoreWebVitals(page) {
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const vitals = {};
        
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.LCP = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            vitals.FID = entry.processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift') {
            vitals.CLS = (vitals.CLS || 0) + entry.value;
          }
        });
        
        resolve(vitals);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      
      // Timeout después de 10 segundos
      setTimeout(() => resolve({}), 10000);
    });
  });
  
  return metrics;
}

// Función para medir métricas de rendimiento
async function medirMetricasRendimiento(page) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      // Métricas de navegación
      DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
      TCP: navigation.connectEnd - navigation.connectStart,
      SSL: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
      TTFB: navigation.responseStart - navigation.requestStart,
      DOMContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      Load: navigation.loadEventEnd - navigation.loadEventStart,
      
      // Métricas de pintura
      FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      LCP: 0, // Se llenará con Core Web Vitals
      
      // Métricas de JavaScript
      JSHeapUsed: performance.memory?.usedJSHeapSize || 0,
      JSHeapTotal: performance.memory?.totalJSHeapSize || 0,
      
      // Métricas de recursos
      resourceCount: performance.getEntriesByType('resource').length,
      resourceSize: performance.getEntriesByType('resource').reduce((total, resource) => total + (resource.transferSize || 0), 0)
    };
  });
  
  // Agregar Core Web Vitals
  const vitals = await medirCoreWebVitals(page);
  metrics.LCP = vitals.LCP || 0;
  metrics.FID = vitals.FID || 0;
  metrics.CLS = vitals.CLS || 0;
  
  return metrics;
}

// Función para medir rendimiento de API
async function medirAPIPerformance(page, url) {
  const apiMetrics = [];
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      apiMetrics.push({
        url: response.url(),
        status: response.status(),
        timing: response.timing(),
        size: response.headers()['content-length'] || 0
      });
    }
  });
  
  // Navegar a la página
  await page.goto(`${config.URLS.base}${url}`, { 
    waitUntil: 'networkidle',
    timeout: config.TIMEOUTS.navegacion 
  });
  
  // Esperar un poco más para capturar todas las llamadas API
  await page.waitForTimeout(2000);
  
  return apiMetrics;
}

// Función para analizar bundle size
async function analizarBundleSize(page) {
  const bundleInfo = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const scripts = resources.filter(r => r.name.includes('.js'));
    const styles = resources.filter(r => r.name.includes('.css'));
    
    return {
      totalJS: scripts.reduce((total, script) => total + (script.transferSize || 0), 0),
      totalCSS: styles.reduce((total, style) => total + (style.transferSize || 0), 0),
      jsCount: scripts.length,
      cssCount: styles.length,
      largestJS: scripts.reduce((max, script) => 
        (script.transferSize || 0) > (max.transferSize || 0) ? script : max, { transferSize: 0 })
    };
  });
  
  return bundleInfo;
}

// Función principal de test de rendimiento
async function ejecutarTestRendimiento() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         🚀 TEST DE RENDIMIENTO OPTIMIZADO - 9001app v6   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const browser = await chromium.launch(PERFORMANCE_CONFIG.browser);
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 } // Resolución estándar
  });
  
  const resultados = {
    timestamp: new Date().toISOString(),
    paginas: {},
    resumen: {
      totalPaginas: 0,
      paginasRapidas: 0,
      paginasLentas: 0,
      promedioLCP: 0,
      promedioFID: 0,
      promedioCLS: 0
    },
    recomendaciones: []
  };
  
  try {
    for (const pagina of PAGINAS_CRITICAS) {
      console.log(`\n🔍 Analizando: ${pagina.nombre} (${pagina.prioridad})`);
      console.log(`🌐 URL: ${pagina.url}`);
      
      const page = await context.newPage();
      
      try {
        // Medir métricas de rendimiento
        const inicio = Date.now();
        await page.goto(`${config.URLS.base}${pagina.url}`, { 
          waitUntil: 'networkidle',
          timeout: config.TIMEOUTS.navegacion 
        });
        const tiempoCarga = Date.now() - inicio;
        
        // Obtener métricas detalladas
        const metricas = await medirMetricasRendimiento(page);
        const apiMetrics = await medirAPIPerformance(page, pagina.url);
        const bundleInfo = await analizarBundleSize(page);
        
        // Evaluar rendimiento
        const evaluacion = {
          LCP: metricas.LCP < PERFORMANCE_CONFIG.metrics.LCP ? '✅ BUENO' : '⚠️ LENTO',
          FID: metricas.FID < PERFORMANCE_CONFIG.metrics.FID ? '✅ BUENO' : '⚠️ LENTO',
          CLS: metricas.CLS < PERFORMANCE_CONFIG.metrics.CLS ? '✅ BUENO' : '⚠️ LENTO',
          TTFB: metricas.TTFB < 600 ? '✅ BUENO' : '⚠️ LENTO',
          TiempoCarga: tiempoCarga < 3000 ? '✅ BUENO' : '⚠️ LENTO'
        };
        
        resultados.paginas[pagina.url] = {
          nombre: pagina.nombre,
          prioridad: pagina.prioridad,
          tiempoCarga,
          metricas,
          apiMetrics,
          bundleInfo,
          evaluacion,
          score: calcularScore(metricas, tiempoCarga)
        };
        
        resultados.resumen.totalPaginas++;
        if (tiempoCarga < 3000) resultados.resumen.paginasRapidas++;
        else resultados.resumen.paginasLentas++;
        
        // Mostrar resultados
        console.log(`   ⏱️  Tiempo de carga: ${tiempoCarga}ms - ${evaluacion.TiempoCarga}`);
        console.log(`   🎯 LCP: ${metricas.LCP.toFixed(0)}ms - ${evaluacion.LCP}`);
        console.log(`   ⚡ FID: ${metricas.FID.toFixed(0)}ms - ${evaluacion.FID}`);
        console.log(`   📐 CLS: ${metricas.CLS.toFixed(3)} - ${evaluacion.CLS}`);
        console.log(`   🌐 TTFB: ${metricas.TTFB.toFixed(0)}ms - ${evaluacion.TTFB}`);
        console.log(`   📦 Bundle JS: ${(bundleInfo.totalJS / 1024).toFixed(1)}KB`);
        console.log(`   📊 Score: ${calcularScore(metricas, tiempoCarga)}/100`);
        
      } finally {
        await page.close();
      }
      
      // Pausa entre páginas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } finally {
    await browser.close();
  }
  
  // Calcular promedios
  const paginas = Object.values(resultados.paginas);
  resultados.resumen.promedioLCP = paginas.reduce((sum, p) => sum + p.metricas.LCP, 0) / paginas.length;
  resultados.resumen.promedioFID = paginas.reduce((sum, p) => sum + p.metricas.FID, 0) / paginas.length;
  resultados.resumen.promedioCLS = paginas.reduce((sum, p) => sum + p.metricas.CLS, 0) / paginas.length;
  
  // Generar recomendaciones
  resultados.recomendaciones = generarRecomendaciones(resultados);
  
  // Generar reportes
  await generarReportes(resultados);
  
  // Mostrar resumen
  mostrarResumen(resultados);
}

// Función para calcular score de rendimiento
function calcularScore(metricas, tiempoCarga) {
  let score = 100;
  
  // Penalizar por LCP lento
  if (metricas.LCP > PERFORMANCE_CONFIG.metrics.LCP) {
    score -= Math.min(30, (metricas.LCP - PERFORMANCE_CONFIG.metrics.LCP) / 100);
  }
  
  // Penalizar por FID alto
  if (metricas.FID > PERFORMANCE_CONFIG.metrics.FID) {
    score -= Math.min(20, (metricas.FID - PERFORMANCE_CONFIG.metrics.FID) / 10);
  }
  
  // Penalizar por CLS alto
  if (metricas.CLS > PERFORMANCE_CONFIG.metrics.CLS) {
    score -= Math.min(25, metricas.CLS * 100);
  }
  
  // Penalizar por tiempo de carga lento
  if (tiempoCarga > 3000) {
    score -= Math.min(25, (tiempoCarga - 3000) / 200);
  }
  
  return Math.max(0, Math.round(score));
}

// Función para generar recomendaciones
function generarRecomendaciones(resultados) {
  const recomendaciones = [];
  
  // Analizar LCP
  if (resultados.resumen.promedioLCP > PERFORMANCE_CONFIG.metrics.LCP) {
    recomendaciones.push({
      tipo: 'LCP',
      prioridad: 'alta',
      problema: `LCP promedio de ${resultados.resumen.promedioLCP.toFixed(0)}ms es muy lento`,
      solucion: 'Optimizar imágenes, implementar lazy loading, mejorar renderizado crítico'
    });
  }
  
  // Analizar FID
  if (resultados.resumen.promedioFID > PERFORMANCE_CONFIG.metrics.FID) {
    recomendaciones.push({
      tipo: 'FID',
      prioridad: 'alta',
      problema: `FID promedio de ${resultados.resumen.promedioFID.toFixed(0)}ms es muy alto`,
      solucion: 'Reducir JavaScript bloqueante, implementar code splitting'
    });
  }
  
  // Analizar bundle size
  const paginas = Object.values(resultados.paginas);
  const bundlePromedio = paginas.reduce((sum, p) => sum + p.bundleInfo.totalJS, 0) / paginas.length;
  
  if (bundlePromedio > 500000) { // > 500KB
    recomendaciones.push({
      tipo: 'Bundle',
      prioridad: 'media',
      problema: `Bundle JS promedio de ${(bundlePromedio / 1024).toFixed(1)}KB es muy grande`,
      solucion: 'Implementar tree shaking, lazy loading de componentes, optimizar imports'
    });
  }
  
  return recomendaciones;
}

// Función para generar reportes
async function generarReportes(resultados) {
  const timestamp = config.TEST_HELPERS.generarTimestamp();
  const fecha = new Date().toLocaleDateString('es-ES');
  const reportesDir = path.join(__dirname, '..', 'reportes', 'rendimiento');
  
  if (!fs.existsSync(reportesDir)) {
    fs.mkdirSync(reportesDir, { recursive: true });
  }
  
  // Agregar metadatos
  resultados.metadata = {
    fechaEjecucion: fecha,
    timestamp: new Date().toISOString(),
    configuracion: PERFORMANCE_CONFIG,
    umbrales: PERFORMANCE_CONFIG.metrics
  };
  
  // Reporte JSON
  const jsonPath = path.join(reportesDir, `reporte-rendimiento-${fecha.replace(/\//g, '-')}-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(resultados, null, 2));
  
  // Reporte HTML
  const htmlPath = path.join(reportesDir, `reporte-rendimiento-${fecha.replace(/\//g, '-')}-${timestamp}.html`);
  const html = generarHTML(resultados);
  fs.writeFileSync(htmlPath, html);
  
  console.log(`\n📊 Reportes generados en: ${reportesDir}`);
}

// Función para generar HTML
function generarHTML(resultados) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Rendimiento - ${resultados.timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
        .good { background: #d4edda; color: #155724; }
        .warning { background: #fff3cd; color: #856404; }
        .danger { background: #f8d7da; color: #721c24; }
        .page-result { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .metric { display: inline-block; margin: 5px; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Reporte de Rendimiento - 9001app v6</h1>
        <p>Generado: ${new Date(resultados.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Páginas Analizadas</h3>
                <p>${resultados.resumen.totalPaginas}</p>
            </div>
            <div class="summary-card">
                <h3>LCP Promedio</h3>
                <p>${resultados.resumen.promedioLCP.toFixed(0)}ms</p>
            </div>
            <div class="summary-card">
                <h3>FID Promedio</h3>
                <p>${resultados.resumen.promedioFID.toFixed(0)}ms</p>
            </div>
            <div class="summary-card">
                <h3>CLS Promedio</h3>
                <p>${resultados.resumen.promedioCLS.toFixed(3)}</p>
            </div>
        </div>
        
        <h2>📊 Resultados por Página</h2>
        ${Object.entries(resultados.paginas).map(([url, pagina]) => `
          <div class="page-result">
            <h3>${pagina.nombre}</h3>
            <p><strong>URL:</strong> ${url}</p>
            <p><strong>Score:</strong> ${pagina.score}/100</p>
            <div>
              <span class="metric ${pagina.evaluacion.LCP.includes('✅') ? 'good' : 'warning'}">LCP: ${pagina.metricas.LCP.toFixed(0)}ms</span>
              <span class="metric ${pagina.evaluacion.FID.includes('✅') ? 'good' : 'warning'}">FID: ${pagina.metricas.FID.toFixed(0)}ms</span>
              <span class="metric ${pagina.evaluacion.CLS.includes('✅') ? 'good' : 'warning'}">CLS: ${pagina.metricas.CLS.toFixed(3)}</span>
              <span class="metric ${pagina.evaluacion.TiempoCarga.includes('✅') ? 'good' : 'warning'}">Carga: ${pagina.tiempoCarga}ms</span>
            </div>
          </div>
        `).join('')}
        
        <h2>💡 Recomendaciones</h2>
        ${resultados.recomendaciones.map(rec => `
          <div class="page-result">
            <h4>${rec.tipo} - Prioridad: ${rec.prioridad}</h4>
            <p><strong>Problema:</strong> ${rec.problema}</p>
            <p><strong>Solución:</strong> ${rec.solucion}</p>
          </div>
        `).join('')}
    </div>
</body>
</html>`;
}

// Función para mostrar resumen
function mostrarResumen(resultados) {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                  📊 RESUMEN RENDIMIENTO                   ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
  
  console.log(`\n📈 ESTADÍSTICAS:`);
  console.log(`   Páginas analizadas: ${resultados.resumen.totalPaginas}`);
  console.log(`   Páginas rápidas: ${resultados.resumen.paginasRapidas}`);
  console.log(`   Páginas lentas: ${resultados.resumen.paginasLentas}`);
  console.log(`   LCP promedio: ${resultados.resumen.promedioLCP.toFixed(0)}ms`);
  console.log(`   FID promedio: ${resultados.resumen.promedioFID.toFixed(0)}ms`);
  console.log(`   CLS promedio: ${resultados.resumen.promedioCLS.toFixed(3)}`);
  
  console.log(`\n💡 RECOMENDACIONES:`);
  if (resultados.recomendaciones.length === 0) {
    console.log(`   ✅ ¡Excelente rendimiento! No se encontraron problemas críticos.`);
  } else {
    resultados.recomendaciones.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.tipo} (${rec.prioridad}): ${rec.problema}`);
    });
  }
  
  console.log(`\n📁 Reportes guardados en: frontend/tests/reportes/rendimiento/`);
  console.log(`\n🎉 Test de rendimiento completado!`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  ejecutarTestRendimiento().catch(console.error);
}

module.exports = { ejecutarTestRendimiento };














