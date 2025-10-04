# 📚 9001app - Documentación y Casos de Estudio

Portal de documentación completa, casos de estudio, manuales y tutoriales para 9001app

## 📋 Descripción

Web dedicada exclusivamente a documentación con:
- ✅ Casos de uso detallados
- 📖 Manuales de usuario por módulo
- 🎓 Tutoriales paso a paso
- 💼 Casos de estudio de clientes reales
- 🔧 Documentación técnica y API
- 🔍 Búsqueda avanzada
- 🏷️ Filtros por categoría

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **MDX** - Soporte para Markdown (futuro)

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo (puerto 3002)
npm run dev

# Build producción
npm run build

# Ejecutar producción
npm start
```

## 📂 Estructura

```
web-documentacion-9001app/
├── app/
│   ├── page.tsx              # Página principal con listado
│   ├── docs/
│   │   ├── casos-de-uso-completo/
│   │   │   └── page.tsx      # Ejemplo de documento completo
│   │   ├── manual-gestion-calidad/
│   │   ├── tutorial-documentos/
│   │   └── ...               # Más documentos
│   ├── layout.tsx
│   └── globals.css
├── public/
│   └── docs/                 # PDFs descargables (futuro)
└── README.md
```

## 🎯 Características Principales

### Página Principal
- 🔍 Barra de búsqueda global
- 🏷️ Filtros por categoría (Casos de Uso, Manuales, Tutoriales, API)
- ⭐ Sección de documentos destacados
- 📊 Estadísticas de documentación

### Tipos de Documentos

1. **Casos de Uso** 🎯
   - Casos prácticos por módulo
   - Flujos detallados
   - Capturas de pantalla
   - Ejemplos reales

2. **Manuales** 📖
   - Guías completas por funcionalidad
   - Paso a paso ilustrado
   - Mejores prácticas

3. **Tutoriales** 🎓
   - Videos y texto
   - Ejercicios prácticos
   - Desde básico a avanzado

4. **Casos de Estudio** 💼
   - Implementaciones exitosas
   - Resultados medibles
   - Testimonios de clientes

5. **Documentación Técnica** 🔧
   - API Reference
   - Integraciones
   - Arquitectura del sistema

### Metadata de Documentos
Cada documento incluye:
- ⏱️ Tiempo de lectura estimado
- 📊 Nivel (Básico, Intermedio, Avanzado)
- 🏷️ Módulos relacionados
- 📅 Fecha de última actualización
- 👤 Autor
- ⬇️ Opción de descarga PDF
- 🖨️ Versión para imprimir

## 🌐 Separación del Proyecto Principal

Esta web está **completamente separada**:
- ✅ Repositorio independiente
- ✅ Tecnología standalone (Next.js)
- ✅ Puerto diferente (3002)
- ✅ Puede servirse en dominio separado: `docs.9001app.com`
- ✅ No requiere autenticación
- ✅ Pública y accesible para todos

## 📝 Agregar Nueva Documentación

Para agregar un nuevo documento:

1. Crear carpeta en `app/docs/nombre-documento/`
2. Crear `page.tsx` con el contenido
3. Agregar entrada en el array de `documentos` en `app/page.tsx`
4. Incluir metadata (título, descripción, categoría, etc.)

## 🎨 Personalización

El sistema usa:
- **Tailwind CSS** para estilos
- **Gradientes** específicos por categoría
- **Animaciones** suaves con Framer Motion
- **Responsive** completamente mobile-first

## 📊 Futuras Mejoras

- [ ] Soporte MDX para escribir docs en Markdown
- [ ] Sistema de comentarios por documento
- [ ] Calificación y feedback de usuarios
- [ ] Generación automática de PDF
- [ ] Versionado de documentación
- [ ] Videos embebidos
- [ ] Búsqueda por contenido (Algolia)
- [ ] Dark mode
- [ ] Traducciones (i18n)

## 🔗 Integración con Sistema Principal

Aunque está separada, puede linkear a:
- Formulario de contacto
- Registro/Login del sistema principal
- Solicitud de demo



