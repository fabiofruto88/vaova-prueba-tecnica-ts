export const STORAGE_KEYS = {
  USERS: "users",
  HOTELS: "hotels",
  ROOMS: "rooms",
  SESSION: "session",
} as const;

export const TOKEN_SECRET = "vaova-secret-key-2025";
export const TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

export const CAPACITY_BY_TYPE = {
  single: 1,
  twin: 2,
  queen: 2,
};

export const ROOM_TYPES = Object.freeze(["single", "twin", "queen"] as const);

export type RoomType = (typeof ROOM_TYPES)[number];

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

export const ROOM_AMENITIES_SET = new Set<string>(ROOM_AMENITIES);
