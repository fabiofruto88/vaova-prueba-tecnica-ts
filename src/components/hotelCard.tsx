import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import { LocationOn, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { logohoteldefect } from "../utils/logoDefault";

interface Hotel {
  id: string | number;
  name: string;
  city: string;
  country: string;
  image: string;
  description: string;
  score: number;
  totalRooms: number;
  gallery: string[];
  logo: string;
}

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height={200}
            image={hotel?.gallery[0] || hotel?.logo || logohoteldefect}
            alt={hotel.name}
            sx={{ objectFit: "cover" }}
          />
          <Chip
            icon={<Star sx={{ fontSize: 16, color: "#ffc107 !important" }} />}
            label={hotel.score.toFixed(1)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(255,255,255,0.95)",
              fontWeight: 600,
              backdropFilter: "blur(4px)",
            }}
          />
        </Box>
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2.5 }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {hotel.name}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}
          >
            <LocationOn sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {hotel.city}, {hotel.country}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {hotel.description}
          </Typography>
          <Box sx={{ mt: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating
                value={hotel.score}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="caption" color="text.secondary">
                ({hotel.totalRooms} habitaciones)
              </Typography>
            </Box>
            <Button
              component={Link}
              to={`/hotel/${hotel.id}`}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Ver Detalles
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
