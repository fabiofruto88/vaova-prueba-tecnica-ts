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
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  acceptTerms: boolean;
  avatar?: File | null;
}
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string; // en base 64
}

export interface Room {
  id: string;
  hotelId: string;
  name: string; // "Suite Presidencial"
  description: string;
  capacity: 1 | 2 | 3 | 4 | 6 | 8;
  pricePerNight: number;
  available: number; // Cantidad de habitaciones de este tipo
  image?: string; // Base64
  amenities: Amenity[]; // Array de amenidades
  createdAt: string;
  updatedAt: string;
}

export type Amenity =
  | "WiFi"
  | "Minibar"
  | "TV Smart"
  | "Aire Acondicionado"
  | "Room Service"
  | "Jacuzzi"
  | "Terraza"
  | "Balcón"
  | "Desayuno incluido"
  | "Caja fuerte"
  | "Secador de pelo"
  | "Cafetera";

export const AVAILABLE_AMENITIES: Amenity[] = [
  "WiFi",
  "Minibar",
  "TV Smart",
  "Aire Acondicionado",
  "Room Service",
  "Jacuzzi",
  "Terraza",
  "Balcón",
  "Desayuno incluido",
  "Caja fuerte",
  "Secador de pelo",
  "Cafetera",
];

export interface Hotel {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  logo?: string;
  stars: 1 | 2 | 3 | 4 | 5;
  score: number; // Score calculado automáticamente (0-100)
  gallery: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HotelWithRooms extends Hotel {
  rooms: Room[];
}

export interface AdminStats {
  totalHotels: number;
  totalRooms: number;
  averageScore: number;
  hotelsByStars: {
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface ApiError {
  error: boolean;
  message: string;
  statusCode: number;
}

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
