import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import { getHotels } from "../../lib/simulatedEndpoints";
import useNotification from "../../hooks/useNotification";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import HotelCard from "../../components/hotelCard";
import AnimatedHotel from "../../components/AnimatedHotel";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { showNotification, notification, handleAutoClose } = useNotification();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [hotels, setHotels] = useState<any[]>([]);

  const phrases = [
    "de forma inteligente",
    "con eficiencia",
    "sin complicaciones",
    "en tiempo real",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const fetched = await getHotels();
      console.log(fetched);
      setHotels(fetched);
    } catch (err: any) {
      showNotification(err.message, "error", 3000);
      console.error("Error loading:", err);
    } finally {
    }
  };

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex]);

  const filteredHotels = hotels.filter((hotel) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return String(hotel.name ?? "")
      .toLowerCase()
      .includes(q);
  });

  return (
    <Stack
      sx={{
        minWidth: "100%",
        bgcolor: "background.paper",
        m: "0px !important",
      }}
    >
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
          position: "relative",
          overflow: "hidden",
          px: 2,
        }}
      >
        {/* Avión animado en el fondo */}
        <motion.div
          initial={{ x: "100%", y: "20%" }}
          animate={{
            x: "-1000%",
            y: ["20%", "15%", "25%", "18%", "22%", "15%"],
          }}
          transition={{
            x: {
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            top: "0",
            right: "0",
            zIndex: 9,
            pointerEvents: "none",
          }}
        >
          <img
            src="/jet-plane.svg"
            alt="plane"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </motion.div>

        {/* Contenido principal */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              color="text.primary"
              align="center"
              sx={{ fontSize: { xs: "1.5rem", md: "3rem" } }}
            >
              Gestiona tus hoteles <br />
              <Typography
                variant="h2"
                component="span"
                color="primary.main"
                sx={{
                  fontSize: { xs: "1.5rem", md: "3rem" },
                  position: "relative",
                  minHeight: "1.2em",
                  display: "inline-block",
                  "&::after": {
                    content: '"|"',
                    animation: "blink 1s infinite",
                    marginLeft: "2px",
                  },
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                }}
              >
                {displayText}
              </Typography>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h6"
              component="h2"
              color="text.secondary"
              align="center"
              mt={2}
              sx={{ fontSize: { xs: "0.9rem", md: "1.25rem" } }}
            >
              La plataforma líder para la administración de hoteles aliados.
              Simplifica, optimiza y haz crecer tu negocio.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ width: "100%", maxWidth: 600 }}
          >
            <TextField
              fullWidth
              placeholder="Buscar hoteles por nombre o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "background.paper",
                },
              }}
            />
          </motion.div>
          <Box>
            <AnimatedHotel />
          </Box>
        </Box>
      </Stack>

      <Box id="hotels" sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Hoteles Destacados
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Descubre nuestra red de hoteles aliados en toda Latinoamérica
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredHotels && filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={hotel.id}>
                  <HotelCard hotel={hotel} index={index} />
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                No se encontraron hoteles que coincidan con la búsqueda.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>
      <Stack
        width="100%"
        bgcolor="primary.main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: { xs: "auto", md: "30dvh" },
          py: { xs: 6, md: 0 },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                    md: "2rem",
                    lg: "2.25rem",
                  },
                }}
              >
                ¿Listo para unirte a VAOVA?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 3,
                  fontWeight: 400,
                  fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.125rem" },
                }}
              >
                Únete a más de {hotels.length} hoteles que ya confían en nuestra
                plataforma
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1, md: 1.5 },
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "380px" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
                onClick={() => {
                  navigate("/register");
                }}
              >
                Comenzar Ahora
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Stack>

      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
    </Stack>
  );
};

export default Home;
