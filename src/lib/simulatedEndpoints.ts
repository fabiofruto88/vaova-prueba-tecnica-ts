import type {
  AdminStats,
  ApiError,
  Hotel,
  HotelWithRooms,
  LoginResponse,
  RegisterRequest,
  Room,
  User,
} from "../types/auth.types";
import { STORAGE_KEYS, TOKEN_EXPIRATION } from "../utils/constants";
import { generateRefreshToken, generateToken } from "../utils/jwt";
import {
  getFromStorage,
  saveToStorage,
  simulateNetworkDelay,
} from "../utils/localStorage";
import { calculateHotelScore } from "../utils/services";

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

  // Crear nuevo usuario (solo hoteles pueden registrarse)
  const userId = `user-${Date.now()}`;
  const newUser: User = {
    id: userId,
    name: data.name,
    email: data.email,
    password: data.password,
    role: "hotel", // Solo hoteles se pueden registrar
    modules: [],
    avatar: data.avatar, // Ya viene como base64
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // ✅ Crear hotel asociado al usuario
  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);

  const newHotel: Hotel = {
    id: `hotel-${Date.now()}`,
    name: data.name, // Mismo nombre del usuario
    description: "",
    country: "",
    state: "",
    city: "",
    logo: data.avatar, // Mismo avatar como logo inicial
    stars: 3, // Por defecto 3 estrellas
    score: 0, // Score inicial en 0
    gallery: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  hotels.push(newHotel);
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

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

/**
 * POST /api/hotels
 * Crear hotel con score calculado automáticamente
 */
export const createHotel = async (
  hotelData: Omit<Hotel, "id" | "createdAt" | "updatedAt" | "score">
): Promise<Hotel> => {
  await simulateNetworkDelay();
  await getCurrentUser();

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);

  const newHotel: Hotel = {
    ...hotelData,
    id: `hotel-${Date.now()}`,
    score: 0, // Se calculará cuando agreguen habitaciones
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  hotels.push(newHotel);
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  return newHotel;
};

/**
 * PUT /api/hotels/:id
 * Actualizar hotel y recalcular score
 */
export const updateHotel = async (
  id: string,
  hotelData: Partial<Omit<Hotel, "id" | "createdAt" | "updatedAt" | "score">>
): Promise<Hotel> => {
  await simulateNetworkDelay();
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

  // Recalcular score
  const newStars = hotelData.stars || hotels[index].stars;
  const newScore = calculateHotelScore(id, newStars);

  const updatedHotel: Hotel = {
    ...hotels[index],
    ...hotelData,
    score: newScore,
    updatedAt: new Date().toISOString(),
  };

  hotels[index] = updatedHotel;
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  return updatedHotel;
};

/**
 * GET /api/hotels/:id/full
 * Obtener hotel con sus habitaciones
 */
export const getHotelWithRooms = async (
  id: string
): Promise<HotelWithRooms> => {
  await simulateNetworkDelay();

  const hotel = await getHotelById(id);
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS).filter(
    (r) => r.hotelId === id
  );

  return {
    ...hotel,
    rooms,
  };
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

// ==================== ROOM ENDPOINTS ====================

export const getRoomsByHotel = async (hotelId: string): Promise<Room[]> => {
  await simulateNetworkDelay();

  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);
  return rooms.filter((room) => room.hotelId === hotelId);
};

export const getRoomById = async (id: string): Promise<Room> => {
  await simulateNetworkDelay();

  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);
  const room = rooms.find((r) => r.id === id);

  if (!room) {
    throw {
      error: true,
      message: "Room not found",
      statusCode: 404,
    } as ApiError;
  }

  return room;
};

export const createRoom = async (
  hotelId: string,
  roomData: Omit<Room, "id" | "hotelId" | "createdAt" | "updatedAt">
): Promise<Room> => {
  await simulateNetworkDelay();
  await getCurrentUser();

  // Verificar que el hotel existe
  await getHotelById(hotelId);

  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);

  const newRoom: Room = {
    ...roomData,
    id: `room-${Date.now()}`,
    hotelId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  rooms.push(newRoom);
  saveToStorage(STORAGE_KEYS.ROOMS, rooms);

  // Recalcular score del hotel
  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotelIndex = hotels.findIndex((h) => h.id === hotelId);
  if (hotelIndex !== -1) {
    hotels[hotelIndex].score = calculateHotelScore(
      hotelId,
      hotels[hotelIndex].stars
    );
    saveToStorage(STORAGE_KEYS.HOTELS, hotels);
  }

  return newRoom;
};

export const updateRoom = async (
  id: string,
  roomData: Partial<Omit<Room, "id" | "hotelId" | "createdAt" | "updatedAt">>
): Promise<Room> => {
  await simulateNetworkDelay();
  await getCurrentUser();

  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);
  const index = rooms.findIndex((r) => r.id === id);

  if (index === -1) {
    throw {
      error: true,
      message: "Room not found",
      statusCode: 404,
    } as ApiError;
  }

  const updatedRoom: Room = {
    ...rooms[index],
    ...roomData,
    updatedAt: new Date().toISOString(),
  };

  rooms[index] = updatedRoom;
  saveToStorage(STORAGE_KEYS.ROOMS, rooms);

  // Recalcular score del hotel
  const hotelId = updatedRoom.hotelId;
  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotelIndex = hotels.findIndex((h) => h.id === hotelId);
  if (hotelIndex !== -1) {
    hotels[hotelIndex].score = calculateHotelScore(
      hotelId,
      hotels[hotelIndex].stars
    );
    saveToStorage(STORAGE_KEYS.HOTELS, hotels);
  }

  return updatedRoom;
};

export const deleteRoom = async (id: string): Promise<{ message: string }> => {
  await simulateNetworkDelay();
  await getCurrentUser();

  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);
  const room = rooms.find((r) => r.id === id);

  if (!room) {
    throw {
      error: true,
      message: "Room not found",
      statusCode: 404,
    } as ApiError;
  }

  const filtered = rooms.filter((r) => r.id !== id);
  saveToStorage(STORAGE_KEYS.ROOMS, filtered);

  // Recalcular score del hotel
  const hotelId = room.hotelId;
  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotelIndex = hotels.findIndex((h) => h.id === hotelId);
  if (hotelIndex !== -1) {
    hotels[hotelIndex].score = calculateHotelScore(
      hotelId,
      hotels[hotelIndex].stars
    );
    saveToStorage(STORAGE_KEYS.HOTELS, hotels);
  }

  return { message: "Room deleted successfully" };
};

// ==================== ADMIN ENDPOINTS ====================

export const getAdminStats = async (): Promise<AdminStats> => {
  await simulateNetworkDelay();

  // Verificar que sea admin
  const user = await getCurrentUser();
  if (user.role !== "admin") {
    throw {
      error: true,
      message: "Unauthorized - Admin only",
      statusCode: 403,
    } as ApiError;
  }

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);

  // Total de habitaciones (sumando todas las disponibles)
  const totalRooms = rooms.reduce((sum, room) => sum + room.available, 0);

  // Score promedio
  const averageScore =
    hotels.length > 0
      ? hotels.reduce((sum, hotel) => sum + hotel.score, 0) / hotels.length
      : 0;

  // Hoteles por estrellas
  const hotelsByStars = {
    "3": hotels.filter((h) => h.stars === 3).length,
    "4": hotels.filter((h) => h.stars === 4).length,
    "5": hotels.filter((h) => h.stars === 5).length,
  };

  return {
    totalHotels: hotels.length,
    totalRooms,
    averageScore: Math.round(averageScore),
    hotelsByStars,
  };
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
  localStorage.removeItem(STORAGE_KEYS.ROOMS);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  console.log("🗑️ All data cleared");
};
