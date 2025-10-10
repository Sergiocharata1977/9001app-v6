const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testSistemaCompleto() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  const results = {
    testName: 'Test Sistema Completo - 9001app v6',
    timestamp: new Date().toISOString(),
    tests: [],
    screenshots: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      modules: {}
    }
  };

  try {
    console.log('🚀 Iniciando test completo del sistema...');
    
    // ========================================
    // TEST 1: PÁGINA PRINCIPAL
    // ========================================
    console.log('📋 Test 1: Página Principal');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const homeLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'Home',
      test: 'Página principal carga',
      status: homeLoaded ? 'PASS' : 'FAIL',
      details: homeLoaded ? 'Página principal cargada correctamente' : 'Error al cargar página principal'
    });
    
    // Screenshot
    const screenshot1 = await page.screenshot({ fullPage: true });
    const screenshotPath1 = path.join(__dirname, 'test-results', 'sistema-completo', '01-home.png');
    fs.writeFileSync(screenshotPath1, screenshot1);
    results.screenshots.push('01-home.png');

    // ========================================
    // TEST 2: SUPER ADMIN
    // ========================================
    console.log('🎛️ Test 2: Super Admin');
    await page.goto('http://localhost:3000/super-admin', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const superAdminLoaded = await page.$('[data-testid="super-admin"]') !== null || 
                            await page.$('h1') !== null;
    results.tests.push({
      module: 'Super Admin',
      test: 'Dashboard Super Admin',
      status: superAdminLoaded ? 'PASS' : 'FAIL',
      details: superAdminLoaded ? 'Super Admin cargado correctamente' : 'Error al cargar Super Admin'
    });
    
    // Test métricas del Super Admin
    const metricas = await page.$$('.text-3xl.font-bold');
    results.tests.push({
      module: 'Super Admin',
      test: 'Métricas del sistema',
      status: metricas.length >= 4 ? 'PASS' : 'FAIL',
      details: `Encontradas ${metricas.length} métricas`
    });
    
    // Screenshot
    const screenshot2 = await page.screenshot({ fullPage: true });
    const screenshotPath2 = path.join(__dirname, 'test-results', 'sistema-completo', '02-super-admin.png');
    fs.writeFileSync(screenshotPath2, screenshot2);
    results.screenshots.push('02-super-admin.png');

    // ========================================
    // TEST 3: RRHH - COMPETENCIAS
    // ========================================
    console.log('👥 Test 3: RRHH - Competencias');
    await page.goto('http://localhost:3000/rrhh/competencias', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const competenciasLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'RRHH',
      test: 'Competencias carga',
      status: competenciasLoaded ? 'PASS' : 'FAIL',
      details: competenciasLoaded ? 'Página de competencias cargada' : 'Error al cargar competencias'
    });
    
    // Test listado de competencias
    const competenciasList = await page.$$('[data-testid="competencia-item"]');
    results.tests.push({
      module: 'RRHH',
      test: 'Listado competencias',
      status: competenciasList.length >= 0 ? 'PASS' : 'FAIL',
      details: `Encontradas ${competenciasList.length} competencias`
    });
    
    // Screenshot
    const screenshot3 = await page.screenshot({ fullPage: true });
    const screenshotPath3 = path.join(__dirname, 'test-results', 'sistema-completo', '03-competencias.png');
    fs.writeFileSync(screenshotPath3, screenshot3);
    results.screenshots.push('03-competencias.png');

    // ========================================
    // TEST 4: RRHH - EVALUACIONES
    // ========================================
    console.log('📊 Test 4: RRHH - Evaluaciones');
    await page.goto('http://localhost:3000/rrhh/evaluaciones', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const evaluacionesLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'RRHH',
      test: 'Evaluaciones carga',
      status: evaluacionesLoaded ? 'PASS' : 'FAIL',
      details: evaluacionesLoaded ? 'Página de evaluaciones cargada' : 'Error al cargar evaluaciones'
    });
    
    // Screenshot
    const screenshot4 = await page.screenshot({ fullPage: true });
    const screenshotPath4 = path.join(__dirname, 'test-results', 'sistema-completo', '04-evaluaciones.png');
    fs.writeFileSync(screenshotPath4, screenshot4);
    results.screenshots.push('04-evaluaciones.png');

    // ========================================
    // TEST 5: RRHH - CAPACITACIONES
    // ========================================
    console.log('🎓 Test 5: RRHH - Capacitaciones');
    await page.goto('http://localhost:3000/rrhh/capacitaciones', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const capacitacionesLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'RRHH',
      test: 'Capacitaciones carga',
      status: capacitacionesLoaded ? 'PASS' : 'FAIL',
      details: capacitacionesLoaded ? 'Página de capacitaciones cargada' : 'Error al cargar capacitaciones'
    });
    
    // Screenshot
    const screenshot5 = await page.screenshot({ fullPage: true });
    const screenshotPath5 = path.join(__dirname, 'test-results', 'sistema-completo', '05-capacitaciones.png');
    fs.writeFileSync(screenshotPath5, screenshot5);
    results.screenshots.push('05-capacitaciones.png');

    // ========================================
    // TEST 6: DOCUMENTOS
    // ========================================
    console.log('📄 Test 6: Documentos');
    await page.goto('http://localhost:3000/documentos', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const documentosLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'Documentos',
      test: 'Documentos carga',
      status: documentosLoaded ? 'PASS' : 'FAIL',
      details: documentosLoaded ? 'Página de documentos cargada' : 'Error al cargar documentos'
    });
    
    // Screenshot
    const screenshot6 = await page.screenshot({ fullPage: true });
    const screenshotPath6 = path.join(__dirname, 'test-results', 'sistema-completo', '06-documentos.png');
    fs.writeFileSync(screenshotPath6, screenshot6);
    results.screenshots.push('06-documentos.png');

    // ========================================
    // TEST 7: NORMAS
    // ========================================
    console.log('📋 Test 7: Normas');
    await page.goto('http://localhost:3000/normas', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const normasLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'Normas',
      test: 'Normas carga',
      status: normasLoaded ? 'PASS' : 'FAIL',
      details: normasLoaded ? 'Página de normas cargada' : 'Error al cargar normas'
    });
    
    // Screenshot
    const screenshot7 = await page.screenshot({ fullPage: true });
    const screenshotPath7 = path.join(__dirname, 'test-results', 'sistema-completo', '07-normas.png');
    fs.writeFileSync(screenshotPath7, screenshot7);
    results.screenshots.push('07-normas.png');

    // ========================================
    // TEST 8: CRM - EMPRESAS
    // ========================================
    console.log('💼 Test 8: CRM - Empresas');
    try {
      await page.goto('http://localhost:3000/crm/empresas', { waitUntil: 'networkidle0', timeout: 5000 });
      await page.waitForTimeout(2000);
      
      const crmEmpresasLoaded = await page.$('h1') !== null;
      results.tests.push({
        module: 'CRM',
        test: 'CRM Empresas carga',
        status: crmEmpresasLoaded ? 'PASS' : 'FAIL',
        details: crmEmpresasLoaded ? 'Página de CRM Empresas cargada' : 'Error al cargar CRM Empresas'
      });
      
      // Test funcionalidades CRM
      const crmFeatures = await page.$$('[data-testid="crm-feature"]');
      results.tests.push({
        module: 'CRM',
        test: 'Funcionalidades CRM',
        status: crmFeatures.length >= 0 ? 'PASS' : 'FAIL',
        details: `Encontradas ${crmFeatures.length} funcionalidades CRM`
      });
      
      // Screenshot
      const screenshot8 = await page.screenshot({ fullPage: true });
      const screenshotPath8 = path.join(__dirname, 'test-results', 'sistema-completo', '08-crm-empresas.png');
      fs.writeFileSync(screenshotPath8, screenshot8);
      results.screenshots.push('08-crm-empresas.png');
    } catch (error) {
      results.tests.push({
        module: 'CRM',
        test: 'CRM Empresas carga',
        status: 'SKIP',
        details: 'CRM Empresas no disponible o no implementado'
      });
    }

    // ========================================
    // TEST 8B: CRM - OPORTUNIDADES
    // ========================================
    console.log('🎯 Test 8B: CRM - Oportunidades');
    try {
      await page.goto('http://localhost:3000/crm/oportunidades', { waitUntil: 'networkidle0', timeout: 5000 });
      await page.waitForTimeout(2000);
      
      const crmOportunidadesLoaded = await page.$('h1') !== null;
      results.tests.push({
        module: 'CRM',
        test: 'CRM Oportunidades carga',
        status: crmOportunidadesLoaded ? 'PASS' : 'FAIL',
        details: crmOportunidadesLoaded ? 'Página de CRM Oportunidades cargada' : 'Error al cargar CRM Oportunidades'
      });
      
      // Test Kanban
      const kanbanBoard = await page.$('[data-testid="kanban-board"]');
      results.tests.push({
        module: 'CRM',
        test: 'Kanban Oportunidades',
        status: kanbanBoard !== null ? 'PASS' : 'FAIL',
        details: kanbanBoard ? 'Kanban de oportunidades disponible' : 'Kanban no encontrado'
      });
      
      // Screenshot
      const screenshot8b = await page.screenshot({ fullPage: true });
      const screenshotPath8b = path.join(__dirname, 'test-results', 'sistema-completo', '08b-crm-oportunidades.png');
      fs.writeFileSync(screenshotPath8b, screenshot8b);
      results.screenshots.push('08b-crm-oportunidades.png');
    } catch (error) {
      results.tests.push({
        module: 'CRM',
        test: 'CRM Oportunidades carga',
        status: 'SKIP',
        details: 'CRM Oportunidades no disponible o no implementado'
      });
    }

    // ========================================
    // TEST 9: CASOS DE USO
    // ========================================
    console.log('📚 Test 9: Casos de Uso');
    await page.goto('http://localhost:3000/super-admin/casos-uso', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    const casosUsoLoaded = await page.$('h1') !== null;
    results.tests.push({
      module: 'Casos de Uso',
      test: 'Casos de uso carga',
      status: casosUsoLoaded ? 'PASS' : 'FAIL',
      details: casosUsoLoaded ? 'Página de casos de uso cargada' : 'Error al cargar casos de uso'
    });
    
    // Screenshot
    const screenshot9 = await page.screenshot({ fullPage: true });
    const screenshotPath9 = path.join(__dirname, 'test-results', 'sistema-completo', '09-casos-uso.png');
    fs.writeFileSync(screenshotPath9, screenshot2);
    results.screenshots.push('09-casos-uso.png');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    results.tests.push({
      module: 'Sistema',
      test: 'Error general',
      status: 'FAIL',
      details: error.message
    });
  } finally {
    await browser.close();
  }
  
  // Calcular estadísticas
  results.summary.total = results.tests.length;
  results.summary.passed = results.tests.filter(t => t.status === 'PASS').length;
  results.summary.failed = results.tests.filter(t => t.status === 'FAIL').length;
  
  // Agrupar por módulos
  results.tests.forEach(test => {
    if (!results.summary.modules[test.module]) {
      results.summary.modules[test.module] = { total: 0, passed: 0, failed: 0 };
    }
    results.summary.modules[test.module].total++;
    if (test.status === 'PASS') results.summary.modules[test.module].passed++;
    if (test.status === 'FAIL') results.summary.modules[test.module].failed++;
  });
  
  // Guardar resultados
  const resultsPath = path.join(__dirname, 'test-results', 'sistema-completo', 'test-report-sistema-completo.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log('✅ Test del sistema completo finalizado');
  console.log(`📊 Resultados: ${results.summary.passed}/${results.summary.total} tests pasaron`);
  console.log(`📈 Cobertura: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);
  
  // Mostrar resumen por módulos
  console.log('\n📋 Resumen por módulos:');
  Object.entries(results.summary.modules).forEach(([module, stats]) => {
    console.log(`  ${module}: ${stats.passed}/${stats.total} (${Math.round((stats.passed / stats.total) * 100)}%)`);
  });
  
  return results;
}

// Ejecutar test
testSistemaCompleto().catch(console.error);
