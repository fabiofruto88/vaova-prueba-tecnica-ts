import React, { useEffect, useState } from "react";
import type { Hotel } from "../../types/auth.types";
import {
  createHotelWithAccount,
  deleteHotelByAdmin,
  getHotelsForAdmin,
  updateHotelByAdmin,
} from "../../lib/simulatedEndpoints";
import {
  TableContainer,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Chip,
  TableHead,
  IconButton,
  Container,
  useTheme,
  Button,
} from "@mui/material";
import { StarIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditHotelModal from "../../components/EditHotelModal";
import Loading from "../../components/loanding";
import useNotification from "../../hooks/useNotification";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import { useAuth } from "../../context/AuthContext";
import type { CreateHotelFormData, ModalConfig } from "../../types/common";
import AlertModal from "../../components/alertModal";
import CreateHotelModal from "./components/admincreateHotelModal";

const Hotels: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { showNotification, notification, handleAutoClose } = useNotification();
  const [infoModal, setInfoModal] = useState<ModalConfig>({
    open: false,
    type: "info",
    title: "",
    description: "",
    cancelText: "Cancelar",
    confirmText: "Confirmar",
  });
  const [createHotelModalOpen, setCreateHotelModalOpen] =
    useState<boolean>(false);
  const closeModal = () => {
    setInfoModal((prev) => ({ ...prev, open: false }));
  };

  const fetchHotels = async () => {
    setLoading(true);

    try {
      const data = await getHotelsForAdmin();
      console.log(data);
      setHotels(data);
    } catch (err) {
      showNotification("Error al cargar hoteles", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteHotelByAdmin(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
      showNotification("Hotel eliminado correctamente", "success", 2000);
    } catch (err) {
      showNotification("Error al eliminar hotel", "error", 2000);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateHotel = async (data: CreateHotelFormData) => {
    try {
      setLoading(true);
      const newHotel = await createHotelWithAccount(data);
      console.log(newHotel);
      setHotels((prev) => [...prev, newHotel.hotel]);
      showNotification("Hotel creado correctamente", "success", 2000);
    } catch (err) {
      console.error("Error creating hotel:\n", err);
      showNotification("Error al crear el hotel", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const editHotel = async (
    id: string,
    data: Partial<Omit<Hotel, "id" | "createdAt" | "updatedAt" | "score">>,
    credentials?: { email?: string; password?: string }
  ) => {
    try {
      setLoading(true);
      const updated = await updateHotelByAdmin(id, data, credentials);
      console.log("updated", updated);
      setHotels((prev) =>
        prev.map((hotel) => (hotel.id === id ? updated : hotel))
      );
      showNotification("Hotel actualizado correctamente", "success", 2000);
    } catch (err) {
      console.error("Error updating hotel:\n", err);
      showNotification("Error al actualizar el hotel", "error", 3000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container sx={{ p: 1, minHeight: "100dvh" }} maxWidth="xl">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <div>
            <Typography variant="h4">Panel de Hoteles</Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenido, {user?.name}
            </Typography>
          </div>
          <Box>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setCreateHotelModalOpen(true)}
            >
              <ArrowUpCircleIcon
                color={theme.palette.primary.main}
                width={25}
              />
              <Typography variant="button" ml={1}>
                Crear Hotel
              </Typography>
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hotels && hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                          }}
                          src={hotel?.logo}
                        />

                        <Typography variant="body1" fontWeight={500}>
                          {hotel?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {hotel?.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {hotel?.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{hotel?.score} </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <StarIcon
                          style={{ color: "rgb(250, 204, 21)", width: 20 }}
                        />
                        <Typography variant="body1" fontWeight={500}>
                          {hotel?.stars}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Activo"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {}}
                        >
                          <EyeIcon color="" width="20" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedHotel(hotel);
                          }}
                        >
                          <PencilIcon color="" width="20" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setInfoModal({
                              open: true,
                              type: "danger",
                              title: "Eliminar hotel",
                              description:
                                "¿Estás seguro de eliminar este hotel? También se eliminaría el usuario relacionado. esta acción no se puede deshacer.",
                              cancelText: "Cancelar",
                              confirmText: "Eliminar",
                              onConfirm: () => {
                                handleDelete(hotel.id);
                                closeModal();
                              },
                            });
                          }}
                        >
                          <TrashIcon color="" width="20" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" fontWeight={500}>
                      No hay hoteles disponibles.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Loading open={loading} />
      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
      <EditHotelModal
        open={selectedHotel}
        onClose={() => setSelectedHotel(null)}
        onEdit={editHotel}
        role={user?.role || "hotel"}
      />
      <CreateHotelModal
        open={createHotelModalOpen}
        onClose={() => setCreateHotelModalOpen(false)}
        onCreate={handleCreateHotel}
      />
      <AlertModal
        open={infoModal.open}
        type={infoModal.type}
        title={infoModal.title}
        description={infoModal.description}
        onCancel={closeModal}
        onConfirm={infoModal.onConfirm}
        cancelText={infoModal.cancelText}
        confirmText={infoModal.confirmText}
      />
    </>
  );
};

export default Hotels;
