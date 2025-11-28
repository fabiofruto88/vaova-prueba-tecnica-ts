import type {
  ApiError,
  Hotel,
  LoginResponse,
  RegisterRequest,
  User,
} from "../types/auth.types";
import { STORAGE_KEYS, TOKEN_EXPIRATION } from "../utils/constants";
import { generateRefreshToken, generateToken } from "../utils/jwt";
import {
  getFromStorage,
  saveToStorage,
  simulateNetworkDelay,
} from "../utils/localStorage";

export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  await simulateNetworkDelay();

  const users = getFromStorage<User>(STORAGE_KEYS.USERS);

  // Validar si el email ya existe
  if (users.find((u) => u.email === data.email)) {
    throw {
      error: true,
      message: "Email already registered",
      statusCode: 400,
    } as ApiError;
  }

  // Crear nuevo usuario
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password, // En producción encriptar
    role: "hotel", // Por defecto hotel, admin se asigna manualmente
    modules: [],
    avatar: data.avatar,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // Generar tokens
  const token = generateToken(newUser.id, newUser.email);
  const refreshToken = generateRefreshToken();

  // Guardar sesión
  sessionStorage.setItem(
    STORAGE_KEYS.SESSION,
    JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      token,
      expiresAt: Date.now() + TOKEN_EXPIRATION,
    })
  );

  // Retornar sin password
  const { password, ...userWithoutPassword } = newUser;

  return {
    message: "User registered successfully",
    token,
    user: userWithoutPassword,
    refreshToken,
    expiresIn: TOKEN_EXPIRATION,
  };
};

/**
 * POST /api/auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  await simulateNetworkDelay();

  const users = getFromStorage<User>(STORAGE_KEYS.USERS);

  // Buscar usuario
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw {
      error: true,
      message: "Invalid credentials",
      statusCode: 401,
    } as ApiError;
  }

  // Generar tokens
  const token = generateToken(user.id, user.email);
  const refreshToken = generateRefreshToken();

  // Guardar sesión
  sessionStorage.setItem(
    STORAGE_KEYS.SESSION,
    JSON.stringify({
      userId: user.id,
      email: user.email,
      token,
      expiresAt: Date.now() + TOKEN_EXPIRATION,
    })
  );

  // Retornar sin password
  const { password: _, ...userWithoutPassword } = user;

  return {
    message: "Login successful",
    token,
    user: userWithoutPassword,
    refreshToken,
    expiresIn: TOKEN_EXPIRATION,
  };
};

/**
 * POST /api/auth/logout
 */
export const logout = async (): Promise<{ message: string }> => {
  await simulateNetworkDelay(200);

  sessionStorage.removeItem(STORAGE_KEYS.SESSION);

  return { message: "Logout successful" };
};

/**
 * GET /api/auth/me
 */
export const getCurrentUser = async (): Promise<Omit<User, "password">> => {
  await simulateNetworkDelay(200);

  const session = sessionStorage.getItem(STORAGE_KEYS.SESSION);

  if (!session) {
    throw {
      error: true,
      message: "No active session",
      statusCode: 401,
    } as ApiError;
  }

  const { userId, expiresAt } = JSON.parse(session);

  // Verificar si el token expiró
  if (Date.now() > expiresAt) {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    throw {
      error: true,
      message: "Session expired",
      statusCode: 401,
    } as ApiError;
  }

  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw {
      error: true,
      message: "User not found",
      statusCode: 404,
    } as ApiError;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// ==================== HOTEL ENDPOINTS ====================

/**
 * GET /api/hotels
 */
export const getHotels = async (): Promise<Hotel[]> => {
  await simulateNetworkDelay();
  return getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
};

/**
 * GET /api/hotels/:id
 */
export const getHotelById = async (id: string): Promise<Hotel> => {
  await simulateNetworkDelay();

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    throw {
      error: true,
      message: "Hotel not found",
      statusCode: 404,
    } as ApiError;
  }

  return hotel;
};

/**
 * POST /api/hotels
 */
export const createHotel = async (
  hotelData: Omit<Hotel, "id" | "createdAt" | "updatedAt">
): Promise<Hotel> => {
  await simulateNetworkDelay();

  // Verificar autenticación
  await getCurrentUser();

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);

  const newHotel: Hotel = {
    ...hotelData,
    id: `hotel-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  hotels.push(newHotel);
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  return newHotel;
};

/**
 * PUT /api/hotels/:id
 */
export const updateHotel = async (
  id: string,
  hotelData: Partial<Omit<Hotel, "id" | "createdAt" | "updatedAt">>
): Promise<Hotel> => {
  await simulateNetworkDelay();

  // Verificar autenticación
  await getCurrentUser();

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const index = hotels.findIndex((h) => h.id === id);

  if (index === -1) {
    throw {
      error: true,
      message: "Hotel not found",
      statusCode: 404,
    } as ApiError;
  }

  const updatedHotel: Hotel = {
    ...hotels[index],
    ...hotelData,
    updatedAt: new Date().toISOString(),
  };

  hotels[index] = updatedHotel;
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  return updatedHotel;
};

/*
  DELETE /api/hotels/:id
 */
export const deleteHotel = async (id: string): Promise<{ message: string }> => {
  await simulateNetworkDelay();

  // Verificar autenticación
  await getCurrentUser();

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const filtered = hotels.filter((h) => h.id !== id);

  if (filtered.length === hotels.length) {
    throw {
      error: true,
      message: "Hotel not found",
      statusCode: 404,
    } as ApiError;
  }

  saveToStorage(STORAGE_KEYS.HOTELS, filtered);

  return { message: "Hotel deleted successfully" };
};

// ==================== UTILIDADES EXTRA ====================

// Inicializa datos de prueba

export const seedDatabase = (): void => {
  // Crear usuario admin por defecto
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);

  if (users.length === 0) {
    const adminUser: User = {
      id: "user-admin",
      name: "Fabio fruto",
      email: "admin@vaova.com",
      password: "admin123",
      role: "admin",
      modules: [],
      createdAt: new Date().toISOString(),
    };

    saveToStorage(STORAGE_KEYS.USERS, [adminUser]);
    console.log(" Admin user created: admin@vaova.com / admin123");
  }
};

/**
 * Limpia toda la data (útil para testing)
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.HOTELS);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  console.log(" All data cleared");
};
