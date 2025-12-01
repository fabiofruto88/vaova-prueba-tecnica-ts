# 🏨 VAOVA - Sistema de Gestión de Hoteles

[![TypeScript](https://img.shields.io/badge/TypeScript-99.2%25-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/Material_UI-7.3.2-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.24-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.66.1-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com/)


> **Prueba Técnica VAOVA** - Aplicación web completa para la gestión integral de hoteles en convenio con planes turísticos, desarrollada con React 19, TypeScript y arquitectura escalable.

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2.  [Cumplimiento Detallado de Requerimientos](#-cumplimiento-detallado-de-requerimientos)
3. [Roles y Funcionalidades por Usuario](#-roles-y-funcionalidades-por-usuario)
4. [Arquitectura y Decisiones Técnicas](#-arquitectura-y-decisiones-técnicas)
5.  [Custom Hooks Propios](#-custom-hooks-propios)
6. [Sistema de Autenticación y Persistencia](#-sistema-de-autenticación-y-persistencia)
7. [Animaciones con Framer Motion](#-animaciones-con-framer-motion)
8. [API Simulada - Endpoints Detallados](#-api-simulada---endpoints-detallados)
9. [Instalación y Ejecución](#-instalación-y-ejecución)
10. [Usuarios por Defecto (Seed)](#-usuarios-por-defecto-seed)
11.  [Estructura Completa del Proyecto](#-estructura-completa-del-proyecto)
12. [Tipos e Interfaces TypeScript](#-tipos-e-interfaces-typescript)
13. [URL de Publicación](#-url-de-publicación)

---

## 📖 Descripción del Proyecto

VAOVA requiere una aplicación web que permita gestionar los hoteles con los cuales ha realizado convenio para ofrecerlos dentro de sus planes turísticos.  Esta solución implementa:

### Características Principales Implementadas

| Característica | Descripción |
|----------------|-------------|
| **Gestión de Hoteles** | CRUD completo con datos generales, ubicación geográfica y clasificación por estrellas |
| **Galería de Imágenes** | Upload y gestión de múltiples imágenes en formato Base64 |
| **Sistema de Score** | Calificación automática calculada dinámicamente (0-100 puntos) |
| **Gestión de Habitaciones** | Tres tipos de acomodación con inventario numérico por tipo |
| **Autenticación Dual** | Persistencia en Cookies + LocalStorage/SessionStorage |
| **Roles Diferenciados** | Administrador y Usuario Hotel con permisos específicos |
| **Diseño Responsive** | Adaptable a todos los dispositivos con Material UI |
| **Animaciones SVG** | Ilustraciones animadas con Framer Motion |

---

## ✅ Cumplimiento Detallado de Requerimientos

### 1. Registro de Usuarios ✔️

**Archivo principal:** `src/pages/public/register.tsx`

| Criterio | Estado | Implementación Específica |
|----------|--------|---------------------------|
| Registro mediante email y contraseña | ✅ | Formulario con React Hook Form + validaciones |
| Nombre (requerido) | ✅ | Campo validado con `required: true` |
| Email (requerido) | ✅ | Validación con regex de email |
| Contraseña (requerida) | ✅ | Mínimo 6 caracteres, confirmación de contraseña |
| Avatar (opcional) | ✅ | Upload de imagen con conversión a Base64 |
| Integración con LocalStorage | ✅ | `src/lib/simulatedEndpoints.ts` → `register()` |
| Librerías agnósticas | ✅ | Funciones puras en `src/utils/localStorage.ts` |

**Función de registro:**
```typescript
// src/lib/simulatedEndpoints.ts - Líneas 29-106
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  await simulateNetworkDelay();
  
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  
  // Validar email único
  if (users.find((u) => u.email === data.email)) {
    throw { error: true, message: "Email already registered", statusCode: 400 } as ApiError;
  }
  
  // Crear usuario con rol "hotel" (solo hoteles pueden registrarse)
  const userId = `hotel-${Date.now()}`;
  const newUser: User = {
    id: `user-${userId}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: "hotel",
    modules: [],
    avatar: data.avatar, // Base64
    createdAt: new Date(). toISOString(),
  };
  
  // Crear hotel asociado automáticamente
  const newHotel: Hotel = {
    id: userId,
    name: data.name,
    description: "",
    country: "",
    state: "",
    city: "",
    logo: data.avatar,
    stars: 3,
    score: 0,
    gallery: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Guardar en localStorage
  users.push(newUser);
  saveToStorage(STORAGE_KEYS. USERS, users);
  hotels.push(newHotel);
  saveToStorage(STORAGE_KEYS. HOTELS, hotels);
  
  // Generar tokens y guardar sesión
  const token = generateToken(newUser.id, newUser.email);
  sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({... }));
  
  return { message: "User registered successfully", token, user, refreshToken, expiresIn };
};
```

### 2. Login de Usuarios ✔️

**Archivo principal:** `src/pages/public/Login.tsx`

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| Login mediante email y contraseña | ✅ | Formulario con validación |
| Verificación de credenciales | ✅ | Comparación en `login()` |
| Generación de tokens | ✅ | JWT simulado con `generateToken()` |
| Manejo de errores | ✅ | Snackbar con mensajes personalizados |

**Función de login:**
```typescript
// src/lib/simulatedEndpoints. ts - Líneas 111-155
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  await simulateNetworkDelay();
  
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    throw { error: true, message: "Invalid credentials", statusCode: 401 } as ApiError;
  }
  
  const token = generateToken(user.id, user.email);
  const refreshToken = generateRefreshToken();
  
  // Guardar sesión en sessionStorage
  sessionStorage.setItem(STORAGE_KEYS. SESSION, JSON.stringify({
    userId: user.id,
    email: user.email,
    token,
    expiresAt: Date.now() + TOKEN_EXPIRATION,
  }));
  
  return { message: "Login successful", token, user, refreshToken, expiresIn: TOKEN_EXPIRATION };
};
```

### 3.  Sesión de Usuario ✔️

**Archivos involucrados:**
- `src/context/AuthContext.tsx` - Contexto global de autenticación
- `src/utils/cookies.ts` - Clase utilitaria para cookies

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| Persistencia con Session Storage | ✅ | `sessionStorage.setItem(STORAGE_KEYS.SESSION, ...)` |
| Persistencia con Cookies | ✅ | `CookieUtils.setCookie()` para tokens |
| Verificación de expiración | ✅ | `CookieUtils.isTokenExpired()` |
| Context API | ✅ | `AuthProvider` con estado global |

**Sistema dual de persistencia (mi implementación base + requerimiento):**
```typescript
// src/context/AuthContext.tsx - Líneas 114-150
const saveLoginData = useCallback((loginResponse: LoginResponse) => {
  const { token, user, refreshToken, expiresIn } = loginResponse;
  
  const tokenExpiresIn = expiresIn || 86400; // 24 horas por defecto
  const expiresAt = Date.now() + tokenExpiresIn * 1000;
  const cookieDays = Math.floor(tokenExpiresIn / (24 * 60 * 60)) || 1;
  
  // ✅ Guardar en COOKIES (mi implementación base)
  CookieUtils.setCookie("accessToken", token, cookieDays);
  CookieUtils.setCookie("user", JSON.stringify(userWithoutAvatar), cookieDays);
  CookieUtils.setCookie("tokenExpires", expiresAt.toString(), cookieDays);
  
  if (refreshToken) {
    CookieUtils. setCookie("refreshToken", refreshToken, cookieDays * 7);
  }
  
  // ✅ También se guarda en sessionStorage (requerimiento de la prueba)
  // Ver función login() en simulatedEndpoints.ts
  
  setUser(user); // Actualizar estado del contexto
});
```

### 4. Perfil del Hotel (CRUD Completo) ✔️

#### 4.a. Datos del Hotel

| Campo | Tipo | Validación | Implementación |
|-------|------|------------|----------------|
| Nombre | `string` | Requerido | ✅ |
| Descripción | `string` | Opcional | ✅ |
| País | `string` | Requerido | ✅ |
| Departamento | `string` | Requerido | ✅ |
| Municipio/Localidad | `string` | Requerido | ✅ |
| Logo | `string (Base64)` | Opcional | ✅ |
| Tipo (Estrellas) | `3 \| 4 \| 5` | Requerido | ✅ |
| Score | `number (0-100)` | Calculado automáticamente | ✅ |

**Interface del Hotel:**
```typescript
// src/types/auth.types.ts - Líneas 79-94
export interface Hotel {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;          // Departamento
  city: string;           // Municipio/Localidad
  email?: string;
  password?: string;
  logo?: string;          // Base64
  stars: 1 | 2 | 3 | 4 | 5;
  score: number;          // 0-100, calculado automáticamente
  gallery: string[];      // Array de imágenes Base64
  createdAt: string;
  updatedAt: string;
}
```

#### 4.b. Tipos de Habitaciones ✔️

**Implementación exacta del requerimiento:**

| Tipo de Acomodación | Código | Capacidad Automática | Campo Numérico |
|---------------------|--------|----------------------|----------------|
| Habitación Sencilla (Single Room) | `single` | 1 persona | ✅ `available` |
| Habitación con Dos Camas (Two Twin Bedroom) | `twin` | 2 personas | ✅ `available` |
| Dormitorio de Matrimonio (One Queen Bedroom) | `queen` | 2 personas | ✅ `available` |

**Constantes y tipos:**
```typescript
// src/utils/constants.ts
export const ROOM_TYPES = Object.freeze(["single", "twin", "queen"] as const);
export type RoomType = (typeof ROOM_TYPES)[number];

export const CAPACITY_BY_TYPE = {
  single: 1,  // Habitación sencilla
  twin: 2,    // Dos camas individuales
  queen: 2,   // Cama matrimonial
};

export const ROOM_AMENITIES = [
  "Wifi",
  "Aire Acondicionado",
  "TV Smart",
  "Calefacción",
  "Minibar",
  "Terraza",
  "Vista Panorámica",
  "Caja Fuerte",
  "Servicio a la Habitación",
  "Escritorio",
  "Secador de Cabello",
  "Detector de Humo",
] as const;
```

**Interface de Habitación:**
```typescript
// src/types/auth.types.ts - Líneas 35-48
export interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: RoomType;           // "single" | "twin" | "queen"
  capacity: number;         // Derivado automáticamente del tipo
  price: number;
  available: number;        // ⭐ Número de habitaciones disponibles por tipo
  description?: string;
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}
```

**Validación y derivación automática de capacidad:**
```typescript
// src/lib/simulatedEndpoints.ts - Líneas 650-660
const deriveCapacityFromType = (type: RoomType): number => {
  const capacity = CAPACITY_BY_TYPE[type];
  if (! capacity) {
    throw {
      error: true,
      message: `Invalid room type '${type}'.  Allowed: ${ROOM_TYPES. join(", ")}`,
      statusCode: 400,
    } as ApiError;
  }
  return capacity;
};
```

#### 4. c-e. Operaciones CRUD

| Operación | Función | Archivo | Descripción |
|-----------|---------|---------|-------------|
| **Crear** | `createHotel()` | `simulatedEndpoints.ts:524` | Crea hotel básico |
| **Crear con cuenta** | `createHotelWithAccount()` | `simulatedEndpoints.ts:210` | Admin: crea hotel + usuario |
| **Leer todos** | `getHotels()` | `simulatedEndpoints.ts:450` | Lista con total de habitaciones |
| **Leer uno** | `getHotelById()` | `simulatedEndpoints. ts:473` | Por ID |
| **Leer completo** | `getHotelWithRooms()` | `simulatedEndpoints.ts:549` | Hotel + habitaciones |
| **Actualizar** | `updateHotel()` | `simulatedEndpoints. ts:490` | Actualiza datos |
| **Actualizar (Admin)** | `updateHotelByAdmin()` | `simulatedEndpoints. ts:309` | + credenciales |
| **Eliminar** | `deleteHotel()` | `simulatedEndpoints. ts:621` | Elimina hotel |
| **Eliminar (Admin)** | `deleteHotelByAdmin()` | `simulatedEndpoints.ts:393` | + usuario asociado |

### 5. Cerrar Sesión ✔️

**Implementación completa:**
```typescript
// src/lib/simulatedEndpoints.ts - Líneas 160-166
export const logout = async (): Promise<{ message: string }> => {
  await simulateNetworkDelay(200);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION); // ✅ Limpia sessionStorage
  return { message: "Logout successful" };
};

// src/context/AuthContext.tsx - Líneas 155-162
const logout = useCallback(() => {
  console.log("👋 Cerrando sesión.. .");
  logoutStorage();        // ✅ Limpia sessionStorage
  clearAuthData();        // ✅ Limpia cookies
  setUser(null);          // ✅ Limpia estado del contexto
  navigate("/login", { replace: true });
}, [navigate]);

const clearAuthData = () => {
  CookieUtils.deleteCookie("accessToken");
  CookieUtils.deleteCookie("refreshToken");
  CookieUtils.deleteCookie("tokenExpires");
  CookieUtils. deleteCookie("user");
};
```

### 6. Diseño Responsive ✔️

- ✅ Material UI Grid System con breakpoints (xs, sm, md, lg, xl)
- ✅ Drawer adaptativo que se convierte en menú móvil
- ✅ Cards y tablas responsive
- ✅ Formularios adaptables
- ✅ Tipografía escalable

### 7.  Repositorio y Publicación ✔️

- ✅ Repositorio GitHub: `fabiofruto88/vaova-prueba-tecnica-ts`
- ✅ Configuración Vercel: `vercel.json`
- ✅ Documentación completa

### 8.  Ítems Técnicos Requeridos ✔️

| Ítem | Estado | Evidencia |
|------|--------|-----------|
| **Componentes funcionales únicamente** | ✅ | 0 clases, 100% funciones |
| **Custom Hooks** | ✅ | `useRequest`, `useNotification`, `useTypewriter` |
| **Render Props** | ✅ | `ProtectedRoute` con children como render prop |
| **Context API** | ✅ | `AuthContext`, `ThemeContext` |
| **Validación con React Hook Form** | ✅ | Todos los formularios |
| **TypeScript con interfaces** | ✅ | `src/types/auth. types. ts`, `common.ts` |
| **Código en inglés** | ✅ | Variables, funciones, comentarios técnicos |
| **Copy en español** | ✅ | Textos de UI, labels, mensajes |

---

## 👥 Roles y Funcionalidades por Usuario

### 🔐 Rol: Administrador (`admin`)

**Credenciales:** `admin@vaova.com` / `admin123`

| Funcionalidad | Ruta | Página | Descripción |
|---------------|------|--------|-------------|
| **Dashboard** | `/admin/dashboard` | `Dashboard.tsx` | Panel con estadísticas globales |
| **Gestión de Hoteles** | `/admin/hotels` | `hotels.tsx` | CRUD completo de hoteles |

#### Dashboard del Administrador

El dashboard muestra en tiempo real:

```typescript
// src/pages/admin/Dashboard.tsx
interface AdminDashboardStats {
  totalHotels: number;      // Total de hoteles registrados
  activeHotels: number;     // Hoteles activos
  totalRooms: number;       // Suma de todas las habitaciones
  occupancy: number;        // Ocupación promedio (%)
  revenue: string;          // Ingresos formateados
  growth: number;           // Crecimiento (%)
}
```

**Componentes del Dashboard:**

| Componente | Descripción |
|------------|-------------|
| `StatCard` | Tarjetas con métricas principales (4 cards) |
| `CardTopHotel` | Ranking de hoteles con mejor desempeño |
| `ProgressBarItem` | Distribución de hoteles por país |

**Widgets visuales:**
1. **Total Hoteles** - Contador de hoteles en el sistema
2. **Total Habitaciones** - Suma de habitaciones disponibles
3. **Ocupación Promedio** - Porcentaje calculado
4. **Ingreso Promedio** - Formateado en moneda

5. **Top Hoteles** - Lista de hoteles ordenados por score:
   - Posición en ranking
   - Logo del hotel
   - Nombre y ubicación
   - Rating en estrellas
   - Score con barra de progreso coloreada

6.  **Distribución por País** - Gráfico de barras:
   - País
   - Cantidad de hoteles
   - Porcentaje del total

#### Gestión de Hoteles (Admin)

**Funcionalidades específicas:**

| Acción | Descripción | Función |
|--------|-------------|---------|
| **Crear Hotel** | Crea hotel + cuenta de usuario asociada | `createHotelWithAccount()` |
| **Ver Lista** | Lista todos los hoteles con credenciales | `getHotelsForAdmin()` |
| **Editar** | Modifica datos + puede cambiar credenciales | `updateHotelByAdmin()` |
| **Eliminar** | Elimina hotel + usuario asociado + habitaciones | `deleteHotelByAdmin()` |

### 🏨 Rol: Usuario Hotel (`hotel`)

**Credenciales:** `hotel@vaova.com` / `hotel123`

| Funcionalidad | Ruta | Página | Descripción |
|---------------|------|--------|-------------|
| **Mi Hotel** | `/hotel/my-hotel` | `myHotel.tsx` | Perfil y edición del hotel |
| **Habitaciones** | `/hotel/rooms` | `rooms.tsx` | CRUD de habitaciones |
| **Galería** | `/hotel/gallery` | `gallery. tsx` | Gestión de imágenes |

#### Perfil del Hotel

**Datos editables:**
- Nombre del hotel
- Descripción
- Ubicación (País, Departamento, Ciudad)
- Logo (upload de imagen)
- Clasificación por estrellas (3, 4 o 5)

**Datos calculados (solo lectura):**
- Score (0-100) - Se recalcula automáticamente

#### Gestión de Habitaciones

**Flujo de creación:**
1.  Seleccionar tipo de acomodación (`single`, `twin`, `queen`)
2. La capacidad se deriva automáticamente del tipo
3. Ingresar nombre, precio y cantidad disponible
4.  Seleccionar amenidades de la lista predefinida
5.  Opcionalmente agregar descripción e imágenes

**Funciones:**
| Acción | Función |
|--------|---------|
| Listar por hotel | `getRoomsByHotel(hotelId)` |
| Crear | `createRoom(hotelId, roomData)` |
| Editar | `updateRoom(id, roomData)` |
| Eliminar | `deleteRoom(id)` |

#### Galería de Imágenes

**Funcionalidades:**
- Upload de múltiples imágenes
- Conversión automática a Base64
- Previsualización en grid
- Eliminación individual
- Reordenamiento (futuro)

---

## 🏗️ Arquitectura y Decisiones Técnicas

### Base Propia Reutilizada

> ⚠️ **Nota del desarrollador:** Este proyecto utiliza una **base de código propia** que he desarrollado y perfeccionado en proyectos anteriores.  Esta base incluye:

1. **Sistema de autenticación con cookies** - Mi implementación preferida para persistencia
2. **Custom hooks optimizados** - `useRequest`, `useNotification`
3. **Arquitectura de carpetas escalable** - Feature-based structure
4. **Configuración de rutas centralizada** - `routes.config.tsx`
5. **Componente ProtectedRoute** - Control de acceso por módulos

### Decisión: Doble Persistencia (Cookies + LocalStorage)

El requerimiento pedía usar LocalStorage/SessionStorage, pero mi base ya utilizaba Cookies. **Decidí mantener ambos sistemas** para cumplir con el requerimiento sin perder la robustez de mi implementación:

```
┌─────────────────────────────────────────────────────────────┐
│                   SISTEMA DE PERSISTENCIA                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │     COOKIES      │         │     SESSION STORAGE       │  │
│  │  (Mi base propia)│         │  (Requerimiento prueba)   │  │
│  ├──────────────────┤         ├──────────────────────────┤  │
│  │ • accessToken    │         │ • session                │  │
│  │ • refreshToken   │         │   - userId               │  │
│  │ • tokenExpires   │         │   - email                │  │
│  │ • user (JSON)    │         │   - token                │  │
│  └──────────────────┘         │   - expiresAt            │  │
│                               └──────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    LOCAL STORAGE                      │   │
│  │              (Datos persistentes - DB simulada)       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • users[]   - Array de usuarios                      │   │
│  │ • hotels[]  - Array de hoteles                       │   │
│  │ • rooms[]   - Array de habitaciones                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                         App. tsx                              │
│                    (React Router v7)                         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│     PublicLayout        │     │    AuthenticatedLayout      │
│  ┌───────────────────┐  │     │  ┌───────────────────────┐  │
│  │ Navbar (simple)   │  │     │  │ Drawer + Navbar       │  │
│  │ <Outlet />        │  │     │  │ Sidebar con navegación│  │
│  │ Footer            │  │     │  │ <Outlet />            │  │
│  └───────────────────┘  │     │  │ Footer                │  │
└─────────────────────────┘     │  └───────────────────────┘  │
              │                 └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│    Rutas Públicas       │     │    Rutas Protegidas         │
│  • / (Home)             │     │  • /admin/dashboard         │
│  • /login               │     │  • /admin/hotels            │
│  • /register            │     │  • /hotel/my-hotel          │
│  • /hotel/:id           │     │  • /hotel/rooms             │
└─────────────────────────┘     │  • /hotel/gallery           │
                                └─────────────────────────────┘
```

---

## 🪝 Custom Hooks Propios

### 1. `useRequest<T>` - Hook para Peticiones HTTP

**Ubicación:** `src/hooks/useRequest. ts`

Este es mi hook más completo, diseñado para manejar cualquier tipo de petición HTTP con Axios de manera consistente y con control total sobre el ciclo de vida. 

**Características:**
- ✅ Tipado genérico con TypeScript
- ✅ Manejo automático de tokens desde cookies
- ✅ Cancelación de peticiones con `CancelToken`
- ✅ Estados de carga, error y éxito
- ✅ Interceptores para logging y manejo de errores 401/403
- ✅ Soporte para FormData (upload de archivos)

**Interface de retorno:**
```typescript
export interface UseRequestReturn<T = any> {
  // Estados
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;

  // Función principal
  loadReq: (
    endpoint: string,
    token: boolean,              // ¿Requiere autenticación? 
    type: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body?: any,
    files?: boolean              // ¿Es FormData?
  ) => Promise<T>;
  
  reset: () => void;             // Resetea estados
  cancel: () => void;            // Cancela petición en curso

  // Funciones de conveniencia
  get: (endpoint: string, requiresAuth?: boolean) => Promise<T>;
  post: (endpoint: string, body?: any, requiresAuth?: boolean, files?: boolean) => Promise<T>;
  put: (endpoint: string, body?: any, requiresAuth?: boolean, files?: boolean) => Promise<T>;
  delete: (endpoint: string, requiresAuth?: boolean) => Promise<T>;
}
```

**Uso típico:**
```typescript
const { data, loading, error, post } = useRequest<LoginResponse>();

const handleLogin = async () => {
  try {
    const response = await post("/auth/login", { email, password }, false);
    // response tiene tipo LoginResponse
  } catch (err) {
    // error ya está seteado en el estado
  }
};
```

**Código completo:**
```typescript
// src/hooks/useRequest.ts
export const useRequest = <T = any>(): UseRequestReturn<T> => {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const axiosInstance = useRef<AxiosInstance | null>(null);

  // Inicializar Axios con interceptores
  const getAxiosInstance = useCallback(() => {
    if (!axiosInstance. current) {
      const baseURL = import.meta.env. VITE_API_URL;
      
      axiosInstance. current = axios.create({
        baseURL,
        timeout: 10000,
        withCredentials: true,
      });

      // Interceptor de request para logging
      axiosInstance.current.interceptors.request.use((config) => {
        console.log("📤 Petición:", config.method?. toUpperCase(), config.url);
        return config;
      });

      // Interceptor de response para errores de auth
      axiosInstance.current.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401 || error.response?. status === 403) {
            handleAuthError(); // Limpia cookies
          }
          return Promise.reject(error);
        }
      );
    }
    return axiosInstance.current;
  }, []);

  // Obtener token desde cookies
  const getAuthToken = useCallback((): string | null => {
    if (CookieUtils.isTokenExpired()) return null;
    return CookieUtils. getCookie("accessToken");
  }, []);

  // Función principal
  const loadReq = useCallback(async (... ) => {
    // Cancelar petición anterior
    if (cancelTokenRef. current) {
      cancelTokenRef.current.cancel("Nueva petición iniciada");
    }
    cancelTokenRef.current = axios.CancelToken. source();

    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const config: AxiosRequestConfig = {
        method: type. toLowerCase(),
        url: endpoint,
        headers: {},
        cancelToken: cancelTokenRef.current.token,
      };

      // Agregar token si es requerido
      if (requiresAuth) {
        const authToken = getAuthToken();
        if (authToken) {
          config.headers["Authorization"] = `Bearer ${authToken}`;
        }
      }

      // Configurar body según tipo
      if (type !== "GET" && body) {
        config.data = body;
        config.headers["Content-Type"] = files ? "multipart/form-data" : "application/json";
      }

      const response = await axiosInstance.request<T>(config);
      setState({ data: response.data, loading: false, error: null, success: true });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error);
      
      const errorMessage = error. response?.data?.message || "Error de conexión";
      setState({ data: null, loading: false, error: errorMessage, success: false });
      throw new Error(errorMessage);
    }
  }, [getAuthToken, getAxiosInstance]);

  return { data, loading, error, success, loadReq, reset, cancel, get, post, put, delete: deleteRequest };
};
```

---

### 2. `useNotification` - Hook para Notificaciones Snackbar

**Ubicación:** `src/hooks/useNotification. ts`

Hook para manejar notificaciones toast/snackbar de manera centralizada con Material UI.

**Características:**
- ✅ 4 tipos de notificación: `error`, `success`, `info`, `warning`
- ✅ Duración configurable
- ✅ Cierre automático y manual
- ✅ Prevención de spam (cierra anterior antes de mostrar nueva)
- ✅ Optimizado con `useCallback`

**Interface:**
```typescript
export type NotificationType = "error" | "success" | "info" | "warning";

export interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
  duration: number;
}

// Retorno del hook
{
  notification: NotificationState;
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
  closeNotification: () => void;
  handleAutoClose: (event?, reason?) => void;
  // Propiedades individuales para compatibilidad
  isOpen: boolean;
  message: string;
  type: NotificationType;
  duration: number;
}
```

**Uso típico:**
```typescript
const { showNotification, notification, handleAutoClose } = useNotification();

// Mostrar notificación de éxito
showNotification("Hotel creado correctamente", "success", 3000);

// Mostrar error
showNotification("Error al guardar", "error");

// En el JSX
<Snackbar
  open={notification.open}
  autoHideDuration={notification.duration}
  onClose={handleAutoClose}
>
  <Alert severity={notification. type}>
    {notification.message}
  </Alert>
</Snackbar>
```

**Código completo:**
```typescript
// src/hooks/useNotification.ts
const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "info",
    duration: 4000,
  });

  // Mostrar notificación (cierra la anterior primero)
  const showNotification: ShowNotificationFn = useCallback(
    (message: string, type: NotificationType = "info", duration: number = 4000) => {
      // Cerrar cualquier notificación activa
      setNotification(prev => ({ ...prev, open: false }));

      // Pequeño delay para permitir animación de cierre
      setTimeout(() => {
        setNotification({ open: true, message, type, duration });
      }, 100);
    },
    []
  );

  // Cerrar manualmente
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Manejador para cierre automático (ignora clickaway)
  const handleAutoClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      closeNotification();
    },
    [closeNotification]
  );

  return {
    notification,
    showNotification,
    closeNotification,
    handleAutoClose,
    isOpen: notification. open,
    message: notification.message,
    type: notification.type,
    duration: notification.duration,
  };
};
```

---

### 3. `useTypewriter` - Hook para Efecto Máquina de Escribir

**Ubicación:** `src/hooks/useTypewriter.ts`

Hook para crear animaciones de texto tipo "typewriter" con múltiples frases que rotan automáticamente.

**Características:**
- ✅ Múltiples textos que rotan en loop infinito
- ✅ Velocidad de escritura configurable
- ✅ Velocidad de borrado configurable
- ✅ Pausa entre textos configurable
- ✅ Limpieza automática de timeouts

**Parámetros:**
```typescript
const displayText = useTypewriter(
  texts: string[],           // Array de textos a mostrar
  typingSpeed?: number,      // ms por carácter al escribir (default: 100)
  deletingSpeed?: number,    // ms por carácter al borrar (default: 50)
  pauseDuration?: number     // ms de pausa antes de borrar (default: 2000)
);
```

**Uso típico (en la página Home):**
```typescript
const texts = [
  "Gestiona tus hoteles fácilmente",
  "Control total de habitaciones",
  "Estadísticas en tiempo real",
  "Diseño moderno y responsive"
];

const displayText = useTypewriter(texts, 80, 40, 1500);

return (
  <Typography variant="h4">
    {displayText}
    <span className="cursor">|</span>
  </Typography>
);
```

**Código completo:**
```typescript
// src/hooks/useTypewriter.ts
export const useTypewriter = (
  texts: string[],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000
) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (! isDeleting) {
          // Escribiendo
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            // Terminó de escribir, pausar antes de borrar
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          // Borrando
          if (displayText.length > 0) {
            setDisplayText(currentText.slice(0, displayText.length - 1));
          } else {
            // Terminó de borrar, pasar al siguiente texto
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
};
```

---

## 🔐 Sistema de Autenticación y Persistencia

### Clase `CookieUtils`

**Ubicación:** `src/utils/cookies.ts`

Clase utilitaria con métodos estáticos para manejo de cookies de manera segura.

```typescript
export class CookieUtils {
  /**
   * Obtener una cookie por nombre
   * @param name Nombre de la cookie
   * @returns Valor decodificado o null
   */
  static getCookie(name: string): string | null {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

    return value ? decodeURIComponent(value) : null;
  }

  /**
   * Establecer una cookie con opciones de seguridad
   * @param name Nombre de la cookie
   * @param value Valor a guardar
   * @param days Días de expiración (default: 7)
   * @param options Opciones adicionales (secure, sameSite, path)
   */
  static setCookie(
    name: string,
    value: string,
    days: number = 7,
    options: { secure?: boolean; sameSite?: "Strict" | "Lax" | "None"; path?: string } = {}
  ) {
    const { 
      secure = window.location.protocol === "https:", 
      sameSite = "Lax", 
      path = "/" 
    } = options;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}; SameSite=${sameSite}`;

    if (secure) {
      cookieString += "; Secure";
    }

    document.cookie = cookieString;
  }

  /**
   * Eliminar una cookie
   */
  static deleteCookie(name: string, path: string = "/") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  }

  /**
   * Verificar si el token ha expirado
   * @returns true si expiró o no existe
   */
  static isTokenExpired(): boolean {
    const expires = this.getCookie("tokenExpires");
    if (!expires) return true;
    return Date.now() >= parseInt(expires);
  }
}
```

### AuthContext - Estado Global de Autenticación

**Ubicación:** `src/context/AuthContext.tsx`

**Métodos disponibles:**
```typescript
interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Métodos de autenticación
  isLoggedIn: () => boolean;
  getUser: () => User | null;
  saveLoginData: (loginResponse: LoginResponse) => void;
  logout: () => void;

  // Métodos de permisos (para futuras expansiones)
  hasModule: (moduleName: string) => boolean;
  hasAnyModule: (moduleNames: string[]) => boolean;
  hasAllModules: (moduleNames: string[]) => boolean;
  getModules: () => string[];
}
```

---

## 🎨 Animaciones con Framer Motion

### `AnimatedHotel` - Ilustración SVG Animada

**Ubicación:** `src/components/AnimatedHotel.tsx`

Componente que renderiza una ilustración de un hotel en formato SVG con animaciones coordinadas usando Framer Motion. 

**Características de la animación:**

| Elemento | Tipo de Animación | Descripción |
|----------|-------------------|-------------|
| **Container** | `staggerChildren` | Los hijos aparecen secuencialmente con 0.3s de delay |
| **Partes del edificio** | `spring` | Aparecen desde abajo con efecto de rebote |
| **Esferas del techo** | `keyframes` | Flotan hacia arriba y abajo infinitamente |
| **Loop principal** | `useAnimation` | El edificio completo aparece, pausa y desaparece en loop |

**Variantes de animación:**
```typescript
// Contenedor principal - Orquesta la aparición de los hijos
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,    // Cada hijo espera 0.3s antes de animarse
      delayChildren: 0. 2,      // Delay inicial antes del primer hijo
    },
  },
};

// Partes del edificio - Efecto de construcción desde abajo
const buildingPartVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,           // Empieza 50px abajo
    scale: 0.8,      // Empieza más pequeño
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",     // Animación tipo resorte
      damping: 12,        // Control del rebote
      stiffness: 100,     // Rigidez del resorte
    },
  },
};
```

**Loop infinito de la animación:**
```typescript
const controls = useAnimation();

useEffect(() => {
  let mounted = true;
  
  const seq = async () => {
    while (mounted) {
      await controls.start("visible");          // Construir edificio
      await new Promise((r) => setTimeout(r, 2200));  // Pausa visible
      await controls. start("hidden");           // Desaparecer
      await new Promise((r) => setTimeout(r, 600));   // Pausa oculto
    }
  };
  
  seq();
  
  return () => { mounted = false; };  // Cleanup
}, [controls]);
```

**Animación de las esferas flotantes:**
```typescript
<motion.g
  variants={buildingPartVariants}
  animate={{
    y: [0, -5, 0],              // Sube y baja 5px
    transition: {
      repeat: Infinity,          // Loop infinito
      duration: 2,               // 2 segundos por ciclo
      ease: "easeInOut",         // Suavizado
    },
  }}
>
  {/* Esferas decorativas del techo */}
</motion.g>
```

**Estructura del SVG:**
```
┌─────────────────────────────────────────┐
│              SVG (512x512)              │
├─────────────────────────────────────────┤
│  1. Techo morado con esferas flotantes  │
│  ┌─────────────────────────────────┐    │
│  │       ○  ○  (flotan)            │    │
│  │    ╱───────────────╲            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  2. Cuerpo principal del edificio       │
│  ┌─────────────────────────────────┐    │
│  │  ┌──┐ ┌──┐ │ ┌──┐ ┌──┐         │    │
│  │  │▒▒│ │▒▒│ │ │▒▒│ │▒▒│  ← Ventanas│  │
│  │  └──┘ └──┘ │ └──┘ └──┘         │    │
│  │  ┌──┐ ┌──┐ │ ┌──┐ ┌──┐         │    │
│  │  │▒▒│ │▒▒│ │ │▒▒│ │▒▒│         │    │
│  │  └──┘ └──┘ │ └──┘ └──┘         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  3. Base y pisos inferiores             │
│  ┌─────────────────────────────────┐    │
│  │  ████████████████████████████   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 🔌 API Simulada - Endpoints Detallados

### Arquitectura de la API Simulada

El archivo `src/lib/simulatedEndpoints.ts` actúa como un **backend completo en memoria**, utilizando LocalStorage como base de datos persistente.

```
┌─────────────────────────────────────────────────────────────┐
│                    simulatedEndpoints.ts                     │
│                    (1064 líneas de código)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SIMULACIÓN DE RED                          │ │
│  │  simulateNetworkDelay(ms) → Promise que espera          │ │
│  │  Simula latencia de red real (200-500ms por defecto)    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              AUTENTICACIÓN                               │ │
│  │  register() → POST /api/auth/register                   │ │
│  │  login() → POST /api/auth/login                         │ │
│  │  logout() → POST /api/auth/logout                       │ │
│  │  getCurrentUser() → GET /api/auth/me                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              HOTELES (CRUD)                             │ │
│  │  getHotels() → GET /api/hotels                          │ │
│  │  getHotelById(id) → GET /api/hotels/:id                 │ │
│  │  getHotelWithRooms(id) → GET /api/hotels/:id/full       │ │
│  │  createHotel(data) → POST /api/hotels                   │ │
│  │  updateHotel(id, data) → PUT /api/hotels/:id            │ │
│  │  deleteHotel(id) → DELETE /api/hotels/:id               │ │
│  │  getHotelGallery(id) → GET /api/hotels/:id/gallery      │ │
│  │  updateHotelGallery(id, gallery) → PUT                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              ADMIN ONLY                                  │ │
│  │  createHotelWithAccount(data) → POST /api/admin/hotels  │ │
│  │  getHotelsForAdmin() → GET /api/admin/hotels            │ │
│  │  updateHotelByAdmin(id, data, creds) → PUT              │ │
│  │  deleteHotelByAdmin(id) → DELETE                        │ │
│  │  getAdminStats() → GET /api/admin/stats                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              HABITACIONES (CRUD)                        │ │
│  │  getRoomsByHotel(hotelId) → GET /api/hotels/:id/rooms   │ │
│  │  getRoomById(id) → GET /api/rooms/:id                   │ │
│  │  createRoom(hotelId, data) → POST                       │ │
│  │  updateRoom(id, data) → PUT /api/rooms/:id              │ │
│  │  deleteRoom(id) → DELETE /api/rooms/:id                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              UTILIDADES                                  │ │
│  │  seedDatabase() → Inicializa datos por defecto          │ │
│  │  clearAllData() → Limpia toda la base de datos          │ │
│  │  calculateHotelScore() → Recalcula score del hotel      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Detalle de Funciones Clave

#### `seedDatabase()` - Inicialización Automática

Esta función se ejecuta automáticamente al cargar la aplicación y garantiza que existan datos de prueba:

```typescript
// src/lib/simulatedEndpoints.ts - Líneas 942-1055
export const seedDatabase = (): void => {
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);

  // 1. Crear usuario Admin si no existe
  const hasAdmin = users. some((u) => u.role === "admin");
  if (!hasAdmin) {
    const adminUser: User = {
      id: "user-admin",
      name: "Fabio fruto",
      email: "admin@vaova.com",
      password: "admin123",
      role: "admin",
      modules: [],
      createdAt: new Date(). toISOString(),
    };
    users. push(adminUser);
    console.log("Admin user created: admin@vaova.com / admin123");
  }

  // 2. Crear usuario Hotel si no existe
  let hotelUser = users.find((u) => u.role === "hotel");
  const hotelId = `hotel-${Date. now()}`;
  if (!hotelUser) {
    hotelUser = {
      id: `user-${hotelId}`,
      name: "Demo Hotel Owner",
      email: "hotel@vaova.com",
      password: "hotel123",
      role: "hotel",
      modules: [],
      avatar: logohoteldefect,  // Logo por defecto en Base64
      createdAt: new Date().toISOString(),
    };
    users.push(hotelUser);
    console.log("Hotel user created: hotel@vaova.com / hotel123");
  }

  saveToStorage(STORAGE_KEYS. USERS, users);

  // 3.  Crear Hotel Demo si no existe
  let targetHotel = hotels.length > 0 ?  hotels[0] : undefined;
  if (! targetHotel) {
    targetHotel = {
      id: hotelId,
      name: "Demo Hotel",
      description: "Hotel de ejemplo creado por seedDatabase",
      country: "Colombia",
      state: "Atlántico",
      city: "Barranquilla",
      logo: logohoteldefect,
      stars: 4,
      score: 0,
      gallery: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    hotels.push(targetHotel);
    saveToStorage(STORAGE_KEYS. HOTELS, hotels);
  }

  // 4. Crear Habitación Demo si el hotel no tiene habitaciones
  const existingRoomsForHotel = rooms.filter((r) => r.hotelId === targetHotel.id);
  if (existingRoomsForHotel. length === 0) {
    const demoType: RoomType = "twin";
    const newRoom: Room = {
      id: `room-${Date. now()}`,
      hotelId: targetHotel.id,
      name: "Habitación Estándar",
      type: demoType,
      capacity: deriveCapacityFromType(demoType),  // 2 personas
      price: 120,
      available: 5,
      description: "Habitación de ejemplo creada por seedDatabase",
      images: [],
      amenities: ["Wifi", "Aire Acondicionado"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    rooms. push(newRoom);
    saveToStorage(STORAGE_KEYS.ROOMS, rooms);
  }

  // 5. Recalcular score del hotel
  const computedScore = calculateHotelScore(targetHotel. id, targetHotel.stars);
  // ...  actualizar score

  console.log("seedDatabase: datos iniciales garantizados.");
};
```

#### `calculateHotelScore()` - Algoritmo de Calificación

El score se calcula automáticamente basándose en tres factores:

```typescript
// src/utils/services. ts
export const calculateHotelScore = (hotelId: string, stars: number): number => {
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS)
    .filter((r) => r.hotelId === hotelId);

  // 1. Score por cantidad de habitaciones (40% del total)
  //    - Máximo 50 habitaciones = 40 puntos
  const totalRooms = rooms.reduce((sum, room) => sum + room. available, 0);
  const roomScore = Math.min((totalRooms / 50) * 40, 40);

  // 2. Score por estrellas (30% del total)
  //    - 5 estrellas = 30 puntos
  const starScore = (stars / 5) * 30;

  // 3.  Score por amenidades promedio (30% del total)
  //    - Promedio de 10 amenidades por habitación = 30 puntos
  const avgAmenities = rooms.length > 0
    ? rooms.reduce((sum, room) => sum + room. amenities.length, 0) / rooms.length
    : 0;
  const amenityScore = Math.min((avgAmenities / 10) * 30, 30);

  // Score total (0-100)
  return Math.round(roomScore + starScore + amenityScore);
};
```

**Ejemplo de cálculo:**
```
Hotel: "Demo Hotel"
- Estrellas: 4
- Habitaciones: 15 disponibles
- Amenidades promedio: 6

Cálculo:
- roomScore = (15/50) * 40 = 12 puntos
- starScore = (4/5) * 30 = 24 puntos
- amenityScore = (6/10) * 30 = 18 puntos

Total: 12 + 24 + 18 = 54 puntos
```

---

## 💻 Instalación y Ejecución

### Prerrequisitos

| Herramienta | Versión Mínima |
|-------------|----------------|
| Node. js | 18.x |
| npm | 9.x |
| yarn (opcional) | 1. 22.x |

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/fabiofruto88/vaova-prueba-tecnica-ts.git

# 2. Entrar al directorio
cd vaova-prueba-tecnica-ts

# 3. Instalar dependencias
npm install
# o con yarn
yarn install

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Comandos Disponibles

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `npm run dev` | Servidor de desarrollo con HMR | `http://localhost:5173` |
| `npm run build` | Compila TypeScript y genera build de producción | `/dist` |
| `npm run preview` | Previsualiza la build de producción localmente | - |
| `npm run lint` | Ejecuta ESLint para verificar código | - |

### Variables de Entorno

El proyecto no requiere variables de entorno para funcionar en modo de desarrollo ya que usa LocalStorage como backend.  Sin embargo, el hook `useRequest` está preparado para usar:

```env
VITE_API_URL=https://tu-api-real.com/api
```

---

## 👤 Usuarios por Defecto (Seed)

Al cargar la aplicación por primera vez,
