# ✅ TESTING LOCAL - EnWuan MVP

**Fecha**: Enero 20, 2026  
**Status**: 🟢 AMBOS SERVIDORES ACTIVOS

---

## 🚀 Estado de los Servidores

### ✅ Backend (NestJS)
```
🚀 EnWuan Backend is running on: http://localhost:4000/api
✅ Firebase Admin SDK initialized
✅ Google Gemini AI initialized
✅ Todas las 42 rutas mapeadas correctamente
```

**Módulos Cargados**:
- AuthModule ✅
- UsersModule ✅
- CompaniesModule ✅
- SurveysModule ✅
- SubmissionsModule ✅
- AnalyticsModule ✅
- AdminModule ✅
- AiModule ✅

### ✅ Frontend (Vite + React)
```
VITE v7.3.1 ready
Local: http://localhost:3000/
```

**Status**: Landing Page cargando en navegador...

---

## 🧪 PLAN DE TESTING

### Fase 1: Validar Landing Page (PÚBLICO)
**Objetivo**: Verificar que la landing page carga correctamente

**Pasos**:
1. Ir a: http://localhost:3000
2. Esperar a que cargue completamente
3. Verificar que ve:
   - ✅ Hero section con "Empieza a Ganar Hoy"
   - ✅ Features section (6 tarjetas)
   - ✅ How it Works (6 pasos)
   - ✅ Pricing (3 niveles: Bronze/Silver/Gold)
   - ✅ Footer con links

**Resultado Esperado**:
```
✅ Landing page carga sin errores de console
✅ Todos los componentes visibles
✅ Botones "Empezar" funcionales
```

---

### Fase 2: Autenticación - Register (PÚBLICO)
**Objetivo**: Crear nueva cuenta de usuario

**Pasos**:
1. Click "Empezar" o "Regístrate como Usuario"
2. Ir a formulario de registro
3. Llenar datos:
   - Email: `testuser@example.com`
   - Password: `Test123!@#`
   - Nombre: `Test User`
   - User Type: `user` (radio button)
4. Click "Registrarse"
5. Esperar respuesta backend

**Resultado Esperado**:
```
✅ POST /api/auth/register exitoso
✅ Usuario creado en Firebase Auth
✅ Documento creado en Firestore users/
✅ Auto-login y redirect a dashboard
✅ NO hay errores en console
```

---

### Fase 3: Dashboard Usuario (PROTEGIDO)
**Objetivo**: Ver encuestas disponibles

**Pasos**:
1. Estar logueado como usuario (desde Fase 2)
2. Verás: UserDashboard con:
   - Saldo actual (inicio $0)
   - Nivel actual (inicio Bronze)
   - Lista de encuestas activas
3. Cada encuesta debe mostrar:
   - Título
   - Descripción
   - Reward amount
   - Botón "Responder"

**Resultado Esperado**:
```
✅ Dashboard carga sin errores
✅ GET /api/surveys/active retorna encuestas
✅ Saldo y nivel visible
✅ Puedes ver botón "Responder" en encuestas
```

---

### Fase 4: Responder Encuesta (CORE FEATURE) 🎯
**Objetivo**: Completar y enviar respuesta a encuesta

**Pasos**:
1. Click "Responder" en cualquier encuesta
2. Navegar a `/survey/:surveyId`
3. Esperar carga de encuesta (GET /api/surveys/:id)
4. Verás formulario dinámico con preguntas:
   - Multiple Choice → Dropdown Select
   - Ranking (1-5) → Select Scale
   - Open Response → Textarea

5. **Responder todas las preguntas requeridas**
6. Click "Enviar Respuestas"
7. Sistema:
   - Valida que todos campos requeridos completados
   - POST /api/submissions con respuestas
   - Backend: Gemini AI valida respuesta
   - Calcula: quality score (0-100%), reward ($X.XX)

**Resultado Esperado**:
```
✅ Formulario dinámico carga correctamente
✅ Todos los tipos de preguntas renderean bien
✅ POST /api/submissions exitoso
✅ Backend retorna: qualityScore, rewardGiven, validationReason
✅ Frontend muestra pantalla de resultado
```

---

### Fase 5: Resultado y Reward (RESULTADO) ✨
**Objetivo**: Ver calidad de respuesta y reward ganado

**Pantalla Esperada**:
```
┌─────────────────────────────────────┐
│  ✅ ¡Respuesta Enviada!             │
│                                     │
│  Calidad: 85% 🌟                   │
│  (Excelente / Bueno / Válido)      │
│                                     │
│  Reward Ganado: $1.25              │
│  (Basado en quality score)         │
│                                     │
│  Razón de Validación:              │
│  "Respuesta reflexiva y bien       │
│   estructurada. Criterios claros   │
│   y coherentes."                   │
│                                     │
│  📈 Nivel: Bronze → Silver         │
│  (Si calidad ≥ 75%)                │
│                                     │
│  [Ver Más Encuestas] [Dashboard]  │
└─────────────────────────────────────┘
```

**Verificar**:
- ✅ Quality score 0-100%
- ✅ Reward amount visible en $
- ✅ Razón de validación de Gemini
- ✅ Notificación de level-up si aplica
- ✅ Botones navegación funcionan

**Resultado Esperado**:
```
✅ Resultado screen carga exitosamente
✅ Validar que números son realistas
✅ Quality: 0-100% coherente con respuestas
✅ Reward: calculado correctamente según formula
✅ Razón AI tiene sentido
```

---

### Fase 6: Dashboard Actualizado (VALIDACIÓN)
**Objetivo**: Verificar que saldo y nivel se actualizaron

**Pasos**:
1. Click "[Dashboard]" desde resultado screen
2. O navega a http://localhost:3000/dashboard/user
3. Verifica:
   - Saldo ANTERIOR: $0.00
   - Saldo NUEVO: $X.XX (reward ganado)
   - Nivel ANTERIOR: Bronze
   - Nivel NUEVO: Silver (si calidad ≥ 75%)

**Resultado Esperado**:
```
✅ Saldo actualizado correctamente
✅ Nivel actualizado si aplica
✅ GET /api/analytics/dashboard/user retorna datos nuevos
✅ Historia de respuestas muestra último envío
```

---

### Fase 7: Múltiples Respuestas (ESCALABILIDAD)
**Objetivo**: Verificar que sistema soporta múltiples respuestas

**Pasos**:
1. Volver a "Ver Más Encuestas" o Dashboard
2. Responder OTRA encuesta
3. Verificar:
   - Nuevo saldo = anterior + nuevo reward
   - Múltiples respuestas en historia
   - Level-up si acumulan calidad

**Resultado Esperado**:
```
✅ Sistema maneja múltiples respuestas
✅ Saldos se acumulan correctamente
✅ Niveles progresan según reglas
✅ Sin errores de duplicación
```

---

### Fase 8: Registro Empresa (BONUS - OPCIONAL)
**Objetivo**: Validar flow de empresa

**Pasos**:
1. Logout (cerrar sesión)
2. Ir a registro
3. Click "Regístrate como Empresa"
4. Llenar datos:
   - Nombre empresa: `Test Company`
   - Email: `company@example.com`
   - Descripción: `Empresa de testing`
   - Sector: `Tecnología`
   - Ubicación: `Lima`
5. Submit
6. Redirect a CompanyDashboard (si existe)

**Resultado Esperado**:
```
✅ POST /api/companies exitoso
✅ Empresa creada en Firestore
✅ Empresa status: pending/approved
✅ User vinculado a empresa
```

---

## 🐛 Checklist de Errores Comunes

### Errores que NO deben aparecer:
- ❌ `@heroui/react not found` → Ya corregido (usa @nextui-org/react)
- ❌ `AuthGuard dependency not resolved` → Ya corregido (AuthModule importado en todos los módulos)
- ❌ `Cannot read property 'id' of undefined` → questions normalizadas correctamente
- ❌ `API not responding` → Backend en http://localhost:4000/api
- ❌ `VITE_API_URL undefined` → .env tiene variable

### Console Warnings que son OK:
- ⚠️ Deprecation warnings de Node.js
- ⚠️ Firebase warnings (normal)
- ⚠️ Vite HMR warnings (normal en desarrollo)

---

## 📊 Flujo Completo (End-to-End)

```
1. LANDING
   ↓
2. REGISTER (testuser@example.com)
   ↓
3. DASHBOARD (ve encuestas)
   ↓
4. SURVEY DETAIL (responde preguntas)
   ↓
5. RESULT (ve quality + reward)
   ↓
6. DASHBOARD UPDATED (saldo ↑, level ↑)
   ↓
✅ FLUJO COMPLETO EXITOSO
```

---

## 🎯 Criterios de Éxito

**MVP Considerado Exitoso si**:
- ✅ Landing page carga sin errores
- ✅ Register funciona (usuario creado)
- ✅ Login funciona (token válido)
- ✅ Dashboard muestra encuestas
- ✅ Responder encuesta completa
- ✅ Gemini AI valida respuesta
- ✅ Reward calculado correctamente
- ✅ Dashboard actualiza con nuevo saldo
- ✅ Sin errores console críticos
- ✅ Performance aceptable (<2s loading)

---

## 🚨 Si algo falla

### Backend No Responde
```bash
# Verificar en terminal backend:
# Debe ver: "🚀 EnWuan Backend is running on: http://localhost:4000/api"
# Si no, ejecutar: npm run start:dev
```

### Frontend No Carga
```bash
# Verificar que .env tiene:
VITE_API_URL=http://localhost:4000/api

# Reiniciar: npm run dev
```

### Encuestas No Cargan
```bash
# Verificar:
1. Backend ejecutando
2. Firestore tiene colección: surveys
3. Documento con estructura correcta
```

### Respuestas No Se Envían
```bash
# Verificar:
1. Token Bearer válido
2. Backend recibe POST /api/submissions
3. Gemini API key configurada en .env
```

---

## 📝 Notas Importantes

1. **Port 3000 puede estar en uso**: Si ves "Port 3000 in use", Vite usa 3001 automáticamente
2. **Firebase Credentials**: Deben estar en .env backend
3. **Gemini API Key**: Debe estar en .env backend para AI validation
4. **Testing**: Usar navegador incógnito para limpiar cache si hay problemas
5. **Logs**: Verificar console (F12) del navegador para errores JavaScript

---

**PRÓXIMO PASO DESPUÉS DE TESTING EXITOSO**:
```
npm run build  # Frontend
npm run build  # Backend (nest build)

# Luego:
# 1. Deploy backend a Railway
# 2. Deploy frontend a Vercel
# 3. Update VITE_API_URL en Vercel con URL real de Railway
```

---

## 🎉 ¡AMBOS SERVIDORES ACTIVOS Y LISTOS PARA TESTING!

Frontend: http://localhost:3000  
Backend: http://localhost:4000/api

**Abre http://localhost:3000 en tu navegador y empieza a testear! ✨**

