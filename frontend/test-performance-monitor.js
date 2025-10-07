const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuración de rutas a monitorear
const ROUTES_TO_MONITOR = [
  { name: 'Landing Page', url: 'http://localhost:3000/' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
  { name: 'RRHH', url: 'http://localhost:3000/rrhh' },
  { name: 'RRHH - Personal', url: 'http://localhost:3000/rrhh/personal' },
  { name: 'RRHH - Puestos', url: 'http://localhost:3000/rrhh/puestos' },
  { name: 'RRHH - Departamentos', url: 'http://localhost:3000/rrhh/departamentos' },
  { name: 'Documentos', url: 'http://localhost:3000/documentos' },
  { name: 'Normas', url: 'http://localhost:3000/normas' },
  { name: 'Procesos', url: 'http://localhost:3000/procesos' },
  { name: 'Super Admin', url: 'http://localhost:3000/super-admin' },
  { name: 'Auditorías', url: 'http://localhost:3000/auditorias' },
  { name: 'Hallazgos', url: 'http://localhost:3000/hallazgos' },
  { name: 'Acciones', url: 'http://localhost:3000/acciones' },
  { name: 'CRM - Empresas', url: 'http://localhost:3000/crm/empresas' },
  { name: 'CRM - Oportunidades', url: 'http://localhost:3000/crm/oportunidades' },
  { name: 'CRM - Actividades', url: 'http://localhost:3000/crm/actividades' }
];

// Umbrales de rendimiento (en milisegundos)
const PERFORMANCE_THRESHOLDS = {
  excellent: 1000,    // < 1s
  good: 2000,         // 1-2s
  acceptable: 3000,   // 2-3s
  slow: 5000,         // 3-5s
  critical: 5000      // > 5s
};

async function measurePagePerformance(page, route) {
  console.log(`\n📊 Midiendo rendimiento de: ${route.name}`);
  
  const startTime = Date.now();
  
  try {
    // Navegar y medir tiempo de carga
    await page.goto(route.url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });
    
    const loadTime = Date.now() - startTime;
    
    // Obtener métricas de rendimiento del navegador
    const performanceMetrics = await page.evaluate(() => {
      const perfData = window.performance.timing;
      return {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        request: perfData.responseStart - perfData.requestStart,
        response: perfData.responseEnd - perfData.responseStart,
        dom: perfData.domComplete - perfData.domLoading,
        load: perfData.loadEventEnd - perfData.navigationStart
      };
    });
    
    // Obtener uso de recursos
    const resourceStats = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalRequests: resources.length,
        jsSize: resources.filter(r => r.name.includes('.js')).reduce((acc, r) => acc + (r.transferSize || 0), 0),
        cssSize: resources.filter(r => r.name.includes('.css')).reduce((acc, r) => acc + (r.transferSize || 0), 0),
        imgSize: resources.filter(r => r.name.match(/\.(png|jpg|jpeg|gif|svg|webp)/)).reduce((acc, r) => acc + (r.transferSize || 0), 0),
        totalSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0)
      };
    });
    
    // Determinar estado de rendimiento
    let status = 'excellent';
    if (loadTime > PERFORMANCE_THRESHOLDS.critical) status = 'critical';
    else if (loadTime > PERFORMANCE_THRESHOLDS.slow) status = 'slow';
    else if (loadTime > PERFORMANCE_THRESHOLDS.acceptable) status = 'acceptable';
    else if (loadTime > PERFORMANCE_THRESHOLDS.good) status = 'good';
    
    const statusEmoji = {
      excellent: '🚀',
      good: '✅',
      acceptable: '⚠️',
      slow: '🐌',
      critical: '🔴'
    };
    
    console.log(`${statusEmoji[status]} Tiempo de carga: ${loadTime}ms (${status})`);
    console.log(`   📦 Recursos: ${resourceStats.totalRequests} requests, ${(resourceStats.totalSize / 1024).toFixed(2)} KB`);
    console.log(`   📄 JS: ${(resourceStats.jsSize / 1024).toFixed(2)} KB, CSS: ${(resourceStats.cssSize / 1024).toFixed(2)} KB, IMG: ${(resourceStats.imgSize / 1024).toFixed(2)} KB`);
    
    return {
      name: route.name,
      url: route.url,
      loadTime,
      status,
      metrics: performanceMetrics,
      resources: resourceStats,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error midiendo ${route.name}:`, error.message);
    return {
      name: route.name,
      url: route.url,
      loadTime: -1,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

function generateRecommendations(results) {
  const recommendations = [];
  
  results.forEach(result => {
    if (result.status === 'error') {
      recommendations.push({
        severity: 'critical',
        page: result.name,
        issue: 'Página no accesible o error 404',
        recommendation: 'Verificar que la ruta exista y el componente se renderice correctamente'
      });
    } else if (result.status === 'critical' || result.status === 'slow') {
      recommendations.push({
        severity: 'high',
        page: result.name,
        issue: `Tiempo de carga lento: ${result.loadTime}ms`,
        recommendation: 'Considerar lazy loading, code splitting, o optimizar componentes pesados'
      });
      
      if (result.resources && result.resources.jsSize > 500000) {
        recommendations.push({
          severity: 'medium',
          page: result.name,
          issue: `JavaScript muy pesado: ${(result.resources.jsSize / 1024).toFixed(2)} KB`,
          recommendation: 'Implementar code splitting y tree shaking'
        });
      }
      
      if (result.resources && result.resources.imgSize > 1000000) {
        recommendations.push({
          severity: 'medium',
          page: result.name,
          issue: `Imágenes muy pesadas: ${(result.resources.imgSize / 1024).toFixed(2)} KB`,
          recommendation: 'Optimizar imágenes (WebP, compresión, lazy loading)'
        });
      }
      
      if (result.resources && result.resources.totalRequests > 50) {
        recommendations.push({
          severity: 'low',
          page: result.name,
          issue: `Muchas peticiones: ${result.resources.totalRequests}`,
          recommendation: 'Considerar bundling de recursos y HTTP/2'
        });
      }
    } else if (result.status === 'acceptable') {
      recommendations.push({
        severity: 'low',
        page: result.name,
        issue: `Tiempo de carga aceptable pero mejorable: ${result.loadTime}ms`,
        recommendation: 'Revisar componentes que se pueden optimizar'
      });
    }
  });
  
  return recommendations;
}

function generateHTMLReport(results, recommendations) {
  const totalPages = results.length;
  const errorPages = results.filter(r => r.status === 'error').length;
  const criticalPages = results.filter(r => r.status === 'critical').length;
  const slowPages = results.filter(r => r.status === 'slow').length;
  const averageLoadTime = results.filter(r => r.loadTime > 0).reduce((acc, r) => acc + r.loadTime, 0) / (totalPages - errorPages);
  
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Rendimiento - 9001app v6</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header .subtitle { font-size: 1.2em; opacity: 0.9; }
    .metrics { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    .metric-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .metric-card:hover { transform: translateY(-5px); }
    .metric-card .value { 
      font-size: 3em; 
      font-weight: bold;
      margin: 10px 0;
    }
    .metric-card .label { 
      color: #666;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .metric-card.error .value { color: #e74c3c; }
    .metric-card.critical .value { color: #e67e22; }
    .metric-card.average .value { color: #3498db; }
    .metric-card.total .value { color: #9b59b6; }
    
    .section { padding: 40px; }
    .section h2 { 
      font-size: 2em;
      margin-bottom: 30px;
      color: #667eea;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    
    .results-grid {
      display: grid;
      gap: 20px;
    }
    .result-card {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 15px;
      border-left: 5px solid #667eea;
      transition: all 0.3s;
    }
    .result-card:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transform: translateX(5px);
    }
    .result-card.excellent { border-left-color: #27ae60; }
    .result-card.good { border-left-color: #2ecc71; }
    .result-card.acceptable { border-left-color: #f39c12; }
    .result-card.slow { border-left-color: #e67e22; }
    .result-card.critical { border-left-color: #e74c3c; }
    .result-card.error { border-left-color: #c0392b; background: #ffe5e5; }
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .result-name { font-size: 1.3em; font-weight: bold; }
    .result-time { 
      font-size: 1.8em;
      font-weight: bold;
      padding: 5px 15px;
      background: white;
      border-radius: 10px;
    }
    .result-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    .detail-label { 
      font-size: 0.8em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .detail-value { 
      font-size: 1.1em;
      font-weight: 600;
      color: #333;
    }
    
    .recommendations {
      background: #fff3cd;
      padding: 30px;
      margin: 40px;
      border-radius: 15px;
      border: 2px solid #ffc107;
    }
    .recommendations h3 {
      font-size: 1.8em;
      color: #856404;
      margin-bottom: 20px;
    }
    .recommendation-item {
      background: white;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 10px;
      border-left: 4px solid #ffc107;
    }
    .recommendation-item.critical { border-left-color: #e74c3c; }
    .recommendation-item.high { border-left-color: #e67e22; }
    .recommendation-item.medium { border-left-color: #f39c12; }
    .recommendation-item.low { border-left-color: #3498db; }
    
    .recommendation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .recommendation-page {
      font-weight: bold;
      font-size: 1.1em;
    }
    .recommendation-severity {
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.8em;
      font-weight: bold;
      text-transform: uppercase;
    }
    .recommendation-severity.critical { background: #e74c3c; color: white; }
    .recommendation-severity.high { background: #e67e22; color: white; }
    .recommendation-severity.medium { background: #f39c12; color: white; }
    .recommendation-severity.low { background: #3498db; color: white; }
    
    .recommendation-issue {
      color: #856404;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .recommendation-text {
      color: #666;
      line-height: 1.6;
    }
    
    .footer {
      background: #2c3e50;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .timestamp {
      font-size: 0.9em;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Reporte de Rendimiento</h1>
      <div class="subtitle">9001app v6 - Monitoreo Automático de Velocidad</div>
    </div>
    
    <div class="metrics">
      <div class="metric-card total">
        <div class="label">Total Páginas</div>
        <div class="value">${totalPages}</div>
      </div>
      <div class="metric-card error">
        <div class="label">Errores (404)</div>
        <div class="value">${errorPages}</div>
      </div>
      <div class="metric-card critical">
        <div class="label">Críticas</div>
        <div class="value">${criticalPages + slowPages}</div>
      </div>
      <div class="metric-card average">
        <div class="label">Tiempo Promedio</div>
        <div class="value">${averageLoadTime.toFixed(0)}<span style="font-size: 0.4em;">ms</span></div>
      </div>
    </div>
    
    <div class="section">
      <h2>🚀 Resultados por Página</h2>
      <div class="results-grid">
        ${results.map(result => `
          <div class="result-card ${result.status}">
            <div class="result-header">
              <div class="result-name">${result.name}</div>
              <div class="result-time">${result.loadTime > 0 ? result.loadTime + 'ms' : 'ERROR'}</div>
            </div>
            <div style="color: #666; margin-bottom: 10px;">${result.url}</div>
            ${result.resources ? `
              <div class="result-details">
                <div class="detail-item">
                  <div class="detail-label">Requests</div>
                  <div class="detail-value">${result.resources.totalRequests}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Total Size</div>
                  <div class="detail-value">${(result.resources.totalSize / 1024).toFixed(1)} KB</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">JavaScript</div>
                  <div class="detail-value">${(result.resources.jsSize / 1024).toFixed(1)} KB</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">CSS</div>
                  <div class="detail-value">${(result.resources.cssSize / 1024).toFixed(1)} KB</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Images</div>
                  <div class="detail-value">${(result.resources.imgSize / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            ` : ''}
            ${result.error ? `<div style="color: #e74c3c; margin-top: 10px;">⚠️ Error: ${result.error}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    
    ${recommendations.length > 0 ? `
      <div class="recommendations">
        <h3>💡 Recomendaciones de Mejora</h3>
        ${recommendations.map(rec => `
          <div class="recommendation-item ${rec.severity}">
            <div class="recommendation-header">
              <div class="recommendation-page">${rec.page}</div>
              <div class="recommendation-severity ${rec.severity}">${rec.severity}</div>
            </div>
            <div class="recommendation-issue">⚠️ ${rec.issue}</div>
            <div class="recommendation-text">💡 ${rec.recommendation}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <div class="footer">
      <div class="timestamp">Generado: ${new Date().toLocaleString('es-ES')}</div>
      <div style="margin-top: 10px;">Sistema de Monitoreo Automático - 9001app v6</div>
    </div>
  </div>
</body>
</html>
  `;
  
  return html;
}

async function runPerformanceMonitoring() {
  console.log('🚀 Iniciando monitoreo automático de rendimiento...\n');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  const results = [];
  
  for (const route of ROUTES_TO_MONITOR) {
    const result = await measurePagePerformance(page, route);
    results.push(result);
    await page.waitForTimeout(500); // Pequeña pausa entre mediciones
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 Generando reporte...\n');
  
  // Generar recomendaciones
  const recommendations = generateRecommendations(results);
  
  // Crear directorio de reportes si no existe
  const reportsDir = path.join(__dirname, 'test-results', 'performance');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Guardar resultados en JSON
  const jsonPath = path.join(reportsDir, 'performance-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results,
    recommendations,
    summary: {
      totalPages: results.length,
      errorPages: results.filter(r => r.status === 'error').length,
      criticalPages: results.filter(r => r.status === 'critical').length,
      slowPages: results.filter(r => r.status === 'slow').length,
      averageLoadTime: results.filter(r => r.loadTime > 0).reduce((acc, r) => acc + r.loadTime, 0) / results.filter(r => r.loadTime > 0).length
    }
  }, null, 2));
  
  console.log(`✅ Reporte JSON guardado: ${jsonPath}`);
  
  // Generar reporte HTML
  const htmlReport = generateHTMLReport(results, recommendations);
  const htmlPath = path.join(reportsDir, 'performance-report.html');
  fs.writeFileSync(htmlPath, htmlReport);
  
  console.log(`✅ Reporte HTML guardado: ${htmlPath}`);
  
  // Mostrar resumen
  console.log('\n📊 RESUMEN DE RENDIMIENTO:');
  console.log('=' .repeat(60));
  console.log(`Total páginas monitoreadas: ${results.length}`);
  console.log(`Páginas con error: ${results.filter(r => r.status === 'error').length}`);
  console.log(`Páginas críticas/lentas: ${results.filter(r => r.status === 'critical' || r.status === 'slow').length}`);
  console.log(`Tiempo promedio de carga: ${(results.filter(r => r.loadTime > 0).reduce((acc, r) => acc + r.loadTime, 0) / results.filter(r => r.loadTime > 0).length).toFixed(0)}ms`);
  console.log(`\n💡 Recomendaciones generadas: ${recommendations.length}`);
  
  if (recommendations.length > 0) {
    console.log('\nTOP 3 RECOMENDACIONES:');
    recommendations.slice(0, 3).forEach((rec, idx) => {
      console.log(`\n${idx + 1}. [${rec.severity.toUpperCase()}] ${rec.page}`);
      console.log(`   ⚠️  ${rec.issue}`);
      console.log(`   💡 ${rec.recommendation}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Monitoreo completado!');
  console.log(`📄 Abre el reporte HTML para ver detalles: ${htmlPath}`);
}

runPerformanceMonitoring().catch(console.error);

