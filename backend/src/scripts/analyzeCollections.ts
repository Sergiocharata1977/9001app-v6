import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface CollectionAnalysis {
  name: string;
  language: 'english' | 'spanish' | 'mixed';
  category: 'process' | 'rrhh' | 'quality' | 'core' | 'other';
  isDuplicate: boolean;
  documentCount: number;
  suggestedName?: string;
  issues: string[];
}

/**
 * Script para analizar las colecciones de MongoDB y detectar problemas de nomenclatura
 */
async function analyzeCollections(): Promise<void> {
  try {
    console.log('🔍 Iniciando análisis de colecciones MongoDB...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL || '');

    console.log('✅ Conectado a MongoDB');
    console.log(`🏢 Base de datos: ${mongoose.connection.db?.databaseName}\n`);

    // Obtener lista de todas las colecciones
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('No se pudo obtener la conexión a la base de datos');
    }

    const collections = await db.listCollections().toArray();
    console.log(`📊 Total de colecciones encontradas: ${collections.length}`);
    
    // Mostrar TODAS las colecciones encontradas
    console.log('📋 Lista completa de colecciones:');
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });
    console.log('');

    // Analizar cada colección
    const analysis: CollectionAnalysis[] = [];
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      const collectionAnalysis = analyzeCollectionName(collection.name, count);
      analysis.push(collectionAnalysis);
    }

    // Detectar duplicados
    detectDuplicates(analysis);

    // Mostrar resultados
    displayAnalysisResults(analysis);

    // Generar recomendaciones
    generateRecommendations(analysis);

  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

/**
 * Analizar el nombre de una colección individual
 */
function analyzeCollectionName(name: string, count: number): CollectionAnalysis {
  const analysis: CollectionAnalysis = {
    name,
    language: 'english',
    category: 'other',
    isDuplicate: false,
    documentCount: count,
    issues: []
  };

  // Detectar idioma
  if (isSpanishName(name)) {
    analysis.language = 'spanish';
  } else if (isMixedLanguage(name)) {
    analysis.language = 'mixed';
    analysis.issues.push('Nombre contiene mezcla de idiomas');
  }

  // Detectar categoría
  analysis.category = detectCategory(name);

  // Detectar problemas de nomenclatura
  if (name.includes('_') && name.includes('-')) {
    analysis.issues.push('Uso inconsistente de separadores (_ y -)');
  }

  if (name !== name.toLowerCase()) {
    analysis.issues.push('Nombre no está en minúsculas');
  }

  if (name.includes(' ')) {
    analysis.issues.push('Nombre contiene espacios');
  }

  // Generar nombre sugerido
  analysis.suggestedName = generateSuggestedName(name, analysis.category);

  return analysis;
}

/**
 * Detectar si un nombre está en español
 */
function isSpanishName(name: string): boolean {
  const spanishWords = [
    // RRHH
    'departamentos', 'personal', 'puestos', 'organizaciones',
    'capacitaciones', 'competencias', 'evaluaciones', 'temas',
    // Procesos
    'procesos', 'documentos', 'normas', 'objetivos', 'indicadores',
    'hallazgos', 'minutas', 'productos', 'politicas', 'calidad',
    // CRM
    'clientes', 'contactos', 'actividades', 'oportunidades',
    'cultivos', 'lotes', 'inmuebles', 'analisis', 'metricas',
    'balances', 'flujo', 'impuestos', 'zonas', 'geograficas',
    // Otros
    'encuestas', 'limites', 'uso', 'relaciones', 'suscripciones',
    'permisos', 'usuarios', 'backup', 'tokens'
  ];
  
  return spanishWords.some(word => name.toLowerCase().includes(word));
}

/**
 * Detectar si un nombre tiene mezcla de idiomas
 */
function isMixedLanguage(name: string): boolean {
  const englishWords = ['process', 'record', 'definition', 'document', 'user', 'organization'];
  const spanishWords = ['proceso', 'registro', 'definicion', 'documento', 'usuario', 'organizacion'];
  
  const hasEnglish = englishWords.some(word => name.toLowerCase().includes(word));
  const hasSpanish = spanishWords.some(word => name.toLowerCase().includes(word));
  
  return hasEnglish && hasSpanish;
}

/**
 * Detectar la categoría de una colección
 */
function detectCategory(name: string): CollectionAnalysis['category'] {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('process') || lowerName.includes('proceso')) {
    return 'process';
  }
  if (lowerName.includes('rrhh') || lowerName.includes('capacitacion') || lowerName.includes('competencia') || 
      lowerName.includes('personal') || lowerName.includes('departamento') || lowerName.includes('puesto')) {
    return 'rrhh';
  }
  if (lowerName.includes('objective') || lowerName.includes('objetivo') || lowerName.includes('indicator') || 
      lowerName.includes('quality') || lowerName.includes('calidad') || lowerName.includes('norma')) {
    return 'quality';
  }
  if (lowerName.includes('user') || lowerName.includes('usuario') || lowerName.includes('organization') || 
      lowerName.includes('organizacion') || lowerName.includes('department')) {
    return 'core';
  }
  
  return 'other';
}

/**
 * Detectar colecciones duplicadas
 */
function detectDuplicates(analysis: CollectionAnalysis[]): void {
  const nameGroups: { [key: string]: CollectionAnalysis[] } = {};
  
  // Agrupar por nombres similares
  analysis.forEach(item => {
    const normalizedName = item.name.toLowerCase()
      .replace(/s$/, '') // Remover plurales
      .replace(/_/g, '')
      .replace(/-/g, '');
    
    if (!nameGroups[normalizedName]) {
      nameGroups[normalizedName] = [];
    }
    nameGroups[normalizedName].push(item);
  });

  // Marcar duplicados
  Object.values(nameGroups).forEach(group => {
    if (group.length > 1) {
      group.forEach(item => {
        item.isDuplicate = true;
        item.issues.push(`Posible duplicado de: ${group.map(g => g.name).filter(n => n !== item.name).join(', ')}`);
      });
    }
  });
}

/**
 * Generar nombre sugerido
 */
function generateSuggestedName(originalName: string, category: string): string {
  let suggested = originalName.toLowerCase();
  
  // Aplicar convenciones estándar
  suggested = suggested
    .replace(/\s+/g, '_')           // Espacios a guiones bajos
    .replace(/-/g, '_')             // Guiones a guiones bajos
    .replace(/[^a-z0-9_]/g, '')     // Remover caracteres especiales
    .replace(/_+/g, '_')            // Múltiples guiones bajos a uno
    .replace(/^_|_$/g, '');         // Remover guiones bajos al inicio/final

  // Aplicar prefijos por categoría (nomenclatura española unificada)
  const prefixes: { [key: string]: string } = {
    'process': 'sgc_procesos',
    'rrhh': 'rrhh',
    'quality': 'sgc_calidad',
    'core': 'sistema',
    'other': 'general'
  };

  const prefix = prefixes[category] || 'general';
  
  // Si no tiene el prefijo apropiado, agregarlo
  if (!suggested.startsWith(prefix)) {
    // Intentar determinar el sufijo apropiado
    if (suggested.includes('definic') || suggested.includes('definition')) {
      suggested = `${prefix}_definiciones`;
    } else if (suggested.includes('record') || suggested.includes('registro')) {
      suggested = `${prefix}_registros`;
    } else if (suggested.includes('document') || suggested.includes('documento')) {
      suggested = `${prefix}_documentos`;
    } else {
      suggested = `${prefix}_${suggested}`;
    }
  }

  return suggested;
}

/**
 * Mostrar resultados del análisis
 */
function displayAnalysisResults(analysis: CollectionAnalysis[]): void {
  console.log('📋 RESULTADOS DEL ANÁLISIS\n');
  console.log('='.repeat(80));

  // Estadísticas generales
  const stats = {
    total: analysis.length,
    english: analysis.filter(a => a.language === 'english').length,
    spanish: analysis.filter(a => a.language === 'spanish').length,
    mixed: analysis.filter(a => a.language === 'mixed').length,
    duplicates: analysis.filter(a => a.isDuplicate).length,
    withIssues: analysis.filter(a => a.issues.length > 0).length
  };

  console.log(`📊 ESTADÍSTICAS GENERALES:`);
  console.log(`   • Total colecciones: ${stats.total}`);
  console.log(`   • En inglés: ${stats.english}`);
  console.log(`   • En español: ${stats.spanish}`);
  console.log(`   • Idioma mixto: ${stats.mixed}`);
  console.log(`   • Duplicados: ${stats.duplicates}`);
  console.log(`   • Con problemas: ${stats.withIssues}\n`);

  // Agrupar por categoría
  const categories = ['process', 'rrhh', 'quality', 'core', 'other'] as const;
  
  categories.forEach(category => {
    const items = analysis.filter(a => a.category === category);
    if (items.length === 0) return;

    console.log(`\n📁 CATEGORÍA: ${category.toUpperCase()}`);
    console.log('-'.repeat(50));
    
    items.forEach(item => {
      console.log(`   ${item.name} (${item.documentCount} docs)`);
      console.log(`     Idioma: ${item.language}`);
      if (item.isDuplicate) console.log(`     ⚠️  DUPLICADO`);
      if (item.issues.length > 0) {
        console.log(`     Problemas: ${item.issues.join(', ')}`);
      }
      if (item.suggestedName && item.suggestedName !== item.name) {
        console.log(`     💡 Sugerido: ${item.suggestedName}`);
      }
      console.log('');
    });
  });
}

/**
 * Generar recomendaciones
 */
function generateRecommendations(analysis: CollectionAnalysis[]): void {
  console.log('\n🎯 RECOMENDACIONES\n');
  console.log('='.repeat(80));

  const withIssues = analysis.filter(a => a.issues.length > 0 || a.language === 'mixed');
  
  if (withIssues.length === 0) {
    console.log('✅ ¡Excelente! No se encontraron problemas de nomenclatura.');
    return;
  }

  console.log(`❗ Se encontraron ${withIssues.length} colecciones con problemas.\n`);

  console.log('📝 PLAN DE ACCIÓN RECOMENDADO:\n');
  
  console.log('1. 🔄 ESTANDARIZAR NOMENCLATURA:');
  console.log('   • Usar español como idioma principal');
  console.log('   • Prefijos por módulo: sgc_, rrhh_, sistema_');
  console.log('   • Solo minúsculas y guiones bajos');
  console.log('   • Nombres descriptivos y plurales\n');

  console.log('2. 🗑️ ELIMINAR DUPLICADOS:');
  const duplicates = analysis.filter(a => a.isDuplicate);
  duplicates.forEach(dup => {
    console.log(`   • Revisar: ${dup.name} (${dup.documentCount} docs)`);
  });

  console.log('\n3. 📝 SCRIPT DE MIGRACIÓN:');
  console.log('   • Crear script para renombrar colecciones');
  console.log('   • Migrar datos entre colecciones duplicadas');
  console.log('   • Actualizar referencias en código');
  console.log('   • Verificar integridad post-migración\n');

  // Generar comandos de migración
  console.log('🛠️ COMANDOS DE MIGRACIÓN SUGERIDOS:\n');
  withIssues.forEach(item => {
    if (item.suggestedName && item.suggestedName !== item.name) {
      console.log(`   db.${item.name}.renameCollection("${item.suggestedName}")`);
    }
  });
  
  console.log('\n⚠️  IMPORTANTE: Hacer backup antes de ejecutar migraciones!');
}

// Ejecutar análisis si se llama directamente
if (require.main === module) {
  analyzeCollections();
}

export { analyzeCollections };
