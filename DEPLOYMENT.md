# 🚀 DEPLOYMENT CHECKLIST - ENWUAN

## PRE-DEPLOYMENT (Antes de enviar a producción)

### Backend Readiness
- [ ] `npm run build` sin errores
- [ ] `npm run start:prod` inicia correctamente
- [ ] Todos los endpoints responden (Postman test)
- [ ] variables .env configuradas (Firebase, Gemini, JWT_SECRET)
- [ ] JWT_SECRET es único y fuerte (no "test" o default)
- [ ] CORS configurado para frontend URL
- [ ] Logs se escriben a archivo (logs/app.log)
- [ ] Health check endpoint disponible: GET /health
- [ ] ErrorFilters configurados para producción
- [ ] Validación completa en DTOs

### Frontend Readiness
- [ ] `npm run build` sin errores
- [ ] Build preview: `npm run preview` funciona
- [ ] VITE_API_URL apunta a backend en producción
- [ ] Todas las páginas cargan sin console errors
- [ ] Auth token se persiste correctamente
- [ ] Logout limpia state
- [ ] Responsive en mobile (F12 toggle device)
- [ ] No hay console errors o warnings
- [ ] Loading states implementados
- [ ] Error boundaries en lugar

### Testing
- [ ] Flujo de registro completo (end-to-end)
- [ ] Flujo de login completo
- [ ] Crear encuesta y verificar en BD
- [ ] Responder encuesta y ver reward
- [ ] Verificar nivel sube correctamente
- [ ] Admin puede ver métricas globales
- [ ] Logout funciona y limpia session
- [ ] Rutas protegidas redirigen si no auth
- [ ] Roles se cumplen (admin vs user vs business)

### Security Audit
- [ ] Credenciales Firebase no en código (solo en .env)
- [ ] Gemini API key no expuesto (solo en backend .env)
- [ ] JWT_SECRET es único (no en repositorio)
- [ ] Requests a Firestore usan Security Rules
- [ ] No hay datos sensibles en localStorage (solo token)
- [ ] HTTPS habilitado en dominio
- [ ] CORS solo permite frontend domain
- [ ] Rate limiting en endpoints públicos
- [ ] Validación en todos los inputs

### Database
- [ ] Firestore Rules permiten read/write correctamente
- [ ] Índices creados para queries frecuentes
- [ ] Backups automáticos configurados
- [ ] Data migration plan si hay cambios schema
- [ ] Firestore collections nombradas correctamente
- [ ] Security rules no permiten acceso global

### Documentation
- [ ] README.md actualizado
- [ ] DEPLOYMENT.md creado con instrucciones específicas
- [ ] Endpoint documentation accesible
- [ ] Troubleshooting guide disponible
- [ ] Admin contact info documentado

---

## DEPLOYMENT: BACKEND → RAILWAY

### Paso 1: Preparar Código
```bash
# 1. Asegurar todo commiteado
git status
git add .
git commit -m "chore: release v1.0-MVP"
git push origin main

# 2. Verificar build local
cd backend
npm run build
npm run start:prod
# Debe funcionar sin errores
```

### Paso 2: Setup Railway
```bash
# 1. Crear cuenta en https://railway.app
# 2. Instalar Railway CLI
npm install -g railway

# 3. Autenticarse
railway login

# 4. Navegar a directorio backend
cd backend

# 5. Crear nuevo proyecto
railway init
# Seleccionar: Create new project
# Nombre: enwuan-backend

# 6. Seleccionar proyecto
railway select
```

### Paso 3: Configurar Env Variables
```bash
# En railway CLI:
railway variable set PORT=4000
railway variable set NODE_ENV=production

# Firebase
railway variable set FIREBASE_PROJECT_ID=enwuan-319a4
railway variable set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
railway variable set FIREBASE_CLIENT_EMAIL=firebase-adminsdk@enwuan-319a4.iam.gserviceaccount.com

# Gemini
railway variable set GOOGLE_API_KEY=AIzaSyD02G0hXS-fzsXWUn7Acjo-ZcWX1MBaJtY

# JWT
railway variable set JWT_SECRET=your-super-secret-production-key-12345
railway variable set JWT_EXPIRATION=7d
```

**O vía Dashboard**:
1. https://railway.app → Proyecto → Variables
2. Agregar cada variable
3. Guardar

### Paso 4: Deploy
```bash
# Opción A: Vía CLI
railway up

# Opción B: Vía GitHub (recomendado)
# 1. Conectar repo GitHub a Railway
# 2. Railway detecta cambios automáticamente
# 3. Deploy automático en cada push
```

### Paso 5: Obtener URL de Producción
```bash
# Vía CLI
railway domain

# Output: https://enwuan-backend-prod.up.railway.app
# (URL específica varía)

# Guardar esta URL para frontend
```

### Paso 6: Verificar Deployement
```bash
# Test endpoint
curl https://enwuan-backend-prod.up.railway.app/api/auth/me

# Debe devolver 401 (Unauthorized) - eso es correcto, significa server funciona
# Si devuelve 500 o connection refused, hay error

# Ver logs
railway logs
```

---

## DEPLOYMENT: FRONTEND → VERCEL

### Paso 1: Preparar Código
```bash
# 1. Actualizar VITE_API_URL a backend en producción
# .env (local):
VITE_API_URL=https://enwuan-backend-prod.up.railway.app/api

# 2. npm run build y verificar
npm run build

# 3. Commit y push
git add .
git commit -m "chore: update API URL for production"
git push origin main
```

### Paso 2: Setup Vercel
```bash
# 1. Crear cuenta en https://vercel.com
# 2. Instalar Vercel CLI
npm install -g vercel

# 3. Autenticarse
vercel login

# 4. Deploy desde raíz (auto detecta React)
vercel
# Preguntas:
# - "Set up and deploy?" → yes
# - "Which scope?" → personal
# - "Link to existing project?" → no (first time)
# - "What's your project's name?" → enwuan
# - "In which directory is your code?" → ./
# - "Want to modify settings?" → no
```

### Paso 3: Configurar Env Variables en Vercel
```bash
# Opción A: Vía CLI (después de deploy inicial)
vercel env add VITE_API_URL
# Input: https://enwuan-backend-prod.up.railway.app/api

# Opción B: Vía Dashboard
# 1. https://vercel.com → proyecto enwuan
# 2. Settings → Environment Variables
# 3. Add: VITE_API_URL = https://enwuan-backend-prod.up.railway.app/api
# 4. Save
```

### Paso 4: Deploy a Producción
```bash
# Opción A: Redeploy después de env vars
vercel --prod

# Opción B: GitHub Integration (recomendado)
# 1. En Vercel Dashboard → Conectar GitHub
# 2. Seleccionar repo Startup Perú/EnWuan
# 3. Vercel hace deploy automático en cada push a main
```

### Paso 5: Obtener URL
```bash
# Output de Vercel
# Production: https://enwuan.vercel.app
# (URL específica varía)
```

### Paso 6: Verificar Deployment
```bash
# Abrir en navegador
https://enwuan.vercel.app

# Debe cargar landing page
# Click en Login debe llevar a /login
# Intentar login con credentials de admin
```

---

## VERIFICACIÓN POST-DEPLOYMENT

### Backend Live
- [ ] GET /api/admin/metrics retorna datos
- [ ] POST /api/auth/login funciona
- [ ] Tokens válidos para requests protegidos
- [ ] Gemini API calls funcionan (validación)
- [ ] Firestore reads/writes funcionan
- [ ] Logs disponibles en Railway

### Frontend Live
- [ ] Landing page carga correctamente
- [ ] Login funciona con backend
- [ ] Dashboard carga después de login
- [ ] API calls van a backend en producción
- [ ] Responsive en mobile

### Integration
- [ ] Frontend token se envía al backend
- [ ] Backend valida tokens correctamente
- [ ] Roles se cumplen en frontend y backend
- [ ] Datos persisten en Firestore
- [ ] Analytics se calculan correctamente

---

## MONITOREO POST-DEPLOYMENT

### Railway (Backend)
```bash
# Ver logs en vivo
railway logs --follow

# Ver ambiente
railway status

# Reiniciar si necesario
railway redeploy

# Metrics
# https://railway.app → proyecto → Metrics
```

### Vercel (Frontend)
```bash
# Ver logs
vercel logs

# Analytics y eventos
# https://vercel.com → proyecto → Analytics

# Edge Function logs
vercel logs --follow
```

### Firestore Monitoring
```
# Console Firebase
https://console.firebase.google.com
- Reads/writes realizados
- Datos almacenados
- Utilización de cuota
```

---

## ROLLBACK si Hay Problema

### Backend (Railway)
```bash
# Ver deployments anteriores
railway deployments

# Rollback a versión anterior
railway rollback <deployment-id>

# O vía Dashboard: Deployments → Select Previous → Revert
```

### Frontend (Vercel)
```bash
# Vía CLI
vercel rollback

# O vía Dashboard: Deployments → Select Previous → Redeploy
```

---

## MANTENIMIENTO CONTINUO

### Diario
- [ ] Revisar logs en busca de errores
- [ ] Monitoring de uptime
- [ ] Responder a alertas de Sentry (si instalado)

### Semanal
- [ ] Revisar analytics
- [ ] Verificar performance
- [ ] Backup manual de Firestore
- [ ] Review de usuarios y empresas nuevas

### Mensual
- [ ] Análisis de métricas
- [ ] Optimización de queries Firestore
- [ ] Security audit
- [ ] Plan para siguiente release

---

## ESCALADO FUTURO

### Cuando Crece

1. **Firestore Indexing**
   - Railway auto escalará Firestore usage
   - Crear índices para queries frecuentes
   - Monitorear cuota de reads/writes

2. **Cache Layer**
   - Agregar Redis en Railway
   - Cache común queries
   - Reducir costo Firestore

3. **CDN para Frontend**
   - Vercel ya usa Vercel Edge Network
   - Está optimizado automáticamente
   - Mejorar con Preload Hints

4. **Database Replica**
   - Setup replicado Firestore
   - Geo-replication si usuarios en múltiples países
   - Backup automático

5. **Monitoring Avanzado**
   - Instalar Sentry para errores
   - Instalar Datadog para métricas
   - Alertas automáticas

---

## CREDENCIALES Y ACCESO

**Guardar en lugar seguro (1Password, Bitwarden, etc)**

```
Railway Account:
Email: 
Password: 
API Key: 

Vercel Account:
Email: 
Password: 
API Key: 

Firebase Project:
Project ID: enwuan-319a4
Email: 
Private Key: 

Backend Production URL:
https://enwuan-backend-prod.up.railway.app/api

Frontend Production URL:
https://enwuan.vercel.app

Admin Account:
Email: jturpoan@unsa.edu.pe
Password: 
```

---

## TIMELINE ESTIMADO

| Actividad | Tiempo | Notas |
|-----------|--------|-------|
| Setup Railway | 15 min | Crear cuenta + conectar GitHub |
| Backend Deploy | 10 min | Push a main, auto deploy |
| Setup Vercel | 15 min | Crear cuenta + conectar GitHub |
| Frontend Deploy | 10 min | Push a main, auto deploy |
| Verificación | 15 min | Test endpoints + UI |
| Monitoreo | Ongoing | Logs + metrics |

**Total: ~1 hora para deployment completo**

---

## CONTACTO DE EMERGENCIA

- **Tech Lead**: jturpoan@unsa.edu.pe
- **Railway Support**: https://railway.app/support
- **Vercel Support**: https://vercel.com/support
- **Firebase Support**: https://firebase.google.com/support

---

**Last Updated**: Enero 20, 2026  
**Version**: 1.0-MVP  
**Status**: Ready for Deployment ✅
