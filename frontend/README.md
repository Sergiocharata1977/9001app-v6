# 9001App v6 - Frontend

Sistema de gestión de registros de procesos ISO 9001 construido con Next.js 14, TypeScript y Tailwind CSS.

## Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **Pragmatic Drag and Drop** - Funcionalidad drag & drop
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP

## Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── globals.css        # Estilos globales
│   └── procesos/          # Módulo de procesos
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── forms/            # Formularios
│   ├── views/            # Vistas principales
│   └── modals/           # Modales
├── lib/                  # Utilidades y configuración
├── types/                # Tipos TypeScript
└── hooks/                # Custom hooks
```

## Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint

# Verificación de tipos
npm run type-check
```

## Configuración de Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Funcionalidades Principales

### Vistas de Procesos
- **Vista Lista**: Tabla con filtros y ordenamiento
- **Vista Tarjetas**: Grid de tarjetas agrupadas
- **Vista Kanban**: Tablero con drag & drop

### Gestión de Procesos
- Crear, editar y eliminar procesos
- Jerarquía de procesos y subprocesos
- Estados configurables
- Plantillas dinámicas

### Características Técnicas
- Server-side rendering (SSR)
- Optimización automática de imágenes
- Code splitting automático
- TypeScript estricto
- Responsive design

## API Integration

El frontend se conecta al backend a través de:
- Base URL: `http://localhost:5000/api`
- Endpoints principales:
  - `GET /api/processes` - Listar procesos
  - `POST /api/processes` - Crear proceso
  - `PUT /api/processes/:id` - Actualizar proceso
  - `DELETE /api/processes/:id` - Eliminar proceso

## Próximos Pasos

1. ✅ Configuración inicial del proyecto
2. 🔄 Implementar componentes UI base
3. 🔄 Crear vistas principales (Lista, Tarjetas, Kanban)
4. 🔄 Integrar con API del backend
5. 🔄 Implementar drag & drop con Pragmatic
6. 🔄 Agregar tests unitarios y E2E