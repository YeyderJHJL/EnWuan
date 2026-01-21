# 🗺️ PLAN DE EJECUCIÓN - EnWuan MVP Fix

**Documento**: Instrucciones paso a paso para arreglar el proyecto  
**Tiempo Total**: ~4-5 horas  
**Riesgo**: Medio-Alto (requiere cuidado)

---

## 📋 TABLA DE CONTENIDOS

1. [FASE 1: Análisis Completado ✅](#fase-1-análisis-completado-)
2. [FASE 2: Autenticación & Hooks](#fase-2-autenticación--hooks)
3. [FASE 3: Landing Page](#fase-3-landing-page)
4. [FASE 4: Dashboards](#fase-4-dashboards)
5. [FASE 5: Documentación](#fase-5-documentación)
6. [FASE 6: Testing Final](#fase-6-testing-final)

---

## ✅ FASE 1: Análisis Completado

**Estado**: COMPLETADO - Ver [AUDIT_COMPLETE.md](AUDIT_COMPLETE.md)

**Hallazgos clave**:
- ✅ Backend funciona (42 endpoints)
- ❌ useAuth duplicado en 2 lugares
- ❌ Landing page duplicada
- ❌ Redirecciones no dinámicas
- ❌ Documentación caótica (17 .md)

**Próximo paso**: FASE 2 (Autenticación)

---

## 🔐 FASE 2: Autenticación & Hooks

### 2.1: Consolidar useAuth (15 min)

**Objetivo**: Eliminar duplicación, usar solo `AuthContext.useAuth()`

#### Paso 1: Listar todos los imports de useAuth
```bash
grep -r "from.*useAuth" src/
```

**Ubicaciones encontradas**:
1. `src/components/Header.jsx` - import from hooks/useAuth ❌
2. `src/pages/Login.jsx` - import from hooks/useAuth ❌
3. `src/pages/Register.jsx` - import from hooks/useAuth ❌
4. `src/pages/UserDashboard.jsx` - import from hooks/useAuth ❌
5. `src/pages/BusinessDashboard.jsx` - import from hooks/useAuth ❌
6. `src/components/admin/AdminDashboard.jsx` - ?
7. Otros componentes admin - ?

#### Paso 2: Actualizar TODOS a import desde AuthContext
```javascript
// CAMBIAR DE:
import { useAuth } from '../hooks/useAuth';

// A:
import { useAuth } from '../contexts/AuthContext';
```

**Archivos a cambiar**:
- [ ] src/components/Header.jsx
- [ ] src/pages/Login.jsx
- [ ] src/pages/Register.jsx
- [ ] src/pages/UserDashboard.jsx
- [ ] src/pages/BusinessDashboard.jsx
- [ ] src/pages/AdminDashboard.jsx (revisar)
- [ ] src/pages/AdminUsers.jsx (revisar)
- [ ] src/pages/AdminCompanies.jsx (revisar)
- [ ] src/pages/Profile.jsx (revisar)
- [ ] src/pages/CompanyOnboarding.jsx (revisar)
- [ ] src/pages/CreateSurvey.jsx (revisar)
- [ ] src/pages/MySurveys.jsx (revisar)

#### Paso 3: ELIMINAR archivo duplicado
```bash
rm src/hooks/useAuth.js
```

**Verify**:
```bash
# No debe haber más referencias a hooks/useAuth
grep -r "hooks/useAuth" src/
# Resultado: (sin resultados = correcto)
```

---

### 2.2: Fix Redirecciones Post-Login (30 min)

**Objetivo**: Login/Register redirigen según `userRole`

#### Paso 1: Actualizar `src/contexts/AuthContext.jsx`

**Agregar función helper**:
```javascript
// Agregar después de ADMIN_EMAIL
const getRoleBasedDashboard = (role) => {
  switch(role) {
    case 'admin': return '/dashboard/admin';
    case 'business': return '/dashboard/business';
    default: return '/dashboard/user';
  }
};

// Exportar en value
export const AuthContext = createContext({});
```

#### Paso 2: Actualizar `src/pages/Login.jsx`

```javascript
// CAMBIAR:
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    await login(formData.email, formData.password);
    // ❌ PROBLEMA: Hardcodeado a /surveys
    navigate('/surveys');
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || 'Error al iniciar sesión.');
  } finally {
    setLoading(false);
  }
};

// A:
const { login, userRole } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    await login(formData.email, formData.password);
    // ✅ Esperar a que userRole se actualice
    setTimeout(() => {
      const targetPath = userRole === 'admin' ? '/dashboard/admin' 
                        : userRole === 'business' ? '/dashboard/business'
                        : '/dashboard/user';
      navigate(targetPath);
    }, 500);
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || 'Error al iniciar sesión.');
  } finally {
    setLoading(false);
  }
};
```

#### Paso 3: Actualizar `src/pages/Register.jsx`

```javascript
// CAMBIAR:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password.length < 6) {
    setError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  setLoading(true);
  setError('');
  
  try {
    await signup(formData.email, formData.password, formData.displayName, accountType);
    
    // ❌ PROBLEMA: Solo redirige a onboarding si business, qué si user?
    if (accountType === 'business') {
      navigate('/onboarding/company');
    } else {
      navigate('/surveys');
    }
  } catch (error) {
    console.error('Signup error:', error);
    setError(error.message || 'Error al crear la cuenta.');
  } finally {
    setLoading(false);
  }
};

// A:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password.length < 6) {
    setError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  setLoading(true);
  setError('');
  
  try {
    await signup(formData.email, formData.password, formData.displayName, accountType);
    
    // ✅ Redireccionar según tipo DE CUENTA
    if (accountType === 'business') {
      // Business debe completar onboarding
      navigate('/onboarding/company');
    } else {
      // Usuario normal va a su dashboard
      navigate('/dashboard/user');
    }
  } catch (error) {
    console.error('Signup error:', error);
    setError(error.message || 'Error al crear la cuenta.');
  } finally {
    setLoading(false);
  }
};
```

---

### 2.3: Agregar ADMIN_EMAIL a .env (5 min)

**Ubicación**: Root del proyecto `.env`

**Agregar**:
```bash
# Autenticación
VITE_API_URL=http://localhost:4000/api
VITE_ADMIN_EMAIL=jturpoan@unsa.edu.pe
```

**Actualizar `src/contexts/AuthContext.jsx`**:
```javascript
// CAMBIAR:
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'jturpoan@unsa.edu.pe';

// A (queda igual, pero ahora lee de .env):
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@enwuan.com';
```

---

## 📄 FASE 3: Landing Page

### 3.1: Consolidar Landing Pages (30 min)

**Objetivo**: Una SOLA landing page correcta y completa

#### Paso 1: Determinar cuál landing es mejor
```bash
# Revisar tamaño y contenido
ls -la src/pages/Landing*.jsx
wc -l src/pages/Landing.jsx src/pages/LandingPage.jsx
```

#### Paso 2: Mantener la mejor, mejorar
**Decisión**: Mantener `src/pages/LandingPage.jsx` (probablemente más completa)

#### Paso 3: Copiar contenido bueno de `Landing.jsx` si falta
```bash
# Revisar si hay componentes diferentes
grep -n "export\|import" src/pages/Landing.jsx
grep -n "export\|import" src/pages/LandingPage.jsx
```

#### Paso 4: Eliminar duplicada
```bash
rm src/pages/Landing.jsx
```

#### Paso 5: Actualizar App.jsx
```javascript
// CAMBIAR:
import Landing from './pages/LandingPage';
// (probablemente ya está así)

// A:
import Landing from './pages/LandingPage';
// Mantener igual
```

---

### 3.2: Asegurar Header Público en Landing (30 min)

**Objetivo**: Landing page muestra un header/navbar público

**Revisar que exista**:
```javascript
// src/pages/LandingPage.jsx o Landing.jsx debe tener:

// Opción A: Usar MainLayout (que incluye Header)
import MainLayout from '../layouts/MainLayout';

export default function Landing() {
  return (
    <MainLayout>
      {/* Tu contenido landing */}
    </MainLayout>
  );
}

// Opción B: Crear Landing Header específico
const LandingHeader = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="text-2xl font-bold">✨ EnWuan</a>
          <div className="flex gap-6">
            <a href="/#inicio">Inicio</a>
            <a href="/#nosotros">Nosotros</a>
            <a href="/#servicios">Servicios</a>
            <a href="/#contacto">Contacto</a>
            <a href="/login" className="btn">Login</a>
            <a href="/register" className="btn btn-primary">Registrarse</a>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

**Debe contener**:
- [x] Logo/Branding
- [x] Links: Inicio, Nosotros, Servicios, Contacto
- [x] Login button
- [x] Register button (con CTA destacado)

---

## 📊 FASE 4: Dashboards

### 4.1: Fix UserDashboard (30 min)

**Archivo**: `src/pages/UserDashboard.jsx`

**Problemas a fix**:
1. `dashboard?.stats?.averageQuality` puede ser undefined
2. `levelColors` hardcodeado
3. No maneja errores de carga

**Fix 1: Safe access en renders**
```javascript
// CAMBIAR:
<p className="text-3xl font-bold text-[#0764bf]">{dashboard?.stats?.totalSubmissions || 0}</p>

// Es correcto, mantener así
```

**Fix 2: Agregar error state**
```javascript
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const dashResponse = await analyticsService.getUserDashboard();
      setDashboard(dashResponse.data);
      
      const surveysResponse = await surveysService.getActiveSurveys();
      setSurveys(surveysResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('No se pudo cargar el dashboard. Intenta recargando.');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile) fetchData();
}, [userProfile]);

// Mostrar error si existe
if (error) {
  return (
    <MainLayout>
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">{error}</p>
      </div>
    </MainLayout>
  );
}
```

---

### 4.2: Fix BusinessDashboard (30 min)

**Archivo**: `src/pages/BusinessDashboard.jsx`

**Cambios necesarios**: Similar a UserDashboard + lógica de empresa

---

### 4.3: Verificar AdminDashboard (15 min)

**Archivo**: `src/pages/AdminDashboard.jsx` (ya creada en attachment)

**Verificar**:
- [x] Usa useAuth() correctamente
- [x] Tabs functionality
- [x] Logout funciona
- [x] ImportS correctos

**Si está bien**: No tocar
**Si tiene errores**: Aplicar mismo fix que UserDashboard

---

### 4.4: Crear ErrorBoundary (OPCIONAL - 15 min)

**Archivo a crear**: `src/components/ErrorBoundary.jsx`

```javascript
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border-2 border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">¡Algo salió mal!</h1>
            <p className="text-gray-600 mb-6">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usar en App.jsx**:
```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          {/* ... routes */}
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
```

---

## 📚 FASE 5: Documentación

### 5.1: Consolidar .md (30 min)

**Objetivo**: 4 archivos profesionales en lugar de 17

#### Archivos a crear/mantener:
1. **README.md** - Visión general + setup rápido
2. **ARCHITECTURE.md** - Estructura del proyecto
3. **DEPLOYMENT.md** - Deploy + variables env
4. **API.md** - Backend endpoints

#### Archivos a eliminar:
```bash
# Backup primero
mkdir docs/archived
mv BACKEND_FIXES.md COMMANDS.md CORRECTIONS_LOG.md FINAL_REPORT.md \
   IMPLEMENTATION_STATUS.md INDEX.md QUICK_START.md ROUTES_AND_COMPONENTS.md \
   SESION_COMPLETADA.md SESSION_SUMMARY.md STATUS.md TECHNICAL_SUMMARY.md \
   TESTING_LOCAL.md docs/archived/

# Mantener:
# - README.md (refactorizado)
# - DEPLOYMENT_READY.md → convertir en DEPLOYMENT.md
# - AUDIT_COMPLETE.md → solo para referencia interna
```

**Tiempo**: No crítico, puede hacerse después

---

## 🧪 FASE 6: Testing Final

### 6.1: Verificar Terminal (5 min)

```bash
cd d:\VSCODE\proyectosVSC\Startup\ Perú\EnWuan

# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
npm run dev
```

**Esperado**:
```
✅ Backend: 🚀 Running on http://localhost:4000/api
✅ Frontend: VITE ready on http://localhost:3000
✅ Console sin errores críticos
```

---

### 6.2: Testing Flujo Completo (30 min)

#### Test 1: Landing → Register → User Dashboard
```
1. Ir a http://localhost:3000
2. Ver landing completa (header público visible)
3. Click "Registrarse" → Tabs: Usuario/Empresa
4. Seleccionar "Usuario"
5. Llenar: email, password, nombre
6. Click Register
7. ✅ Debería redirigir a /dashboard/user (NO /surveys)
8. Ver estadísticas de usuario
```

#### Test 2: Landing → Register → Business Onboarding
```
1. Ir a http://localhost:3000
2. Click "Registrarse"
3. Seleccionar "Empresa"
4. Llenar datos
5. Click Register
6. ✅ Debería redirigir a /onboarding/company
```

#### Test 3: Login con Usuario
```
1. Logout (si estaba logueado)
2. Ir a /login
3. Email: user@test.com
4. Password: ****
5. Click "Iniciar Sesión"
6. ✅ Redirige a /dashboard/user
7. Header muestra "Usuario" con avatar + opciones
8. Click en avatar → muestra email, saldo, nivel
9. Click Logout → vuelve a /
```

#### Test 4: Login con Admin
```
1. Ir a /login
2. Email: jturpoan@unsa.edu.pe
3. Password: ****
4. Click "Iniciar Sesión"
5. ✅ Redirige a /dashboard/admin (NO /dashboard/user)
6. Ver panel admin
```

#### Test 5: Responder Encuesta
```
1. User logged in en dashboard
2. Click en encuesta
3. Ver formulario dinámico
4. Responder preguntas
5. Click "Enviar"
6. Ver resultado (quality %, reward $)
7. ✅ Dashboard actualiza saldo
```

---

### 6.3: Validar Console (5 min)

```bash
# Abrir DevTools (F12)
# Ir a Console tab

# NO debe haber:
❌ Uncaught TypeError: Cannot read property 'map' of undefined
❌ useAuth must be used within AuthProvider
❌ Cannot read property 'displayName' of undefined
❌ Duplicate useAuth imports

# Puede haber:
⚠️ Firebase deprecation warnings (OK)
⚠️ Vite HMR messages (OK)
```

---

## 📊 CHECKLIST FINAL

### Fase 2: Autenticación
- [ ] Todos los `import { useAuth }` usan `../contexts/AuthContext`
- [ ] `src/hooks/useAuth.js` eliminado
- [ ] Login redirige según role
- [ ] Register redirige según tipo
- [ ] `.env` tiene `VITE_ADMIN_EMAIL`

### Fase 3: Landing
- [ ] `src/pages/Landing.jsx` eliminado
- [ ] `src/pages/LandingPage.jsx` mejorada
- [ ] Header público visible
- [ ] Links y CTAs funcionan

### Fase 4: Dashboards
- [ ] UserDashboard no rompe con undefined
- [ ] BusinessDashboard mejorado
- [ ] AdminDashboard revisado
- [ ] ErrorBoundary creado (opcional)

### Fase 5: Documentación
- [ ] 4 .md consolidados
- [ ] Archivos viejos movidos a docs/archived

### Fase 6: Testing
- [ ] Flujo Landing → Auth → Dashboard funciona
- [ ] Todas las redirecciones correctas
- [ ] Console limpia
- [ ] Cero pantallas blancas

---

## 🚀 EJECUCIÓN

**Comenzar ahora con FASE 2: Autenticación & Hooks**

Tiempo estimado: 1 hora

Después: FASE 3 (Landing Page)

