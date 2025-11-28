// src/types/auth.types.ts
// ==================== TYPES & INTERFACES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // En producción NUNCA guardar sin encriptar
  role: "admin" | "hotel";
  modules: string[];
  avatar?: string;
  createdAt: string;
}

export interface LoginResponse {
  message?: string;
  token: string;
  user: Omit<User, "password">; // No retornar password
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  logo?: string;
  stars: number;
  rating: number; // 0-5
  rooms: HotelRoom[];
  gallery: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HotelRoom {
  type: "single" | "double" | "queen";
  available: number;
}

export interface ApiError {
  error: boolean;
  message: string;
  statusCode: number;
}

/**
 * Configuración de una ruta protegida
 */
export interface RouteConfig {
  path: string;
  component: React.ReactElement;
  requiredModule?: string;
  requiredModules?: string[];
  requireAllModules?: string[];
  isPublic?: boolean;
  layout?: "public" | "authenticated"; // 👈 AÑADIR ESTA LÍNEA
  name?: string;
}
