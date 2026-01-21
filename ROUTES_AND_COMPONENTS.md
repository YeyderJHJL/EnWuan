# 🗺️ EnWuan - Mapa de Rutas y Componentes

## 🌐 RUTAS FRONTEND

### Públicas (sin autenticación)
```
/                      → Landing Page (hero + features + pricing)
/login                 → Formulario de login
/register              → Formulario de registro (tabs: usuario/empresa)
```

### Protegidas - Usuario Normal
```
/surveys               → Dashboard de usuario con encuestas disponibles
/survey/:id            → [PENDIENTE] Responder encuesta
/dashboard/user        → Dashboard personal (stats, balance, nivel)
/profile               → [PENDIENTE] Perfil usuario
```

### Protegidas - Empresas
```
/dashboard/company     → [PENDIENTE] Dashboard empresa
/surveys/create        → [PENDIENTE] Crear encuesta
/surveys/:id/edit      → [PENDIENTE] Editar encuesta
/surveys/:id/analytics → [PENDIENTE] Resultados de encuesta
```

### Protegidas - Admin (SOLO jturpoan@unsa.edu.pe)
```
/dashboard/admin       → Panel de administración (métricas globales)
/admin/users           → [PENDIENTE] Gestionar usuarios
/admin/companies       → [PENDIENTE] Gestionar empresas
```

---

## 🧩 ESTRUCTURA DE COMPONENTES

### Layout
```
layouts/
└── MainLayout.jsx
    ├── Header (renderizado desde components/)
    └── {children}
```

### Componentes Principales
```
components/
├── Header.jsx              ✅ Navbar (auth state, user dropdown)
│   ├── Logo/Brand
│   ├── Nav Links
│   ├── Auth Buttons
│   └── User Dropdown
│
├── ProtectedRoute.jsx      ✅ Guard de rutas protegidas
│   ├── Check auth
│   ├── Check role
│   └── Redirect si no autorizado
│
└── dashboard/
    └── [PENDIENTE] Chart components
```

### Pages (Rutas)
```
pages/
├── Landing.jsx            ✅ Landing Page
│   ├── Hero Section
│   ├── Features Cards
│   ├── Pricing Section
│   └── CTA
│
├── Login.jsx              ✅ Página de Login
│   ├── Email input
│   ├── Password input
│   └── Submit button
│
├── Register.jsx           ✅ Página de Registro
│   ├── Tabs (usuario/empresa)
│   ├── Email input
│   ├── Password input
│   ├── Display name
│   └── Submit button
│
├── UserDashboard.jsx      ✅ Dashboard Usuario
│   ├── Stats Cards (balance, encuestas, calidad, nivel)
│   ├── Level Progress bar
│   ├── Available Surveys List
│   └── Recent Activity
│
├── AdminDashboard.jsx     ✅ Dashboard Admin
│   ├── Global Metrics Cards
│   ├── Companies by Level
│   └── Management Buttons
│
├── [PENDIENTE] CompanyDashboard.jsx
│   ├── Company Stats
│   ├── Surveys List
│   ├── Results Analytics
│   └── Gemini Insights
│
├── [PENDIENTE] SurveyDetail.jsx
│   ├── Survey Info
│   ├── Questions Form
│   ├── Submit Button
│   └── Confirmation
│
└── [PENDIENTE] Profile.jsx
    ├── User Info
    ├── Edit Form
    ├── Preferences
    └── Account Settings
```

---

## 🔌 SERVICIOS (API)

### api.js
```
authService
├── register()
├── login()
├── getCurrentUser()
└── verifyToken()

surveysService
├── createSurvey()
├── getActiveSurveys()
├── getSurveysByCompany()
├── getSurveyById()
├── updateSurvey()
├── toggleSurveyActive()
└── suggestQuestions()

submissionsService
├── submitSurvey()
├── getSubmissionsByUser()
└── getSubmissionsBySurvey()

analyticsService
├── getUserDashboard()
├── getCompanyDashboard()
├── getSurveyQualityTrend()
└── getSurveyBreakdown()

companiesService
├── createCompany()
├── getCompanyById()
├── getCompanyByUserId()
├── updateCompany()
└── getAllCompanies()

adminService
├── getGlobalMetrics()
├── getAllUsers()
├── getAllCompanies()
├── getPendingCompanies()
├── updateUserStatus()
└── updateCompanyStatus()
```

---

## 🎭 CONTEXTOS

### AuthContext.jsx
```
Proporciona:
├── currentUser (Firebase user)
├── userProfile (datos backend)
├── userRole (user|business|admin)
├── loading (boolean)
├── signup() → register con Firebase + backend
├── login() → login con Firebase
└── logout() → signOut Firebase

Disponible en toda la app vía useAuth()
```

---

## 🪝 CUSTOM HOOKS

### useAuth()
```typescript
const { 
  userProfile,    // User data from backend
  loading,        // Loading state
  logout          // Logout function
} = useAuth();
```

---

## 🎨 DISEÑO SYSTEM

### Colores
```
Primary:     Indigo (from-indigo-600)
Secondary:   Purple (to-purple-600)
Success:     Green (text-green-600)
Warning:     Amber (from-amber-50)
Error:       Red (text-red-600)

Backgrounds:
- Default: bg-gray-50
- Card: white with shadow-lg
- Gradient: from-indigo-600 to-purple-600
```

### Tipografía
```
H1: text-6xl font-bold
H2: text-4xl font-bold
H3: text-2xl font-bold
Body: text-gray-600
Small: text-sm text-gray-600
```

### Componentes HeroUI
```
Button, Input, Card, CardBody
Progress, Spinner, Navbar, NavbarBrand
NavbarContent, NavbarItem, Avatar
Dropdown, DropdownTrigger, DropdownMenu
DropdownItem, Tabs, Tab
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:  < 640px   (no md:grid)
Tablet:  640px+    (md:grid-cols-2)
Desktop: 1024px+   (md:grid-cols-3 / md:grid-cols-4)
```

### Ejemplos
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

---

## 🔐 RUTAS PROTEGIDAS

### Implementación
```jsx
<Route
  path="/dashboard/user"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
```

### Con Role
```jsx
<Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🔄 FLUJO DE DATOS

### Auth Flow
```
Component
  ↓ (useAuth)
AuthContext
  ↓ (Firebase SDK)
Firebase Auth
  ↓ (getIdToken)
Backend Services
  ↓ (axios + Bearer token)
NestJS Controllers
  ↓ (AuthGuard)
Business Logic (Services)
  ↓
Firestore
```

### Data Fetch Flow
```
Component (useEffect)
  ↓ (analyticsService.getUserDashboard())
API Client (axios)
  ↓ (Bearer token in header)
Backend (/analytics/dashboard/user)
  ↓ (AuthGuard verifica token)
Analytics Service
  ↓ (Firestore queries)
Firestore Collections
  ↓
Component State (setDashboard)
  ↓
Render
```

---

## 🚀 CÓMO AGREGAR UNA NUEVA PÁGINA

### 1. Crear Componente
```jsx
// src/pages/NewPage.jsx
import MainLayout from '../layouts/MainLayout';

export default function NewPage() {
  return (
    <MainLayout>
      <h1>New Page</h1>
    </MainLayout>
  );
}
```

### 2. Agregar Ruta
```jsx
// src/App.jsx
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

### 3. Agregar Link en Header (opcional)
```jsx
// components/Header.jsx
<NavbarItem>
  <Link to="/new-page">New Page</Link>
</NavbarItem>
```

---

## 🔌 CÓMO AGREGAR UN SERVICIO API

### 1. Backend - Crear Endpoint
```typescript
// backend/src/feature/feature.controller.ts
@Get('my-endpoint')
async myEndpoint() {
  return this.featureService.getData();
}
```

### 2. Frontend - Agregar Servicio
```javascript
// src/services/api.js
export const featureService = {
  getData: () => api.get('/feature/my-endpoint'),
};
```

### 3. Frontend - Usar en Componente
```jsx
// src/pages/MyPage.jsx
useEffect(() => {
  featureService.getData()
    .then(res => setData(res.data))
    .catch(err => console.error(err));
}, []);
```

---

## 🧪 TESTING

### Manual Testing Checklist
```
☐ Login con usuario válido
☐ Login con contraseña incorrecta
☐ Registro nuevo usuario
☐ Acceso a dashboard protegido sin auth
☐ Ver encuestas en UserDashboard
☐ Admin accede a /dashboard/admin
☐ No-admin no puede acceder a admin
☐ Datos actualizan correctamente
☐ Logout borra token
```

### API Testing
```bash
# Postman/Insomnia
GET  /api/auth/me
Header: Authorization: Bearer {token}

POST /api/surveys
Body: { title, description, questions }

POST /api/submissions
Body: { surveyId, answers }
```

---

## 📈 PRÓXIMAS IMPLEMENTACIONES

### Corto Plazo (1-2 días)
- [ ] Agregar Recharts para gráficos
- [ ] Completar CompanyDashboard
- [ ] Implementar SurveyDetail con form

### Mediano Plazo (3-5 días)
- [ ] Email notifications
- [ ] User Profile page
- [ ] Company onboarding flow
- [ ] Error toast notifications

### Largo Plazo (1-2 semanas)
- [ ] Payment integration
- [ ] Real-time notifications (Socket.io)
- [ ] File uploads (encuestas con images)
- [ ] Advanced filters/search

---

**Última actualización**: Enero 20, 2026  
**Estado**: 🟢 Estructura Base Lista, Pendiente: Gráficos y UIs Adicionales
