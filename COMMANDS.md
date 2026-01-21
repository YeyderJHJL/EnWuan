# 🛠️ EnWuan - COMANDOS ÚTILES DEL DESARROLLO

## 🚀 INICIACIÓN RÁPIDA

### Opción 1: Fresh Start
```bash
# Instalar dependencias de todo
cd backend && npm install
cd .. && npm install

# Variables de entorno
cp backend/.env.example backend/.env
cp .env.example .env

# Iniciar
npm run dev        # Frontend en 3000
npm run dev:api    # Backend en 4000 (en otra terminal)
```

### Opción 2: Desarrollo Rápido
```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Monitoreo Firestore (opcional)
firebase emulator:start
```

---

## 📦 INSTALACIÓN DE DEPENDENCIAS

### Frontend Dependencies
```bash
npm install axios recharts react-router-dom @heroui/react
```

### Backend Dependencies
```bash
cd backend
npm install firebase-admin @google/generative-ai class-validator
```

### Dev Dependencies (si necesario)
```bash
npm install -D typescript @types/node ts-node nodemon
```

---

## 🏃 COMANDOS DE DESARROLLO

### Backend
```bash
cd backend

# Desarrollo con hot-reload
npm run start:dev

# Build para producción
npm run build

# Ejecutar build producción
npm run start:prod

# Testing
npm run test
npm run test:watch

# Linting
npm run lint
```

### Frontend
```bash
# Desarrollo con Vite
npm run dev

# Build producción
npm run build

# Preview build local
npm run preview

# Linting React
npm run lint
```

### Full Stack (desde raíz)
```bash
# Instalar todo
npm run install:all

# Iniciar desarrollo
npm run dev       # Ambos en paralelo

# Build ambos
npm run build:all
```

---

## 🧪 TESTING DE ENDPOINTS

### Con cURL
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Obtener token en respuesta
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Usar token en requests protegidos
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Obtener mis dashboards
curl -X GET http://localhost:4000/api/analytics/dashboard/user \
  -H "Authorization: Bearer $TOKEN"
```

### Con Postman/Insomnia
```
1. Nuevo Request → POST → http://localhost:4000/api/auth/login
2. Body (JSON): {"email":"test@example.com","password":"password123"}
3. Send → Copiar token de respuesta
4. Nuevo Request → GET → http://localhost:4000/api/auth/me
5. Headers: Authorization: Bearer {token}
6. Send
```

---

## 🔍 DEBUGGING

### Backend Logs
```bash
# Con npm run start:dev (ya tiene logs)
# O agregar a código:
console.log('Debug:', data);
Logger.debug('Message', 'Context');

# En archivo tsconfig.json:
"sourceMap": true
```

### Frontend Logs
```javascript
// Consola del navegador (F12)
console.log('Component state:', state);
console.error('API Error:', error);

// React DevTools extension útil
// Descargar: Chrome/Firefox
```

### Firestore Emulator (local testing)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar emulator
firebase emulator:start

# Limpiar emulator
firebase emulator:clean
```

---

## 🐛 TROUBLESHOOTING

### Backend No Inicia
```bash
# Error: Port 4000 in use
netstat -ano | findstr :4000
taskkill /PID {PID} /F

# Error: Firebase credentials not found
# Verificar backend/.env tiene GOOGLE_APPLICATION_CREDENTIALS
cat backend/.env | grep GOOGLE

# Error: Modulo no encontrado
rm -rf backend/node_modules
npm install
```

### Frontend No Carga
```bash
# Limpiar cache
rm -rf node_modules/.vite
npm run dev

# Port 3000 in use
kill -9 $(lsof -t -i:3000)

# API no responde
curl http://localhost:4000/api/auth/me
# Si falla: backend no está corriendo
```

### Autenticación Fallando
```bash
# Verificar token válido
# En browser console:
localStorage.getItem('authToken')

# Token expirado?
# Backend genera nuevos en cada login
# Frontend debe hacer logout + login

# Firebase credentials error?
# Verificar firebase.json y project ID
firebase projects:list
```

---

## 📊 MONITOREO

### Ver Firestore en Vivo
```bash
# Firebase Console
# https://console.firebase.google.com
# Seleccionar proyecto: enwuan-319a4

# En terminal:
firebase firestore:inspect

# Ver documentos específicos:
firebase firestore:inspect users
```

### Ver Logs Backend
```bash
# Si hay archivo de logs:
tail -f logs/app.log

# O usar PM2 para producción:
npm install -g pm2
pm2 start npm --name "enwuan-api" -- run start:prod
pm2 logs enwuan-api
```

### Monitorear Memoria/CPU
```bash
# Top
top -p $(pgrep -f "node.*backend")

# O con npm:
npm install -g clinic
clinic doctor -- npm run start:dev
```

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno Requeridas

**backend/.env**
```
PORT=4000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=enwuan-319a4
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@enwuan-319a4.iam.gserviceaccount.com

# Gemini
GOOGLE_API_KEY=AIzaSyD02G0hXS-fzsXWUn7Acjo-ZcWX1MBaJtY

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=7d
```

**.env (Frontend)**
```
VITE_API_URL=http://localhost:4000/api
VITE_FIREBASE_CONFIG={"apiKey":"...","projectId":"enwuan-319a4",...}
```

### Cambiar Configuración
```bash
# Backend port
# backend/.env → PORT=5000
# Reiniciar servidor

# Frontend API URL
# .env → VITE_API_URL=http://your-api:4000/api
# npm run dev

# Firestore location
# firebase.json → "firebaserc": "asia-northeast1"
# firebase deploy
```

---

## 📝 GIT WORKFLOW

### Commits Básicos
```bash
# Ver cambios
git status
git diff

# Agregar archivos
git add src/
git add backend/

# Commit
git commit -m "feat: agregar SurveyDetail page"
git commit -m "fix: corregir cálculo de rewards"
git commit -m "docs: actualizar README"

# Push
git push origin main
```

### Branching
```bash
# Crear rama para feature
git checkout -b feature/survey-detail

# Hacer cambios, commits
git add .
git commit -m "feat: survey detail form"

# Merge a main
git checkout main
git merge feature/survey-detail
git push origin main
```

### Revert Cambios
```bash
# Deshacer cambios no committed
git checkout -- src/file.jsx

# Deshacer último commit (keep changes)
git reset --soft HEAD~1

# Deshacer último commit (discard changes)
git reset --hard HEAD~1
```

---

## 🚢 DEPLOYMENT

### Preparación
```bash
# 1. Build
cd backend && npm run build
npm run build

# 2. Test build local
# Backend
npm run start:prod

# Frontend
npm run preview

# 3. Verificar .env production-ready
cat backend/.env
cat .env

# 4. Commit final
git add .
git commit -m "chore: release v1.0-MVP"
git push
```

### Deploy Backend (Railway)
```bash
# 1. Install Railway CLI
npm install -g railway

# 2. Login
railway login

# 3. Link project
cd backend
railway init

# 4. Deploy
railway up

# 5. Ver URL
railway domain
# https://enwuan-api.up.railway.app

# 6. Set environment variables en Railway dashboard
```

### Deploy Frontend (Vercel)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel
# Seleccionar: frontend root

# 4. Configurar environment
# .env.production → VITE_API_URL=https://enwuan-api.up.railway.app/api

# 5. Deploy producción
vercel --prod
```

### Post-Deploy Verification
```bash
# Verificar backend en vivo
curl https://enwuan-api.up.railway.app/api/auth/me

# Verificar frontend
open https://enwuan.vercel.app

# Ver logs
railway logs
vercel logs
```

---

## 🔑 ADMIN ACCESS

### Cuenta Admin Existente
```
Email: jturpoan@unsa.edu.pe
Password: (check backend/.env)
Role: admin

Login URL: http://localhost:3000/login
```

### Crear Nuevo Admin
```javascript
// En backend, admin.service.ts, add method:
async makeAdmin(email: string) {
  const user = await this.firebaseService.db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
  
  if (user.empty) throw new Error('User not found');
  
  await user.docs[0].ref.update({ role: 'admin' });
  return 'User promoted to admin';
}

// Luego: POST /api/admin/promote-user
// Body: {"email":"new-admin@example.com"}
```

---

## 📞 SOPORTE RÁPIDO

### Si no funciona el login
```
1. Verificar firebase.json tiene project ID correcto
2. Verificar backend/.env tiene Firebase credentials
3. Verificar usuario existe en Firebase Console
4. Verificar password es correcta
5. Ver logs: npm run start:dev
```

### Si no funciona un endpoint
```
1. Verificar endpoint URL es correcta
2. Verificar método HTTP (GET, POST, etc.)
3. Verificar Authorization header si protegido
4. Verificar body JSON es válido
5. Ver logs backend para error específico
```

### Si no carga página
```
1. npm run dev está corriendo? (puerto 3000)
2. npm run start:dev está corriendo? (puerto 4000)
3. VITE_API_URL en .env es correcto?
4. Limpiar cache: Ctrl+Shift+Del → Clear browsing data
5. F12 → Console tab → Ver errors
```

---

## 🎯 PRÓXIMOS PASOS

### Mañana (Si continúas desarrollo)
```bash
# 1. Crear SurveyDetail.jsx
# 2. Implementar form de respuestas
# 3. Conectar submissionsService
# 4. Testing del flujo completo

cd src/pages
# Crear SurveyDetail.jsx (ver ROUTES_AND_COMPONENTS.md)
```

### Esta Semana
```bash
# 1. Agregar Recharts charts
# 2. Crear CompanyDashboard
# 3. Implementar ProfilePage
# 4. Testing e2e

npm install recharts
# Usar en dashboards
```

### Próximas Semanas
```bash
# 1. Email notifications
# 2. Payment integration
# 3. Real-time updates
# 4. Deploy a producción
```

---

**Last Updated**: Enero 20, 2026  
**Maintained by**: Tech Lead - Jorge Turpón  
**Questions?** → Check QUICK_START.md o TECHNICAL_SUMMARY.md
