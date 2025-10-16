/**
 * Monitor de Rendimiento de Módulos para MVP
 * 
 * Este módulo proporciona funciones para monitorear y optimizar el rendimiento
 * de los diferentes módulos de la aplicación.
 */

// Interfaz para métricas de rendimiento
export interface PerformanceMetric {
  module: string;
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
}

// Interfaz para estadísticas de rendimiento
export interface PerformanceStats {
  module: string;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  successRate: number;
  sampleCount: number;
}

// Clase para monitorear el rendimiento
export class ModulePerformanceMonitor {
  private static instance: ModulePerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 100; // Limitar la cantidad de métricas almacenadas
  private enabled: boolean = true;

  // Singleton
  private constructor() { }

  public static getInstance(): ModulePerformanceMonitor {
    if (!ModulePerformanceMonitor.instance) {
      ModulePerformanceMonitor.instance = new ModulePerformanceMonitor();
    }
    return ModulePerformanceMonitor.instance;
  }

  // Habilitar/deshabilitar el monitor
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Iniciar medición de rendimiento
  public startMeasure(module: string, operation: string): number {
    if (!this.enabled) return 0;
    return performance.now();
  }

  // Finalizar medición de rendimiento
  public endMeasure(
    module: string,
    operation: string,
    startTime: number,
    success: boolean = true,
    error?: string
  ): PerformanceMetric | null {
    if (!this.enabled || startTime === 0) return null;

    const endTime = performance.now();
    const duration = endTime - startTime;

    const metric: PerformanceMetric = {
      module,
      operation,
      startTime,
      endTime,
      duration,
      success,
      error
    };

    // Agregar métrica y limitar el tamaño
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Loguear en consola para desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `%c[Performance] ${module} - ${operation}: ${duration.toFixed(2)}ms ${success ? '✅' : '❌'
        }`,
        `color: ${success ? 'green' : 'red'}`
      );
    }

    return metric;
  }

  // Medir rendimiento de una función
  public async measure<T>(
    module: string,
    operation: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const startTime = this.startMeasure(module, operation);

    try {
      const result = await fn();
      this.endMeasure(module, operation, startTime, true);
      return result;
    } catch (error) {
      this.endMeasure(
        module,
        operation,
        startTime,
        false,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  // Obtener todas las métricas
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Obtener métricas por módulo
  public getMetricsByModule(module: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.module === module);
  }

  // Obtener estadísticas de rendimiento por módulo
  public getStatsByModule(module: string): PerformanceStats | null {
    const moduleMetrics = this.getMetricsByModule(module);

    if (moduleMetrics.length === 0) {
      return null;
    }

    const durations = moduleMetrics.map(metric => metric.duration);
    const successCount = moduleMetrics.filter(metric => metric.success).length;

    return {
      module,
      avgDuration: durations.reduce((sum, duration) => sum + duration, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: (successCount / moduleMetrics.length) * 100,
      sampleCount: moduleMetrics.length
    };
  }

  // Obtener estadísticas de rendimiento para todos los módulos
  public getAllStats(): Record<string, PerformanceStats> {
    const modules = new Set(this.metrics.map(metric => metric.module));
    const stats: Record<string, PerformanceStats> = {};

    modules.forEach(module => {
      const moduleStats = this.getStatsByModule(module);
      if (moduleStats) {
        stats[module] = moduleStats;
      }
    });

    return stats;
  }

  // Limpiar métricas
  public clearMetrics(): void {
    this.metrics = [];
  }

  // Iniciar monitoreo de un módulo (método faltante)
  public startMonitoring(module: string): void {
    if (!this.enabled) return;
    
    // Loguear inicio de monitoreo
    if (process.env.NODE_ENV !== 'production') {
      console.log(`%c[Performance] Iniciando monitoreo para módulo: ${module}`, 'color: blue');
    }
  }

  // Registrar tiempo de carga (método faltante)
  public recordLoadTime(module: string): void {
    if (!this.enabled) return;
    
    const loadTime = performance.now();
    
    // Loguear tiempo de carga
    if (process.env.NODE_ENV !== 'production') {
      console.log(`%c[Performance] Tiempo de carga para ${module}: ${loadTime.toFixed(2)}ms`, 'color: green');
    }
  }
}

// Exportar instancia singleton
export const performanceMonitor = ModulePerformanceMonitor.getInstance();

// Decorador para medir rendimiento de métodos
export function measurePerformance(module: string, operation?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const opName = operation || propertyKey;
      return performanceMonitor.measure(
        module,
        opName,
        () => originalMethod.apply(this, args)
      );
    };

    return descriptor;
  };
}

// Función para envolver una función con medición de rendimiento
export function withPerformance<T>(
  fn: (...args: any[]) => Promise<T> | T,
  module: string,
  operation: string
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    return performanceMonitor.measure(module, operation, () => fn(...args));
  };
}

// Cache en memoria simple para optimizar rendimiento
export class MemoryCache {
  private static instance: MemoryCache;
  private cache: Record<string, { value: any; expiry: number }> = {};
  private enabled: boolean = true;

  private constructor() { }

  public static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }

  // Habilitar/deshabilitar el cache
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Obtener valor del cache
  public get<T>(key: string): T | null {
    if (!this.enabled) return null;

    const item = this.cache[key];

    if (!item) return null;

    // Verificar si expiró
    if (item.expiry && item.expiry < Date.now()) {
      delete this.cache[key];
      return null;
    }

    return item.value as T;
  }

  // Guardar valor en cache
  public set<T>(key: string, value: T, ttlMs?: number): void {
    if (!this.enabled) return;

    const expiry = ttlMs ? Date.now() + ttlMs : 0;

    this.cache[key] = { value, expiry };
  }

  // Eliminar valor del cache
  public delete(key: string): void {
    delete this.cache[key];
  }

  // Limpiar todo el cache
  public clear(): void {
    this.cache = {};
  }

  // Obtener todas las claves
  public keys(): string[] {
    return Object.keys(this.cache);
  }

  // Obtener tamaño del cache
  public size(): number {
    return Object.keys(this.cache).length;
  }
}

// Exportar instancia singleton del cache
export const memoryCache = MemoryCache.getInstance();

// Decorador para cachear resultados de métodos
export function cacheResult(ttlMs?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}(${JSON.stringify(args)})`;

      // Intentar obtener del cache
      const cachedResult = memoryCache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Ejecutar método original
      const result = await originalMethod.apply(this, args);

      // Guardar en cache
      memoryCache.set(cacheKey, result, ttlMs);

      return result;
    };

    return descriptor;
  };
}
