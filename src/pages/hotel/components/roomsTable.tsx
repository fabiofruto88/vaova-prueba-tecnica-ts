import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Chip,
  Typography,
  Avatar,
} from "@mui/material";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Room } from "../../../types/auth.types";

interface RoomsTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

const RoomsTable: React.FC<RoomsTableProps> = ({ rooms, onEdit, onDelete }) => {
  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single: "Single",
      twin: "Twin",
      queen: "Queen",
    };
    return labels[type] || type;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (rooms.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No hay habitaciones registradas
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Crea tu primera habitación para comenzar
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Habitación</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Tipo</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Capacidad</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Precio/Noche</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Disponibles</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Estado</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2">Acciones</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.id}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
                transition: "background-color 0.2s",
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={room.images[0] || ""}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  >
                    {room.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {room.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {room.amenities.slice(0, 2).join(", ")}
                      {room.amenities.length > 2 &&
                        ` +${room.amenities.length - 2}`}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  label={getRoomTypeLabel(room.type)}
                  size="small"
                  color={
                    room.type === "queen"
                      ? "primary"
                      : room.type === "twin"
                      ? "secondary"
                      : "default"
                  }
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {room.capacity} {room.capacity === 1 ? "persona" : "personas"}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {formatPrice(room.price)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={room.available > 0 ? "success.main" : "error.main"}
                >
                  {room.available}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={room.available > 0 ? "Disponible" : "Agotado"}
                  size="small"
                  color={room.available > 0 ? "success" : "error"}
                  sx={{ fontWeight: "medium" }}
                  variant="outlined"
                />
              </TableCell>

              <TableCell align="center">
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(room)}
                    sx={{
                      "&:hover": {
                        bgcolor: "primary.lighter",
                      },
                    }}
                  >
                    <PencilIcon width={20} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(room.id)}
                    sx={{
                      "&:hover": {
                        bgcolor: "error.lighter",
                      },
                    }}
                  >
                    <TrashIcon width={20} />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoomsTable;
