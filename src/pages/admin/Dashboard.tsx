/* import { useNavigate } from "react-router-dom"; */
import { Box, Typography, Grid, Container } from "@mui/material";
/* import { useTheme } from "@mui/material/styles"; */
import {
  getDashboardData,
  formatRevenue,
  getScoreColor,
  type DashboardData,
} from "../../utils/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import StatCard from "../../components/cardStats";
import Loading from "../../components/loanding";
import { Hotel } from "@mui/icons-material";

export default function Dashboard() {
  const { user } = useAuth();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  /*   const theme = useTheme(); */
  const loadData = async () => {
    try {
      setLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = {
    totalHotels: data?.totalHotels,
    activeHotels: data?.activeHotels,
    totalRooms: data?.totalRooms,
    occupancy: data?.averageOccupancy,
    revenue: formatRevenue(data?.monthlyRevenue || 0),
    growth: data?.revenueGrowth,
  };

  // Top hoteles
  const topHotels = data?.topHotels.map((item) => ({
    rank: item.rank,
    name: item.hotel.name,
    location: `${item.hotel.city}, ${item.hotel.country}`,
    rating: item.rating,
    score: item.scorePercentage,
    scoreColor: getScoreColor(item.scorePercentage),
    logo: item.hotel.logo,
  }));

  // Distribución por país
  const countries = data?.hotelsByCountry.map((item) => ({
    name: item.country,
    count: item.count,
    percentage: item.percentage,
    label: `${item.count} hoteles`,
  }));

  // Distribución por estrellas
  const stars = {
    three: data?.hotelsByStars["3"],
    four: data?.hotelsByStars["4"],
    five: data?.hotelsByStars["5"],
  };

  console.log("📊 STATS:", stats);
  console.log("🏆 TOP HOTELS:", topHotels);
  console.log("🌎 COUNTRIES:", countries);
  console.log("⭐ STARS:", stars);
  return (
    <Container sx={{ p: 1 }} maxWidth="xl">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <div>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido, {user?.name}
          </Typography>
        </div>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
          <StatCard
            title="Total Hoteles"
            value={stats?.totalHotels || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
          <StatCard
            title="Total Habitaciones"
            value={stats?.totalRooms || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
          <StatCard
            title="Ocupación Promedio  (%)"
            value={stats?.occupancy || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
          <StatCard
            title="Ingreso promedio"
            value={stats?.revenue || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
      </Grid>

      <Loading open={loading} />
    </Container>
  );
}
