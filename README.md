# 9001App v6 🏆

Sistema de Gestión de Calidad ISO 9001:2015 - Plataforma integral para empresas certificadas

## 🚀 Características Principales

- **Gestión de Procesos**: Control completo de procesos, documentos y registros
- **Auditorías**: Planificación y seguimiento de auditorías internas
- **Mejora Continua**: Gestión de hallazgos y acciones correctivas/preventivas
- **Módulo de Calidad**: Dashboard, Política de Calidad, AMFE, FODA, Reuniones y Organigrama
- **Diseño y Desarrollo de Producto**: Gestión integral del ciclo de vida del producto
- **RRHH**: Gestión de personal, puestos y departamentos
- **CRM Agro**: Sistema especializado para el sector agropecuario
- **Documentación**: Control de versiones y categorización de documentos
- **Puntos de Norma ISO**: Seguimiento del cumplimiento de cláusulas ISO 9001:2015

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** con App Router
- **React 19** con Server Components
- **TypeScript**
- **Tailwind CSS** para estilos
- **Lucide React** para iconografía
- **Lottie** para animaciones (Don Cándido)
- **Recharts** para gráficos y dashboards

### Backend
- **Node.js** con Express
- **TypeScript**
- **MongoDB Atlas** (base de datos)
- **Mongoose** (ODM)
- **Zod** (validación)
- **JWT** para autenticación (próximamente)

## 📦 Estructura del Proyecto

```
9001app-v6/
├── frontend/               # Aplicación Next.js
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Componentes React
│   │   ├── lib/          # Utilidades y helpers
│   │   └── types/        # Definiciones TypeScript
│   └── public/           # Recursos estáticos
│
├── backend/               # API REST
│   └── src/
│       ├── controllers/  # Controladores
│       ├── models/       # Modelos Mongoose
│       ├── routes/       # Rutas Express
│       ├── services/     # Lógica de negocio
│       └── seeders/      # Datos de prueba
│
├── web-landing-9001app/   # Landing page principal
└── web-documentacion-9001app/  # Documentación técnica
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- MongoDB Atlas (o MongoDB local)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Sergiocharata1977/9001app-v6.git
cd 9001app-v6
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno del backend**
```bash
cp .env.example .env
# Editar .env con tus credenciales de MongoDB
```

4. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

5. **Iniciar el backend**
```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:5000
```

6. **Iniciar el frontend**
```bash
cd frontend
npm run dev
# Aplicación corriendo en http://localhost:3000
```

## 🔧 Variables de Entorno

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/9001app-v6
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 Documentación

La documentación técnica completa está disponible en el sitio web de documentación:

```bash
cd web-documentacion-9001app
npm install
npm run dev
# Documentación en http://localhost:3002
```

## 🎯 Módulos Principales

### 1. Dashboard Principal
Vista general con KPIs, métricas y estado del sistema de gestión

### 2. Gestión de Procesos
- Definición de procesos
- Documentos asociados
- Registros de ejecución
- Vista Kanban tipo Trello

### 3. Auditorías
- Planificación de auditorías
- Listas de verificación
- Informes de auditoría

### 4. Mejora Continua
- Hallazgos (No conformidades, Oportunidades de mejora)
- Acciones correctivas y preventivas
- Seguimiento de eficacia

### 5. Módulo de Calidad ISO 9001
- Dashboard de calidad
- Política de calidad
- Análisis AMFE (Failure Mode and Effects Analysis)
- Análisis FODA/SWOT
- Gestión de reuniones
- Organigrama organizacional

### 6. CRM Agropecuario
- Gestión de clientes del sector agro
- Contactos y oportunidades
- Productos específicos del sector
- Actividades y seguimiento

## 🎨 Características de UX

- **Diseño moderno y limpio** con Tailwind CSS
- **Animaciones con Lottie** (mascota "Don Cándido")
- **Responsive design** para móviles y tablets
- **Dark mode ready** (próximamente)
- **Componentes reutilizables** con diseño consistente

## 🔐 Seguridad

- Rate limiting en API
- Helmet.js para headers de seguridad
- CORS configurado
- Validación de datos con Zod
- Autenticación JWT (en desarrollo)

## 📈 Roadmap

- [x] Módulo de Procesos
- [x] Módulo de Calidad ISO 9001
- [x] CRM Agropecuario
- [ ] Sistema de autenticación y roles
- [ ] Módulo de Capacitación
- [ ] Módulo de Mantenimiento
- [ ] Reportes avanzados
- [ ] Notificaciones en tiempo real
- [ ] App móvil

## 🤝 Contribuir

Este es un proyecto privado en desarrollo. Para contribuir, contacta al propietario del repositorio.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 👥 Autor

**Sergio Charata** - [Sergiocharata1977](https://github.com/Sergiocharata1977)

## 📞 Contacto

Para consultas sobre el proyecto, abre un issue en GitHub.

---

**🎓 Nota**: Este proyecto está diseñado para empresas que buscan una solución completa y moderna para gestionar su Sistema de Gestión de Calidad ISO 9001:2015.

