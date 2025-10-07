const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPuntosDeNorma() {
  console.log('🚀 Iniciando pruebas automáticas de Puntos de Norma...\n');
  
  // Crear carpeta para screenshots
  const screenshotsDir = path.join(__dirname, 'test-results');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Lanzar navegador en modo visible
  const browser = await chromium.launch({ 
    headless: false,  // Modo visible para que veas todo en vivo
    slowMo: 500       // Ralentizar acciones para que puedas verlas
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  const testResults = [];
  
  try {
    // Test 1: Navegar a la página principal
    console.log('📍 Test 1: Navegando a localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '01-home.png'), fullPage: true });
    testResults.push({ test: 'Cargar página principal', status: '✅ PASS', time: new Date().toISOString() });
    console.log('   ✅ Página cargada correctamente\n');
    
    await page.waitForTimeout(1000);
    
    // Test 2: Buscar el botón "Comenzar Ahora" o "Acceder"
    console.log('📍 Test 2: Buscando botón de acceso...');
    try {
      // Intentar varios selectores posibles
      const accessButton = await page.locator('text=Comenzar Ahora').or(
        page.locator('text=Acceder')
      ).or(
        page.locator('text=Ver Demo')
      ).first();
      
      if (await accessButton.isVisible()) {
        await accessButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotsDir, '02-after-login.png'), fullPage: true });
        testResults.push({ test: 'Hacer clic en acceso', status: '✅ PASS', time: new Date().toISOString() });
        console.log('   ✅ Botón de acceso clickeado\n');
      } else {
        console.log('   ℹ️  No se encontró botón de acceso, continuando...\n');
      }
    } catch (error) {
      console.log('   ℹ️  Saltando paso de login, continuando...\n');
    }
    
    // Test 3: Navegar directamente a /normas
    console.log('📍 Test 3: Navegando a /normas...');
    await page.goto('http://localhost:3000/normas', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '03-normas-page.png'), fullPage: true });
    testResults.push({ test: 'Navegar a página de normas', status: '✅ PASS', time: new Date().toISOString() });
    console.log('   ✅ Página de normas cargada\n');
    
    // Test 4: Verificar que los tabs estén presentes
    console.log('📍 Test 4: Verificando presencia de tabs...');
    const tabs = [
      { name: 'Cláusulas ISO', selector: 'button:has-text("Cláusulas ISO")' },
      { name: 'Relaciones', selector: 'button:has-text("Relaciones")' },
      { name: 'Cumplimiento', selector: 'button:has-text("Cumplimiento")' },
      { name: 'Evaluaciones', selector: 'button:has-text("Evaluaciones")' },
      { name: 'Hallazgos', selector: 'button:has-text("Hallazgos")' },
      { name: 'Plan', selector: 'button:has-text("Plan")' }
    ];
    
    for (const tab of tabs) {
      try {
        const tabElement = page.locator(tab.selector).first();
        const isVisible = await tabElement.isVisible();
        if (isVisible) {
          console.log(`   ✅ Tab "${tab.name}" encontrado`);
          testResults.push({ test: `Verificar tab ${tab.name}`, status: '✅ PASS', time: new Date().toISOString() });
        } else {
          console.log(`   ❌ Tab "${tab.name}" no visible`);
          testResults.push({ test: `Verificar tab ${tab.name}`, status: '❌ FAIL', time: new Date().toISOString() });
        }
      } catch (error) {
        console.log(`   ⚠️  Tab "${tab.name}" no encontrado: ${error.message}`);
        testResults.push({ test: `Verificar tab ${tab.name}`, status: '⚠️ WARNING', time: new Date().toISOString() });
      }
    }
    console.log('');
    
    // Test 5: Hacer clic en cada tab y tomar screenshot
    console.log('📍 Test 5: Probando navegación por tabs...');
    const tabsToClick = [
      { name: 'dashboard', text: 'Cláusulas ISO', screenshot: '04-tab-dashboard.png' },
      { name: 'relaciones', text: 'Relaciones', screenshot: '05-tab-relaciones.png' },
      { name: 'cumplimiento', text: 'Cumplimiento', screenshot: '06-tab-cumplimiento.png' },
      { name: 'evaluaciones', text: 'Evaluaciones', screenshot: '07-tab-evaluaciones.png' },
      { name: 'hallazgos', text: 'Hallazgos', screenshot: '08-tab-hallazgos.png' },
      { name: 'plan', text: 'Plan', screenshot: '09-tab-plan.png' }
    ];
    
    for (const tab of tabsToClick) {
      try {
        console.log(`   📌 Haciendo clic en tab "${tab.text}"...`);
        await page.locator(`button:has-text("${tab.text}")`).first().click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotsDir, tab.screenshot), fullPage: true });
        testResults.push({ test: `Hacer clic en tab ${tab.text}`, status: '✅ PASS', time: new Date().toISOString() });
        console.log(`   ✅ Tab "${tab.text}" clickeado y capturado`);
      } catch (error) {
        console.log(`   ❌ Error al hacer clic en "${tab.text}": ${error.message}`);
        testResults.push({ test: `Hacer clic en tab ${tab.text}`, status: '❌ FAIL', time: new Date().toISOString() });
      }
    }
    console.log('');
    
    // Test 6: Probar navegación mediante URL con parámetros
    console.log('📍 Test 6: Probando navegación por URL con parámetros...');
    const urlTests = [
      { url: '/normas?tab=dashboard', name: 'Dashboard', screenshot: '10-url-dashboard.png' },
      { url: '/normas?tab=relaciones', name: 'Relaciones', screenshot: '11-url-relaciones.png' },
      { url: '/normas?tab=cumplimiento', name: 'Cumplimiento', screenshot: '12-url-cumplimiento.png' }
    ];
    
    for (const urlTest of urlTests) {
      try {
        console.log(`   📌 Navegando a ${urlTest.url}...`);
        await page.goto(`http://localhost:3000${urlTest.url}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotsDir, urlTest.screenshot), fullPage: true });
        testResults.push({ test: `Navegar a ${urlTest.name} por URL`, status: '✅ PASS', time: new Date().toISOString() });
        console.log(`   ✅ Navegación a ${urlTest.name} exitosa`);
      } catch (error) {
        console.log(`   ❌ Error al navegar a ${urlTest.url}: ${error.message}`);
        testResults.push({ test: `Navegar a ${urlTest.name} por URL`, status: '❌ FAIL', time: new Date().toISOString() });
      }
    }
    console.log('');
    
    // Test 7: Verificar que no hay errores 404
    console.log('📍 Test 7: Verificando ausencia de errores 404...');
    const title = await page.title();
    if (title.includes('404')) {
      console.log('   ❌ Se detectó página 404');
      testResults.push({ test: 'Verificar ausencia de 404', status: '❌ FAIL', time: new Date().toISOString() });
    } else {
      console.log('   ✅ No se detectaron errores 404');
      testResults.push({ test: 'Verificar ausencia de 404', status: '✅ PASS', time: new Date().toISOString() });
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    testResults.push({ test: 'Ejecución general', status: '❌ ERROR', error: error.message, time: new Date().toISOString() });
  }
  
  // Generar reporte HTML
  console.log('📊 Generando reporte de pruebas...');
  const reportHtml = generateReport(testResults, screenshotsDir);
  fs.writeFileSync(path.join(screenshotsDir, 'test-report.html'), reportHtml);
  console.log(`   ✅ Reporte generado en: ${path.join(screenshotsDir, 'test-report.html')}\n`);
  
  // Mostrar resumen
  console.log('📈 RESUMEN DE PRUEBAS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const passed = testResults.filter(r => r.status.includes('PASS')).length;
  const failed = testResults.filter(r => r.status.includes('FAIL')).length;
  const warnings = testResults.filter(r => r.status.includes('WARNING')).length;
  console.log(`✅ Pruebas exitosas: ${passed}`);
  console.log(`❌ Pruebas fallidas: ${failed}`);
  console.log(`⚠️  Advertencias: ${warnings}`);
  console.log(`📊 Total de pruebas: ${testResults.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Mantener navegador abierto 10 segundos para que veas el resultado
  console.log('🎥 Manteniendo navegador abierto 10 segundos para inspección...');
  await page.waitForTimeout(10000);
  
  await browser.close();
  console.log('✅ Pruebas completadas!\n');
}

function generateReport(results, screenshotsDir) {
  const passed = results.filter(r => r.status.includes('PASS')).length;
  const failed = results.filter(r => r.status.includes('FAIL')).length;
  const warnings = results.filter(r => r.status.includes('WARNING')).length;
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Pruebas - Puntos de Norma ISO 9001</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary-card h3 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }
    .summary-card .value {
      font-size: 32px;
      font-weight: bold;
    }
    .pass { color: #10b981; }
    .fail { color: #ef4444; }
    .warning { color: #f59e0b; }
    .test-results {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .test-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test-item:last-child {
      border-bottom: none;
    }
    .screenshots {
      margin-top: 30px;
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .screenshots h2 {
      margin-top: 0;
    }
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .screenshot-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .screenshot-item img {
      width: 100%;
      height: auto;
      display: block;
    }
    .screenshot-item .caption {
      padding: 10px;
      background: #f9f9f9;
      font-size: 14px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Reporte de Pruebas Automáticas</h1>
    <h2>Sistema de Puntos de Norma ISO 9001</h2>
    <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
  </div>
  
  <div class="summary">
    <div class="summary-card">
      <h3>Pruebas Exitosas</h3>
      <div class="value pass">${passed}</div>
    </div>
    <div class="summary-card">
      <h3>Pruebas Fallidas</h3>
      <div class="value fail">${failed}</div>
    </div>
    <div class="summary-card">
      <h3>Advertencias</h3>
      <div class="value warning">${warnings}</div>
    </div>
    <div class="summary-card">
      <h3>Total de Pruebas</h3>
      <div class="value">${results.length}</div>
    </div>
  </div>
  
  <div class="test-results">
    <h2>Resultados Detallados</h2>
    ${results.map(r => `
      <div class="test-item">
        <span>${r.test}</span>
        <span class="${r.status.includes('PASS') ? 'pass' : r.status.includes('FAIL') ? 'fail' : 'warning'}">${r.status}</span>
      </div>
    `).join('')}
  </div>
  
  <div class="screenshots">
    <h2>Capturas de Pantalla</h2>
    <div class="screenshot-grid">
      ${fs.readdirSync(screenshotsDir)
        .filter(f => f.endsWith('.png'))
        .map(f => `
          <div class="screenshot-item">
            <img src="${f}" alt="${f}">
            <div class="caption">${f.replace('.png', '').replace(/\d+-/, '').replace(/-/g, ' ')}</div>
          </div>
        `).join('')}
    </div>
  </div>
</body>
</html>
  `;
}

// Ejecutar las pruebas
testPuntosDeNorma().catch(console.error);

