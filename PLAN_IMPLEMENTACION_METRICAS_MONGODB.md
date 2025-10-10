# 📊 Plan de Implementación: Sistema de Monitoreo y Métricas MongoDB

**Proyecto:** 9001app-v6  
**Fecha:** Octubre 2025  
**Referencia:** [MongoDB Monitoring Guide](https://www.mongodb.com/resources/products/capabilities/how-to-monitor-mongodb-and-what-metrics-to-monitor)

---

## 🎯 Objetivo General

Implementar un sistema completo de monitoreo y métricas para MongoDB que permita:
- ✅ Supervisar la salud del sistema en tiempo real
- ✅ Detectar cuellos de botella y optimizar rendimiento
- ✅ Prevenir problemas antes de que afecten a usuarios
- ✅ Garantizar cumplimiento de SLAs y disponibilidad
- ✅ Optimizar costos mediante uso eficiente de recursos

---

## 📋 Índice

1. [Métricas Prioritarias](#métricas-prioritarias)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Fases de Implementación](#fases-de-implementación)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Servicios Backend](#servicios-backend)
6. [Componentes Frontend](#componentes-frontend)
7. [Rutas y Navegación](#rutas-y-navegación)
8. [Sistema de Alertas](#sistema-de-alertas)
9. [Cronograma](#cronograma)
10. [Recursos Necesarios](#recursos-necesarios)

---

## 🎯 Métricas Prioritarias

### Top 7 Métricas Críticas (Basadas en MongoDB Official Guide)

| Prioridad | Métrica | Descripción | Valor Ideal | Señal de Alerta |
|-----------|---------|-------------|-------------|-----------------|
| 🔴 **CRÍTICA** | **Query Targeting** | Ratio de documentos examinados vs retornados | ≤ 1.0 | > 10 |
| 🔴 **CRÍTICA** | **Scan and Order** | Operaciones de ordenamiento sin índice | 0 | > 0 |
| 🟠 **ALTA** | **Normalized System CPU** | Uso de CPU normalizado (0-100%) | 40-70% | < 40% o > 70% |
| 🟠 **ALTA** | **Slow Queries** | Consultas con tiempo > 1000ms | 0 | > 10/min |
| 🟡 **MEDIA** | **Active Connections** | Conexiones simultáneas activas | Estable | Picos anormales |
| 🟡 **MEDIA** | **Memory Usage** | Uso de memoria RAM del sistema | < 80% | > 85% |
| 🟢 **BAJA** | **Disk Space Free** | Espacio en disco disponible | > 20% | < 15% |

### Métricas Adicionales Importantes

#### **Performance Metrics**
- **Query Execution Time** (P50, P95, P99)
- **Index Hit Ratio** (% de queries que usan índices)
- **Cache Hit Ratio** (efectividad de caché)
- **Documents Scanned per Query**

#### **Resource Metrics**
- **Normalized Process CPU** (CPU usado por MongoDB específicamente)
- **Disk Latency** (latencia de lectura/escritura)
- **Disk IOPS** (operaciones I/O por segundo)
- **Network Throughput**

#### **Replication Metrics** (si aplica)
- **Replication Lag** (retraso entre primario y secundario)
- **Replication Oplog Window** (ventana de tiempo del oplog)
- **Oplog GB/hour** (crecimiento del oplog)

#### **Database Metrics**
- **Collection Count** (número de colecciones)
- **Document Count per Collection**
- **Average Document Size**
- **Index Size vs Data Size**
- **Database Size Growth Rate**

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  📊 Dashboard Principal (/admin/sistema/monitoreo)          │
│    ├─ SystemHealthDashboard.tsx                             │
│    ├─ QueryPerformanceChart.tsx                             │
│    ├─ ResourceMonitor.tsx                                   │
│    ├─ AlertsPanel.tsx                                       │
│    ├─ SlowQueriesTable.tsx                                  │
│    └─ DatabaseStatsCard.tsx                                 │
└─────────────────────────────────────────────────────────────┘
                            ↕ API REST
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + TS)                    │
├─────────────────────────────────────────────────────────────┤
│  🔧 Services                                                 │
│    ├─ databaseMonitoringService.ts (Core)                   │
│    ├─ queryAnalyzerService.ts                               │
│    ├─ alertService.ts                                       │
│    └─ metricsCollectorService.ts                            │
│                                                              │
│  🛣️ Routes                                                   │
│    └─ /api/monitoring/* (endpoints)                         │
│                                                              │
│  📝 Models                                                   │
│    ├─ MetricSnapshot.ts                                     │
│    ├─ SlowQuery.ts                                          │
│    └─ SystemAlert.ts                                        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB                                   │
│  ├─ Application Database (datos de la app)                  │
│  └─ Metrics Database (métricas históricas)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Fases de Implementación

### **FASE 1: Infraestructura Base** (Semana 1)
**Objetivo:** Establecer la base de datos y servicios core

#### Backend
- [ ] Crear modelo `MetricSnapshot` para almacenar métricas históricas
- [ ] Crear modelo `SlowQuery` para registrar consultas lentas
- [ ] Crear modelo `SystemAlert` para alertas del sistema
- [ ] Implementar `databaseMonitoringService.ts` con funciones base:
  - `getServerStatus()` - obtener db.serverStatus()
  - `getDatabaseStats()` - obtener stats por database
  - `getCollectionStats()` - obtener stats por colección
  - `getConnectionStats()` - conexiones activas

#### Pruebas
- [ ] Test unitarios de servicios
- [ ] Validar conexión y obtención de métricas base

---

### **FASE 2: Query Performance Monitor** (Semana 2)
**Objetivo:** Implementar análisis de performance de queries

#### Backend
- [ ] Implementar `queryAnalyzerService.ts`:
  - `enableQueryProfiler()` - activar profiler de MongoDB
  - `getSlowQueries()` - obtener queries lentas (>1000ms)
  - `getQueryTargeting()` - calcular query targeting ratio
  - `getScanAndOrderOps()` - detectar operaciones sin índices
  - `analyzeIndexUsage()` - análisis de uso de índices

#### API Routes
```typescript
GET  /api/monitoring/queries/slow          // Queries lentas
GET  /api/monitoring/queries/targeting     // Query targeting metrics
GET  /api/monitoring/queries/scan-order    // Scan and order operations
GET  /api/monitoring/indexes/usage         // Uso de índices
POST /api/monitoring/queries/analyze       // Analizar query específica
```

#### Frontend
- [ ] Crear componente `QueryPerformanceChart.tsx`
- [ ] Crear componente `SlowQueriesTable.tsx`
- [ ] Crear componente `IndexRecommendations.tsx`

---

### **FASE 3: Resource Monitoring** (Semana 3)
**Objetivo:** Monitorear recursos del sistema

#### Backend
- [ ] Implementar `resourceMonitorService.ts`:
  - `getCPUMetrics()` - CPU normalizado del sistema y proceso
  - `getMemoryMetrics()` - uso de memoria
  - `getDiskMetrics()` - espacio, latencia, IOPS
  - `getNetworkMetrics()` - throughput de red

#### API Routes
```typescript
GET /api/monitoring/resources/cpu          // Métricas de CPU
GET /api/monitoring/resources/memory       // Métricas de memoria
GET /api/monitoring/resources/disk         // Métricas de disco
GET /api/monitoring/resources/network      // Métricas de red
GET /api/monitoring/resources/summary      // Resumen de todos los recursos
```

#### Frontend
- [ ] Crear componente `ResourceMonitor.tsx` con gauges/charts:
  - CPU Usage Gauge
  - Memory Usage Bar
  - Disk Space Indicator
  - Network Throughput Graph

---

### **FASE 4: Sistema de Alertas** (Semana 4)
**Objetivo:** Detección proactiva de problemas

#### Backend
- [ ] Implementar `alertService.ts`:
  - `checkThresholds()` - verificar umbrales de métricas
  - `createAlert()` - crear alerta en BD
  - `getActiveAlerts()` - obtener alertas activas
  - `resolveAlert()` - marcar alerta como resuelta
  - `sendNotification()` - enviar notificación (email/webhook)

#### Reglas de Alertas
```typescript
// Configuración de umbrales
const ALERT_THRESHOLDS = {
  queryTargeting: { warning: 5, critical: 10 },
  scanAndOrder: { warning: 1, critical: 10 },
  cpuUsage: { warning: 70, critical: 85 },
  memoryUsage: { warning: 80, critical: 90 },
  diskSpace: { warning: 20, critical: 10 }, // % libre
  slowQueries: { warning: 5, critical: 20 }, // por minuto
  replicationLag: { warning: 5, critical: 10 } // segundos
};
```

#### API Routes
```typescript
GET  /api/monitoring/alerts                // Alertas activas
POST /api/monitoring/alerts/:id/resolve    // Resolver alerta
GET  /api/monitoring/alerts/history        // Historial de alertas
PUT  /api/monitoring/alerts/config         // Configurar umbrales
```

#### Frontend
- [ ] Crear componente `AlertsPanel.tsx`
- [ ] Crear componente `AlertNotificationBadge.tsx` (header)
- [ ] Sistema de notificaciones toast para alertas en tiempo real

---

### **FASE 5: Dashboard Principal** (Semana 5)
**Objetivo:** Interfaz unificada de monitoreo

#### Frontend
- [ ] Crear página `/admin/sistema/monitoreo`
- [ ] Implementar `SystemHealthDashboard.tsx`:
  - Vista general del estado del sistema (Health Score)
  - Grid de métricas principales
  - Gráficos de tendencias (últimas 24h, 7d, 30d)
  - Panel de alertas activas
  - Top 10 consultas lentas
  - Recomendaciones de optimización

#### Secciones del Dashboard
```
┌─────────────────────────────────────────────────────┐
│  🟢 Sistema Saludable | Score: 94/100               │
├─────────────────────────────────────────────────────┤
│  📊 Métricas Principales (Cards)                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ CPU  │ │ RAM  │ │Queries│ │Alerts│              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
├─────────────────────────────────────────────────────┤
│  📈 Query Performance (últimas 24h)                 │
│  [Gráfico de líneas: Query Targeting, Scan&Order]  │
├─────────────────────────────────────────────────────┤
│  ⚠️ Alertas Activas (3)                             │
│  [Tabla de alertas con severidad y acciones]       │
├─────────────────────────────────────────────────────┤
│  🐌 Consultas Lentas (Top 10)                       │
│  [Tabla con tiempo, colección, operación]          │
├─────────────────────────────────────────────────────┤
│  💡 Recomendaciones                                 │
│  [Performance Advisor suggestions]                  │
└─────────────────────────────────────────────────────┘
```

---

### **FASE 6: Recolección Histórica** (Semana 6)
**Objetivo:** Almacenar métricas para análisis histórico

#### Backend
- [ ] Implementar `metricsCollectorService.ts`:
  - `collectMetricsSnapshot()` - recolectar todas las métricas
  - `scheduleCollection()` - programar recolección periódica
  - `aggregateMetrics()` - agregar métricas por período
  - `cleanOldMetrics()` - limpiar métricas antiguas

#### Cron Jobs / Schedulers
```typescript
// Recolectar cada 5 minutos
schedule.every('5m').do(collectMetricsSnapshot);

// Agregar datos cada hora
schedule.every('1h').do(aggregateHourlyMetrics);

// Limpiar datos > 90 días cada día
schedule.every('1d').do(cleanOldMetrics);
```

#### Frontend
- [ ] Selector de rango de fechas
- [ ] Gráficos de tendencias históricas
- [ ] Comparativas (hoy vs ayer, esta semana vs semana anterior)
- [ ] Exportación de reportes (PDF/CSV)

---

## 📁 Estructura de Archivos

### Backend

```
backend/src/
├── models/
│   ├── MetricSnapshot.ts          # Modelo de snapshot de métricas
│   ├── SlowQuery.ts               # Modelo de consulta lenta
│   ├── SystemAlert.ts             # Modelo de alerta
│   └── MonitoringConfig.ts        # Configuración de monitoreo
│
├── services/
│   ├── monitoring/
│   │   ├── databaseMonitoringService.ts    # Core monitoring
│   │   ├── queryAnalyzerService.ts         # Análisis de queries
│   │   ├── resourceMonitorService.ts       # Recursos del sistema
│   │   ├── alertService.ts                 # Sistema de alertas
│   │   ├── metricsCollectorService.ts      # Recolección histórica
│   │   └── performanceAdvisorService.ts    # Recomendaciones
│   │
│   └── notifications/
│       ├── emailNotificationService.ts     # Notificaciones por email
│       └── webhookService.ts               # Webhooks externos
│
├── controllers/
│   └── monitoringController.ts    # Controlador principal
│
├── routes/
│   └── monitoringRoutes.ts        # Rutas de API
│
├── utils/
│   ├── mongoStatsParser.ts        # Parser de stats de MongoDB
│   └── metricsCalculator.ts       # Cálculos de métricas
│
└── schedulers/
    └── metricsScheduler.ts         # Tareas programadas
```

### Frontend

```
frontend/src/
├── app/
│   └── admin/
│       └── sistema/
│           └── monitoreo/
│               ├── page.tsx                    # Página principal
│               └── layout.tsx                  # Layout del módulo
│
├── components/
│   └── monitoring/
│       ├── SystemHealthDashboard.tsx          # Dashboard principal
│       ├── HealthScoreCard.tsx                # Tarjeta de score general
│       ├── MetricsGrid.tsx                    # Grid de métricas
│       │
│       ├── performance/
│       │   ├── QueryPerformanceChart.tsx      # Gráfico de queries
│       │   ├── SlowQueriesTable.tsx           # Tabla de queries lentas
│       │   ├── QueryTargetingGauge.tsx        # Gauge de targeting
│       │   └── ScanAndOrderIndicator.tsx      # Indicador scan&order
│       │
│       ├── resources/
│       │   ├── ResourceMonitor.tsx            # Monitor general
│       │   ├── CPUGauge.tsx                   # Gauge de CPU
│       │   ├── MemoryBar.tsx                  # Barra de memoria
│       │   ├── DiskSpaceIndicator.tsx         # Indicador de disco
│       │   └── NetworkChart.tsx               # Gráfico de red
│       │
│       ├── alerts/
│       │   ├── AlertsPanel.tsx                # Panel de alertas
│       │   ├── AlertNotificationBadge.tsx     # Badge en header
│       │   ├── AlertCard.tsx                  # Tarjeta de alerta
│       │   └── AlertConfigModal.tsx           # Modal de configuración
│       │
│       ├── database/
│       │   ├── DatabaseStatsCard.tsx          # Stats de BD
│       │   ├── CollectionsList.tsx            # Lista de colecciones
│       │   └── IndexUsageTable.tsx            # Uso de índices
│       │
│       └── common/
│           ├── MetricCard.tsx                 # Tarjeta de métrica genérica
│           ├── TrendChart.tsx                 # Gráfico de tendencia
│           ├── DateRangePicker.tsx            # Selector de fechas
│           └── ExportButton.tsx               # Botón de exportación
│
├── services/
│   ├── monitoringService.ts                   # Cliente API monitoring
│   └── alertsService.ts                       # Cliente API alertas
│
└── types/
    └── monitoring.ts                          # Types de monitoreo
```

---

## 🔧 Servicios Backend (Detallado)

### 1. `databaseMonitoringService.ts`

```typescript
import { Db } from 'mongodb';

interface ServerStatus {
  host: string;
  version: string;
  uptime: number;
  connections: {
    current: number;
    available: number;
    totalCreated: number;
  };
  opcounters: {
    insert: number;
    query: number;
    update: number;
    delete: number;
  };
  mem: {
    resident: number;
    virtual: number;
  };
}

export class DatabaseMonitoringService {
  constructor(private db: Db) {}

  /**
   * Obtiene el estado general del servidor MongoDB
   */
  async getServerStatus(): Promise<ServerStatus> {
    const adminDb = this.db.admin();
    const status = await adminDb.serverStatus();
    
    return {
      host: status.host,
      version: status.version,
      uptime: status.uptime,
      connections: {
        current: status.connections.current,
        available: status.connections.available,
        totalCreated: status.connections.totalCreated
      },
      opcounters: status.opcounters,
      mem: {
        resident: status.mem.resident,
        virtual: status.mem.virtual
      }
    };
  }

  /**
   * Obtiene estadísticas de base de datos
   */
  async getDatabaseStats(dbName: string) {
    const database = this.db.db(dbName);
    const stats = await database.stats();
    
    return {
      db: dbName,
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      avgObjSize: stats.avgObjSize,
      fsUsedSize: stats.fsUsedSize,
      fsTotalSize: stats.fsTotalSize
    };
  }

  /**
   * Obtiene estadísticas de una colección
   */
  async getCollectionStats(dbName: string, collectionName: string) {
    const database = this.db.db(dbName);
    const stats = await database.collection(collectionName).stats();
    
    return {
      collection: collectionName,
      count: stats.count,
      size: stats.size,
      storageSize: stats.storageSize,
      totalIndexSize: stats.totalIndexSize,
      nindexes: stats.nindexes,
      avgObjSize: stats.avgObjSize
    };
  }

  /**
   * Calcula el health score general del sistema (0-100)
   */
  async calculateHealthScore(): Promise<number> {
    const status = await this.getServerStatus();
    
    let score = 100;
    
    // CPU check (asumiendo que tenemos esta métrica)
    const cpuUsage = await this.getCPUUsage();
    if (cpuUsage > 85) score -= 20;
    else if (cpuUsage > 70) score -= 10;
    else if (cpuUsage < 40) score -= 5; // Sobreaprovisionado
    
    // Conexiones check
    const connectionRatio = status.connections.current / status.connections.available;
    if (connectionRatio > 0.9) score -= 15;
    else if (connectionRatio > 0.7) score -= 5;
    
    // Query performance check
    const queryMetrics = await this.getQueryMetrics();
    if (queryMetrics.queryTargeting > 10) score -= 20;
    else if (queryMetrics.queryTargeting > 5) score -= 10;
    
    if (queryMetrics.scanAndOrder > 10) score -= 15;
    else if (queryMetrics.scanAndOrder > 0) score -= 5;
    
    return Math.max(0, score);
  }

  /**
   * Obtiene métricas de conexiones
   */
  async getConnectionStats() {
    const status = await this.getServerStatus();
    
    return {
      current: status.connections.current,
      available: status.connections.available,
      totalCreated: status.connections.totalCreated,
      utilizationPercentage: (status.connections.current / status.connections.available) * 100
    };
  }
}
```

### 2. `queryAnalyzerService.ts`

```typescript
export class QueryAnalyzerService {
  constructor(private db: Db) {}

  /**
   * Habilita el Query Profiler
   * Level 0: off
   * Level 1: slow queries (>100ms por defecto)
   * Level 2: todas las queries (mucho overhead, solo para debug)
   */
  async enableQueryProfiler(level: 0 | 1 | 2 = 1, slowMs: number = 1000) {
    await this.db.command({
      profile: level,
      slowms: slowMs
    });
  }

  /**
   * Obtiene queries lentas del profiler
   */
  async getSlowQueries(limit: number = 50) {
    const profilerCollection = this.db.collection('system.profile');
    
    const slowQueries = await profilerCollection
      .find({
        millis: { $gt: 1000 } // Queries > 1 segundo
      })
      .sort({ ts: -1 })
      .limit(limit)
      .toArray();
    
    return slowQueries.map(q => ({
      timestamp: q.ts,
      operation: q.op,
      namespace: q.ns,
      duration: q.millis,
      docsExamined: q.docsExamined,
      docsReturned: q.nreturned,
      queryTargeting: q.docsExamined / (q.nreturned || 1),
      query: q.command,
      executionStats: q.execStats
    }));
  }

  /**
   * Calcula el Query Targeting promedio
   */
  async getQueryTargeting(timeWindow: number = 3600): Promise<number> {
    const profilerCollection = this.db.collection('system.profile');
    
    const since = new Date(Date.now() - timeWindow * 1000);
    
    const result = await profilerCollection.aggregate([
      {
        $match: {
          ts: { $gte: since },
          docsExamined: { $exists: true },
          nreturned: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgDocsExamined: { $avg: '$docsExamined' },
          avgDocsReturned: { $avg: '$nreturned' }
        }
      }
    ]).toArray();
    
    if (result.length === 0) return 0;
    
    const avgExamined = result[0].avgDocsExamined || 0;
    const avgReturned = result[0].avgDocsReturned || 1;
    
    return avgExamined / avgReturned;
  }

  /**
   * Detecta operaciones Scan and Order (sin índice para ordenar)
   */
  async getScanAndOrderOperations(timeWindow: number = 3600) {
    const profilerCollection = this.db.collection('system.profile');
    
    const since = new Date(Date.now() - timeWindow * 1000);
    
    const scanAndOrderOps = await profilerCollection
      .find({
        ts: { $gte: since },
        'execStats.stage': 'SORT',
        'execStats.sortPattern': { $exists: true }
      })
      .toArray();
    
    return {
      count: scanAndOrderOps.length,
      operations: scanAndOrderOps.map(op => ({
        timestamp: op.ts,
        namespace: op.ns,
        duration: op.millis,
        sortPattern: op.execStats.sortPattern
      }))
    };
  }

  /**
   * Analiza el uso de índices
   */
  async analyzeIndexUsage(collectionName: string) {
    const collection = this.db.collection(collectionName);
    
    // Obtener índices existentes
    const indexes = await collection.indexes();
    
    // Obtener stats de uso (requiere MongoDB 3.2+)
    const indexStats = await collection.aggregate([
      { $indexStats: {} }
    ]).toArray();
    
    return indexes.map(index => {
      const stats = indexStats.find(s => s.name === index.name);
      
      return {
        name: index.name,
        keys: index.key,
        size: stats?.size || 0,
        usageCount: stats?.accesses?.ops || 0,
        lastUsed: stats?.accesses?.since || null
      };
    });
  }
}
```

### 3. `alertService.ts`

```typescript
interface AlertThresholds {
  queryTargeting: { warning: number; critical: number };
  scanAndOrder: { warning: number; critical: number };
  cpuUsage: { warning: number; critical: number };
  memoryUsage: { warning: number; critical: number };
  diskSpace: { warning: number; critical: number };
  slowQueries: { warning: number; critical: number };
  replicationLag: { warning: number; critical: number };
}

interface SystemAlert {
  id: string;
  type: 'query_targeting' | 'scan_and_order' | 'cpu' | 'memory' | 'disk' | 'slow_queries' | 'replication';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  currentValue: number;
  threshold: number;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  organization_id: string;
}

export class AlertService {
  private thresholds: AlertThresholds = {
    queryTargeting: { warning: 5, critical: 10 },
    scanAndOrder: { warning: 1, critical: 10 },
    cpuUsage: { warning: 70, critical: 85 },
    memoryUsage: { warning: 80, critical: 90 },
    diskSpace: { warning: 20, critical: 10 },
    slowQueries: { warning: 5, critical: 20 },
    replicationLag: { warning: 5, critical: 10 }
  };

  constructor(
    private db: Db,
    private monitoringService: DatabaseMonitoringService,
    private queryAnalyzer: QueryAnalyzerService
  ) {}

  /**
   * Verifica todos los umbrales y crea alertas si es necesario
   */
  async checkAllThresholds(organizationId: string): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];

    // Check Query Targeting
    const queryTargeting = await this.queryAnalyzer.getQueryTargeting();
    if (queryTargeting >= this.thresholds.queryTargeting.critical) {
      alerts.push(this.createAlert(
        'query_targeting',
        'critical',
        'Query Targeting Crítico',
        `Ratio de documentos examinados/retornados muy alto: ${queryTargeting.toFixed(2)}`,
        queryTargeting,
        this.thresholds.queryTargeting.critical,
        organizationId
      ));
    } else if (queryTargeting >= this.thresholds.queryTargeting.warning) {
      alerts.push(this.createAlert(
        'query_targeting',
        'warning',
        'Query Targeting Alto',
        `Considere optimizar índices. Ratio actual: ${queryTargeting.toFixed(2)}`,
        queryTargeting,
        this.thresholds.queryTargeting.warning,
        organizationId
      ));
    }

    // Check Scan and Order
    const scanAndOrder = await this.queryAnalyzer.getScanAndOrderOperations(300); // últimos 5 min
    if (scanAndOrder.count >= this.thresholds.scanAndOrder.critical) {
      alerts.push(this.createAlert(
        'scan_and_order',
        'critical',
        'Múltiples operaciones Scan and Order',
        `${scanAndOrder.count} operaciones de ordenamiento sin índice detectadas`,
        scanAndOrder.count,
        this.thresholds.scanAndOrder.critical,
        organizationId
      ));
    }

    // Check CPU Usage
    const cpuUsage = await this.monitoringService.getCPUUsage();
    if (cpuUsage >= this.thresholds.cpuUsage.critical) {
      alerts.push(this.createAlert(
        'cpu',
        'critical',
        'Uso de CPU Crítico',
        `CPU al ${cpuUsage.toFixed(1)}% - Considere escalar el tier`,
        cpuUsage,
        this.thresholds.cpuUsage.critical,
        organizationId
      ));
    } else if (cpuUsage >= this.thresholds.cpuUsage.warning) {
      alerts.push(this.createAlert(
        'cpu',
        'warning',
        'Uso de CPU Alto',
        `CPU al ${cpuUsage.toFixed(1)}% - Monitorear`,
        cpuUsage,
        this.thresholds.cpuUsage.warning,
        organizationId
      ));
    }

    // Guardar alertas en BD
    for (const alert of alerts) {
      await this.saveAlert(alert);
    }

    return alerts;
  }

  /**
   * Crea una alerta
   */
  private createAlert(
    type: SystemAlert['type'],
    severity: SystemAlert['severity'],
    title: string,
    message: string,
    currentValue: number,
    threshold: number,
    organizationId: string
  ): SystemAlert {
    return {
      id: generateId(),
      type,
      severity,
      title,
      message,
      currentValue,
      threshold,
      timestamp: new Date(),
      resolved: false,
      organization_id: organizationId
    };
  }

  /**
   * Guarda alerta en BD
   */
  private async saveAlert(alert: SystemAlert) {
    await this.db.collection('system_alerts').insertOne(alert);
  }

  /**
   * Obtiene alertas activas
   */
  async getActiveAlerts(organizationId: string): Promise<SystemAlert[]> {
    return await this.db
      .collection('system_alerts')
      .find({
        organization_id: organizationId,
        resolved: false
      })
      .sort({ timestamp: -1 })
      .toArray();
  }

  /**
   * Resuelve una alerta
   */
  async resolveAlert(alertId: string) {
    await this.db.collection('system_alerts').updateOne(
      { id: alertId },
      {
        $set: {
          resolved: true,
          resolvedAt: new Date()
        }
      }
    );
  }

  /**
   * Actualiza umbrales de configuración
   */
  async updateThresholds(newThresholds: Partial<AlertThresholds>) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    
    // Guardar en configuración
    await this.db.collection('monitoring_config').updateOne(
      { type: 'alert_thresholds' },
      { $set: { thresholds: this.thresholds } },
      { upsert: true }
    );
  }
}
```

---

## 🎨 Componentes Frontend (Detallado)

### 1. `SystemHealthDashboard.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { monitoringService } from '@/services/monitoringService';
import MetricsGrid from './MetricsGrid';
import QueryPerformanceChart from './performance/QueryPerformanceChart';
import ResourceMonitor from './resources/ResourceMonitor';
import AlertsPanel from './alerts/AlertsPanel';
import SlowQueriesTable from './performance/SlowQueriesTable';

interface HealthData {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  version: string;
}

export default function SystemHealthDashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    try {
      const data = await monitoringService.getSystemHealth();
      setHealthData(data);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando métricas del sistema...</div>;
  }

  const getStatusIcon = () => {
    if (!healthData) return <XCircle className="w-8 h-8 text-gray-400" />;
    
    switch (healthData.status) {
      case 'healthy':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (!healthData) return 'Desconocido';
    
    switch (healthData.status) {
      case 'healthy':
        return 'Sistema Saludable';
      case 'warning':
        return 'Requiere Atención';
      case 'critical':
        return 'Estado Crítico';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Estado */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon()}
              <div>
                <h2 className="text-2xl font-bold">{getStatusText()}</h2>
                <p className="text-sm text-muted-foreground">
                  Health Score: {healthData?.score || 0}/100
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>MongoDB {healthData?.version}</p>
              <p>Uptime: {formatUptime(healthData?.uptime || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Métricas Principales */}
      <MetricsGrid />

      {/* Alertas Activas */}
      <AlertsPanel />

      {/* Performance de Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Performance de Queries (últimas 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <QueryPerformanceChart />
        </CardContent>
      </Card>

      {/* Monitor de Recursos */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceMonitor />
        </CardContent>
      </Card>

      {/* Tabla de Queries Lentas */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Consultas Lentas</CardTitle>
        </CardHeader>
        <CardContent>
          <SlowQueriesTable />
        </CardContent>
      </Card>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
}
```

### 2. `MetricsGrid.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Database, HardDrive, Network, Search, AlertTriangle } from 'lucide-react';
import MetricCard from './common/MetricCard';
import { monitoringService } from '@/services/monitoringService';

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 10000); // cada 10s
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    const data = await monitoringService.getKeyMetrics();
    setMetrics(data);
  };

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="CPU Usage"
        value={`${metrics.cpu.toFixed(1)}%`}
        icon={<Activity className="w-5 h-5" />}
        trend={metrics.cpuTrend}
        status={getStatus(metrics.cpu, 70, 85)}
        subtitle="Normalized System CPU"
      />
      
      <MetricCard
        title="Memory Usage"
        value={`${metrics.memory.toFixed(1)}%`}
        icon={<HardDrive className="w-5 h-5" />}
        trend={metrics.memoryTrend}
        status={getStatus(metrics.memory, 80, 90)}
        subtitle={`${formatBytes(metrics.memoryUsed)} / ${formatBytes(metrics.memoryTotal)}`}
      />
      
      <MetricCard
        title="Query Targeting"
        value={metrics.queryTargeting.toFixed(2)}
        icon={<Search className="w-5 h-5" />}
        status={getStatus(metrics.queryTargeting, 5, 10)}
        subtitle="Docs examined/returned ratio"
      />
      
      <MetricCard
        title="Scan & Order"
        value={metrics.scanAndOrder}
        icon={<AlertTriangle className="w-5 h-5" />}
        status={metrics.scanAndOrder === 0 ? 'healthy' : 'warning'}
        subtitle="Last 5 minutes"
      />
      
      <MetricCard
        title="Active Connections"
        value={metrics.connections.current}
        icon={<Network className="w-5 h-5" />}
        subtitle={`${metrics.connections.available} available`}
        status={getStatus(
          (metrics.connections.current / metrics.connections.available) * 100,
          70,
          90
        )}
      />
      
      <MetricCard
        title="Database Size"
        value={formatBytes(metrics.databaseSize)}
        icon={<Database className="w-5 h-5" />}
        trend={metrics.dbSizeTrend}
        subtitle={`${metrics.collectionsCount} collections`}
      />
    </div>
  );
}

function getStatus(value: number, warningThreshold: number, criticalThreshold: number) {
  if (value >= criticalThreshold) return 'critical';
  if (value >= warningThreshold) return 'warning';
  return 'healthy';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
```

---

## 🛣️ Rutas y Navegación

### Agregar al Menú Principal

**Archivo:** `frontend/src/app/admin/layout.tsx` (o donde esté el layout de admin)

```typescript
import { Activity } from 'lucide-react';

const adminNavigation = [
  // ... otras rutas existentes
  {
    name: 'Monitoreo Sistema',
    href: '/admin/sistema/monitoreo',
    icon: Activity,
    badge: 'Nuevo'
  }
];
```

### API Routes

```typescript
// backend/src/routes/monitoringRoutes.ts

import express from 'express';
import { monitoringController } from '../controllers/monitoringController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

// Proteger todas las rutas con autenticación y permisos de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Health & General
router.get('/health', monitoringController.getSystemHealth);
router.get('/metrics/key', monitoringController.getKeyMetrics);

// Query Performance
router.get('/queries/slow', monitoringController.getSlowQueries);
router.get('/queries/targeting', monitoringController.getQueryTargeting);
router.get('/queries/scan-order', monitoringController.getScanAndOrder);
router.post('/queries/analyze', monitoringController.analyzeQuery);

// Resources
router.get('/resources/cpu', monitoringController.getCPUMetrics);
router.get('/resources/memory', monitoringController.getMemoryMetrics);
router.get('/resources/disk', monitoringController.getDiskMetrics);
router.get('/resources/summary', monitoringController.getResourcesSummary);

// Database Stats
router.get('/database/stats', monitoringController.getDatabaseStats);
router.get('/database/collections', monitoringController.getCollectionsStats);
router.get('/indexes/usage', monitoringController.getIndexUsage);

// Alerts
router.get('/alerts', monitoringController.getActiveAlerts);
router.post('/alerts/:id/resolve', monitoringController.resolveAlert);
router.get('/alerts/history', monitoringController.getAlertsHistory);
router.put('/alerts/config', monitoringController.updateAlertConfig);

// Historical Data
router.get('/history/metrics', monitoringController.getHistoricalMetrics);
router.post('/history/export', monitoringController.exportMetrics);

export default router;
```

---

## 🚨 Sistema de Alertas

### Tipos de Alertas

```typescript
// backend/src/types/alerts.ts

export enum AlertType {
  QUERY_TARGETING = 'query_targeting',
  SCAN_AND_ORDER = 'scan_and_order',
  CPU_HIGH = 'cpu_high',
  CPU_LOW = 'cpu_low',
  MEMORY_HIGH = 'memory_high',
  DISK_LOW = 'disk_low',
  SLOW_QUERIES = 'slow_queries',
  CONNECTION_POOL = 'connection_pool',
  REPLICATION_LAG = 'replication_lag'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export interface AlertRule {
  type: AlertType;
  enabled: boolean;
  warningThreshold: number;
  criticalThreshold: number;
  evaluationWindow: number; // segundos
  cooldown: number; // segundos entre alertas del mismo tipo
  notifyEmail: boolean;
  notifyWebhook: boolean;
}
```

### Configuración de Alertas Default

```typescript
export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    type: AlertType.QUERY_TARGETING,
    enabled: true,
    warningThreshold: 5,
    criticalThreshold: 10,
    evaluationWindow: 300, // 5 minutos
    cooldown: 900, // 15 minutos
    notifyEmail: true,
    notifyWebhook: false
  },
  {
    type: AlertType.SCAN_AND_ORDER,
    enabled: true,
    warningThreshold: 1,
    criticalThreshold: 10,
    evaluationWindow: 300,
    cooldown: 600,
    notifyEmail: true,
    notifyWebhook: false
  },
  {
    type: AlertType.CPU_HIGH,
    enabled: true,
    warningThreshold: 70,
    criticalThreshold: 85,
    evaluationWindow: 60,
    cooldown: 1800,
    notifyEmail: true,
    notifyWebhook: true
  },
  {
    type: AlertType.MEMORY_HIGH,
    enabled: true,
    warningThreshold: 80,
    criticalThreshold: 90,
    evaluationWindow: 60,
    cooldown: 1800,
    notifyEmail: true,
    notifyWebhook: true
  },
  {
    type: AlertType.DISK_LOW,
    enabled: true,
    warningThreshold: 20, // % libre
    criticalThreshold: 10,
    evaluationWindow: 300,
    cooldown: 3600,
    notifyEmail: true,
    notifyWebhook: true
  },
  {
    type: AlertType.SLOW_QUERIES,
    enabled: true,
    warningThreshold: 5, // queries/min
    criticalThreshold: 20,
    evaluationWindow: 300,
    cooldown: 600,
    notifyEmail: false,
    notifyWebhook: false
  },
  {
    type: AlertType.CONNECTION_POOL,
    enabled: true,
    warningThreshold: 70, // % de uso
    criticalThreshold: 90,
    evaluationWindow: 60,
    cooldown: 600,
    notifyEmail: true,
    notifyWebhook: false
  }
];
```

### Sistema de Notificaciones

```typescript
// backend/src/services/notifications/emailNotificationService.ts

export class EmailNotificationService {
  async sendAlert(alert: SystemAlert, recipients: string[]) {
    const subject = `[${alert.severity.toUpperCase()}] ${alert.title}`;
    
    const htmlContent = `
      <h2 style="color: ${this.getSeverityColor(alert.severity)}">
        ${alert.title}
      </h2>
      <p>${alert.message}</p>
      <p><strong>Valor actual:</strong> ${alert.currentValue}</p>
      <p><strong>Umbral:</strong> ${alert.threshold}</p>
      <p><strong>Timestamp:</strong> ${alert.timestamp.toISOString()}</p>
      <hr>
      <p>
        <a href="${process.env.APP_URL}/admin/sistema/monitoreo">
          Ver Dashboard de Monitoreo
        </a>
      </p>
    `;
    
    // Implementar envío de email (usar nodemailer, sendgrid, etc.)
    await this.sendEmail(recipients, subject, htmlContent);
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }
}
```

---

## 📅 Cronograma de Implementación

```
Semana 1: Infraestructura Base
├─ Lunes-Martes: Modelos de datos
├─ Miércoles-Jueves: Servicio de monitoreo core
└─ Viernes: Tests y validación

Semana 2: Query Performance
├─ Lunes-Martes: Query Analyzer Service
├─ Miércoles: API Routes
├─ Jueves-Viernes: Componentes frontend

Semana 3: Resource Monitoring
├─ Lunes-Martes: Resource Monitor Service
├─ Miércoles: API Routes
├─ Jueves-Viernes: Componentes frontend

Semana 4: Sistema de Alertas
├─ Lunes-Martes: Alert Service
├─ Miércoles: Configuración de reglas
├─ Jueves: Sistema de notificaciones
└─ Viernes: Panel de alertas frontend

Semana 5: Dashboard Principal
├─ Lunes-Martes: Integración de componentes
├─ Miércoles: Gráficos y visualizaciones
├─ Jueves: Responsive design
└─ Viernes: Testing end-to-end

Semana 6: Recolección Histórica
├─ Lunes-Martes: Metrics Collector
├─ Miércoles: Scheduler y cron jobs
├─ Jueves: Queries históricas
└─ Viernes: Exportación de reportes
```

---

## 💻 Recursos Necesarios

### Dependencias Backend

```json
{
  "dependencies": {
    "mongodb": "^6.0.0",
    "node-cron": "^3.0.2",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.7",
    "@types/nodemailer": "^6.4.11"
  }
}
```

### Dependencias Frontend

```json
{
  "dependencies": {
    "recharts": "^2.9.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.263.1"
  }
}
```

### Infraestructura

- **MongoDB Atlas:** Plan con soporte para profiler y métricas avanzadas
- **Storage:** ~100MB adicionales para métricas históricas (90 días)
- **Cron Jobs:** Servidor con soporte para tareas programadas
- **Email Service:** SendGrid, AWS SES, o similar

---

## 🧪 Testing

### Tests Backend

```typescript
// backend/src/tests/monitoring.test.ts

describe('Database Monitoring Service', () => {
  test('should get server status', async () => {
    const status = await monitoringService.getServerStatus();
    expect(status).toHaveProperty('uptime');
    expect(status).toHaveProperty('connections');
  });

  test('should calculate health score', async () => {
    const score = await monitoringService.calculateHealthScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should detect slow queries', async () => {
    const slowQueries = await queryAnalyzer.getSlowQueries(10);
    expect(Array.isArray(slowQueries)).toBe(true);
  });
});

describe('Alert Service', () => {
  test('should create alert when threshold exceeded', async () => {
    const alerts = await alertService.checkAllThresholds('org-123');
    expect(Array.isArray(alerts)).toBe(true);
  });

  test('should resolve alert', async () => {
    await alertService.resolveAlert('alert-123');
    const alert = await alertService.getAlertById('alert-123');
    expect(alert.resolved).toBe(true);
  });
});
```

### Tests Frontend

```typescript
// frontend/src/components/monitoring/__tests__/SystemHealthDashboard.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import SystemHealthDashboard from '../SystemHealthDashboard';
import { monitoringService } from '@/services/monitoringService';

jest.mock('@/services/monitoringService');

describe('SystemHealthDashboard', () => {
  test('renders health status', async () => {
    (monitoringService.getSystemHealth as jest.Mock).mockResolvedValue({
      score: 95,
      status: 'healthy',
      uptime: 86400,
      version: '6.0.0'
    });

    render(<SystemHealthDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Sistema Saludable')).toBeInTheDocument();
      expect(screen.getByText('Health Score: 95/100')).toBeInTheDocument();
    });
  });
});
```

---

## 📚 Referencias

- [MongoDB Monitoring Guide](https://www.mongodb.com/resources/products/capabilities/how-to-monitor-mongodb-and-what-metrics-to-monitor)
- [MongoDB Performance Best Practices](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)
- [MongoDB Atlas Monitoring](https://www.mongodb.com/docs/atlas/monitoring-alerting/)
- [db.serverStatus() Documentation](https://www.mongodb.com/docs/manual/reference/command/serverStatus/)
- [Query Profiler Documentation](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/)

---

## ✅ Checklist de Implementación

### Backend
- [ ] Crear modelos de datos (MetricSnapshot, SlowQuery, SystemAlert)
- [ ] Implementar DatabaseMonitoringService
- [ ] Implementar QueryAnalyzerService
- [ ] Implementar ResourceMonitorService
- [ ] Implementar AlertService
- [ ] Implementar MetricsCollectorService
- [ ] Crear API routes
- [ ] Configurar cron jobs
- [ ] Sistema de notificaciones
- [ ] Tests unitarios

### Frontend
- [ ] Crear página /admin/sistema/monitoreo
- [ ] Implementar SystemHealthDashboard
- [ ] Implementar MetricsGrid
- [ ] Implementar QueryPerformanceChart
- [ ] Implementar ResourceMonitor
- [ ] Implementar AlertsPanel
- [ ] Implementar SlowQueriesTable
- [ ] Servicios de API client
- [ ] Tests de componentes
- [ ] Responsive design

### Infraestructura
- [ ] Habilitar profiler en MongoDB
- [ ] Configurar storage para métricas históricas
- [ ] Configurar servicio de email
- [ ] Configurar cron scheduler
- [ ] Configurar umbrales de alertas
- [ ] Documentación de deployment

### Documentación
- [ ] Guía de uso del dashboard
- [ ] Documentación de API
- [ ] Guía de configuración de alertas
- [ ] Troubleshooting guide

---

## 🎯 KPIs de Éxito

Al finalizar la implementación, el sistema debe:

1. ✅ Mostrar métricas en tiempo real con < 30s de latencia
2. ✅ Detectar alertas críticas en < 5 minutos
3. ✅ Almacenar historial de 90 días de métricas
4. ✅ Generar reportes exportables
5. ✅ Health Score calculado con precisión
6. ✅ Interfaz responsive y usable
7. ✅ Carga de dashboard < 3 segundos

---

**Última actualización:** Octubre 2025  
**Versión del documento:** 1.0  
**Próxima revisión:** Implementación completa


