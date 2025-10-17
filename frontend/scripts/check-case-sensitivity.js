#!/usr/bin/env node
/**
 * Script para detectar problemas de case sensitivity en imports
 * Previene errores de deployment en Linux
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Verificando case sensitivity en imports...\n');

const root = path.resolve(__dirname, '..', 'src');
const files = glob.sync(`${root}/**/*.{ts,tsx,js,jsx}`, { nodir: true });

console.log(`📊 Analizando ${files.length} archivos...\n`);

// Mapa de archivos del sistema de archivos
const mapFs = new Map();
files.forEach(f => {
  const rel = path.relative(root, f);
  mapFs.set(rel.toLowerCase(), { real: rel, path: f });
});

// Extraer imports
const imports = [];
const importRegex = /import\s+(?:.+?)\s+from\s+['"](.+?)['"]/g;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = importRegex.exec(content)) !== null) {
      const imp = m[1];
      if (imp.startsWith('.') || imp.startsWith('@/')) {
        imports.push({ file, imp });
      }
    }
  } catch (err) {
    console.warn(`⚠️  No se pudo leer: ${file}`);
  }
});

console.log(`📦 Encontrados ${imports.length} imports locales\n`);

const problems = [];

imports.forEach(({ file, imp }) => {
  const baseDir = path.dirname(file);
  let fullPath = imp.startsWith('@/') 
    ? path.resolve(root, imp.replace(/^@\/?/, '')) 
    : path.resolve(baseDir, imp);
  
  // Intentar con extensiones
  const candidates = [
    `${fullPath}.ts`,
    `${fullPath}.tsx`,
    `${fullPath}.js`,
    `${fullPath}.jsx`,
    `${fullPath}/index.ts`,
    `${fullPath}/index.tsx`,
    `${fullPath}/index.js`,
    `${fullPath}/index.jsx`
  ];
  
  const exists = candidates.find(c => fs.existsSync(c));
  
  if (!exists) {
    // Buscar coincidencia case-insensitive
    const dir = path.dirname(candidates[0]);
    const base = path.basename(fullPath);
    
    if (fs.existsSync(dir)) {
      try {
        const filesInDir = fs.readdirSync(dir);
        const match = filesInDir.find(f => {
          const baseName = f.replace(/\.(ts|tsx|js|jsx)$/, '');
          return baseName.toLowerCase() === base.toLowerCase();
        });
        
        if (match) {
          const actualPath = path.join(dir, match);
          const expectedImport = path.relative(baseDir, actualPath)
            .replace(/\\/g, '/')
            .replace(/\.(ts|tsx|js|jsx)$/, '');
          
          problems.push({
            file: path.relative(root, file),
            import: imp,
            suggestion: expectedImport.startsWith('.') ? expectedImport : `./${expectedImport}`,
            reason: 'Case mismatch'
          });
        } else {
          problems.push({
            file: path.relative(root, file),
            import: imp,
            suggestion: null,
            reason: 'File not found'
          });
        }
      } catch (err) {
        // Ignorar errores de lectura de directorio
      }
    } else {
      problems.push({
        file: path.relative(root, file),
        import: imp,
        suggestion: null,
        reason: 'Directory not found'
      });
    }
  }
});

// Mostrar resultados
if (problems.length > 0) {
  console.log(`❌ Se encontraron ${problems.length} problemas de case sensitivity:\n`);
  
  problems.forEach((p, i) => {
    console.log(`${i + 1}. ${p.file}`);
    console.log(`   Import: ${p.import}`);
    if (p.suggestion) {
      console.log(`   ✓ Sugerencia: ${p.suggestion}`);
    } else {
      console.log(`   ✗ Archivo no encontrado`);
    }
    console.log(`   Razón: ${p.reason}\n`);
  });
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Estos problemas causarán errores en Linux');
  console.log('🔧 Corrige los imports o renombra los archivos');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  process.exit(1);
} else {
  console.log('✅ No se encontraron problemas de case sensitivity');
  console.log('🎉 Todos los imports son consistentes con el sistema de archivos\n');
  process.exit(0);
}

