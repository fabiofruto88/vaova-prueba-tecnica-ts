import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Room } from "../../types/auth.types";
import useNotification from "../../hooks/useNotification";
import Loading from "../../components/loanding";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import {
  createRoom,
  getRoomsByHotel,
  deleteRoom,
  updateRoom,
} from "../../lib/simulatedEndpoints";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import type { CreateRoomFormData } from "../../types/common";
import CreateRoomModal from "../../components/CreateRoomModal";
import AlertModal from "../../components/alertModal";
import RoomsTable from "./components/roomsTable";
import EditRoomModal from "./components/editRoomModal";

interface ModalConfig {
  open: boolean;
  type: "info" | "warning" | "danger" | "success";
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  onConfirm?: () => void;
}

const MyRooms: React.FC = () => {
  const { showNotification, notification, handleAutoClose } = useNotification();
  const { user } = useAuth();
  const theme = useTheme();

  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [userId, setUserId] = useState<string>(user ? user.id : "");
  const [loading, setLoading] = useState(true);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [infoModal, setInfoModal] = useState<ModalConfig>({
    open: false,
    type: "info",
    title: "",
    description: "",
    cancelText: "Cancelar",
    confirmText: "Confirmar",
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (!user) {
        setRooms([]);
        return;
      }

      let hotelId = user.id;
      if (hotelId.startsWith("user-")) {
        hotelId = hotelId.replace(/^user-/, "");
      }
      setUserId(hotelId);

      const fetched = await getRoomsByHotel(hotelId);
      console.log(fetched);
      setRooms(fetched);
    } catch (err: any) {
      showNotification(err.message, "error", 3000);
      console.error("Error loading:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (data: CreateRoomFormData) => {
    try {
      setLoading(true);

      const newRoom = await createRoom(userId, data);
      console.log(newRoom);
      setRooms((prev) => (prev ? [newRoom, ...prev] : [newRoom]));
      showNotification("Habitación creada correctamente", "success", 2000);
      setCreateRoomModalOpen(false);
    } catch (err) {
      console.error("Error creating room:\n", err);
      showNotification("Error al crear la habitación", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteRoom(id);
      setRooms((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
      showNotification("Habitación eliminada correctamente", "success", 2000);
    } catch (err) {
      showNotification("Error al eliminar habitación", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleEditSubmit = async (
    id: string,
    data: Partial<CreateRoomFormData>
  ): Promise<void> => {
    try {
      setLoading(true);
      const updated = await updateRoom(id, data);
      setRooms((prev) =>
        prev ? prev.map((r) => (r.id === id ? updated : r)) : prev
      );
      showNotification("Habitación actualizada correctamente", "success", 2000);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Error editing room:\n", err);
      showNotification("Error al editar la habitación", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (roomId: string) => {
    setInfoModal({
      open: true,
      type: "danger",
      title: "Eliminar habitación",
      description:
        "¿Estás seguro de eliminar esta habitación? Esta acción no se puede deshacer.",
      cancelText: "Cancelar",
      confirmText: "Eliminar",
      onConfirm: () => {
        handleDelete(roomId);
        closeModal();
      },
    });
  };

  const closeModal = () => {
    setInfoModal({
      open: false,
      type: "info",
      title: "",
      description: "",
      cancelText: "Cancelar",
      confirmText: "Confirmar",
    });
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
            <Typography variant="h4">Panel de Habitaciones</Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenido, {user?.name}
            </Typography>
          </div>
          <Box>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setCreateRoomModalOpen(true)}
            >
              <ArrowUpCircleIcon
                color={theme.palette.primary.main}
                width={25}
              />
              <Typography variant="button" ml={1}>
                Crear Habitación
              </Typography>
            </Button>
          </Box>
        </Box>

        {/* Tabla de habitaciones */}
        {rooms && (
          <RoomsTable
            rooms={rooms}
            onEdit={handleEditRoom}
            onDelete={handleDeleteClick}
          />
        )}
      </Container>

      <Loading open={loading} />
      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
      <CreateRoomModal
        open={createRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        onCreate={handleCreateRoom}
      />
      <EditRoomModal
        open={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onEdit={handleEditSubmit}
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

export default MyRooms;
