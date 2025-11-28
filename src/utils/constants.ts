export const STORAGE_KEYS = {
  USERS: "users",
  HOTELS: "hotels",
  SESSION: "session",
} as const;

export const TOKEN_SECRET = "vaova-secret-key-2025";
export const TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
