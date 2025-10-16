/**
 * Servicio de Caching (In-Memory)
 * Implementación simple sin Redis para desarrollo rápido
 * TODO: Migrar a Redis en producción
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutos en ms

  /**
   * Obtener valor del cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si expiró
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Guardar valor en cache
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      data,
      expiresAt,
    });
  }

  /**
   * Invalidar clave específica
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidar por patrón
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpiar todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtener o ejecutar (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    // Intentar obtener del cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Si no existe, ejecutar función y guardar
    const data = await fetchFn();
    this.set(key, data, ttlMs);
    return data;
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats() {
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [, entry] of this.cache.entries()) {
      if (Date.now() > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalKeys: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: 0, // TODO: implementar tracking de hits/misses
    };
  }
}

// Singleton
export const cacheService = new CacheService();

