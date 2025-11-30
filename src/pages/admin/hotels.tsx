import React, { useEffect, useState } from "react";
import type { Hotel } from "../../types/auth.types";
import { getHotels, updateHotel } from "../../lib/simulatedEndpoints";
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
} from "@mui/material";
import { StarIcon } from "@heroicons/react/24/solid";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditHotelModal from "../../components/EditHotelModal";
import Loading from "../../components/loanding";
import useNotification from "../../hooks/useNotification";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { showNotification, notification, handleAutoClose } = useNotification();

  const fetchHotels = async () => {
    setLoading(true);

    try {
      const data = await getHotels();
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

  /* const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar hotel? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    try {
      await deleteHotel(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert("Error al eliminar hotel");
    }
  }; */
  const editHotel = async (id: string, data: Partial<Hotel>) => {
    try {
      setLoading(true);
      const updated = await updateHotel(id, data);
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
            {hotels &&
              hotels.length > 0 &&
              hotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                      <IconButton size="small" color="error">
                        <TrashIcon color="" width="20" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Loading open={loading} />
      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
      <EditHotelModal
        open={selectedHotel}
        onClose={() => setSelectedHotel(null)}
        onEdit={editHotel}
      />
    </>
  );
};

export default Hotels;
