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
import type { CreateHotelFormData } from "../types/common";
import {
  CAPACITY_BY_TYPE,
  ROOM_AMENITIES_SET,
  ROOM_TYPES,
  STORAGE_KEYS,
  TOKEN_EXPIRATION,
  type RoomType,
} from "../utils/constants";
import { generateRefreshToken, generateToken } from "../utils/jwt";
import {
  getFromStorage,
  saveToStorage,
  simulateNetworkDelay,
} from "../utils/localStorage";
import { logohoteldefect } from "../utils/logoDefault";
import { calculateHotelScore } from "../utils/services";

export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  await simulateNetworkDelay();

  const users = getFromStorage<User>(STORAGE_KEYS.USERS);

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

// Crear hotel con su cuenta de usuario asociada (Solo Admin)

export const createHotelWithAccount = async (
  data: CreateHotelFormData
): Promise<{ user: User; hotel: Hotel }> => {
  await simulateNetworkDelay();

  const currentUser = await getCurrentUser();
  if (currentUser.role !== "admin") {
    throw {
      error: true,
      message: "Unauthorized - Admin only",
      statusCode: 403,
    } as ApiError;
  }

  const users = getFromStorage<User>(STORAGE_KEYS.USERS);

  if (users.find((u) => u.email === data.email)) {
    throw {
      error: true,
      message: "Email already registered",
      statusCode: 400,
    } as ApiError;
  }

  const hotelId = `hotel-${Date.now()}`;
  const newUser: User = {
    id: `user-${hotelId}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: "hotel",
    modules: [],
    avatar: data.avatar || "",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);

  const newHotel: Hotel = {
    id: hotelId,
    name: data.name,
    description: data.description,
    country: data.country,
    state: data.state,
    city: data.city,
    logo: data.avatar || "",
    stars: data.stars,
    score: 0,
    gallery: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: data.email,
    password: data.password,
  };

  hotels.push(newHotel);
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  const { password, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    hotel: newHotel,
  };
};
export const getHotelsForAdmin = async (): Promise<
  Array<Hotel & { email?: string; password?: string; userId?: string }>
> => {
  await simulateNetworkDelay();

  const currentUser = await getCurrentUser();
  if (currentUser.role !== "admin") {
    throw {
      error: true,
      message: "Unauthorized - Admin only",
      statusCode: 403,
    } as ApiError;
  }

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);

  return hotels.map((hotel) => {
    const user = users.find(
      (u) => u.role === "hotel" && u.id === `user-${hotel.id}`
    );

    return {
      ...hotel,
      email: user?.email,
      password: user?.password,
      userId: user?.id,
    };
  });
};

export const updateHotelByAdmin = async (
  id: string,
  hotelData: Partial<Omit<Hotel, "id" | "createdAt" | "updatedAt" | "score">>,
  credentials?: { email?: string; password?: string }
): Promise<Hotel> => {
  await simulateNetworkDelay();

  // Verificar que sea admin
  const currentUser = await getCurrentUser();
  if (currentUser.role !== "admin") {
    throw {
      error: true,
      message: "Unauthorized - Admin only",
      statusCode: 403,
    } as ApiError;
  }

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotelIndex = hotels.findIndex((h) => h.id === id);

  if (hotelIndex === -1) {
    throw {
      error: true,
      message: "Hotel not found",
      statusCode: 404,
    } as ApiError;
  }

  const existingHotel = hotels[hotelIndex];

  // Recalcular score (si cambian estrellas)
  const newStars = hotelData.stars ?? existingHotel.stars;
  const newScore = calculateHotelScore(id, newStars);

  const updatedHotel: Hotel = {
    ...existingHotel,
    ...hotelData,
    score: newScore,
    updatedAt: new Date().toISOString(),
  };

  hotels[hotelIndex] = updatedHotel;
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  if (credentials && (credentials.email || credentials.password)) {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);

    // Buscar usuario asociado usando la convención: user id = `user-${hotel.id}`
    let userIndex = users.findIndex(
      (u) => u.role === "hotel" && u.id === `user-${existingHotel.id}`
    );

    if (userIndex === -1) {
      console.warn(
        `No se encontró usuario hotel asociado a hotel id=${id}. No se actualizaron credenciales.`
      );
    } else {
      users[userIndex] = {
        ...users[userIndex],
        email: credentials.email ?? users[userIndex].email,
        password: credentials.password ?? users[userIndex].password,
      };
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
  }

  // Obtener el hotel actualizado con credenciales actuales
  const updatedUsers = getFromStorage<User>(STORAGE_KEYS.USERS);
  const associatedUser = updatedUsers.find(
    (u) => u.role === "hotel" && u.id === `user-${existingHotel.id}`
  );

  return {
    ...updatedHotel,
    ...(associatedUser && {
      email: associatedUser.email,
      password: associatedUser.password,
      userId: associatedUser.id,
    }),
  };
};

//Elimina hotel y usuario asociado (Admin only)

export const deleteHotelByAdmin = async (
  id: string
): Promise<{ message: string }> => {
  await simulateNetworkDelay();

  // Verificar que sea admin
  const currentUser = await getCurrentUser();
  if (currentUser.role !== "admin") {
    throw {
      error: true,
      message: "Unauthorized - Admin only",
      statusCode: 403,
    } as ApiError;
  }

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotelIndex = hotels.findIndex((h) => h.id === id);

  if (hotelIndex === -1) {
    throw {
      error: true,
      message: "Hotel not found",
      statusCode: 404,
    } as ApiError;
  }

  const [removedHotel] = hotels.splice(hotelIndex, 1);
  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  // Eliminar usuario asociado (convención: user id = `user-${hotel.id}`)
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  const userIndex = users.findIndex(
    (u) => u.role === "hotel" && u.id === `user-${removedHotel.id}`
  );

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    saveToStorage(STORAGE_KEYS.USERS, users);
  } else {
    console.warn(
      `No se encontró usuario asociado para hotel id=${removedHotel.id}.`
    );
  }

  // (Opcional pero coherente) Eliminar habitaciones asociadas al hotel
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);
  const remainingRooms = rooms.filter((r) => r.hotelId !== removedHotel.id);
  if (remainingRooms.length !== rooms.length) {
    saveToStorage(STORAGE_KEYS.ROOMS, remainingRooms);
  }

  return { message: "Hotel and associated user deleted successfully" };
};

/**
 * GET /api/hotels
 */
export const getHotels = async (): Promise<
  Array<Hotel & { totalRooms: number }>
> => {
  await simulateNetworkDelay();

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);

  return hotels.map((hotel) => {
    const total = rooms
      .filter((r) => r.hotelId === hotel.id)
      .reduce((sum, r) => sum + (Number(r.available) || 0), 0);

    return {
      ...hotel,
      totalRooms: total,
    };
  });
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

export const getHotelGallery = async (id: string): Promise<string[]> => {
  await simulateNetworkDelay();

  const hotel = await getHotelById(id);

  return hotel.gallery || [];
};

export const updateHotelGallery = async (
  id: string,
  gallery: string[]
): Promise<Hotel> => {
  await simulateNetworkDelay();

  // Requiere autenticación
  await getCurrentUser();

  if (!Array.isArray(gallery)) {
    throw {
      error: true,
      message: "Gallery must be an array of strings",
      statusCode: 400,
    } as ApiError;
  }

  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const index = hotels.findIndex((h) => h.id === id);

  if (index === -1) {
    throw {
      error: true,
      message: "Hotel not found",
      statusCode: 404,
    } as ApiError;
  }

  // Sanitizar: aceptar solo strings no vacías
  const sanitized = gallery
    .filter((g) => typeof g === "string")
    .map((g) => g.trim())
    .filter((g) => g.length > 0);

  hotels[index] = {
    ...hotels[index],
    gallery: sanitized,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.HOTELS, hotels);

  return hotels[index];
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
const sanitizeAmenities = (amenities: string[] | undefined): string[] => {
  if (!amenities || amenities.length === 0) return [];
  return amenities
    .map((a) => a.trim())
    .filter((a) => ROOM_AMENITIES_SET.has(a));
};
const deriveCapacityFromType = (type: RoomType): number => {
  const capacity = CAPACITY_BY_TYPE[type];
  if (!capacity) {
    throw {
      error: true,
      message: `Invalid room type '${type}'. Allowed: ${ROOM_TYPES.join(", ")}`,
      statusCode: 400,
    } as ApiError;
  }
  return capacity;
};
const validateRoomCore = (
  partial: Partial<Room>,
  mode: "create" | "update"
) => {
  if (mode === "create") {
    if (!partial.name || partial.name.trim().length === 0) {
      throw {
        error: true,
        message: "Room name is required",
        statusCode: 400,
      } as ApiError;
    }
    if (!partial.type) {
      throw {
        error: true,
        message: "Room type is required",
        statusCode: 400,
      } as ApiError;
    }
    if (partial.available === undefined) {
      throw {
        error: true,
        message: "Available quantity is required",
        statusCode: 400,
      } as ApiError;
    }
    if (partial.price === undefined) {
      throw {
        error: true,
        message: "Room price is required",
        statusCode: 400,
      } as ApiError;
    }
  }

  if (partial.type && !ROOM_TYPES.includes(partial.type)) {
    throw {
      error: true,
      message: `Invalid room type '${partial.type}'. Allowed: ${ROOM_TYPES.join(
        ", "
      )}`,
      statusCode: 400,
    } as ApiError;
  }

  if (partial.available !== undefined && partial.available < 1) {
    throw {
      error: true,
      message: "Available must be at least 1",
      statusCode: 400,
    } as ApiError;
  }

  if (partial.price !== undefined && partial.price <= 0) {
    throw {
      error: true,
      message: "Price must be greater than 0",
      statusCode: 400,
    } as ApiError;
  }
};

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
  roomData: Omit<
    Room,
    "id" | "hotelId" | "createdAt" | "updatedAt" | "capacity"
  >
): Promise<Room> => {
  await simulateNetworkDelay();
  await getCurrentUser();

  // Verificar hotel existe
  await getHotelById(hotelId);

  validateRoomCore(roomData as Partial<Room>, "create");

  const capacity = deriveCapacityFromType(roomData.type);

  const sanitizedAmenities = sanitizeAmenities(roomData.amenities);

  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);

  const newRoom: Room = {
    ...roomData,
    id: `room-${Date.now()}`,
    hotelId,
    capacity,
    amenities: sanitizedAmenities,
    images: roomData.images || [],
    description: roomData.description || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  rooms.push(newRoom);
  saveToStorage(STORAGE_KEYS.ROOMS, rooms);

  // Recalcular score del hotel (usa amenities y available en cálculo)
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
  roomData: Partial<
    Omit<
      Room,
      "id" | "hotelId" | "createdAt" | "updatedAt" | "capacity" // capacity se recalcula, no se recibe
    >
  >
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

  validateRoomCore(roomData as Partial<Room>, "update");

  const existing = rooms[index];

  // Derivar capacity si cambia type, de lo contrario mantener el actual
  const nextType: RoomType = roomData.type ?? existing.type;
  const nextCapacity =
    nextType !== existing.type
      ? deriveCapacityFromType(nextType)
      : existing.capacity;

  const nextAmenities = roomData.amenities
    ? sanitizeAmenities(roomData.amenities)
    : existing.amenities;

  const updatedRoom: Room = {
    ...existing,
    ...roomData,
    type: nextType,
    capacity: nextCapacity,
    amenities: nextAmenities,
    images: roomData.images ?? existing.images,
    description: roomData.description ?? existing.description,
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
  const totalRooms = rooms.reduce(
    (sum, room) => sum + Number(room.available ?? 0),
    0
  );

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

export const seedDatabase = (): void => {
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  const hotels = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS);

  const hasAdmin = users.some((u) => u.role === "admin");
  if (!hasAdmin) {
    const adminUser: User = {
      id: "user-admin",
      name: "Fabio fruto",
      email: "admin@vaova.com",
      password: "admin123",
      role: "admin",
      modules: [],
      createdAt: new Date().toISOString(),
    };
    users.push(adminUser);
    console.log("Admin user created: admin@vaova.com / admin123");
  }

  let hotelUser = users.find((u) => u.role === "hotel");
  const hotelId = `hotel-${Date.now()}`;
  if (!hotelUser) {
    hotelUser = {
      id: `user-${hotelId}`,
      name: "Demo Hotel Owner",
      email: "hotel@vaova.com",
      password: "hotel123",
      role: "hotel",
      modules: [],
      avatar: logohoteldefect,
      createdAt: new Date().toISOString(),
    };
    users.push(hotelUser);
    console.log("Hotel user created: hotel@vaova.com / hotel123");
  }

  saveToStorage(STORAGE_KEYS.USERS, users);

  let targetHotel: Hotel | undefined =
    hotels.length > 0 ? hotels[0] : undefined;
  if (!targetHotel) {
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
    saveToStorage(STORAGE_KEYS.HOTELS, hotels);
    console.log(
      `Hotel por defecto creado: ${targetHotel.name} (${targetHotel.id})`
    );
  }

  const existingRoomsForHotel = rooms.filter(
    (r) => r.hotelId === targetHotel!.id
  );
  if (existingRoomsForHotel.length === 0) {
    // Nueva estructura de room con type y capacity derivada
    const demoType: RoomType = "twin";
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      hotelId: targetHotel!.id,
      name: "Habitación Estándar",
      type: demoType,
      capacity: deriveCapacityFromType(demoType),
      price: 120,
      available: 5,
      description: "Habitación de ejemplo creada por seedDatabase",
      images: [],
      amenities: ["Wifi", "Aire Acondicionado"].filter((a) =>
        ROOM_AMENITIES_SET.has(a)
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    rooms.push(newRoom);
    saveToStorage(STORAGE_KEYS.ROOMS, rooms);
    console.log(
      `Room por defecto creada: ${newRoom.id} para hotel ${targetHotel!.id}`
    );
  }

  const hotelsAfter = getFromStorage<Hotel>(STORAGE_KEYS.HOTELS);
  const hotelIndex = hotelsAfter.findIndex((h) => h.id === targetHotel!.id);
  if (hotelIndex !== -1) {
    const computedScore = calculateHotelScore(
      targetHotel!.id,
      hotelsAfter[hotelIndex].stars
    );
    hotelsAfter[hotelIndex] = {
      ...hotelsAfter[hotelIndex],
      score: computedScore,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.HOTELS, hotelsAfter);
    console.log(
      `Score recalculado para hotel ${targetHotel!.id}: ${computedScore}`
    );
  }

  console.log(
    "seedDatabase: datos iniciales garantizados (admin, hotel user, hotel y room)."
  );
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.HOTELS);
  localStorage.removeItem(STORAGE_KEYS.ROOMS);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  console.log("🗑️ All data cleared");
};
