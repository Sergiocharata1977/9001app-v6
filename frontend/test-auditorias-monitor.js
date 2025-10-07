const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuración de rutas del módulo de Auditorías
const AUDIT_ROUTES = [
  { 
    name: 'Auditorías - Dashboard', 
    url: 'http://localhost:3000/auditorias',
    description: 'Panel principal de gestión de auditorías'
  },
  { 
    name: 'Hallazgos', 
    url: 'http://localhost:3000/hallazgos',
    description: 'Gestión de hallazgos de auditoría'
  },
  { 
    name: 'Acciones Correctivas', 
    url: 'http://localhost:3000/acciones',
    description: 'Seguimiento de acciones correctivas y preventivas'
  },
  { 
    name: 'Acciones Auditor', 
    url: 'http://localhost:3000/acciones-auditor',
    description: 'Gestión de acciones desde perspectiva del auditor'
  }
];

// Umbrales específicos para auditorías (más estrictos)
const PERFORMANCE_THRESHOLDS = {
  excellent: 1500,    // < 1.5s
  good: 3000,         // 1.5-3s
  acceptable: 5000,   // 3-5s
  slow: 7000,         // 5-7s
  critical: 7000      // > 7s
};

async function testAuditFeature(page, route) {
  console.log(`\n🔍 Analizando: ${route.name}`);
  console.log(`   📝 ${route.description}`);
  
  const startTime = Date.now();
  const results = {
    navigation: null,
    components: [],
    forms: [],
    tables: [],
    buttons: [],
    interactions: [],
    errors: []
  };
  
  try {
    // Navegar a la página
    await page.goto(route.url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });
    
    const loadTime = Date.now() - startTime;
    results.navigation = { success: true, time: loadTime };
    
    // Esperar un momento para que los componentes se carguen
    await page.waitForTimeout(2000);
    
    // Detectar componentes de auditoría
    console.log('   📊 Verificando componentes...');
    
    // Buscar tablas de datos
    const tables = await page.$$('table, [role="table"]');
    results.tables = tables.length;
    console.log(`   ✓ Tablas encontradas: ${tables.length}`);
    
    // Buscar formularios
    const forms = await page.$$('form');
    results.forms = forms.length;
    console.log(`   ✓ Formularios encontrados: ${forms.length}`);
    
    // Buscar botones de acción
    const actionButtons = await page.$$('button:has-text("Nuevo"), button:has-text("Crear"), button:has-text("Agregar")');
    results.buttons.create = actionButtons.length;
    console.log(`   ✓ Botones de creación: ${actionButtons.length}`);
    
    const editButtons = await page.$$('button:has-text("Editar"), button[title*="Editar"]');
    results.buttons.edit = editButtons.length;
    console.log(`   ✓ Botones de edición: ${editButtons.length}`);
    
    const deleteButtons = await page.$$('button:has-text("Eliminar"), button[title*="Eliminar"]');
    results.buttons.delete = deleteButtons.length;
    console.log(`   ✓ Botones de eliminación: ${deleteButtons.length}`);
    
    // Buscar filtros y búsqueda
    const searchInputs = await page.$$('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="buscar"]');
    results.components.push({ type: 'search', count: searchInputs.length });
    console.log(`   ✓ Campos de búsqueda: ${searchInputs.length}`);
    
    const filterButtons = await page.$$('button:has-text("Filtro"), button:has-text("Filtrar"), select');
    results.components.push({ type: 'filters', count: filterButtons.length });
    console.log(`   ✓ Controles de filtro: ${filterButtons.length}`);
    
    // Buscar badges de estado
    const statusBadges = await page.$$('[class*="badge"], [class*="Badge"], span[class*="rounded-full"]');
    results.components.push({ type: 'badges', count: statusBadges.length });
    console.log(`   ✓ Badges de estado: ${statusBadges.length}`);
    
    // Buscar tarjetas de datos
    const cards = await page.$$('[class*="Card"], [class*="card"]');
    results.components.push({ type: 'cards', count: cards.length });
    console.log(`   ✓ Tarjetas de datos: ${cards.length}`);
    
    // Verificar elementos específicos de auditorías
    const auditSpecific = await page.evaluate(() => {
      const texts = Array.from(document.body.querySelectorAll('*')).map(el => el.textContent?.toLowerCase() || '');
      const allText = texts.join(' ');
      
      return {
        hasHallazgos: allText.includes('hallazgo'),
        hasAcciones: allText.includes('acción') || allText.includes('accion'),
        hasAuditoria: allText.includes('auditoría') || allText.includes('auditoria'),
        hasFechas: allText.includes('fecha'),
        hasResponsable: allText.includes('responsable'),
        hasEstado: allText.includes('estado'),
        hasPrioridad: allText.includes('prioridad'),
        hasSeguimiento: allText.includes('seguimiento'),
        hasCumplimiento: allText.includes('cumplimiento')
      };
    });
    
    results.auditFeatures = auditSpecific;
    console.log('   📋 Características de auditoría detectadas:');
    Object.entries(auditSpecific).forEach(([key, value]) => {
      if (value) console.log(`      ✓ ${key.replace('has', '')}: Presente`);
    });
    
    // Tomar captura de pantalla
    const screenshotPath = path.join(__dirname, 'test-results', 'auditorias', `${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results.screenshot = screenshotPath;
    
    // Determinar estado
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
    
    console.log(`\n   ${statusEmoji[status]} Tiempo de carga: ${loadTime}ms (${status})`);
    
    return {
      name: route.name,
      url: route.url,
      description: route.description,
      loadTime,
      status,
      results,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    results.errors.push(error.message);
    
    // Captura de pantalla del error
    try {
      const errorScreenshot = path.join(__dirname, 'test-results', 'auditorias', `error-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`);
      await page.screenshot({ path: errorScreenshot });
      results.screenshot = errorScreenshot;
    } catch (e) {}
    
    return {
      name: route.name,
      url: route.url,
      description: route.description,
      loadTime: -1,
      status: 'error',
      error: error.message,
      results,
      timestamp: new Date().toISOString()
    };
  }
}

function generateAuditRecommendations(results) {
  const recommendations = [];
  
  results.forEach(result => {
    if (result.status === 'error') {
      recommendations.push({
        severity: 'critical',
        module: result.name,
        issue: `Página no accesible: ${result.error}`,
        recommendation: 'Verificar que la ruta exista y el componente se renderice correctamente',
        priority: 1
      });
    } else if (result.status === 'critical' || result.status === 'slow') {
      recommendations.push({
        severity: 'high',
        module: result.name,
        issue: `Tiempo de carga lento: ${result.loadTime}ms`,
        recommendation: 'Implementar lazy loading de tablas y formularios complejos',
        priority: 2
      });
    }
    
    // Recomendaciones específicas de auditorías
    if (result.results && result.results.tables === 0 && result.status !== 'error') {
      recommendations.push({
        severity: 'medium',
        module: result.name,
        issue: 'No se detectaron tablas de datos',
        recommendation: 'Verificar que los componentes de listado se estén renderizando',
        priority: 3
      });
    }
    
    if (result.results && result.results.buttons && 
        result.results.buttons.create === 0 && 
        result.status !== 'error') {
      recommendations.push({
        severity: 'low',
        module: result.name,
        issue: 'No se detectaron botones de creación',
        recommendation: 'Agregar funcionalidad CRUD completa al módulo',
        priority: 4
      });
    }
    
    if (result.results && result.results.auditFeatures) {
      const missing = [];
      if (!result.results.auditFeatures.hasEstado) missing.push('Estado');
      if (!result.results.auditFeatures.hasPrioridad) missing.push('Prioridad');
      if (!result.results.auditFeatures.hasResponsable) missing.push('Responsable');
      if (!result.results.auditFeatures.hasFechas) missing.push('Fechas');
      
      if (missing.length > 0) {
        recommendations.push({
          severity: 'medium',
          module: result.name,
          issue: `Campos de auditoría faltantes: ${missing.join(', ')}`,
          recommendation: 'Implementar campos estándar de gestión de auditorías ISO 9001',
          priority: 3
        });
      }
    }
  });
  
  return recommendations.sort((a, b) => a.priority - b.priority);
}

function generateAuditHTML(results, recommendations) {
  const totalModules = results.length;
  const errorModules = results.filter(r => r.status === 'error').length;
  const criticalModules = results.filter(r => r.status === 'critical' || r.status === 'slow').length;
  const workingModules = results.filter(r => r.status === 'excellent' || r.status === 'good' || r.status === 'acceptable').length;
  const averageLoadTime = results.filter(r => r.loadTime > 0).reduce((acc, r) => acc + r.loadTime, 0) / results.filter(r => r.loadTime > 0).length;
  
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Testing - Módulo de Auditorías</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    .container { 
      max-width: 1400px; 
      margin: 0 auto; 
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    }
    .metric-card .value { 
      font-size: 3em; 
      font-weight: bold;
      margin: 10px 0;
    }
    .metric-card.working .value { color: #27ae60; }
    .metric-card.error .value { color: #e74c3c; }
    .metric-card.critical .value { color: #e67e22; }
    .metric-card.average .value { color: #3498db; }
    
    .section { padding: 40px; }
    .section h2 { 
      font-size: 2em;
      margin-bottom: 30px;
      color: #f5576c;
      border-bottom: 3px solid #f5576c;
      padding-bottom: 10px;
    }
    
    .module-grid {
      display: grid;
      gap: 20px;
    }
    .module-card {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 15px;
      border-left: 5px solid #f5576c;
    }
    .module-card.excellent { border-left-color: #27ae60; background: #f0fff4; }
    .module-card.good { border-left-color: #2ecc71; background: #f0fff4; }
    .module-card.acceptable { border-left-color: #f39c12; background: #fffbf0; }
    .module-card.slow { border-left-color: #e67e22; background: #fff5f0; }
    .module-card.critical { border-left-color: #e74c3c; background: #fff5f5; }
    .module-card.error { border-left-color: #c0392b; background: #ffe5e5; }
    
    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .module-name { font-size: 1.5em; font-weight: bold; }
    .module-time { 
      font-size: 1.5em;
      font-weight: bold;
      padding: 5px 15px;
      background: white;
      border-radius: 10px;
    }
    
    .module-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }
    .detail-item { display: flex; flex-direction: column; }
    .detail-label { 
      font-size: 0.8em;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .detail-value { font-size: 1.1em; font-weight: 600; }
    
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
    
    .audit-features {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .audit-feature {
      padding: 5px 12px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 15px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .audit-feature.missing {
      background: #ffebee;
      color: #c62828;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Reporte de Testing - Módulo de Auditorías</h1>
      <div class="subtitle">Sistema de Gestión de Calidad ISO 9001 - 9001app v6</div>
    </div>
    
    <div class="metrics">
      <div class="metric-card">
        <div class="label">Total Módulos</div>
        <div class="value">${totalModules}</div>
      </div>
      <div class="metric-card working">
        <div class="label">Funcionales</div>
        <div class="value">${workingModules}</div>
      </div>
      <div class="metric-card error">
        <div class="label">Con Errores</div>
        <div class="value">${errorModules}</div>
      </div>
      <div class="metric-card critical">
        <div class="label">Críticos</div>
        <div class="value">${criticalModules}</div>
      </div>
      <div class="metric-card average">
        <div class="label">Tiempo Promedio</div>
        <div class="value">${averageLoadTime.toFixed(0)}<span style="font-size: 0.4em;">ms</span></div>
      </div>
    </div>
    
    <div class="section">
      <h2>📊 Resultados por Módulo</h2>
      <div class="module-grid">
        ${results.map(result => `
          <div class="module-card ${result.status}">
            <div class="module-header">
              <div class="module-name">${result.name}</div>
              <div class="module-time">${result.loadTime > 0 ? result.loadTime + 'ms' : 'ERROR'}</div>
            </div>
            <div style="color: #666; margin-bottom: 15px;">${result.description}</div>
            ${result.results && result.results.auditFeatures ? `
              <div class="audit-features">
                ${result.results.auditFeatures.hasHallazgos ? '<span class="audit-feature">✓ Hallazgos</span>' : '<span class="audit-feature missing">✗ Hallazgos</span>'}
                ${result.results.auditFeatures.hasAcciones ? '<span class="audit-feature">✓ Acciones</span>' : '<span class="audit-feature missing">✗ Acciones</span>'}
                ${result.results.auditFeatures.hasEstado ? '<span class="audit-feature">✓ Estado</span>' : '<span class="audit-feature missing">✗ Estado</span>'}
                ${result.results.auditFeatures.hasPrioridad ? '<span class="audit-feature">✓ Prioridad</span>' : '<span class="audit-feature missing">✗ Prioridad</span>'}
                ${result.results.auditFeatures.hasResponsable ? '<span class="audit-feature">✓ Responsable</span>' : '<span class="audit-feature missing">✗ Responsable</span>'}
                ${result.results.auditFeatures.hasSeguimiento ? '<span class="audit-feature">✓ Seguimiento</span>' : '<span class="audit-feature missing">✗ Seguimiento</span>'}
              </div>
            ` : ''}
            ${result.results && result.results.tables !== undefined ? `
              <div class="module-details">
                <div class="detail-item">
                  <div class="detail-label">Tablas</div>
                  <div class="detail-value">${result.results.tables}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Formularios</div>
                  <div class="detail-value">${result.results.forms}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Creación</div>
                  <div class="detail-value">${result.results.buttons?.create || 0}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Edición</div>
                  <div class="detail-value">${result.results.buttons?.edit || 0}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Eliminación</div>
                  <div class="detail-value">${result.results.buttons?.delete || 0}</div>
                </div>
              </div>
            ` : ''}
            ${result.error ? `<div style="color: #e74c3c; margin-top: 10px;">⚠️ ${result.error}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    
    ${recommendations.length > 0 ? `
      <div class="recommendations">
        <h3>💡 Recomendaciones de Mejora</h3>
        ${recommendations.map(rec => `
          <div class="recommendation-item ${rec.severity}">
            <div style="display: flex; justify-between; align-items: center; margin-bottom: 10px;">
              <div style="font-weight: bold; font-size: 1.1em;">${rec.module}</div>
              <div style="padding: 5px 15px; background: #856404; color: white; border-radius: 20px; font-size: 0.8em; text-transform: uppercase;">${rec.severity}</div>
            </div>
            <div style="color: #856404; margin-bottom: 10px; font-weight: 600;">⚠️ ${rec.issue}</div>
            <div style="color: #666;">💡 ${rec.recommendation}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <div style="background: #2c3e50; color: white; padding: 30px; text-align: center;">
      <div class="timestamp">Generado: ${new Date().toLocaleString('es-ES')}</div>
      <div style="margin-top: 10px;">Sistema de Testing Automático - Módulo de Auditorías ISO 9001</div>
    </div>
  </div>
</body>
</html>
  `;
  
  return html;
}

async function runAuditTesting() {
  console.log('🔍 Iniciando testing del Módulo de Auditorías...\n');
  console.log('='.repeat(60));
  
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
  
  // Crear directorio de resultados
  const resultsDir = path.join(__dirname, 'test-results', 'auditorias');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const results = [];
  
  for (const route of AUDIT_ROUTES) {
    const result = await testAuditFeature(page, route);
    results.push(result);
    await page.waitForTimeout(1000); // Pausa entre tests
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 Generando reporte...\n');
  
  // Generar recomendaciones
  const recommendations = generateAuditRecommendations(results);
  
  // Guardar JSON
  const jsonPath = path.join(resultsDir, 'audit-test-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    module: 'Auditorías',
    results,
    recommendations,
    summary: {
      totalModules: results.length,
      errorModules: results.filter(r => r.status === 'error').length,
      criticalModules: results.filter(r => r.status === 'critical' || r.status === 'slow').length,
      workingModules: results.filter(r => r.status === 'excellent' || r.status === 'good' || r.status === 'acceptable').length,
      averageLoadTime: results.filter(r => r.loadTime > 0).reduce((acc, r) => acc + r.loadTime, 0) / results.filter(r => r.loadTime > 0).length
    }
  }, null, 2));
  
  console.log(`✅ Reporte JSON guardado: ${jsonPath}`);
  
  // Generar HTML
  const htmlReport = generateAuditHTML(results, recommendations);
  const htmlPath = path.join(resultsDir, 'audit-test-report.html');
  fs.writeFileSync(htmlPath, htmlReport);
  
  console.log(`✅ Reporte HTML guardado: ${htmlPath}`);
  
  // Mostrar resumen
  console.log('\n📊 RESUMEN DE TESTING - MÓDULO DE AUDITORÍAS:');
  console.log('='.repeat(60));
  console.log(`Total módulos testeados: ${results.length}`);
  console.log(`Módulos funcionales: ${results.filter(r => r.status === 'excellent' || r.status === 'good' || r.status === 'acceptable').length}`);
  console.log(`Módulos con errores: ${results.filter(r => r.status === 'error').length}`);
  console.log(`Módulos críticos/lentos: ${results.filter(r => r.status === 'critical' || r.status === 'slow').length}`);
  console.log(`\n💡 Recomendaciones generadas: ${recommendations.length}`);
  
  if (recommendations.length > 0) {
    console.log('\nTOP 3 RECOMENDACIONES:');
    recommendations.slice(0, 3).forEach((rec, idx) => {
      console.log(`\n${idx + 1}. [${rec.severity.toUpperCase()}] ${rec.module}`);
      console.log(`   ⚠️  ${rec.issue}`);
      console.log(`   💡 ${rec.recommendation}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Testing del Módulo de Auditorías completado!');
  console.log(`📄 Abre el reporte HTML: ${htmlPath}`);
}

runAuditTesting().catch(console.error);


