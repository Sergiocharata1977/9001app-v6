# 📋 DATOS PARA TARJETA KANBAN: Don Cándido

**Para**: Super Admin → Roadmap Kanban

---

## 📝 INFORMACIÓN DE LA TAREA

### **Título:**
```
🤖 FASE 0: MVP Don Cándido - Asistente IA (1 semana)
```

### **Descripción:**
```
Probar sistema de IA "Don Cándido" (ya implementado) con 5 usuarios piloto 
para validar si aporta valor antes de invertir en sistema completo.

ESTADO ACTUAL:
✅ Código 100% implementado (1,500 líneas)
⚠️ API Key de Anthropic Claude no configurada
✅ Modo fallback operativo (respuestas simuladas)

OBJETIVO FASE 0:
Validar con usuarios reales si Don Cándido realmente ayuda antes de 
invertir en facturación y features avanzadas.
```

### **Objetivos:**
```
1. Activar conexión con Anthropic Claude API
   - Obtener API Key
   - Configurar en proyecto
   - Verificar funcionamiento

2. Implementar rate limiting simple
   - 10 consultas/hora por usuario
   - 1000 consultas/mes por organización
   - Email de alerta al pasar 500

3. Probar con 5 usuarios piloto
   - 1 operario, 1 supervisor, 1 jefe, 1 RRHH, 1 Producción
   - Capacitación 15 minutos c/u
   - Uso durante 1 semana

4. Recolectar feedback y métricas
   - Formulario de satisfacción
   - Logs de uso
   - Costos reales de API

5. DECIDIR próximos pasos
   - SI funciona (80%+ satisfacción) → Continuar con Fase 1 (Facturación)
   - SI tiene potencial → Ajustar y re-testear
   - SI no funciona → Cancelar (pérdida controlada $2K)

BENEFICIOS SI FUNCIONA:
- Respuestas ISO 9001 instantáneas 24/7
- Reducción 70% tiempo resolución de dudas
- Menos consultas a expertos (-50%)
- Capacitación más rápida (+60%)
```

---

## 🏷️ CLASIFICACIÓN

- **Módulo**: `general`
- **Estado**: `todo` (listo para comenzar)
- **Prioridad**: `high` (bajo riesgo, alto potencial)
- **Tipo**: `feature`
- **Fase**: `v6.1`
- **Días estimados**: `5`
- **Asignado a**: `developer`
- **Responsible**: `Tech Lead`

---

## 🏷️ TAGS

```
ia, anthropic, claude, don-candido, mvp, quick-win, 
low-risk, validacion-rapida, iso-9001, asistente-virtual
```

---

## 📎 ARCHIVOS ENLAZADOS

```
- FASE-0-MVP-DON-CANDIDO.md
- RESUMEN-EJECUTIVO-DON-CANDIDO.md
- README-DON-CANDIDO.md
- QUICK-START-DON-CANDIDO.md
- don-candido-analisis.md
```

---

## 💰 PRESUPUESTO

| Concepto | Costo |
|----------|-------|
| Desarrollo (5 días) | $2,000 USD |
| Claude API (1 semana prueba) | ~$20 USD |
| **TOTAL FASE 0** | **$2,020 USD** |

**Comparación**:
- Plan original descartado: $20,000 USD
- Plan pragmático Fase 0: $2,000 USD ✅ (10x menos)

**Si continúa a Fase 1**:
- Facturación + Dashboards: +$4,000 USD
- Total acumulado: $6,000 USD

---

## 📊 MÉTRICAS DE ÉXITO

Para considerar exitosa la Fase 0:

| Métrica | Mínimo | Resultado |
|---------|--------|-----------|
| Usuarios que lo usaron | 4/5 (80%) | ___ /5 |
| Consultas promedio | 5+ por usuario | ___ |
| Satisfacción | 3.5/5 estrellas | ___ /5 |
| Recomendarían | 3/5 usuarios | ___ /5 |
| Costo API | <$50 USD semana | $___ |
| Problemas técnicos | <2 menores | ___ |

**Decisión**:
- ✅ 4+ métricas cumplidas → Continuar Fase 1
- 🔄 2-3 métricas cumplidas → Ajustar y re-testear
- ❌ 0-1 métricas cumplidas → Cancelar

---

## 📅 TIMELINE

```
DÍA 1 (Lunes):
└─ Setup Claude API + Testing básico

DÍA 2 (Martes):
└─ Implementar rate limiting

DÍA 3 (Miércoles):
└─ Seleccionar y capacitar 5 usuarios piloto

DÍA 4-5 (Jueves-Viernes):
└─ Semana de prueba con usuarios

VIERNES TARDE:
└─ Recolección feedback y DECISIÓN
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Claude API activada y funcionando
- [ ] Rate limiting implementado (10/hora, 1000/mes)
- [ ] 5 usuarios capacitados
- [ ] Formulario de feedback creado
- [ ] 1 semana de uso completada
- [ ] Métricas recolectadas
- [ ] Informe ejecutivo con recomendación
- [ ] Decisión tomada: Continuar/Ajustar/Cancelar

---

## 🔗 LINKS ÚTILES

- **Código API**: `frontend/src/app/api/ia/don-candidos/route.ts`
- **Componente Chat**: `frontend/src/components/chat/DonCandidoChat.tsx`
- **Contexto**: `frontend/src/lib/ia/contextoProyectoCompleto.ts`
- **Anthropic Console**: https://console.anthropic.com
- **Docs Claude**: https://docs.anthropic.com/claude/reference

---

## 📝 NOTAS IMPORTANTES

### ⚠️ CAMBIO DE PLAN

Se descartó plan original de 10 semanas ($20K) por sobre-ingeniería.

**Razones**:
- Sin validación temprana con usuarios
- Inversión muy alta sin saber si funciona
- Muchas features que tal vez no se usan
- Sistema de facturación ausente

**Nuevo enfoque**:
- Probar rápido y barato (1 semana, $2K)
- Validar con usuarios reales
- Decidir con datos, no supuestos
- Invertir más solo si funciona

### ✅ VENTAJAS DEL MVP

1. **Riesgo controlado**: Solo $2K vs $20K
2. **Aprendizaje rápido**: 1 semana vs 10 semanas
3. **Flexibilidad**: Fácil cancelar si no funciona
4. **Validación real**: Feedback de usuarios reales
5. **No waste**: Solo lo esencial

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE FASE 0

### Si funciona (✅):
```
FASE 1: Sistema de Facturación (2 semanas, $4K)
- Modelo: Free/Pro/Enterprise
- Dashboard cliente
- Dashboard admin
- Alertas y límites
```

### Si tiene potencial (🔄):
```
AJUSTAR: Identificar problemas y mejorar (1 semana, $1K)
- Analizar qué falló
- Ajustar prompts
- Re-testear con usuarios
```

### Si no funciona (❌):
```
CANCELAR: No continuar
- Documentar lecciones aprendidas
- Pérdida controlada: $2K (vs $20K del plan original)
```

---

## 👥 USUARIOS PILOTO (a definir)

1. **Operario** (Producción): _____________
2. **Supervisor** (Turno): _____________
3. **Jefe** (Departamento): _____________
4. **RRHH** (Analista): _____________
5. **Producción** (Responsable proceso): _____________

---

## 📧 NOTIFICACIONES

**Alertas a enviar**:
- Inicio de Fase 0 → Equipo técnico
- Capacitación usuarios → Usuarios piloto
- Recordatorio uso → Usuarios piloto (mitad de semana)
- Formulario feedback → Usuarios piloto (viernes)
- Resultados → Dirección + Equipo

---

**Creado**: 9 de Octubre, 2025  
**Última actualización**: 9 de Octubre, 2025  
**Estado**: ⏳ Listo para iniciar  
**Aprobación requerida**: Presupuesto $2,000 USD

---

> 💡 **Filosofía Lean**: Construir mínimo viable → Medir con usuarios reales → Aprender de feedback → Decidir con datos. No sobre-invertir sin validación.


