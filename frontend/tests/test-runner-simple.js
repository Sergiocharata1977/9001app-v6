const { chromium } = require('playwright');
const fs = require('fs');

async function runTests() {
    console.log('🚀 INICIANDO PRUEBAS - 9001APP\n');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const results = [];
    
    for (let i = 1; i <= 13; i++) {
        console.log(`🔄 ITERACIÓN ${i}/13`);
        const result = { iteration: i, tests: {}, errors: [] };
        const context = await browser.newContext();
        const page = await context.newPage();
        
        try {
            // Login
            await page.goto('http://localhost:3000/login', { timeout: 15000 });
            await page.fill('input[type="email"]', 'admin@9001app.com');
            await page.fill('input[type="password"]', 'admin123');
            await page.click('button:has-text("Iniciar Sesión")');
            await page.waitForURL(/.*dashboard/, { timeout: 15000 });
            result.tests.login = 'PASS';
            console.log(`   ✅ Login`);

            // Módulos
            const modules = [
                { name: 'CRM', url: '/crm/dashboard' },
                { name: 'RRHH', url: '/rrhh' },
                { name: 'Calidad', url: '/calidad' },
                { name: 'Procesos', url: '/procesos' },
                { name: 'Documentos', url: '/documentos' },
                { name: 'Normas', url: '/normas' },
                { name: 'Mejoras', url: '/mejoras' }
            ];

            for (const mod of modules) {
                try {
                    await page.goto(`http://localhost:3000${mod.url}`, { timeout: 15000 });
                    await page.waitForTimeout(1000);
                    
                    if (!page.url().includes('/login')) {
                        result.tests[mod.name.toLowerCase()] = 'PASS';
                        console.log(`   ✅ ${mod.name}`);
                    } else {
                        result.tests[mod.name.toLowerCase()] = 'FAIL';
                        result.errors.push(`${mod.name} redirige al login`);
                        console.log(`   ❌ ${mod.name} redirige al login`);
                    }
                } catch (error) {
                    result.tests[mod.name.toLowerCase()] = 'FAIL';
                    result.errors.push(`${mod.name}: ${error.message.substring(0, 50)}`);
                    console.log(`   ❌ ${mod.name} error`);
                }
            }

            result.overall = result.errors.length === 0 ? 'PASS' : 'FAIL';
            console.log(`   ${result.overall === 'PASS' ? '🎉' : '💥'} Resultado: ${result.overall}\n`);

        } catch (error) {
            result.overall = 'FAIL';
            result.errors.push(error.message.substring(0, 100));
            console.log(`   ❌ ERROR GENERAL\n`);
        }
        
        await context.close();
        results.push(result);
    }

    await browser.close();

    // Reporte final
    const passed = results.filter(r => r.overall === 'PASS').length;
    const failed = results.filter(r => r.overall === 'FAIL').length;
    const rate = Math.round((passed / 13) * 100);

    console.log('📊 REPORTE FINAL:');
    console.log('=================');
    console.log(`✅ Exitosas: ${passed}/13`);
    console.log(`❌ Fallidas: ${failed}/13`);
    console.log(`📈 Tasa: ${rate}%\n`);

    // Módulos
    const modules = ['login', 'crm', 'rrhh', 'calidad', 'procesos', 'documentos', 'normas', 'mejoras'];
    console.log('📋 POR MÓDULO:');
    modules.forEach(m => {
        const p = results.filter(r => r.tests[m] === 'PASS').length;
        console.log(`   ${m}: ${p}/13 (${Math.round((p/13)*100)}%)`);
    });

    // Problemas
    const allErrors = results.flatMap(r => r.errors);
    if (allErrors.length > 0) {
        console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
        const errorCounts = {};
        allErrors.forEach(e => {
            errorCounts[e] = (errorCounts[e] || 0) + 1;
        });
        Object.entries(errorCounts).forEach(([error, count]) => {
            console.log(`   - ${error} (${count}x)`);
        });
    }

    fs.writeFileSync('test-report.json', JSON.stringify({ passed, failed, rate, results }, null, 2));
    console.log('\n💾 Reporte: test-report.json');
}

new TestRunner().runTests().catch(console.error);






