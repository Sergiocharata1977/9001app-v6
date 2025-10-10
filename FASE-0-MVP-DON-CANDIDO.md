# 🚀 FASE 0: MVP Don Cándido (1 semana)

**Objetivo**: Probar si Don Cándido aporta valor REAL antes de invertir más  
**Duración**: 1 semana (40 horas)  
**Inversión**: $2,000 USD  
**Riesgo**: BAJO

---

## 📋 QUÉ VAMOS A HACER

✅ Activar Claude API con lo que YA existe  
✅ Rate limiting simple (evitar abusos)  
✅ Probar con 5-10 usuarios piloto  
✅ Recolectar feedback  
✅ DECIDIR si continuamos

---

## ❌ QUÉ NO VAMOS A HACER (todavía)

- ❌ Sistema de facturación
- ❌ Base de conocimiento por industria  
- ❌ Sistema de privacidad complejo
- ❌ Analytics avanzados
- ❌ Dashboards elaborados
- ❌ Voz / Autocompletado

**Todo eso viene DESPUÉS si el MVP funciona**

---

## 📅 PLAN DÍA A DÍA

### **DÍA 1: Setup Claude API (8 horas)**

#### Mañana (4 horas)
```bash
✅ Tarea 1.1: Obtener API Key (30 min)
   - Ir a https://console.anthropic.com
   - Crear cuenta
   - Generar API Key
   - Guardar en lugar seguro

✅ Tarea 1.2: Configurar proyecto (30 min)
   - Crear frontend/.env.local
   - Agregar: NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-...
   - Reiniciar servidor
   - Verificar que NO hay warning en consola

✅ Tarea 1.3: Test básico (3 horas)
   - Abrir http://localhost:3000/procesos
   - Activar Don Cándido
   - Preguntar: "¿Qué es ISO 9001?"
   - Verificar respuesta de IA real (no simulada)
   - Probar en 3 módulos diferentes
   - Verificar logs
```

#### Tarde (4 horas)
```bash
✅ Tarea 1.4: Documentar setup (1 hora)
   - Crear archivo SETUP-REAL.md
   - Anotar API Key usada
   - Anotar cualquier problema encontrado

✅ Tarea 1.5: Verificar costos (1 hora)
   - Ir a console.anthropic.com/usage
   - Ver cuánto costaron las pruebas
   - Estimar costo con 10 usuarios

✅ Tarea 1.6: Preparar entorno para usuarios piloto (2 horas)
   - Asegurar servidor estable
   - Configurar logs
   - Preparar instructivo simple
```

**Entregable Día 1**: ✅ Don Cándido funcionando con Claude API real

---

### **DÍA 2: Rate Limiting Simple (8 horas)**

#### Mañana (4 horas)
```typescript
// backend/src/middleware/rateLimitDonCandido.ts

import rateLimit from 'express-rate-limit';

// Límite por usuario: 10 consultas/hora
export const userRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: {
    error: "Has alcanzado el límite de 10 consultas por hora. Intenta más tarde.",
    retry_after: "1 hora"
  },
  keyGenerator: (req) => req.user?.id || req.ip
});

// Colección en MongoDB para tracking mensual
interface UsageTracking {
  organization_id: string;
  periodo: string; // "2025-10"
  consultas_totales: number;
  limite_warning: 500; // Enviar email
  limite_hard: 1000; // Bloquear
  alerta_enviada: boolean;
  usuarios: Array<{
    user_id: string;
    nombre: string;
    consultas: number;
  }>;
}

// Servicio simple
async function verificarLimiteOrganizacion(orgId: string): Promise<boolean> {
  const periodo = new Date().toISOString().slice(0, 7); // "2025-10"
  
  const usage = await UsageTracking.findOne({
    organization_id: orgId,
    periodo: periodo
  });
  
  // Si no existe, crear
  if (!usage) {
    await UsageTracking.create({
      organization_id: orgId,
      periodo: periodo,
      consultas_totales: 0,
      limite_warning: 500,
      limite_hard: 1000,
      alerta_enviada: false,
      usuarios: []
    });
    return true;
  }
  
  // Verificar límite duro
  if (usage.consultas_totales >= usage.limite_hard) {
    throw new Error('Límite mensual alcanzado (1000 consultas). Contacta a soporte.');
  }
  
  // Enviar alerta si pasa 500
  if (usage.consultas_totales >= usage.limite_warning && !usage.alerta_enviada) {
    await sendEmailAlert(orgId, {
      asunto: "⚠️ Don Cándido: 500 consultas usadas",
      mensaje: `Has usado 500 de 1000 consultas mensuales. Monitorea el uso.`
    });
    usage.alerta_enviada = true;
    await usage.save();
  }
  
  return true;
}

// Incrementar contador después de cada consulta
async function registrarConsulta(orgId: string, userId: string, userName: string) {
  const periodo = new Date().toISOString().slice(0, 7);
  
  await UsageTracking.findOneAndUpdate(
    { organization_id: orgId, periodo: periodo },
    {
      $inc: { consultas_totales: 1 },
      $push: {
        usuarios: {
          $each: [{ user_id: userId, nombre: userName, consultas: 1 }],
          $slice: -100 // Mantener últimos 100
        }
      }
    },
    { upsert: true }
  );
}
```

#### Tarde (4 horas)
```bash
✅ Tarea 2.1: Crear modelo UsageTracking (1 hora)
   - backend/src/models/DonCandidoUsage.ts

✅ Tarea 2.2: Crear servicio de tracking (2 horas)
   - backend/src/services/usageTrackingService.ts
   - Implementar verificarLimite()
   - Implementar registrarConsulta()

✅ Tarea 2.3: Integrar en API route (1 hora)
   - Actualizar frontend/src/app/api/ia/don-candidos/route.ts
   - Llamar verificarLimite() ANTES de consultar Claude
   - Llamar registrarConsulta() DESPUÉS de respuesta
   - Manejar errores de límite
```

**Entregable Día 2**: ✅ Rate limiting funcionando (10/hora, 1000/mes)

---

### **DÍA 3: Preparación Usuarios Piloto (8 horas)**

#### Mañana (4 horas)
```bash
✅ Tarea 3.1: Seleccionar usuarios piloto (1 hora)
   Criterios:
   - 1 operario (nivel básico)
   - 1 supervisor (nivel medio)
   - 1 jefe (nivel avanzado)
   - 1 de RRHH
   - 1 de Producción
   Total: 5 usuarios

✅ Tarea 3.2: Crear instructivo simple (2 horas)
   Documento: "Cómo usar Don Cándido"
   - Dónde encontrarlo (ícono en cada módulo)
   - Cómo activarlo
   - Ejemplos de preguntas útiles
   - Qué NO preguntarle
   - 1 página máximo, con capturas

✅ Tarea 3.3: Capacitación express (1 hora)
   - Reunión 15 minutos con cada usuario
   - Mostrar en vivo cómo funciona
   - Responder dudas
```

#### Tarde (4 horas)
```bash
✅ Tarea 3.4: Crear formulario de feedback (2 horas)
   Google Forms simple con:
   1. ¿Usaste Don Cándido esta semana? (Sí/No)
   2. ¿Cuántas veces aproximadamente? (1-5, 6-10, 11-20, 20+)
   3. ¿Te ayudó a resolver tus dudas? (1-5 estrellas)
   4. ¿Qué pregunta te respondió mejor?
   5. ¿Qué pregunta NO te pudo responder bien?
   6. ¿Lo recomendarías a un compañero? (Sí/No/Tal vez)
   7. Comentarios libres

✅ Tarea 3.5: Configurar monitoreo básico (2 horas)
   - Crear hoja de cálculo para tracking diario
   - Columnas: Fecha, Usuario, Consultas, Problemas
   - Configurar script para exportar desde MongoDB
```

**Entregable Día 3**: ✅ 5 usuarios capacitados y listos

---

### **DÍA 4-5: SEMANA DE PRUEBA** (usuarios usan el sistema)

**NO hay tareas de desarrollo**

```bash
✅ Monitoreo diario (30 min/día):
   - Ver cuántas consultas se hacen
   - Ver si hay errores
   - Verificar costos en console.anthropic.com
   - Registrar cualquier problema

✅ Soporte rápido:
   - Responder dudas de usuarios
   - Solucionar problemas técnicos
   - Tomar notas de feedback informal

✅ Check-in con usuarios (mitad de semana):
   - Email o mensaje rápido
   - ¿Cómo va? ¿Problemas?
```

---

### **DÍA 5 (viernes tarde): Recolección de Feedback (4 horas)**

```bash
✅ Tarea 5.1: Enviar formulario de feedback (30 min)
   - Email a los 5 usuarios con link
   - Recordar que es anónimo
   - Dar plazo: responder hoy

✅ Tarea 5.2: Analizar respuestas (1.5 horas)
   - Compilar resultados del formulario
   - Revisar logs de uso
   - Calcular métricas:
     * Tasa de adopción: ¿cuántos realmente lo usaron?
     * Frecuencia: ¿cuántas veces?
     * Satisfacción promedio
     * Problemas comunes

✅ Tarea 5.3: Reunión de cierre (1 hora)
   - Reunión con 5 usuarios (30 min)
   - Conversación abierta
   - Preguntar qué mejorar
   - Agradecer participación

✅ Tarea 5.4: Informe ejecutivo (1 hora)
   - Crear presentación simple (5-10 slides)
   - Resultados clave
   - Recomendación: ¿continuar?
```

**Entregable Día 5**: ✅ Informe con recomendación CONTINUAR/AJUSTAR/CANCELAR

---

## 📊 MÉTRICAS DE ÉXITO

### Criterios para CONTINUAR a Fase 1:

```javascript
const criterios_exito = {
  
  adopcion: {
    minimo: "4 de 5 usuarios lo usaron",
    ideal: "5 de 5 usuarios lo usaron",
    real: "___/5" // Completar después
  },
  
  frecuencia: {
    minimo: "Promedio de 5+ consultas por usuario",
    ideal: "Promedio de 10+ consultas por usuario",
    real: "___" // Completar después
  },
  
  satisfaccion: {
    minimo: "3.5/5 estrellas promedio",
    ideal: "4.0/5 estrellas promedio",
    real: "___/5" // Completar después
  },
  
  recomendacion: {
    minimo: "3 de 5 usuarios recomendarían",
    ideal: "5 de 5 usuarios recomendarían",
    real: "___/5" // Completar después
  },
  
  problemas_tecnicos: {
    maximo_aceptable: "2 problemas menores",
    bloqueantes: "0 problemas bloqueantes",
    real: "___" // Completar después
  },
  
  costo: {
    maximo_aceptable: "$50 USD en la semana",
    proyeccion_mensual: "$200 USD/mes con 5 usuarios",
    real: "$___" // Completar después
  }
};
```

### Decisión Final:

```javascript
// Evaluar después de la semana:

if (adopcion >= 4 && satisfaccion >= 3.5 && problemas < 2) {
  decision = "✅ CONTINUAR con Fase 1 (Facturación)";
  proximos_pasos = "Implementar sistema de facturación simple";
  inversion_adicional = "$4,000 USD (2 semanas)";
  
} else if (tiene_potencial_pero_necesita_ajustes) {
  decision = "🔄 AJUSTAR y probar 1 semana más";
  proximos_pasos = "Identificar qué ajustar y re-testear";
  inversion_adicional = "$1,000 USD (1 semana)";
  
} else {
  decision = "❌ CANCELAR Don Cándido";
  razon = "No aporta valor suficiente para el costo";
  perdida = "$2,000 USD (mejor que perder $20K)";
}
```

---

## 💰 PRESUPUESTO

| Concepto | Costo |
|----------|-------|
| **Desarrollo (5 días)** | $2,000 USD |
| Setup Claude API | Incluido |
| Rate limiting | Incluido |
| Capacitación usuarios | Incluido |
| **Costos operación (1 semana)** | ~$10-30 USD |
| Claude API (estimado) | $10-30 USD |
| **TOTAL FASE 0** | **$2,030 USD** |

**Comparación**:
- Plan original: $20,000 USD
- Plan Anthropic: $4,000 USD  
- Plan pragmático: $2,000 USD ✅

---

## 📝 ENTREGABLES FINALES

Al final de la semana debes tener:

1. ✅ **Don Cándido funcionando** con Claude API real
2. ✅ **Rate limiting** implementado (10/hora, 1000/mes)
3. ✅ **5 usuarios capacitados** que usaron el sistema
4. ✅ **Formulario de feedback** completado
5. ✅ **Informe ejecutivo** con recomendación
6. ✅ **Métricas de uso** (consultas, costos, errores)
7. ✅ **Decisión clara**: Continuar / Ajustar / Cancelar

---

## 🚨 RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Usuarios no lo usan | Media | Alto | Capacitación clara, recordatorios |
| Claude API cae | Baja | Medio | Ya existe modo fallback |
| Costos muy altos | Baja | Medio | Rate limiting + monitoreo diario |
| Respuestas malas | Media | Alto | Prompt ya está optimizado |
| Problemas técnicos | Media | Medio | Testing previo día 1 |

---

## ✅ CHECKLIST PRE-INICIO

Antes de empezar, verifica:

- [ ] Presupuesto aprobado ($2,000 USD)
- [ ] Developer asignado (1 persona, 1 semana)
- [ ] 5 usuarios piloto identificados
- [ ] Acceso a console.anthropic.com
- [ ] Servidor de desarrollo estable
- [ ] MongoDB funcionando
- [ ] Backup del sistema (por las dudas)

---

## 📞 CONTACTO

**Developer asignado**: ___________  
**Usuarios piloto**:
1. ___________ (Operario)
2. ___________ (Supervisor)
3. ___________ (Jefe)
4. ___________ (RRHH)
5. ___________ (Producción)

**Fecha inicio**: ___________  
**Fecha cierre**: ___________ (5 días después)

---

## 🎯 DESPUÉS DE FASE 0

### Si funciona (80%+ satisfacción):
→ **FASE 1**: Sistema de facturación (2 semanas, $4K)

### Si tiene potencial (60-79% satisfacción):
→ **AJUSTAR**: Identificar problemas y re-testear (1 semana, $1K)

### Si no funciona (<60% satisfacción):
→ **CANCELAR**: Ahorras $18K que ibas a invertir

---

**Preparado**: 9 de Octubre, 2025  
**Versión**: 1.0 - Plan Pragmático  
**Estado**: ⏳ Listo para ejecutar

---

> 💡 **Filosofía**: Probar rápido y barato. Si funciona, invertir más. Si no funciona, no pierdes mucho. **Lean Startup aplicado a IA.**


