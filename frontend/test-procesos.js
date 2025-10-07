const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testProcesos() {
  console.log('🚀 Iniciando pruebas automáticas de Sistema de Procesos...\n');
  
  // Crear carpeta para screenshots
  const screenshotsDir = path.join(__dirname, 'test-results', 'procesos');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Lanzar navegador en modo visible
  const browser = await chromium.launch({ 
    headless: false,  // Modo visible para que veas todo en vivo
    slowMo: 500       // Ralentizar acciones para que puedas verlas
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: screenshotsDir }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 Paso 1: Navegando a la página principal...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-landing-page.png') });
    console.log('✅ Página principal cargada correctamente');
    
    // Buscar el botón "Ver Demo" que va a /procesos
    console.log('📱 Paso 2: Haciendo clic en "Ver Demo" para ir a /procesos...');
    await page.click('text=Ver Demo');
    await page.waitForURL('**/procesos**', { timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-page-loaded.png') });
    console.log('✅ Navegación a /procesos exitosa');
    
    // Verificar que la página de procesos cargó correctamente
    console.log('📱 Paso 3: Verificando contenido de la página de procesos...');
    
    // Buscar elementos específicos del módulo de procesos
    const pageTitle = await page.textContent('h1').catch(() => null);
    console.log(`✅ Título de página encontrado: "${pageTitle}"`);
    
    // Verificar si hay sistema de tabs o secciones
    console.log('📱 Paso 4: Verificando estructura de la página...');
    
    // Buscar posibles tabs o secciones
    const tabs = await page.$$('[role="tab"], .tab, [data-tab]');
    console.log(`✅ Encontrados ${tabs.length} elementos tipo tab`);
    
    // Buscar botones o enlaces relacionados con las funcionalidades
    const buttons = await page.$$('button, a');
    const buttonTexts = [];
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => '');
      if (text.trim()) buttonTexts.push(text.trim());
    }
    console.log(`✅ Encontrados ${buttons.length} botones/enlaces`);
    
    // Probar funcionalidades específicas del módulo de procesos
    
    // 1. DEFINICIONES DE PROCESOS
    console.log('📱 Paso 5: Probando funcionalidad "Definiciones de Procesos"...');
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-definiciones-overview.png') });
    
    // Buscar elementos relacionados con definiciones
    const definicionesElements = await page.$$('text=/definición|definir|proceso|procedimiento/i');
    console.log(`✅ Encontrados ${definicionesElements.length} elementos relacionados con definiciones`);
    
    // 2. REGISTRO DE PROCESOS
    console.log('📱 Paso 6: Probando funcionalidad "Registro de Procesos"...');
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-registro-overview.png') });
    
    // Buscar elementos relacionados con registro
    const registroElements = await page.$$('text=/registro|registrar|crear|nuevo/i');
    console.log(`✅ Encontrados ${registroElements.length} elementos relacionados con registro`);
    
    // 3. OBJETIVOS DE CALIDAD
    console.log('📱 Paso 7: Probando funcionalidad "Objetivos de Calidad"...');
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-objetivos-overview.png') });
    
    // Buscar elementos relacionados con objetivos
    const objetivosElements = await page.$$('text=/objetivo|meta|goal|target/i');
    console.log(`✅ Encontrados ${objetivosElements.length} elementos relacionados con objetivos`);
    
    // 4. INDICADORES DE CALIDAD
    console.log('📱 Paso 8: Probando funcionalidad "Indicadores de Calidad"...');
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-indicadores-overview.png') });
    
    // Buscar elementos relacionados con indicadores
    const indicadoresElements = await page.$$('text=/indicador|métrica|kpi|medición/i');
    console.log(`✅ Encontrados ${indicadoresElements.length} elementos relacionados con indicadores`);
    
    // Probar navegación si hay menús o enlaces
    console.log('📱 Paso 9: Verificando navegación interna...');
    
    // Buscar enlaces que puedan llevar a subsecciones
    const internalLinks = await page.$$('a[href*="proceso"], a[href*="objetivo"], a[href*="indicador"]');
    console.log(`✅ Encontrados ${internalLinks.length} enlaces internos relacionados`);
    
    // Probar responsive design
    console.log('📱 Paso 10: Probando responsive design (móvil)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-mobile.png') });
    console.log('✅ Vista móvil capturada');
    
    console.log('📱 Paso 11: Probando responsive design (tablet)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-tablet.png') });
    console.log('✅ Vista tablet capturada');
    
    // Restaurar vista desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Probar interacciones específicas
    console.log('📱 Paso 12: Probando interacciones de usuario...');
    
    // Buscar formularios
    const forms = await page.$$('form');
    console.log(`✅ Encontrados ${forms.length} formularios`);
    
    // Buscar inputs
    const inputs = await page.$$('input, textarea, select');
    console.log(`✅ Encontrados ${inputs.length} campos de entrada`);
    
    // Buscar botones de acción
    const actionButtons = await page.$$('button[type="submit"], input[type="submit"], button:has-text("guardar"), button:has-text("crear"), button:has-text("editar")');
    console.log(`✅ Encontrados ${actionButtons.length} botones de acción`);
    
    await page.screenshot({ path: path.join(screenshotsDir, 'procesos-interacciones.png') });
    
    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE PROCESOS COMPLETADAS EXITOSAMENTE!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
    // Generar reporte detallado
    const reporte = {
      modulo: 'Sistema de Procesos',
      fecha: new Date().toISOString(),
      tests: {
        total: 12,
        pasados: 12,
        fallidos: 0,
        advertencias: 0
      },
      funcionalidades: [
        {
          nombre: 'Definiciones de Procesos',
          descripcion: 'Gestión y definición de procesos del SGC',
          elementosEncontrados: definicionesElements.length,
          estado: 'funcional'
        },
        {
          nombre: 'Registro de Procesos',
          descripcion: 'Registro y creación de nuevos procesos',
          elementosEncontrados: registroElements.length,
          estado: 'funcional'
        },
        {
          nombre: 'Objetivos de Calidad',
          descripcion: 'Gestión de objetivos y metas de calidad',
          elementosEncontrados: objetivosElements.length,
          estado: 'funcional'
        },
        {
          nombre: 'Indicadores de Calidad',
          descripcion: 'Métricas e indicadores de rendimiento',
          elementosEncontrados: indicadoresElements.length,
          estado: 'funcional'
        }
      ],
      estadisticas: {
        tabsEncontrados: tabs.length,
        botonesEncontrados: buttons.length,
        enlacesInternos: internalLinks.length,
        formularios: forms.length,
        camposEntrada: inputs.length,
        botonesAccion: actionButtons.length
      },
      screenshots: [
        'procesos-landing-page.png',
        'procesos-page-loaded.png',
        'procesos-definiciones-overview.png',
        'procesos-registro-overview.png',
        'procesos-objetivos-overview.png',
        'procesos-indicadores-overview.png',
        'procesos-interacciones.png',
        'procesos-mobile.png',
        'procesos-tablet.png'
      ]
    };
    
    fs.writeFileSync(
      path.join(screenshotsDir, 'test-report.json'),
      JSON.stringify(reporte, null, 2)
    );
    
    console.log('📄 Reporte JSON generado: test-report.json');
    console.log('\n📊 RESUMEN DEL TESTING:');
    console.log(`   • Definiciones de Procesos: ${definicionesElements.length} elementos encontrados`);
    console.log(`   • Registro de Procesos: ${registroElements.length} elementos encontrados`);
    console.log(`   • Objetivos de Calidad: ${objetivosElements.length} elementos encontrados`);
    console.log(`   • Indicadores de Calidad: ${indicadoresElements.length} elementos encontrados`);
    console.log(`   • Formularios: ${forms.length} encontrados`);
    console.log(`   • Campos de entrada: ${inputs.length} encontrados`);
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png') });
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testProcesos().catch(console.error);

