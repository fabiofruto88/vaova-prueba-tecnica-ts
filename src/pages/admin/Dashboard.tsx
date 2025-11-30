/* import { useNavigate } from "react-router-dom"; */
import { Box, Typography, Grid, Container, Card, Stack } from "@mui/material";
import {
  getDashboardData,
  formatRevenue,
  getScoreColor,
} from "../../utils/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import StatCard from "../../components/cardStats";
import Loading from "../../components/loanding";
import { Hotel } from "@mui/icons-material";

import CardTopHotel from "../../components/cardTopHotel";
import ProgressBarItem from "../../components/ProgressBarItem";

interface Thotels {
  rank: number;
  name: string;
  location: string;
  rating: number;
  score: number;
  scoreColor: string;
  logo?: string;
}
export default function Dashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    totalRooms: 0,
    occupancy: 0,
    revenue: formatRevenue(0),
    growth: 0,
  });
  const [topHotels, setTopHotels] = useState<Thotels[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [stars, setStars] = useState({ three: 0, four: 0, five: 0 });
  /*   const theme = useTheme(); */
  const loadData = async () => {
    try {
      setLoading(true);
      const dashboardData = await getDashboardData();

      if (dashboardData) {
        setStats({
          totalHotels: dashboardData.totalHotels ?? 0,
          activeHotels: dashboardData.activeHotels ?? 0,
          totalRooms: dashboardData.totalRooms ?? 0,
          occupancy: dashboardData.averageOccupancy ?? 0,
          revenue: formatRevenue(dashboardData.monthlyRevenue || 0),
          growth: Number(dashboardData.revenueGrowth) || 0,
        });

        setTopHotels(
          (dashboardData.topHotels || []).map((item) => ({
            rank: item.rank,
            name: item.hotel.name,
            location: `${item.hotel.city}, ${item.hotel.country}`,
            rating: item.rating,
            score: item.scorePercentage,
            scoreColor: getScoreColor(item.scorePercentage),
            logo: item?.hotel?.logo,
          }))
        );

        setCountries(
          (dashboardData.hotelsByCountry || []).map((item) => ({
            name: item.country,
            count: item.count,
            percentage: item.percentage,
            label: `${item.count} hoteles`,
          }))
        );

        setStars({
          three: dashboardData.hotelsByStars?.["3"] ?? 0,
          four: dashboardData.hotelsByStars?.["4"] ?? 0,
          five: dashboardData.hotelsByStars?.["5"] ?? 0,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  console.log("📊 STATS:", stats);
  console.log("🏆 TOP HOTELS:", topHotels);
  console.log("🌎 COUNTRIES:", countries);
  console.log("⭐ STARS:", stars);
  return (
    <Container sx={{ p: 1, minHeight: "100dvh" }} maxWidth="xl">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <div>
          <Typography variant="h4">Panel de Administración</Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido, {user?.name}
          </Typography>
        </div>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Total Hoteles"
            value={stats?.totalHotels || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Total Habitaciones"
            value={stats?.totalRooms || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Ocupación Promedio  (%)"
            value={stats?.occupancy || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Ingreso promedio"
            value={stats?.revenue || 0}
            icon={Hotel}
            colorIcon="#1976d2"
            widthIcon={40}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2} my={3}>
            <Typography variant="h6">Hoteles con Mejor Desempeño</Typography>
            {topHotels && topHotels.length > 0 ? (
              topHotels.map((hotel, index) => (
                <CardTopHotel
                  key={index}
                  rank={hotel.rank}
                  logo={hotel.logo}
                  name={hotel.name}
                  location={hotel.location}
                  rating={hotel.rating}
                  score={hotel.score}
                  scoreColor={hotel.scoreColor}
                />
              ))
            ) : (
              <Card sx={{ p: 2, textAlign: "center" }} elevation={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No hay hoteles para mostrar.
                </Typography>
              </Card>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} my={3}>
            <Typography variant="h6">Distribución por País</Typography>
            <Card
              sx={{
                display: "flex",
                flex: 1,
                minWidth: "100%",
                px: 2,
                py: 1.5,
              }}
              elevation={1}
            >
              {countries && countries.length > 0 ? (
                countries.map((country, index) => (
                  <ProgressBarItem
                    key={index}
                    title={country.name}
                    percentage={country.percentage}
                    category={`${country.count} hoteles`}
                    color="#1976d2"
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ p: 2 }}
                >
                  No hay países para mostrar.
                </Typography>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Loading open={loading} />
    </Container>
  );
}
