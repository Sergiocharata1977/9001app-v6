import mongoose from 'mongoose';

/**
 * Servicio para obtener métricas de MongoDB
 * Monitorea performance, queries lentas, índices faltantes
 */
export class MongoDBMetricsService {
  /**
   * Obtiene estadísticas generales de la base de datos
   */
  static async getDatabaseStats() {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }

      // Obtener estadísticas de la base de datos
      const dbStats = await db.stats();

      // Obtener información del servidor
      const serverStatus = await db.admin().serverStatus();

      return {
        success: true,
        data: {
          // Información general
          database: db.databaseName,
          collections: dbStats.collections,
          dataSize: this.formatBytes(dbStats.dataSize),
          storageSize: this.formatBytes(dbStats.storageSize),
          indexes: dbStats.indexes,
          indexSize: this.formatBytes(dbStats.indexSize),

          // Conexiones
          connections: {
            current: serverStatus.connections?.current || 0,
            available: serverStatus.connections?.available || 0,
            totalCreated: serverStatus.connections?.totalCreated || 0,
            active: serverStatus.connections?.active || 0,
          },

          // Operaciones
          operations: {
            insert: serverStatus.opcounters?.insert || 0,
            query: serverStatus.opcounters?.query || 0,
            update: serverStatus.opcounters?.update || 0,
            delete: serverStatus.opcounters?.delete || 0,
            getmore: serverStatus.opcounters?.getmore || 0,
            command: serverStatus.opcounters?.command || 0,
          },

          // Memoria
          memory: {
            resident: serverStatus.mem?.resident || 0,
            virtual: serverStatus.mem?.virtual || 0,
            mapped: serverStatus.mem?.mapped || 0,
          },

          // Uptime
          uptime: serverStatus.uptime,
          uptimeFormatted: this.formatUptime(serverStatus.uptime),
        },
      };
    } catch (error: any) {
      console.error('[MongoDB Metrics] Error getting database stats:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene queries lentas (> 100ms)
   */
  static async getSlowQueries(limit = 10) {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }

      // Obtener el profiling level actual
      const profilingLevel = await db.command({ profile: -1 });

      // Si el profiling no está activado, activarlo temporalmente
      if (profilingLevel.was === 0) {
        // Activar profiling solo para queries lentas (> 100ms)
        await db.command({ profile: 1, slowms: 100 });
      }

      // Obtener queries lentas del system.profile
      const slowQueries = await db
        .collection('system.profile')
        .find({
          millis: { $gt: 100 },
        })
        .sort({ ts: -1 })
        .limit(limit)
        .toArray();

      return {
        success: true,
        data: slowQueries.map((query: any) => ({
          timestamp: query.ts,
          operation: query.op,
          namespace: query.ns,
          duration: query.millis,
          command: query.command,
          planSummary: query.planSummary,
        })),
        profilingEnabled: profilingLevel.was > 0,
      };
    } catch (error: any) {
      console.error('[MongoDB Metrics] Error getting slow queries:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Analiza colecciones y detecta índices faltantes
   */
  static async analyzeMissingIndexes() {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collections = await db.listCollections().toArray();
      const analysis: any[] = [];

      for (const collInfo of collections) {
        const collName = collInfo.name;

        // Saltar colecciones del sistema
        if (collName.startsWith('system.')) continue;

        const collection = db.collection(collName);

        // Obtener índices existentes
        const indexes = await collection.indexes();

        // Obtener estadísticas de la colección
        const stats = await db.command({ collStats: collName });

        // Analizar si necesita índices
        const needsIndexes = this.detectMissingIndexes(collName, indexes, stats);

        if (needsIndexes.length > 0) {
          analysis.push({
            collection: collName,
            documentCount: stats.count,
            avgDocSize: this.formatBytes(stats.avgObjSize),
            currentIndexes: indexes.map((idx: any) => ({
              name: idx.name,
              keys: idx.key,
            })),
            recommendations: needsIndexes,
          });
        }
      }

      return {
        success: true,
        data: analysis,
      };
    } catch (error: any) {
      console.error('[MongoDB Metrics] Error analyzing indexes:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Detecta índices faltantes basado en patrones comunes
   */
  private static detectMissingIndexes(
    collectionName: string,
    existingIndexes: any[],
    stats: any
  ): string[] {
    const recommendations: string[] = [];

    // Verificar si tiene índice en organization_id (multi-tenant)
    const hasOrgIndex = existingIndexes.some(idx => idx.key.hasOwnProperty('organization_id'));

    if (!hasOrgIndex && stats.count > 100) {
      recommendations.push('Crear índice en organization_id para queries multi-tenant');
    }

    // Verificar si tiene índice en timestamp/createdAt para queries de fecha
    const hasTimestampIndex = existingIndexes.some(
      idx =>
        idx.key.hasOwnProperty('timestamp') ||
        idx.key.hasOwnProperty('createdAt') ||
        idx.key.hasOwnProperty('fecha')
    );

    if (!hasTimestampIndex && stats.count > 500) {
      recommendations.push('Crear índice en timestamp/createdAt para queries de fecha');
    }

    // Si la colección es grande (> 1000 docs) y solo tiene _id index
    if (existingIndexes.length === 1 && stats.count > 1000) {
      recommendations.push(
        'Colección grande sin índices adicionales - considerar índices en campos frecuentemente consultados'
      );
    }

    return recommendations;
  }

  /**
   * Obtiene métricas de latencia por colección
   */
  static async getCollectionLatency() {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collections = await db.listCollections().toArray();
      const latencyData: any[] = [];

      for (const collInfo of collections) {
        const collName = collInfo.name;

        // Saltar colecciones del sistema
        if (collName.startsWith('system.')) continue;

        const collection = db.collection(collName);

        // Medir latencia de una query simple
        const startTime = Date.now();
        await collection.findOne({});
        const latency = Date.now() - startTime;

        // Obtener stats
        const stats = await db.command({ collStats: collName });

        latencyData.push({
          collection: collName,
          latency,
          documentCount: stats.count,
          avgDocSize: stats.avgObjSize,
          status: latency > 100 ? 'slow' : latency > 50 ? 'warning' : 'good',
        });
      }

      // Ordenar por latencia (más lentas primero)
      latencyData.sort((a, b) => b.latency - a.latency);

      return {
        success: true,
        data: latencyData,
      };
    } catch (error: any) {
      console.error('[MongoDB Metrics] Error getting collection latency:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Obtiene resumen completo de salud de MongoDB
   */
  static async getHealthSummary() {
    try {
      const [dbStats, slowQueries, missingIndexes, latency] = await Promise.all([
        this.getDatabaseStats(),
        this.getSlowQueries(5),
        this.analyzeMissingIndexes(),
        this.getCollectionLatency(),
      ]);

      // Calcular score de salud (0-100)
      let healthScore = 100;

      // Penalizar por queries lentas
      if (slowQueries.data && slowQueries.data.length > 0) {
        healthScore -= slowQueries.data.length * 5;
      }

      // Penalizar por índices faltantes
      if (missingIndexes.data && missingIndexes.data.length > 0) {
        healthScore -= missingIndexes.data.length * 10;
      }

      // Penalizar por colecciones lentas
      if (latency.data) {
        const slowCollections = latency.data.filter((c: any) => c.status === 'slow');
        healthScore -= slowCollections.length * 8;
      }

      healthScore = Math.max(0, healthScore);

      return {
        success: true,
        data: {
          healthScore,
          status:
            healthScore > 80
              ? 'excellent'
              : healthScore > 60
                ? 'good'
                : healthScore > 40
                  ? 'warning'
                  : 'critical',
          dbStats: dbStats.data,
          slowQueries: slowQueries.data || [],
          missingIndexes: missingIndexes.data || [],
          collectionLatency: latency.data || [],
          recommendations: this.generateRecommendations(
            slowQueries.data || [],
            missingIndexes.data || [],
            latency.data || []
          ),
        },
      };
    } catch (error: any) {
      console.error('[MongoDB Metrics] Error getting health summary:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Genera recomendaciones basadas en las métricas
   */
  private static generateRecommendations(
    slowQueries: any[],
    missingIndexes: any[],
    latency: any[]
  ): string[] {
    const recommendations: string[] = [];

    if (slowQueries.length > 5) {
      recommendations.push(
        `⚠️ ${slowQueries.length} queries lentas detectadas - Revisar y optimizar`
      );
    }

    if (missingIndexes.length > 0) {
      recommendations.push(
        `🔍 ${missingIndexes.length} colecciones necesitan índices - Crear índices recomendados`
      );
    }

    const slowCollections = latency.filter(c => c.status === 'slow');
    if (slowCollections.length > 0) {
      recommendations.push(
        `🐌 ${slowCollections.length} colecciones lentas - Considerar paginación o índices`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Base de datos funcionando óptimamente');
    }

    return recommendations;
  }

  /**
   * Formatea bytes a formato legible
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Formatea uptime a formato legible
   */
  private static formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  }
}
