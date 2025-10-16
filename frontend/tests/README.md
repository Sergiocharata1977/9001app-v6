# 🧪 SISTEMA DE TESTING CENTRALIZADO - 9001app v6

## 📁 Estructura de Tests

```
frontend/tests/
├── README.md                    # Este archivo
├── velocidad/                   # Tests de velocidad y rendimiento
│   ├── test-velocidad-completo.js
│   ├── test-velocidad-rrhh.js
│   ├── test-velocidad-crm.js
│   ├── test-velocidad-documentos.js
│   └── test-velocidad-auditorias.js
├── usabilidad/                  # Tests de usabilidad
│   ├── test-usabilidad-completo.js
│   └── test-navegacion.js
├── funcionalidad/               # Tests funcionales
│   ├── test-abm-completo.js
│   ├── test-crud-modulos.js
│   └── test-flujos-completos.js
├── super-admin/                 # Tests específicos del super admin
│   ├── test-modulos-single.js
│   ├── test-dashboard-performance.js
│   └── test-navegacion-admin.js
├── reportes/                    # Reportes generados
│   ├── velocidad/
│   ├── usabilidad/
│   └── funcionalidad/
└── scripts/                     # Scripts de ejecución
    ├── run-all-tests.bat
    ├── run-all-tests.ps1
    ├── run-velocidad.bat
    ├── run-usabilidad.bat
    └── run-super-admin.bat
```

## 🎯 Tipos de Tests

### 1. **Tests de Velocidad** (`/velocidad/`)
- ⏱️ **Tiempo de carga** de páginas
- 🚀 **Velocidad de respuesta** de APIs
- 📊 **Rendimiento** de componentes
- 🎨 **Tiempo de renderizado** de listas

### 2. **Tests de Usabilidad** (`/usabilidad/`)
- 🖱️ **Navegación intuitiva**
- 📱 **Responsive design**
- ⌨️ **Accesibilidad**
- 🎯 **Experiencia de usuario**

### 3. **Tests Funcionales** (`/funcionalidad/`)
- ✅ **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- 🔄 **Flujos de trabajo**
- 🔗 **Integración entre módulos**
- 🛡️ **Validaciones**

### 4. **Tests Super Admin** (`/super-admin/`)
- 📋 **Dashboard de módulos**
- 🎯 **Navegación a páginas single**
- 📊 **Métricas de desarrollo**
- 🧪 **Casos de uso y requerimientos**

## 🚀 Cómo Ejecutar

### Todos los Tests
```bash
# Windows
frontend/tests/scripts/run-all-tests.bat

# PowerShell
frontend/tests/scripts/run-all-tests.ps1
```

### Solo Velocidad
```bash
frontend/tests/scripts/run-velocidad.bat
```

### Solo Usabilidad
```bash
frontend/tests/scripts/run-usabilidad.bat
```

### Solo Super Admin
```bash
frontend/tests/scripts/run-super-admin.bat
```

## 📊 Reportes

Todos los reportes se generan en:
- **HTML**: Visualización interactiva
- **JSON**: Datos estructurados
- **TXT**: Resumen simple

## 🔧 Configuración

Cada test tiene su configuración específica:
- **Timeouts**: Tiempo máximo por operación
- **Umbrales**: Clasificación de velocidad
- **Módulos**: Qué módulos testear
- **Reportes**: Qué tipo de reporte generar

## 📈 Métricas Medidas

### Velocidad
- 🚀 **EXCELENTE**: < 500ms
- ✅ **BUENO**: 500-1000ms
- ⚠️ **ACEPTABLE**: 1-2s
- 🐌 **LENTO**: 2-3s
- 🔴 **CRÍTICO**: > 3s

### Usabilidad
- 🎯 **Navegación**: Clicks para llegar a destino
- 📱 **Responsive**: Funciona en móvil/tablet
- ⌨️ **Accesibilidad**: Navegación por teclado
- 🖱️ **Intuitividad**: Elementos claros y visibles

### Funcionalidad
- ✅ **Éxito**: Operación completada
- ❌ **Fallido**: Error en operación
- ⏳ **Timeout**: Tiempo excedido
- 🚫 **No disponible**: Funcionalidad no implementada

---

**Creado**: Enero 2025  
**Versión**: 1.0  
**Autor**: Equipo 9001app














