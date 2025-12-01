import { useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  Collections,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
}

export default function ImageGallery({ images, mainImage }: ImageGalleryProps) {
  console.log(images, mainImage);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const allImages = [mainImage, ...images];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gridTemplateRows: { xs: "300px", md: "200px 200px" },
            gap: 1,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              gridRow: { md: "1 / 3" },
              position: "relative",
              cursor: "pointer",
              "&:hover img": { transform: "scale(1.02)" },
            }}
            onClick={() => {
              setCurrentIndex(0);
              setLightboxOpen(true);
            }}
          >
            <Box
              component="img"
              src={mainImage}
              alt="Hotel principal"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />
          </Box>

          {!isMobile &&
            images.slice(0, 2).map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  "&:hover img": { transform: "scale(1.02)" },
                }}
                onClick={() => {
                  setCurrentIndex(idx + 1);
                  setLightboxOpen(true);
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Galería ${idx + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
                {idx === 1 && images.length > 2 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    <Collections fontSize="small" />
                    Ver {allImages.length} fotos
                  </Box>
                )}
              </Box>
            ))}
        </Box>
      </Box>

      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative", bgcolor: "black" }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 10,
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <Close />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 16,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={allImages[currentIndex]}
                alt={`Imagen ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            </AnimatePresence>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              p: 2,
              overflowX: "auto",
            }}
          >
            {allImages.map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: 60,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  opacity: idx === currentIndex ? 1 : 0.5,
                  border: idx === currentIndex ? "2px solid white" : "none",
                  transition: "all 0.2s ease",
                  "&:hover": { opacity: 1 },
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
