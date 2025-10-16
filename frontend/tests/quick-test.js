const { chromium } = require('playwright');
const fs = require('fs');

async function quickTest() {
    console.log('🚀 PRUEBAS RÁPIDAS - 9001APP\n');
    
    const browser = await chromium.launch({ headless: false });
    const results = [];
    
    for (let i = 1; i <= 13; i++) {
        console.log(`🔄 ITERACIÓN ${i}/13`);
        const context = await browser.newContext();
        const page = await context.newPage();
        const result = { iteration: i, tests: {}, errors: [] };
        
        try {
            // Login
            await page.goto('http://localhost:3000/login');
            await page.fill('input[type="email"]', 'admin@9001app.com');
            await page.fill('input[type="password"]', 'admin123');
            await page.click('button:has-text("Iniciar Sesión")');
            await page.waitForTimeout(2000);
            result.tests.login = page.url().includes('dashboard') ? 'PASS' : 'FAIL';
            console.log(`   ${result.tests.login === 'PASS' ? '✅' : '❌'} Login`);
            
            // IMPORTANTE: Verificar que el localStorage tenga el usuario
            const hasUser = await page.evaluate(() => {
                return localStorage.getItem('user') !== null;
            });
            
            if (!hasUser) {
                result.errors.push('localStorage no tiene usuario después del login');
                console.log(`   ⚠️ WARNING: localStorage vacío`);
            }

            // Módulos - navegación directa
            const modules = [
                { name: 'CRM', url: '/crm' },
                { name: 'RRHH', url: '/rrhh' },
                { name: 'Calidad', url: '/calidad' },
                { name: 'Procesos', url: '/procesos' },
                { name: 'Documentos', url: '/documentos' },
                { name: 'Normas', url: '/normas' }
            ];

            for (const mod of modules) {
                try {
                    await page.goto(`http://localhost:3000${mod.url}`);
                    await page.waitForTimeout(1500);
                    
                    const url = page.url();
                    if (url.includes(mod.url) && !url.includes('/login')) {
                        result.tests[mod.name.toLowerCase()] = 'PASS';
                        console.log(`   ✅ ${mod.name}`);
                    } else {
                        result.tests[mod.name.toLowerCase()] = 'FAIL';
                        result.errors.push(`${mod.name} redirige a ${url}`);
                        console.log(`   ❌ ${mod.name}`);
                    }
                } catch (error) {
                    result.tests[mod.name.toLowerCase()] = 'FAIL';
                    result.errors.push(`${mod.name}: timeout`);
                    console.log(`   ❌ ${mod.name} - timeout`);
                }
            }

            result.overall = result.errors.length === 0 ? 'PASS' : 'FAIL';
            console.log(`   ${result.overall === 'PASS' ? '🎉 PASS' : '💥 FAIL'}\n`);

        } catch (error) {
            result.overall = 'FAIL';
            result.errors.push('Error general');
            console.log(`   ❌ ERROR\n`);
        }
        
        await context.close();
        results.push(result);
    }

    await browser.close();

    // REPORTE FINAL
    const passed = results.filter(r => r.overall === 'PASS').length;
    const failed = 13 - passed;
    const rate = Math.round((passed / 13) * 100);

    console.log('═══════════════════════════════════');
    console.log('📊 REPORTE FINAL - 13 ITERACIONES');
    console.log('═══════════════════════════════════\n');
    console.log(`✅ EXITOSAS: ${passed}/13`);
    console.log(`❌ FALLIDAS: ${failed}/13`);
    console.log(`📈 TASA DE ÉXITO: ${rate}%\n`);

    // Por módulo
    const modules = ['login', 'crm', 'rrhh', 'calidad', 'procesos', 'documentos', 'normas'];
    console.log('📋 RESUMEN POR MÓDULO:');
    console.log('─────────────────────────');
    modules.forEach(m => {
        const p = results.filter(r => r.tests[m] === 'PASS').length;
        const pct = Math.round((p/13)*100);
        console.log(`${m.toUpperCase().padEnd(15)} ${p}/13 (${pct}%)`);
    });

    // Problemas
    console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
    console.log('─────────────────────────');
    const allErrors = results.flatMap(r => r.errors);
    if (allErrors.length > 0) {
        const errorCounts = {};
        allErrors.forEach(e => errorCounts[e] = (errorCounts[e] || 0) + 1);
        Object.entries(errorCounts).forEach(([error, count]) => {
            console.log(`  ${count}x - ${error}`);
        });
    } else {
        console.log('  ✅ Ningún problema encontrado');
    }

    // Guardar
    const report = { timestamp: new Date().toISOString(), passed, failed, rate, results };
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Reporte guardado: test-report.json\n');
    console.log('═══════════════════════════════════\n');
}

quickTest().catch(console.error);
