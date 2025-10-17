#!/usr/bin/env node
/**
 * Script de validación pre-build para deployment en Linux
 * Verifica problemas comunes de case sensitivity y configuración
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando compatibilidad Linux...\n');

let hasErrors = false;

// 1. Verificar archivos .env
const envFiles = ['.env', '.env.local', '.env.production'];
envFiles.forEach(file => {
  const envPath = path.join(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('\r\n')) {
      console.warn(`⚠️  ${file} tiene line endings de Windows (CRLF). Considera convertir a LF para Linux.`);
    } else {
      console.log(`✅ ${file} - line endings correctos`);
    }
  }
});

// 2. Verificar que node_modules existe
if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
  console.error('❌ node_modules no existe. Ejecuta: npm install --legacy-peer-deps');
  hasErrors = true;
} else {
  console.log('✅ node_modules existe');
}

// 3. Verificar que .next no existe (build limpio)
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('🧹 Limpiando directorio .next anterior...');
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ Directorio .next eliminado');
}

// 4. Verificar imports comunes problemáticos
console.log('\n🔍 Verificando imports case-sensitive...');

const problematicPatterns = [
  { pattern: /from ['"]\.\/[A-Z][a-zA-Z]*['"]/, msg: 'Import con PascalCase relativo' },
  { pattern: /from ['"]@\/components\/ui\/[A-Z][a-zA-Z]*['"]/, msg: 'Import UI con PascalCase' },
];

let fileCount = 0;
let issueCount = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  problematicPatterns.forEach(({ pattern, msg }) => {
    if (pattern.test(content)) {
      console.warn(`⚠️  ${relativePath}: ${msg}`);
      issueCount++;
    }
  });
  fileCount++;
}

function walkDir(dir, ext = '.tsx') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath, ext);
    } else if (file.endsWith(ext) || file.endsWith('.ts')) {
      checkFile(filePath);
    }
  });
}

const srcDir = path.join(process.cwd(), 'src');
if (fs.existsSync(srcDir)) {
  walkDir(srcDir);
  console.log(`\n📊 Archivos analizados: ${fileCount}`);
  if (issueCount > 0) {
    console.warn(`⚠️  Posibles problemas encontrados: ${issueCount}`);
    console.warn('   Estos imports pueden fallar en Linux si los archivos están en kebab-case.\n');
  } else {
    console.log('✅ No se encontraron problemas evidentes de case sensitivity\n');
  }
}

// 5. Resumen
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (hasErrors) {
  console.error('❌ Hay errores críticos. Corrígelos antes del build.');
  process.exit(1);
} else if (issueCount > 0) {
  console.warn('⚠️  Hay advertencias. El build puede fallar en Linux.');
  console.log('   Continúa bajo tu propio riesgo...\n');
} else {
  console.log('✅ Validación pre-build completada con éxito\n');
}

