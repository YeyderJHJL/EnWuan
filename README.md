# EnWuan MVP - Plataforma de Encuestas con Validación IA

🚀 **Proyecto Startup Perú** - Desarrollado por Ely, Avril, Victor, Jhamil

## 📝 Descripción

EnWuan es una plataforma innovadora donde los usuarios pueden ganar dinero completando encuestas validadas por Inteligencia Artificial. Las empresas crean encuestas, los usuarios las completan, y una IA (Google Gemini) verifica la calidad de las respuestas antes de aprobar los pagos.

## 🎯 Características Principales

- ✅ **Autenticación con Firebase**: Registro seguro con roles (Admin, Empresa, Usuario)
- 🤖 **Validación con IA**: Google Gemini valida la calidad de respuestas
- 💰 **Sistema de Pagos**: Saldo virtual con solicitudes de retiro (PayPal/Banco)
- 📈 **Panel de Admin**: Gestión completa de tareas y usuarios
- 🏭 **Panel de Empresas**: Crear y gestionar encuestas propias
- 👤 **Panel de Usuarios**: Completar tareas y ganar dinero

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **Vite** - Framework y build tool
- **Tailwind CSS** - Estilos utility-first
- **HeroUI (NextUI)** - Componentes UI enterprise-grade
- **React Router** - Navegación
- **Lucide React** - Iconos

### Backend
- **Vercel Serverless Functions** - Backend serverless
- **Firebase Authentication** - Autenticación de usuarios
- **Firestore** - Base de datos NoSQL
- **Google Gemini AI** - Validación de respuestas

### Integraciones
- **Google Forms** - Formularios de encuestas
- **Google Apps Script** - Captura de envios

## 📂 Estructura del Proyecto

```
/app/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── admin/              # Panel de administración
│   │   ├── business/           # Panel de empresas
│   │   ├── user/               # Panel de usuarios
│   │   └── auth/               # Login y registro
│   ├── contexts/              # React contexts (Auth)
│   ├── services/              # Firebase, Firestore
│   └── App.jsx                # Router principal
├── api/                         # Vercel Serverless Functions
│   └── validate-webhook.js    # Validación con Gemini
├── docs/                        # Documentación
│   └── google-apps-script.js  # Script para Google Forms
├── firestore.rules              # Reglas de seguridad Firestore
└── vercel.json                  # Configuración Vercel
```

## 🚀 Instalación y Configuración
### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/enwuan-mvp.git
cd enwuan-mvp
```

### 2. Instalar dependencias

```bash
# Frontend
yarn install

# Backend (API)
cd api
yarn install
cd ..
```

### 3. Configurar Variables de Entorno

#### Frontend (/.env)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Admin Email
VITE_ADMIN_EMAIL=jturpoan@unsa.edu.pe
```

#### Backend (/api/.env)

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=tu_proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Gemini API
GEMINI_API_KEY=tu_gemini_api_key
```

### 4. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa **Authentication** (Email/Password)
3. Activa **Firestore Database**
4. Copia las credenciales a `.env`
5. Despliega las reglas de seguridad:

```bash
firebase deploy --only firestore:rules
```

### 5. Configurar Google Gemini

1. Obtén una API Key en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Añade la key a `/api/.env`

### 6. Ejecutar en desarrollo

```bash
# Frontend
yarn dev

# El frontend estará en http://localhost:3000
```

## 📦 Despliegue en Vercel

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Desplegar

```bash
vercel
```

### 3. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, añade todas las variables de `/api/.env`

## 📝 Configurar Google Forms

### 1. Crear el Formulario

1. Crea un Google Form con tus preguntas
2. Añade un campo oculto llamado "User ID" (Respuesta corta)
3. Ve a vista previa e inspecciona el HTML del campo
4. Copia el `entry.XXXXXXX` (lo necesitarás para crear la tarea)

### 2. Configurar Google Apps Script

1. En el formulario, ve a (⋮) -> Editor de secuencias de comandos
2. Copia el código de `/docs/google-apps-script.js`
3. Reemplaza `YOUR_VERCEL_WEBHOOK_URL` con tu URL real
4. Guarda el proyecto
5. Crea un activador:
   - Función: `onFormSubmit`
   - Evento: Del formulario -> Al enviar formulario
6. Autoriza los permisos

## 👥 Roles de Usuario

### 🔑 Superadmin
- **Email fijo**: `jturpoan@unsa.edu.pe`
- **Permisos**: Control total de la plataforma
- **Funciones**:
  - Crear/editar/eliminar tareas
  - Gestionar usuarios (cambiar roles)
  - Ver todas las transacciones
  - Aprobar retiros

### 🏭 Usuarios Empresa (Business)
- **Permisos**: Crear sus propias encuestas
- **Funciones**:
  - Crear encuestas con Google Forms
  - Ver estadísticas de sus encuestas
  - Activar/desactivar sus encuestas

### 👤 Usuarios Normales
- **Permisos**: Completar encuestas y ganar dinero
- **Funciones**:
  - Ver tareas disponibles
  - Completar encuestas
  - Ver saldo y historial
  - Solicitar retiros (mínimo S/. 10.00)

## 🔄 Flujo de la Aplicación
```mermaid
graph TD
    A[Usuario se registra] --> B{Tipo de cuenta}
    B -->|Admin| C[Panel Admin]
    B -->|Business| D[Panel Empresa]
    B -->|User| E[Panel Usuario]
    
    D --> F[Crear Tarea/Encuesta]
    F --> G[Configurar Google Form]
    G --> H[Tarea activa]
    
    E --> I[Ver tareas disponibles]
    I --> J[Clic en tarea]
    J --> K[Google Form se abre con UID]
    K --> L[Usuario completa formulario]
    L --> M[Apps Script captura envio]
    M --> N[Webhook recibe datos]
    N --> O[Gemini AI valida respuestas]
    O --> P{Respuestas válidas?}
    P -->|Si| Q[Incrementar saldo]
    P -->|No| R[Rechazar con razón]
    Q --> S[Usuario ve saldo actualizado]
    S --> T[Solicitar retiro]
```

## 📊 Modelo de Datos (Firestore)

### users
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "role": "admin | business | user",
  "balance": "number",
  "createdAt": "timestamp"
}
```

### tasks
```json
{
  "title": "string",
  "description": "string",
  "reward": "number",
  "form_url": "string",
  "entry_id": "string (entry.XXXXXX)",
  "active": "boolean",
  "createdBy": "uid",
  "createdByEmail": "string",
  "createdAt": "timestamp"
}
```

### submissions
```json
{
  "userId": "string",
  "taskId": "string",
  "taskTitle": "string",
  "reward": "number",
  "responses": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "status": "approved | rejected | pending",
  "validationReason": "string",
  "createdAt": "timestamp"
}
```

### withdrawals
```json
{
  "userId": "string",
  "userEmail": "string",
  "amount": "number",
  "method": "paypal | bank",
  "account": "string",
  "status": "pending | approved | rejected",
  "createdAt": "timestamp",
  "processedAt": "timestamp"
}
```

## ⚠️ Notas Importantes

### Para MVP (Fase Actual)
- Las variables de entorno son **placeholders**
- No se ejecutará en producción hasta tener keys reales
- La arquitectura y flujo están completos y listos para producir

### Para Producción
1. **Firebase**:
   - Crear proyecto real en Firebase
   - Configurar autenticación
   - Desplegar Firestore Rules
   - Obtener credenciales Admin SDK

2. **Google Gemini**:
   - Obtener API Key real en Google AI Studio
   - Configurar límites de rate
   - Monitorear uso

3. **Vercel**:
   - Desplegar con `vercel --prod`
   - Configurar variables de entorno
   - Configurar dominio personalizado

4. **Google Forms**:
   - Crear formularios reales
   - Configurar Apps Script en cada uno
   - Actualizar webhook URL

## 🔒 Seguridad

- ✅ Firestore Security Rules configuradas
- ✅ Autenticación obligatoria para todas las operaciones
- ✅ Validación de roles en backend
- ✅ Admin único por email
- ✅ Transacciones atómicas para saldo

## 📞 Soporte

**Equipo EnWuan**
- Ely
- Avril
- Victor
- Jhamil

**Proyecto**: Startup Perú
**Año**: 2025

---

🌟 **¡Aprovecha tus tiempos muertos y gana dinero con EnWuan!**
