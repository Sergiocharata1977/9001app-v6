# ⚡ QUICK START: Activar Don Cándido en 15 minutos

**¿Quieres activar Don Cándido AHORA?** Sigue estos pasos:

---

## ✅ PASO 1: Obtener API Key (5 minutos)

1. **Ir a**: https://console.anthropic.com
2. **Click en**: "Sign Up" (o "Log In" si ya tienes cuenta)
3. **Completar registro** con tu email
4. **Ir a**: Settings → API Keys
5. **Click en**: "Create Key"
6. **Copiar** la API Key (empieza con `sk-ant-api03-...`)
7. **Guardar** en lugar seguro

💡 **Tip**: Usa el plan FREE primero ($5 gratis para probar)

---

## ✅ PASO 2: Configurar en tu proyecto (2 minutos)

### En Windows PowerShell:

```powershell
# 1. Ir al directorio frontend
cd "C:\Users\Usuario\Documents\Proyectos\ISO -conjunto\9001app-v6\frontend"

# 2. Crear archivo .env.local
New-Item -Path ".env.local" -ItemType File -Force

# 3. Abrir en Notepad
notepad .env.local
```

### En el archivo .env.local, pega esto:

```env
NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **IMPORTANTE**: Reemplaza las X con tu API Key real

### Guardar y cerrar Notepad

---

## ✅ PASO 3: Reiniciar servidor (1 minuto)

```powershell
# Si el servidor está corriendo, detenerlo (Ctrl+C)

# Iniciar nuevamente
npm run dev
```

Espera a que aparezca:
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

---

## ✅ PASO 4: Probar (5 minutos)

### Prueba 1: Abrir la app

```
1. Abrir navegador
2. Ir a: http://localhost:3000/procesos
3. Buscar el ícono de Don Cándido
4. Click para activar
```

### Prueba 2: Hacer una consulta

```
Pregunta: "¿Qué es la cláusula 8.1 de ISO 9001?"

Respuesta esperada:
- Debe ser diferente cada vez
- Debe tener contexto específico
- Debe mencionar tu rol/módulo
- NO debe ser la respuesta genérica de siempre
```

### Prueba 3: Verificar en consola

```
1. Abrir DevTools (F12)
2. Ir a tab "Network"
3. Buscar request a: /api/ia/don-candidos
4. Ver response, debe decir: "modo": "claude_api"
   (NO "simulado" o "fallback")
```

---

## ✅ ¿FUNCIONÓ?

### ✅ SÍ - Don Cándido responde con IA real
**¡Felicidades! 🎉**

Próximos pasos:
- Probar en diferentes módulos (RRHH, CRM, Auditorías)
- Recolectar feedback de usuarios
- Leer documentación completa

---

### ❌ NO - Sigue en modo simulado

**Verifica:**

1. **API Key correcta en .env.local**
   ```powershell
   # Ver contenido del archivo
   cat .env.local
   
   # Debe mostrar:
   # NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-api03-...
   ```

2. **Servidor reiniciado**
   ```powershell
   # Matar proceso de Node
   Get-Process node | Stop-Process -Force
   
   # Iniciar nuevamente
   npm run dev
   ```

3. **API Key válida**
   ```powershell
   # Probar con curl
   $headers = @{
       "Authorization" = "Bearer TU_API_KEY_AQUI"
       "Content-Type" = "application/json"
       "anthropic-version" = "2023-06-01"
   }
   
   $body = '{"model":"claude-3-sonnet-20240229","max_tokens":100,"messages":[{"role":"user","content":"Test"}]}'
   
   Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method POST -Headers $headers -Body $body
   ```

4. **Ver logs del servidor**
   ```
   En la terminal donde corre npm run dev, buscar:
   
   ❌ "CLAUDE_API_KEY no configurada" → Falta configurar
   ✅ "Claude API response successful" → Funcionando
   ```

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Error: "API Key no válida"

**Solución:**
1. Regenerar API Key en console.anthropic.com
2. Actualizar .env.local
3. Reiniciar servidor

---

### Error: "Rate limit exceeded"

**Solución:**
1. Esperar 1 minuto
2. Probar nuevamente
3. Considerar upgrade a plan Pro

---

### Error: "Module not found: .env.local"

**Solución:**
```powershell
# Verificar que estás en el directorio correcto
pwd
# Debe mostrar: ...\9001app-v6\frontend

# Verificar que existe el archivo
Test-Path .env.local
# Debe mostrar: True
```

---

## 📊 CHECKLIST FINAL

Marca cuando completes cada paso:

- [ ] Cuenta en Anthropic creada
- [ ] API Key obtenida
- [ ] Archivo .env.local creado
- [ ] API Key configurada en .env.local
- [ ] Servidor reiniciado
- [ ] Don Cándido responde con IA real
- [ ] Verificado en DevTools: "modo": "claude_api"
- [ ] Probado en 3 módulos diferentes

---

## 🎉 ¡LISTO!

**Don Cándido está operativo con Inteligencia Artificial real.**

### Próximos pasos:

1. **Leer**: `RESUMEN-EJECUTIVO-DON-CANDIDO.md` (para entender beneficios)
2. **Monitorear**: Primeros días de uso
3. **Recolectar**: Feedback de usuarios
4. **Optimizar**: Según lo que aprendas

### Recursos adicionales:

- 📖 Documentación completa: `INFORME-DON-CANDIDO-IA-ANTHROPIC.md`
- ✅ Lista de tareas: `TAREAS-ACTIVACION-DON-CANDIDO.md`
- 📊 Resumen ejecutivo: `RESUMEN-EJECUTIVO-DON-CANDIDO.md`

---

## 💬 ¿DUDAS?

**Preguntas comunes:**

**P**: ¿Cuánto va a costar al mes?  
**R**: $20-100 USD según uso. Con 20-30 usuarios: ~$40/mes

**P**: ¿Puedo desactivarlo después?  
**R**: Sí, solo borra la línea de .env.local y reinicia

**P**: ¿Es seguro?  
**R**: Sí, Claude de Anthropic es uno de los modelos más seguros

**P**: ¿Qué pasa si se cae Claude?  
**R**: Don Cándido activa automáticamente modo fallback (simulado)

---

**Tiempo total**: 15 minutos ⚡  
**Dificultad**: Fácil 😊  
**Resultado**: Don Cándido con IA real ✅

**¿Listo? ¡A activarlo!** 🚀






