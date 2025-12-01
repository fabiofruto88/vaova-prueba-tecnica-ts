import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Grid,
  Link as MuiLink,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { getHotelWithRooms } from "../../lib/simulatedEndpoints";
import Loading from "../../components/loanding";
import { LocationOn, NavigateNext, Star } from "@mui/icons-material";
import ImageGallery from "../../components/image-gallery";
import { motion } from "framer-motion";
import RoomTypeCard from "../../components/room-type-card";
import { capitalizeName } from "../../utils/generals";

const HotelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("ID from useParams:", id);

    if (!id) {
      console.error("No se encontró el ID del hotel en la URL");
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const data = await getHotelWithRooms(id);
        console.log("Hotel data:", data);
        setHotel(data);
      } catch (err) {
        console.error("Error cargando hotel:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Si no hay hotel y no está cargando, mostrar mensaje
  if (!loading && !hotel) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          No se pudo cargar el hotel. {!id ? "ID no encontrado en la URL." : ""}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4, bgcolor: "background.paper" }}>
        {hotel && (
          <>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ mb: 3 }}
            >
              <MuiLink
                component={Link}
                to="/"
                underline="hover"
                color="text.secondary"
              >
                Inicio
              </MuiLink>
              <MuiLink
                component={Link}
                to="/#hotels"
                underline="hover"
                color="text.secondary"
              >
                Hoteles
              </MuiLink>
              <Typography color="text.primary">
                {capitalizeName(hotel?.name)}
              </Typography>
            </Breadcrumbs>
            <ImageGallery images={hotel?.gallery} mainImage={hotel?.logo} />
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "center", sm: "flex-start" },
                      textAlign: { xs: "center", sm: "left" },
                      gap: { xs: 2, sm: 3 },
                      mb: 4,
                    }}
                  >
                    <Avatar
                      src={hotel?.logo}
                      sx={{
                        width: { xs: 100, sm: 80 },
                        height: { xs: 100, sm: 80 },
                        border: 2,
                        borderColor: "divider",
                      }}
                    />
                    <Box sx={{ flex: 1, width: "100%" }}>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                          fontSize: {
                            xs: "1.5rem",
                            sm: "1.75rem",
                            md: "2.125rem",
                          },
                        }}
                      >
                        {capitalizeName(hotel?.name)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: { xs: "center", sm: "flex-start" },
                          gap: { xs: 1, sm: 2 },
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: { xs: 18, sm: 20 },
                              color: "text.secondary",
                            }}
                          />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                          >
                            {hotel?.city}, {hotel?.state}, {hotel?.country}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Rating
                            value={hotel?.score}
                            precision={0.1}
                            size="small"
                            readOnly
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Acerca del Hotel
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {hotel?.description}
                    </Typography>
                  </Paper>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Tipos de Habitación
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Elige la habitación perfecta para tu estadía
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {hotel?.rooms?.length > 0 &&
                        hotel.rooms.map((room: any, index: number) => (
                          <RoomTypeCard
                            key={room.id}
                            room={room}
                            index={index}
                          />
                        ))}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      position: { lg: "sticky" },
                      top: { lg: 100 },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Información del Hotel
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Calificación
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Star sx={{ fontSize: 16, color: "#ffc107" }} />
                          <Typography variant="body2" fontWeight={600}>
                            {hotel?.score?.toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Ubicación
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {hotel?.city}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Precios desde
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="primary.main"
                      >
                        $
                        {hotel?.rooms?.length
                          ? Math.min(
                              ...hotel.rooms.map(
                                (r: any) => Number(r.price) || 0
                              )
                            ).toLocaleString()
                          : "0"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        por noche
                      </Typography>
                    </Box>

                    <Box
                      sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {(() => {
                        const amenities = (hotel?.rooms ?? []).flatMap(
                          (r: any) => r.amenities ?? []
                        );
                        const uniq = amenities
                          .filter(
                            (v: string, i: number, a: string[]) =>
                              a.indexOf(v) === i
                          )
                          .slice(0, 6);
                        return uniq.map((amenity: string) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            size="small"
                            variant="outlined"
                          />
                        ));
                      })()}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      <Loading open={loading} />
    </>
  );
};

export default HotelPage;
