/**
 * 🚀 TEST DE VELOCIDAD COMPLETO - 9001app v6
 * 
 * Evalúa la velocidad de respuesta de TODOS los módulos del sistema
 * - RRHH (5 módulos)
 * - CRM (7 módulos) 
 * - Documentos (2 módulos)
 * - Auditorías (3 módulos)
 * - Super Admin (8 páginas)
 * 
 * Total: 25 módulos × 4 operaciones = 100 tests
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Importar configuración centralizada
const config = require('../config/test-config.js');

// Usar configuración centralizada
const BASE_URL = config.URLS.base;
const TIMEOUT = config.TIMEOUTS.navegacion;
const SLOW_MO = config.BROWSER_CONFIG.slowMo;
const UMBRALES = config.UMBRALES_VELOCIDAD;
const MODULOS = config.MODULOS;

// Usar función helper de configuración
const clasificarVelocidad = config.TEST_HELPERS.clasificarVelocidad;

// Función para medir tiempo de carga
async function medirCarga(page, url) {
  const inicio = Date.now();
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle', timeout: TIMEOUT });
    const tiempo = Date.now() - inicio;
    return { exito: true, tiempo, error: null };
  } catch (error) {
    const tiempo = Date.now() - inicio;
    return { exito: false, tiempo, error: error.message };
  }
}

// Función para medir tiempo de renderizado de listado
async function medirListado(page) {
  const inicio = Date.now();
  try {
    // Buscar elementos comunes de listado
    const selectores = [
      'table tbody tr',
      '[data-testid="lista"]',
      '.grid > div',
      '.space-y-4 > div',
      'ul li'
    ];
    
    let elementos = 0;
    for (const selector of selectores) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        elementos = await page.locator(selector).count();
        if (elementos > 0) break;
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    
    const tiempo = Date.now() - inicio;
    return { exito: true, tiempo, elementos, error: null };
  } catch (error) {
    const tiempo = Date.now() - inicio;
    return { exito: false, tiempo, elementos: 0, error: error.message };
  }
}

// Función para medir tiempo de apertura de modal
async function medirModal(page, selector, nombreModal) {
  const inicio = Date.now();
  try {
    await page.click(selector);
    await page.waitForSelector('[role="dialog"], .modal, [data-testid="modal"]', { timeout: 3000 });
    const tiempo = Date.now() - inicio;
    
    // Cerrar modal
    try {
      await page.click('[data-testid="close"], .close, [aria-label="Close"]');
      await page.waitForTimeout(500);
    } catch (e) {
      // Modal puede no tener botón de cerrar visible
    }
    
    return { exito: true, tiempo, error: null };
  } catch (error) {
    const tiempo = Date.now() - inicio;
    return { exito: false, tiempo, error: error.message };
  }
}

// Función principal
async function ejecutarTestCompleto() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     🚀 TEST DE VELOCIDAD COMPLETO - 9001app v6            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: SLOW_MO 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  const resultados = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    exitosos: 0,
    fallidos: 0,
    porModulo: {},
    resumen: {
      excelente: 0,
      bueno: 0,
      aceptable: 0,
      lento: 0,
      critico: 0
    }
  };
  
  try {
    for (const [categoria, modulos] of Object.entries(MODULOS)) {
      console.log(`\n████████████████████████████████████████████████████████████`);
      console.log(`█  ${categoria.toUpperCase().padEnd(50)} █`);
      console.log(`████████████████████████████████████████████████████████████`);
      
      resultados.porModulo[categoria] = {
        total: 0,
        exitosos: 0,
        fallidos: 0,
        modulos: {}
      };
      
      for (const modulo of modulos) {
        console.log(`\n============================================================`);
        console.log(`📦 ${categoria} → ${modulo.nombre}`);
        console.log(`============================================================`);
        console.log(`🌐 URL: ${modulo.url}`);
        
        const moduloResultado = {
          nombre: modulo.nombre,
          url: modulo.url,
          tests: {}
        };
        
        // 1. Test CARGA
        console.log(`\n1️⃣  Testeando CARGA de página...`);
        const carga = await medirCarga(page, modulo.url);
        moduloResultado.tests.carga = carga;
        resultados.totalTests++;
        
        if (carga.exito) {
          resultados.exitosos++;
          resultados.porModulo[categoria].exitosos++;
          const clasificacion = clasificarVelocidad(carga.tiempo);
          resultados.resumen[clasificacion.nivel.toLowerCase()]++;
          console.log(`   ${clasificacion.emoji} CARGA: ${carga.tiempo}ms - ${clasificacion.nivel}`);
        } else {
          resultados.fallidos++;
          resultados.porModulo[categoria].fallidos++;
          console.log(`   ❌ CARGA: FALLÓ - ${carga.error}`);
        }
        
        // 2. Test LISTADO
        console.log(`\n2️⃣  Testeando LISTADO...`);
        const listado = await medirListado(page);
        moduloResultado.tests.listado = listado;
        resultados.totalTests++;
        
        if (listado.exito) {
          resultados.exitosos++;
          resultados.porModulo[categoria].exitosos++;
          const clasificacion = clasificarVelocidad(listado.tiempo);
          resultados.resumen[clasificacion.nivel.toLowerCase()]++;
          console.log(`   ${clasificacion.emoji} LISTADO: ${listado.tiempo}ms - ${clasificacion.nivel} (${listado.elementos} items)`);
        } else {
          resultados.fallidos++;
          resultados.porModulo[categoria].fallidos++;
          console.log(`   ❌ LISTADO: FALLÓ - ${listado.error}`);
        }
        
        // 3. Test CREAR (si hay botón)
        console.log(`\n3️⃣  Testeando CREAR...`);
        const crear = await medirModal(page, '[data-testid="btn-crear"], button:has-text("Nuevo"), button:has-text("Crear")', 'Modal Crear');
        moduloResultado.tests.crear = crear;
        resultados.totalTests++;
        
        if (crear.exito) {
          resultados.exitosos++;
          resultados.porModulo[categoria].exitosos++;
          const clasificacion = clasificarVelocidad(crear.tiempo);
          resultados.resumen[clasificacion.nivel.toLowerCase()]++;
          console.log(`   ${clasificacion.emoji} CREAR (Modal): ${crear.tiempo}ms - ${clasificacion.nivel}`);
        } else {
          resultados.fallidos++;
          resultados.porModulo[categoria].fallidos++;
          console.log(`   ❌ CREAR: NO DISPONIBLE - ${crear.error}`);
        }
        
        // 4. Test EDITAR (si hay botón)
        console.log(`\n4️⃣  Testeando EDITAR...`);
        const editar = await medirModal(page, '[data-testid="btn-editar"] >> nth=0, button:has-text("Editar") >> nth=0', 'Modal Editar');
        moduloResultado.tests.editar = editar;
        resultados.totalTests++;
        
        if (editar.exito) {
          resultados.exitosos++;
          resultados.porModulo[categoria].exitosos++;
          const clasificacion = clasificarVelocidad(editar.tiempo);
          resultados.resumen[clasificacion.nivel.toLowerCase()]++;
          console.log(`   ${clasificacion.emoji} EDITAR (Modal): ${editar.tiempo}ms - ${clasificacion.nivel}`);
        } else {
          resultados.fallidos++;
          resultados.porModulo[categoria].fallidos++;
          console.log(`   ❌ EDITAR: NO DISPONIBLE - ${editar.error}`);
        }
        
        resultados.porModulo[categoria].modulos[modulo.nombre] = moduloResultado;
        resultados.porModulo[categoria].total += 4;
        
        // Pausa entre módulos
        await page.waitForTimeout(1000);
      }
    }
    
  } finally {
    await browser.close();
  }
  
  // Generar reportes
  await generarReportes(resultados);
  
  // Mostrar resumen
  mostrarResumen(resultados);
}

// Función para generar reportes mejorados
async function generarReportes(resultados) {
  const timestamp = config.TEST_HELPERS.generarTimestamp();
  const fecha = new Date().toLocaleDateString('es-ES');
  const hora = new Date().toLocaleTimeString('es-ES');
  const reportesDir = path.join(__dirname, '..', 'reportes', 'velocidad');
  
  // Crear directorio si no existe
  if (!fs.existsSync(reportesDir)) {
    fs.mkdirSync(reportesDir, { recursive: true });
  }
  
  // Agregar metadatos al resultado
  resultados.metadata = {
    fechaEjecucion: fecha,
    horaEjecucion: hora,
    timestamp: new Date().toISOString(),
    version: '1.0',
    configuracion: {
      umbrales: UMBRALES,
      timeouts: config.TIMEOUTS,
      browser: config.BROWSER_CONFIG
    }
  };
  
  // Reporte JSON con metadatos
  const jsonPath = path.join(reportesDir, `reporte-velocidad-${fecha.replace(/\//g, '-')}-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(resultados, null, 2));
  
  // Reporte HTML mejorado
  const htmlPath = path.join(reportesDir, `reporte-velocidad-${fecha.replace(/\//g, '-')}-${timestamp}.html`);
  const html = generarHTML(resultados);
  fs.writeFileSync(htmlPath, html);
  
  // Reporte TXT con fecha
  const txtPath = path.join(reportesDir, `reporte-velocidad-${fecha.replace(/\//g, '-')}-${timestamp}.txt`);
  const txt = generarTXT(resultados);
  fs.writeFileSync(txtPath, txt);
  
  console.log(`\n📊 Reportes generados en: ${reportesDir}`);
  console.log(`📅 Fecha: ${fecha} ${hora}`);
  console.log(`📁 Archivos:`);
  console.log(`   - JSON: reporte-velocidad-${fecha.replace(/\//g, '-')}-${timestamp}.json`);
  console.log(`   - HTML: reporte-velocidad-${fecha.replace(/\//g, '-')}-${timestamp}.html`);
  console.log(`   - TXT:  reporte-velocidad-${fecha.replace(/\//g, '-')}-${timestamp}.txt`);
}

// Función para generar HTML
function generarHTML(resultados) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Velocidad - ${resultados.timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
        .excelente { background: #d4edda; color: #155724; }
        .bueno { background: #cce7ff; color: #004085; }
        .aceptable { background: #fff3cd; color: #856404; }
        .lento { background: #ffeaa7; color: #d63031; }
        .critico { background: #f8d7da; color: #721c24; }
        .modulo { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .modulo-header { background: #f8f9fa; padding: 15px; font-weight: bold; }
        .modulo-content { padding: 20px; }
        .test-result { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Reporte de Velocidad - 9001app v6</h1>
            <p>Generado: ${new Date(resultados.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card excelente">
                <h3>🚀 EXCELENTE</h3>
                <p>${resultados.resumen.excelente} tests</p>
            </div>
            <div class="summary-card bueno">
                <h3>✅ BUENO</h3>
                <p>${resultados.resumen.bueno} tests</p>
            </div>
            <div class="summary-card aceptable">
                <h3>⚠️ ACEPTABLE</h3>
                <p>${resultados.resumen.aceptable} tests</p>
            </div>
            <div class="summary-card lento">
                <h3>🐌 LENTO</h3>
                <p>${resultados.resumen.lento} tests</p>
            </div>
            <div class="summary-card critico">
                <h3>🔴 CRÍTICO</h3>
                <p>${resultados.resumen.critico} tests</p>
            </div>
        </div>
        
        <h2>Resumen General</h2>
        <p><strong>Total Tests:</strong> ${resultados.totalTests}</p>
        <p><strong>Exitosos:</strong> ${resultados.exitosos}</p>
        <p><strong>Fallidos:</strong> ${resultados.fallidos}</p>
        <p><strong>% Éxito:</strong> ${((resultados.exitosos / resultados.totalTests) * 100).toFixed(1)}%</p>
    </div>
</body>
</html>`;
}

// Función para generar TXT
function generarTXT(resultados) {
  let txt = `REPORTE DE VELOCIDAD - 9001app v6\n`;
  txt += `Generado: ${new Date(resultados.timestamp).toLocaleString()}\n`;
  txt += `\nRESUMEN GENERAL:\n`;
  txt += `- Total Tests: ${resultados.totalTests}\n`;
  txt += `- Exitosos: ${resultados.exitosos}\n`;
  txt += `- Fallidos: ${resultados.fallidos}\n`;
  txt += `- % Éxito: ${((resultados.exitosos / resultados.totalTests) * 100).toFixed(1)}%\n`;
  txt += `\nCLASIFICACIÓN:\n`;
  txt += `- 🚀 EXCELENTE: ${resultados.resumen.excelente}\n`;
  txt += `- ✅ BUENO: ${resultados.resumen.bueno}\n`;
  txt += `- ⚠️ ACEPTABLE: ${resultados.resumen.aceptable}\n`;
  txt += `- 🐌 LENTO: ${resultados.resumen.lento}\n`;
  txt += `- 🔴 CRÍTICO: ${resultados.resumen.critico}\n`;
  return txt;
}

// Función para mostrar resumen
function mostrarResumen(resultados) {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                    📊 RESUMEN FINAL                        ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
  
  console.log(`\n📈 ESTADÍSTICAS GENERALES:`);
  console.log(`   Total Tests: ${resultados.totalTests}`);
  console.log(`   ✅ Exitosos: ${resultados.exitosos}`);
  console.log(`   ❌ Fallidos: ${resultados.fallidos}`);
  console.log(`   📊 % Éxito: ${((resultados.exitosos / resultados.totalTests) * 100).toFixed(1)}%`);
  
  console.log(`\n🎯 CLASIFICACIÓN DE VELOCIDAD:`);
  console.log(`   🚀 EXCELENTE (< 500ms): ${resultados.resumen.excelente}`);
  console.log(`   ✅ BUENO (500-1000ms): ${resultados.resumen.bueno}`);
  console.log(`   ⚠️ ACEPTABLE (1-2s): ${resultados.resumen.aceptable}`);
  console.log(`   🐌 LENTO (2-3s): ${resultados.resumen.lento}`);
  console.log(`   🔴 CRÍTICO (> 3s): ${resultados.resumen.critico}`);
  
  console.log(`\n📁 Reportes guardados en: frontend/tests/reportes/velocidad/`);
  console.log(`\n🎉 Test completado exitosamente!`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  ejecutarTestCompleto().catch(console.error);
}

module.exports = { ejecutarTestCompleto };
