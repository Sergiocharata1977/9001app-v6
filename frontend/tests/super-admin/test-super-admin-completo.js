/**
 * 🎯 TEST SUPER ADMIN COMPLETO - 9001app v6
 * 
 * Evalúa específicamente el Super Admin Dashboard:
 * - Navegación entre módulos
 * - Velocidad de carga de páginas single
 * - Funcionalidad de las tarjetas clickeables
 * - Rendimiento del dashboard principal
 * 
 * Tests:
 * - Dashboard principal
 * - 8 páginas single de módulos
 * - Navegación y usabilidad
 * - Tiempos de respuesta
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 15000; // 15 segundos por operación
const SLOW_MO = 150; // 150ms entre acciones

// Módulos del Super Admin
const MODULOS_SUPER_ADMIN = [
  { 
    id: 'crm', 
    nombre: 'CRM', 
    url: '/super-admin/modulos/crm',
    descripcion: 'Gestión de clientes y relaciones comerciales'
  },
  { 
    id: 'rrhh', 
    nombre: 'RRHH', 
    url: '/super-admin/modulos/rrhh',
    descripcion: 'Recursos humanos y gestión de personal'
  },
  { 
    id: 'procesos', 
    nombre: 'Procesos', 
    url: '/super-admin/modulos/procesos',
    descripcion: 'Gestión de procesos operativos'
  },
  { 
    id: 'auditorias', 
    nombre: 'Auditorías', 
    url: '/super-admin/modulos/auditorias',
    descripcion: 'Auditorías internas y externas'
  },
  { 
    id: 'normas', 
    nombre: 'Normas', 
    url: '/super-admin/modulos/normas',
    descripcion: 'Gestión de normas y cumplimiento'
  },
  { 
    id: 'documentos', 
    nombre: 'Documentos', 
    url: '/super-admin/modulos/documentos',
    descripcion: 'Gestión documental'
  },
  { 
    id: 'calidad', 
    nombre: 'Calidad', 
    url: '/super-admin/modulos/calidad',
    descripcion: 'Sistema de gestión de calidad'
  },
  { 
    id: 'diseno-desarrollo', 
    nombre: 'Diseño y Desarrollo', 
    url: '/super-admin/modulos/diseno-desarrollo',
    descripcion: 'Gestión de productos y desarrollo'
  }
];

// Umbrales de velocidad para Super Admin
const UMBRALES = {
  excelente: 300,   // < 300ms (más estricto para admin)
  bueno: 600,       // 300-600ms
  aceptable: 1000,  // 600ms-1s
  lento: 2000,      // 1-2s
  critico: 3000     // > 2s
};

// Función para clasificar velocidad
function clasificarVelocidad(tiempo) {
  if (tiempo < UMBRALES.excelente) return { nivel: 'EXCELENTE', emoji: '🚀', color: 'green' };
  if (tiempo < UMBRALES.bueno) return { nivel: 'BUENO', emoji: '✅', color: 'blue' };
  if (tiempo < UMBRALES.aceptable) return { nivel: 'ACEPTABLE', emoji: '⚠️', color: 'yellow' };
  if (tiempo < UMBRALES.lento) return { nivel: 'LENTO', emoji: '🐌', color: 'orange' };
  return { nivel: 'CRÍTICO', emoji: '🔴', color: 'red' };
}

// Función para medir tiempo de carga
async function medirCarga(page, url, nombre) {
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

// Función para verificar elementos de la página single
async function verificarElementosSingle(page, modulo) {
  const elementos = {
    titulo: false,
    casosUso: false,
    requerimientos: false,
    tests: false,
    documentacion: false
  };
  
  try {
    // Verificar título del módulo
    const titulo = await page.locator(`h1:has-text("${modulo.nombre}")`).count();
    elementos.titulo = titulo > 0;
    
    // Verificar secciones de documentación
    const casosUso = await page.locator('text=/casos de uso/i').count();
    elementos.casosUso = casosUso > 0;
    
    const requerimientos = await page.locator('text=/requerimientos/i').count();
    elementos.requerimientos = requerimientos > 0;
    
    const tests = await page.locator('text=/test/i').count();
    elementos.tests = tests > 0;
    
    const documentacion = await page.locator('text=/documentación/i').count();
    elementos.documentacion = documentacion > 0;
    
    return elementos;
  } catch (error) {
    return elementos;
  }
}

// Función para verificar navegabilidad del dashboard
async function verificarDashboard(page) {
  const dashboard = {
    tarjetas: 0,
    clickeables: 0,
    navegacion: false,
    elementos: {}
  };
  
  try {
    // Ir al dashboard
    await page.goto(`${BASE_URL}/super-admin`);
    await page.waitForTimeout(2000);
    
    // Contar tarjetas de módulos
    const tarjetas = await page.locator('[data-testid="modulo-card"], .group').count();
    dashboard.tarjetas = tarjetas;
    
    // Verificar que las tarjetas sean clickeables
    const links = await page.locator('a[href*="/super-admin/modulos/"]').count();
    dashboard.clickeables = links;
    
    // Verificar navegación
    dashboard.navegacion = links > 0;
    
    // Verificar elementos específicos
    dashboard.elementos = {
      titulo: await page.locator('text=/Super Admin/i').count() > 0,
      subtitulo: await page.locator('text=/dashboard/i').count() > 0,
      estadisticas: await page.locator('[data-testid="estadisticas"]').count() > 0,
      filtros: await page.locator('[data-testid="filtros"]').count() > 0
    };
    
    return dashboard;
  } catch (error) {
    return dashboard;
  }
}

// Función principal
async function ejecutarTestSuperAdmin() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         🎯 TEST SUPER ADMIN COMPLETO - 9001app v6         ║');
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
    dashboard: {},
    modulos: {},
    totalTests: 0,
    exitosos: 0,
    fallidos: 0,
    resumen: {
      excelente: 0,
      bueno: 0,
      aceptable: 0,
      lento: 0,
      critico: 0
    }
  };
  
  try {
    // 1. Test del Dashboard Principal
    console.log(`\n████████████████████████████████████████████████████████████`);
    console.log(`█  DASHBOARD SUPER ADMIN                                   █`);
    console.log(`████████████████████████████████████████████████████████████`);
    
    console.log(`\n🔍 Verificando Dashboard Principal...`);
    const dashboard = await verificarDashboard(page);
    resultados.dashboard = dashboard;
    
    console.log(`   📊 Tarjetas encontradas: ${dashboard.tarjetas}`);
    console.log(`   🔗 Tarjetas clickeables: ${dashboard.clickeables}`);
    console.log(`   ✅ Navegación funcional: ${dashboard.navegacion ? 'SÍ' : 'NO'}`);
    
    // 2. Test de cada módulo single
    console.log(`\n████████████████████████████████████████████████████████████`);
    console.log(`█  MÓDULOS SINGLE                                         █`);
    console.log(`████████████████████████████████████████████████████████████`);
    
    for (const modulo of MODULOS_SUPER_ADMIN) {
      console.log(`\n============================================================`);
      console.log(`📦 ${modulo.nombre} - ${modulo.descripcion}`);
      console.log(`============================================================`);
      console.log(`🌐 URL: ${modulo.url}`);
      
      // Test de carga de página single
      console.log(`\n1️⃣  Testeando CARGA de página single...`);
      const carga = await medirCarga(page, modulo.url, modulo.nombre);
      resultados.totalTests++;
      
      if (carga.exito) {
        resultados.exitosos++;
        const clasificacion = clasificarVelocidad(carga.tiempo);
        resultados.resumen[clasificacion.nivel.toLowerCase()]++;
        console.log(`   ${clasificacion.emoji} CARGA: ${carga.tiempo}ms - ${clasificacion.nivel}`);
      } else {
        resultados.fallidos++;
        console.log(`   ❌ CARGA: FALLÓ - ${carga.error}`);
      }
      
      // Test de verificación de elementos
      console.log(`\n2️⃣  Verificando elementos de documentación...`);
      const elementos = await verificarElementosSingle(page, modulo);
      resultados.totalTests++;
      
      const elementosOk = Object.values(elementos).filter(Boolean).length;
      if (elementosOk >= 3) {
        resultados.exitosos++;
        console.log(`   ✅ ELEMENTOS: ${elementosOk}/5 encontrados`);
      } else {
        resultados.fallidos++;
        console.log(`   ⚠️ ELEMENTOS: Solo ${elementosOk}/5 encontrados`);
      }
      
      // Test de navegación de vuelta al dashboard
      console.log(`\n3️⃣  Testeando navegación de vuelta...`);
      const inicioNav = Date.now();
      try {
        await page.click('a[href="/super-admin"], [data-testid="volver-dashboard"]');
        await page.waitForURL('**/super-admin', { timeout: 5000 });
        const tiempoNav = Date.now() - inicioNav;
        
        resultados.totalTests++;
        resultados.exitosos++;
        const clasificacion = clasificarVelocidad(tiempoNav);
        resultados.resumen[clasificacion.nivel.toLowerCase()]++;
        console.log(`   ${clasificacion.emoji} NAVEGACIÓN: ${tiempoNav}ms - ${clasificacion.nivel}`);
      } catch (error) {
        resultados.totalTests++;
        resultados.fallidos++;
        console.log(`   ❌ NAVEGACIÓN: FALLÓ - ${error.message}`);
      }
      
      // Guardar resultados del módulo
      resultados.modulos[modulo.id] = {
        nombre: modulo.nombre,
        url: modulo.url,
        carga,
        elementos,
        navegacion: resultados.totalTests > 0
      };
      
      // Pausa entre módulos
      await page.waitForTimeout(1000);
    }
    
  } finally {
    await browser.close();
  }
  
  // Generar reportes
  await generarReportes(resultados);
  
  // Mostrar resumen
  mostrarResumen(resultados);
}

// Función para generar reportes
async function generarReportes(resultados) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportesDir = path.join(__dirname, '..', 'reportes', 'super-admin');
  
  // Crear directorio si no existe
  if (!fs.existsSync(reportesDir)) {
    fs.mkdirSync(reportesDir, { recursive: true });
  }
  
  // Reporte JSON
  const jsonPath = path.join(reportesDir, `reporte-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(resultados, null, 2));
  
  // Reporte HTML
  const htmlPath = path.join(reportesDir, `reporte-${timestamp}.html`);
  const html = generarHTML(resultados);
  fs.writeFileSync(htmlPath, html);
  
  // Reporte TXT
  const txtPath = path.join(reportesDir, `reporte-${timestamp}.txt`);
  const txt = generarTXT(resultados);
  fs.writeFileSync(txtPath, txt);
  
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
    <title>Reporte Super Admin - ${resultados.timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .dashboard-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .modulo-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Reporte Super Admin - 9001app v6</h1>
            <p>Generado: ${new Date(resultados.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="dashboard-info">
            <h2>📊 Dashboard Principal</h2>
            <p><strong>Tarjetas encontradas:</strong> ${resultados.dashboard.tarjetas}</p>
            <p><strong>Tarjetas clickeables:</strong> ${resultados.dashboard.clickeables}</p>
            <p><strong>Navegación funcional:</strong> ${resultados.dashboard.navegacion ? '✅ SÍ' : '❌ NO'}</p>
        </div>
        
        <h2>📦 Módulos Testeados</h2>
        ${Object.entries(resultados.modulos).map(([id, modulo]) => `
          <div class="modulo-card">
            <h3>${modulo.nombre}</h3>
            <p><strong>URL:</strong> ${modulo.url}</p>
            <p><strong>Carga:</strong> ${modulo.carga.exito ? `${modulo.carga.tiempo}ms` : 'FALLÓ'}</p>
            <p><strong>Elementos:</strong> ${Object.values(modulo.elementos).filter(Boolean).length}/5</p>
          </div>
        `).join('')}
        
        <h2>📈 Resumen</h2>
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
  let txt = `REPORTE SUPER ADMIN - 9001app v6\n`;
  txt += `Generado: ${new Date(resultados.timestamp).toLocaleString()}\n`;
  txt += `\nDASHBOARD:\n`;
  txt += `- Tarjetas: ${resultados.dashboard.tarjetas}\n`;
  txt += `- Clickeables: ${resultados.dashboard.clickeables}\n`;
  txt += `- Navegación: ${resultados.dashboard.navegacion ? 'OK' : 'FALLÓ'}\n`;
  txt += `\nRESUMEN:\n`;
  txt += `- Total Tests: ${resultados.totalTests}\n`;
  txt += `- Exitosos: ${resultados.exitosos}\n`;
  txt += `- Fallidos: ${resultados.fallidos}\n`;
  txt += `- % Éxito: ${((resultados.exitosos / resultados.totalTests) * 100).toFixed(1)}%\n`;
  return txt;
}

// Función para mostrar resumen
function mostrarResumen(resultados) {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                  📊 RESUMEN SUPER ADMIN                    ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
  
  console.log(`\n📊 DASHBOARD:`);
  console.log(`   Tarjetas encontradas: ${resultados.dashboard.tarjetas}`);
  console.log(`   Tarjetas clickeables: ${resultados.dashboard.clickeables}`);
  console.log(`   Navegación funcional: ${resultados.dashboard.navegacion ? '✅ SÍ' : '❌ NO'}`);
  
  console.log(`\n📈 ESTADÍSTICAS:`);
  console.log(`   Total Tests: ${resultados.totalTests}`);
  console.log(`   ✅ Exitosos: ${resultados.exitosos}`);
  console.log(`   ❌ Fallidos: ${resultados.fallidos}`);
  console.log(`   📊 % Éxito: ${((resultados.exitosos / resultados.totalTests) * 100).toFixed(1)}%`);
  
  console.log(`\n🎯 CLASIFICACIÓN DE VELOCIDAD:`);
  console.log(`   🚀 EXCELENTE (< 300ms): ${resultados.resumen.excelente}`);
  console.log(`   ✅ BUENO (300-600ms): ${resultados.resumen.bueno}`);
  console.log(`   ⚠️ ACEPTABLE (600ms-1s): ${resultados.resumen.aceptable}`);
  console.log(`   🐌 LENTO (1-2s): ${resultados.resumen.lento}`);
  console.log(`   🔴 CRÍTICO (> 2s): ${resultados.resumen.critico}`);
  
  console.log(`\n📁 Reportes guardados en: frontend/tests/reportes/super-admin/`);
  console.log(`\n🎉 Test Super Admin completado!`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  ejecutarTestSuperAdmin().catch(console.error);
}

module.exports = { ejecutarTestSuperAdmin };














