import type { Room } from "../types/auth.types";
import { STORAGE_KEYS } from "./constants";
import { getFromStorage } from "./localStorage";

/**
 * Calcula el score del hotel basado en:
 * - Número de habitaciones (40%)
 * - Estrellas (30%)
 * - Amenidades promedio (30%)
 */
export const calculateHotelScore = (hotelId: string, stars: number): number => {
  const rooms = getFromStorage<Room>(STORAGE_KEYS.ROOMS).filter(
    (r) => r.hotelId === hotelId
  );

  // 1. Score por cantidad de habitaciones (0-40 puntos)
  const totalRooms = rooms.reduce((sum, room) => sum + room.available, 0);
  const roomScore = Math.min((totalRooms / 50) * 40, 40); // Max 50 habitaciones = 40 puntos

  // 2. Score por estrellas (0-30 puntos)
  const starScore = (stars / 5) * 30;

  // 3. Score por amenidades promedio (0-30 puntos)
  const avgAmenities =
    rooms.length > 0
      ? rooms.reduce((sum, room) => sum + room.amenities.length, 0) /
        rooms.length
      : 0;
  const amenityScore = Math.min((avgAmenities / 10) * 30, 30); // Max 10 amenidades = 30 puntos

  // Score total (0-100)
  return Math.round(roomScore + starScore + amenityScore);
};
