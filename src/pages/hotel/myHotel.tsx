import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { PencilIcon } from "@heroicons/react/24/outline";
import type { Hotel } from "../../types/auth.types";
import useNotification from "../../hooks/useNotification";
import { useAuth } from "../../context/AuthContext";
import { getHotelById, updateHotel } from "../../lib/simulatedEndpoints";
import Loading from "../../components/loanding";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import EditHotelModal from "../../components/EditHotelModal";

const MyHotel: React.FC = () => {
  const { user } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { showNotification, notification, handleAutoClose } = useNotification();

  useEffect(() => {
    loadHotelData();
  }, []);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      const hotelId = user?.id.replace("user-", "") || "";
      const hotelData = await getHotelById(hotelId);

      setHotel(hotelData);
    } catch (err: any) {
      showNotification(
        err.message || "Error al cargar la información del hotel",
        "error",
        3000
      );
      console.error("Error loading hotel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHotel = async (id: string, data: Partial<Hotel>) => {
    try {
      const updated = await updateHotel(id, data);
      setHotel(updated);
      showNotification("Hotel actualizado exitosamente", "success", 2000);
    } catch (err: any) {
      showNotification(
        err.message || "Error al actualizar el hotel",
        "error",
        3000
      );
      console.error("Error updating hotel:", err);
    }
  };

  if (!hotel && !loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          No se encontró información del hotel
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Loading open={loading} />
      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Perfil del Hotel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra la información general de tu hotel
          </Typography>
        </Box>

        {hotel && (
          <Grid container spacing={3}>
            {/* Left Card - Logo y nombre */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 4,
                  }}
                >
                  <Box sx={{ position: "relative", mb: 3 }}>
                    <Avatar
                      src={hotel.logo}
                      sx={{
                        width: 150,
                        height: 150,
                        bgcolor: "#f5e6d3",
                        border: "4px solid",
                        borderColor: "primary.main",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={600}
                    textAlign="center"
                    gutterBottom
                  >
                    {hotel.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {hotel.city}, {hotel.country}
                  </Typography>

                  <Button
                    variant="outlined"
                    startIcon={<PencilIcon style={{ width: 18, height: 18 }} />}
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Editar Información
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Card - Información General */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Información General
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {/* Nombre del Hotel */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        Nombre del Hotel
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {hotel.name}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Ubicación */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.5, display: "block" }}
                        >
                          País
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {hotel.country}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.5, display: "block" }}
                        >
                          Departamento / Estado
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {hotel.state}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.5, display: "block" }}
                        >
                          Ciudad
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {hotel.city}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Descripción */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        Descripción
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {hotel.description}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Calificación */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: "block" }}
                      >
                        Calificación
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {[...Array(5)].map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              fontSize: "1.5rem",
                              color:
                                index < hotel.stars
                                  ? "rgb(250, 204, 21)"
                                  : "rgb(229, 231, 235)",
                            }}
                          >
                            ★
                          </Box>
                        ))}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {hotel.stars}{" "}
                        {hotel.stars === 1 ? "estrella" : "estrellas"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Modal de Edición */}
        {hotel && (
          <EditHotelModal
            open={isEditModalOpen ? hotel : null}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={handleEditHotel}
            role={user?.role || "hotel"}
          />
        )}
      </Box>
    </>
  );
};

export default MyHotel;
