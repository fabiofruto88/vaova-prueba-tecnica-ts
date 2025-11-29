import { getAdminStats, getHotels } from "../lib/simulatedEndpoints";
import type { Hotel } from "../types/auth.types";

export interface DashboardData {
  // Estadísticas principales
  totalHotels: number;
  activeHotels: number;
  totalRooms: number;
  averageOccupancy: number;
  monthlyRevenue: number;
  revenueGrowth: string;

  // Top hoteles por score
  topHotels: Array<{
    rank: number;
    hotel: Hotel;
    rating: number;
    scorePercentage: number;
  }>;

  // Distribución por país
  hotelsByCountry: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;

  // Distribución por estrellas
  hotelsByStars: {
    "3": number;
    "4": number;
    "5": number;
  };
}

/**
 * Obtiene todos los datos del dashboard
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  // 1. Obtener estadísticas generales
  const stats = await getAdminStats();

  // 2. Obtener todos los hoteles
  const hotels = await getHotels();

  // 3. Calcular hoteles activos (los que tienen score > 0)
  const activeHotels = hotels.filter((h) => h.score >= 0).length;

  // 4. Calcular ocupación promedio (simulado - en producción vendría de reservas)
  const averageOccupancy = 76;

  // 5. Calcular ingresos mensuales (simulado)
  const monthlyRevenue = 2450000;

  // 6. Crecimiento vs mes anterior (simulado)
  const revenueGrowth = "+18%";

  // 7. Top 5 hoteles por score
  const topHotels = calculateTopHotels(hotels);

  // 8. Distribución por país
  const hotelsByCountry = calculateHotelsByCountry(hotels);

  return {
    totalHotels: stats.totalHotels,
    activeHotels,
    totalRooms: stats.totalRooms,
    averageOccupancy,
    monthlyRevenue,
    revenueGrowth,
    topHotels,
    hotelsByCountry,
    hotelsByStars: stats.hotelsByStars,
  };
};

/**
 * Calcula el top 5 de hoteles por score
 */
export const calculateTopHotels = (hotels: Hotel[]) => {
  return hotels
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((hotel, index) => ({
      rank: index + 1,
      hotel,
      rating: parseFloat((hotel.score / 20).toFixed(1)), // 0-100 a 0-5
      scorePercentage: hotel.score,
    }));
};

/**
 * Calcula distribución de hoteles por país
 */
export const calculateHotelsByCountry = (hotels: Hotel[]) => {
  const countryCount = hotels.reduce((acc, hotel) => {
    acc[hotel.country] = (acc[hotel.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(countryCount)
    .map(([country, count]) => ({
      country,
      count,
      percentage: Math.round((count / hotels.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Formatea el revenue a string con símbolo
 */
export const formatRevenue = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

/**
 * Obtiene el color según el score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return "#10b981"; // Verde
  if (score >= 80) return "#3b82f6"; // Azul
  if (score >= 70) return "#f59e0b"; // Amarillo
  if (score >= 60) return "#ef4444"; // Rojo
  return "#6b7280"; // Gris
};

/**
 * Calcula el porcentaje de cambio vs mes anterior (simulado)
 */
export const calculateGrowthPercentage = (
  current: number,
  previous: number
): string => {
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}%`;
};
