# Don Candido Animation System

Sistema de animaciones interactivas para Don Candido, el asistente virtual del sistema ISO 9001.

## Componentes Disponibles

### 1. DonCandidoAnimation
Componente base para mostrar animaciones de Don Candido.

```tsx
import { DonCandidoAnimation } from '@/components/ui/DonCandidoAnimation';

<DonCandidoAnimation
  animationType="saludo"
  size="lg"
  autoShow={true}
  autoHide={3000}
  loop={true}
  speed={1}
/>
```

### 2. DonCandidoChat
Componente específico para chat con posicionamiento y mensajes.

```tsx
import { DonCandidoChat } from '@/components/chat/DonCandidoChat';

<DonCandidoChat
  visible={true}
  position="bottom-right"
  size="lg"
  animationType="feliz"
  message="¡Hola! ¿En qué puedo ayudarte?"
  autoHide={5000}
/>
```

### 3. DonCandidoButton
Botón para activar animaciones de Don Candido.

```tsx
import { DonCandidoButton } from '@/components/ui/DonCandidoButton';

<DonCandidoButton
  action="welcome"
  message="¡Bienvenido al sistema!"
  variant="outline"
  size="default"
>
  Saludar
</DonCandidoButton>
```

### 4. Contexto Global
Sistema de contexto para usar Don Candido en toda la aplicación.

```tsx
import { useDonCandidoActions } from '@/contexts/DonCandidoContext';

const { welcome, success, error, loading, help, notify } = useDonCandidoActions();

// Uso
welcome(); // Mostrar saludo
success("¡Proceso completado!"); // Mostrar éxito
error("Algo salió mal..."); // Mostrar error
loading("Procesando..."); // Mostrar carga
help(); // Mostrar ayuda
notify("Notificación", "info"); // Notificación personalizada
```

## Tipos de Animación

- `saludo` - Saludo amigable
- `pensando` - Pensando/reflexionando
- `feliz` - Alegre/exitoso
- `triste` - Triste/error
- `sorprendido` - Sorprendido/advertencia

## Tamaños

- `sm` - 64x64px
- `md` - 96x96px
- `lg` - 128x128px
- `xl` - 192x192px

## Posiciones

- `bottom-right` - Esquina inferior derecha
- `bottom-left` - Esquina inferior izquierda
- `top-right` - Esquina superior derecha
- `top-left` - Esquina superior izquierda
- `center` - Centro de la pantalla

## Ejemplos de Uso

### En una página
```tsx
import { useEffect } from 'react';
import { useDonCandidoActions } from '@/contexts/DonCandidoContext';

export default function MiPagina() {
  const donCandido = useDonCandidoActions();

  useEffect(() => {
    // Mostrar saludo al cargar la página
    donCandido.welcome();
  }, []);

  const handleSuccess = () => {
    donCandido.success("¡Operación exitosa!");
  };

  return (
    <div>
      <button onClick={handleSuccess}>
        Completar Acción
      </button>
    </div>
  );
}
```

### En un componente
```tsx
import { DonCandidoButton } from '@/components/ui/DonCandidoButton';

export default function MiComponente() {
  return (
    <div>
      <DonCandidoButton action="help" message="¿Necesitas ayuda?">
        Ayuda
      </DonCandidoButton>
    </div>
  );
}
```

### Botón flotante
```tsx
import { DonCandidoFloatingButton } from '@/components/ui/DonCandidoButton';

export default function Layout() {
  return (
    <div>
      {/* Tu contenido */}
      <DonCandidoFloatingButton position="bottom-right" />
    </div>
  );
}
```

## Configuración Global

El `DonCandidoProvider` debe envolver toda la aplicación en el layout principal:

```tsx
import { DonCandidoProvider } from '@/contexts/DonCandidoContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <DonCandidoProvider position="bottom-right" size="lg">
          {children}
        </DonCandidoProvider>
      </body>
    </html>
  );
}
```

## Archivos de Animación

Las animaciones se almacenan en `public/animations/`:
- `don-candido-saludo.json`
- `don-candido-pensando.json`
- `don-candido-feliz.json`
- `don-candido-triste.json`
- `don-candido-sorprendido.json`

## Personalización

### Crear nueva animación
1. Crear archivo JSON en `public/animations/`
2. Agregar al mapeo en `animationFiles`
3. Actualizar tipos TypeScript

### Personalizar estilos
```tsx
<DonCandidoAnimation
  className="custom-class"
  size="lg"
/>
```

### Personalizar duración
```tsx
<DonCandidoChat
  autoHide={10000} // 10 segundos
/>
```

## Mejores Prácticas

1. **Usar acciones contextuales**: `welcome()`, `success()`, `error()`
2. **No abusar**: Mostrar Don Candido solo cuando sea relevante
3. **Mensajes claros**: Usar mensajes concisos y útiles
4. **Timing apropiado**: No mostrar demasiado rápido seguido
5. **Accesibilidad**: Don Candido es visual, asegurar alternativas para usuarios con discapacidades
