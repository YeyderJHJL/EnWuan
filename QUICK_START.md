# 🚀 EnWuan - Quick Start Guide

## ⚡ Inicio Rápido (5 minutos)

### 1. Clonar/Abrir el Proyecto
```bash
cd "d:\VSCODE\proyectosVSC\Startup Perú\EnWuan"
```

### 2. Instalar Dependencias

**Backend**:
```bash
cd backend
npm install
```

**Frontend**:
```bash
cd ..
npm install
```

### 3. Verificar Variables de Entorno

✅ **Backend** (`backend/.env`):
```
FIREBASE_PROJECT_ID=enwuan-319a4
GEMINI_API_KEY=AIzaSyD02G0hXS-fzsXWUn7Acjo-ZcWX1MBaJtY
PORT=4000
```

✅ **Frontend** (`.env`):
```
VITE_API_URL=http://localhost:4000/api
VITE_FIREBASE_PROJECT_ID=enwuan-319a4
```

### 4. Ejecutar Servidores

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
# ✅ Escucha en http://localhost:4000
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# ✅ Abre http://localhost:3000
```

### 5. Probar el Sistema

#### Test de Registro
```bash
# En browser
http://localhost:3000/register
- Email: test@example.com
- Contraseña: Test123456
- Nombre: Test User
- Tipo: Usuario
```

#### Test de Login
```bash
http://localhost:3000/login
```

#### Test de Admin (Email especial)
```bash
# Registrarse con:
Email: jturpoan@unsa.edu.pe
# Acceso automático a /dashboard/admin
```

---

## 🔧 Estructura del Proyecto

```
EnWuan/
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── auth/            # ✅ Autenticación
│   │   ├── surveys/         # ✅ Encuestas
│   │   ├── submissions/     # ✅ Respuestas
│   │   ├── companies/       # ✅ Empresas
│   │   ├── users/           # ✅ Usuarios
│   │   ├── analytics/       # ✅ Analytics
│   │   ├── admin/           # ✅ Admin
│   │   ├── ai/              # ✅ Gemini
│   │   └── common/firebase/ # ✅ Firebase
│   ├── .env                 # Variables de entorno
│   └── package.json
│
├── src/                     # React Frontend
│   ├── pages/              # ✅ Landing, Login, Register, Dashboards
│   ├── components/         # ✅ Header, ProtectedRoute
│   ├── layouts/            # ✅ MainLayout
│   ├── services/           # ✅ API client
│   ├── contexts/           # ✅ Auth context
│   ├── hooks/              # ✅ useAuth
│   └── App.jsx            # ✅ Router
│
├── .env                     # Variables frontend
└── IMPLEMENTATION_STATUS.md # Documentación completa
```

---

## 📡 Endpoints Principales

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Surveys
```
POST   /api/surveys
GET    /api/surveys/active
GET    /api/surveys/:id
PUT    /api/surveys/:id
```

### Submissions
```
POST   /api/submissions
GET    /api/submissions/user/:userId
```

### Analytics
```
GET    /api/analytics/dashboard/user
GET    /api/analytics/dashboard/company/:companyId
```

### Admin
```
GET    /api/admin/metrics
GET    /api/admin/users
GET    /api/admin/companies
```

---

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar puerto 4000
netstat -ano | findstr :4000

# Matar proceso si existe
taskkill /PID [PID] /F

# Reintentar
npm run start:dev
```

### CORS errors
✅ Ya configurado en `main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

### Firebase auth no funciona
```bash
# Verificar credenciales en backend/.env
# Deben coincidir con proyecto enwuan-319a4
```

### Variables .env no cargan
```bash
# Frontend: Reiniciar servidor Vite (Ctrl+C y npm run dev)
# Backend: Reiniciar servidor (Ctrl+C y npm run start:dev)
```

---

## 📊 Flujos Principales

### Flujo Usuario
```
1. Registrarse → /register
2. Login → /login
3. Ver encuestas → /surveys (Dashboard Usuario)
4. Responder → /survey/:id (en desarrollo)
5. Ganas recompensa → Balance actualizado
```

### Flujo Admin
```
1. Email: jturpoan@unsa.edu.pe
2. Acceso automático → /dashboard/admin
3. Ver métricas globales
4. Gestionar usuarios/empresas
```

### Flujo Empresa (pendiente UI)
```
1. Registrarse con tipo "Empresa"
2. Crear encuesta
3. Ver resultados
4. Análisis IA automático
```

---

## 🎨 Tecnologías Instaladas

- ✅ NestJS 10
- ✅ React 18 + Vite
- ✅ Tailwind CSS
- ✅ HeroUI (NextUI)
- ✅ Firebase Admin SDK
- ✅ Google Generative AI
- ✅ Axios
- ✅ React Router v6

---

## 💡 Tips Útiles

### Agregar una nueva página
```typescript
// 1. Crear src/pages/NewPage.jsx
// 2. Importar en src/App.jsx
// 3. Agregar ruta

<Route path="/new-page" element={<NewPage />} />
```

### Agregar un endpoint backend
```typescript
// 1. Crear método en .service.ts
// 2. Crear endpoint en .controller.ts
// 3. Testear con Postman
```

### Usar variables de entorno
```typescript
// Frontend
import.meta.env.VITE_API_URL

// Backend
process.env.PORT
```

---

## 📞 Support

- 📄 Ver `IMPLEMENTATION_STATUS.md` para documentación completa
- 🔍 Revisar logs en terminal
- ✅ Todos los módulos están en `backend/src/`

---

**Estado**: 🟢 Listo para desarrollo
**Última actualización**: Enero 20, 2026
