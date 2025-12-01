import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { Person, Check } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { Room } from "../types/auth.types";
import { capitalizeName } from "../utils/generals";

interface RoomTypeCardProps {
  room: Room;
  index?: number;
}

export default function RoomTypeCard({ room, index = 0 }: RoomTypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.1)" },
        }}
      >
        <CardMedia
          component="img"
          image={room.images[0]}
          alt={room.name}
          sx={{
            width: { xs: "100%", sm: 280 },
            height: { xs: 180, sm: "auto" },
            objectFit: "cover",
          }}
        />

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {capitalizeName(room.name)}
              </Typography>
              <Chip
                size="small"
                label={
                  room.available > 0
                    ? `${room.available} disponibles`
                    : "Agotado"
                }
                color={room.available > 0 ? "success" : "error"}
                variant="outlined"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {room.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Person fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Hasta {room.capacity}{" "}
                {room.capacity === 1 ? "persona" : "personas"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {room.amenities.slice(0, 4).map((amenity) => (
                <Chip
                  key={amenity}
                  icon={<Check sx={{ fontSize: 14 }} />}
                  label={amenity}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: "divider" }}
                />
              ))}
              {room.amenities.length > 4 && (
                <Chip
                  label={`+${room.amenities.length - 4} más`}
                  size="small"
                  sx={{ bgcolor: "action.hover" }}
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                ${room.price.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                por noche
              </Typography>
            </Box>
            <Button
              variant="contained"
              disabled={room.available === 0}
              sx={{
                px: 3,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Reservar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
