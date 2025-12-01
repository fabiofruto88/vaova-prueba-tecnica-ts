import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useNotification from "../../hooks/useNotification";
import Loading from "../../components/loanding";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import {
  getHotelGallery,
  updateHotelGallery,
} from "../../lib/simulatedEndpoints";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";

const Gallery: React.FC = () => {
  const { showNotification, notification, handleAutoClose } = useNotification();
  const { user } = useAuth();

  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hotelId, setHotelId] = useState<string>("");

  const MAX_IMAGES = 10;

  useEffect(() => {
    if (user) loadGallery();
  }, [user]);

  const loadGallery = async () => {
    try {
      setLoading(true);

      if (!user) {
        setGallery([]);
        return;
      }

      let id = user.id;
      if (id.startsWith("user-")) {
        id = id.replace(/^user-/, "");
      }
      setHotelId(id);

      const images = await getHotelGallery(id);
      setGallery(images);
    } catch (err: any) {
      showNotification(err.message, "error", 3000);
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Validar límite de imágenes
    const remainingSlots = MAX_IMAGES - gallery.length;
    if (fileArray.length > remainingSlots) {
      showNotification(
        `Solo puedes subir ${remainingSlots} imagen(es) más. Máximo ${MAX_IMAGES} imágenes.`,
        "warning",
        3000
      );
      return;
    }

    // Validar tamaño de archivos (5MB max cada uno)
    const validFiles = fileArray.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showNotification(
          `La imagen ${file.name} excede el tamaño máximo de 5MB`,
          "warning",
          3000
        );
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setUploading(true);

      // Convertir a base64
      const base64Images = await Promise.all(
        validFiles.map((file) => convertToBase64(file))
      );

      // Actualizar galería
      const updatedGallery = [...gallery, ...base64Images];
      await updateHotelGallery(hotelId, updatedGallery);

      setGallery(updatedGallery);
      showNotification(
        `${validFiles.length} imagen(es) agregada(s) correctamente`,
        "success",
        2000
      );
    } catch (err: any) {
      showNotification(err.message || "Error al subir imágenes", "error", 3000);
      console.error("Error uploading images:", err);
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = async (index: number) => {
    try {
      setLoading(true);

      const updatedGallery = gallery.filter((_, i) => i !== index);
      await updateHotelGallery(hotelId, updatedGallery);

      setGallery(updatedGallery);
      showNotification("Imagen eliminada correctamente", "success", 2000);
    } catch (err: any) {
      showNotification(
        err.message || "Error al eliminar imagen",
        "error",
        3000
      );
      console.error("Error removing image:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGallery = async () => {
    try {
      setUploading(true);
      await updateHotelGallery(hotelId, gallery);
      showNotification("Galería guardada correctamente", "success", 2000);
    } catch (err: any) {
      showNotification(
        err.message || "Error al guardar galería",
        "error",
        3000
      );
      console.error("Error saving gallery:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Container sx={{ py: 4, minHeight: "100dvh" }} maxWidth="xl">
        {/* Header */}
        <Box mb={1}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Galería del Hotel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra las imágenes que se mostrarán en tu perfil público
          </Typography>
        </Box>

        {/* Gallery Section */}
        <Paper
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            mt: 3,
            width: "100%",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="600">
                Imágenes del Hotel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sube hasta {MAX_IMAGES} imágenes para mostrar en tu perfil
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleSaveGallery}
              disabled={uploading || loading}
              startIcon={<CloudArrowUpIcon width={20} />}
            >
              Subir Imágenes
            </Button>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {gallery.map((image, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                  sx={{
                    position: "relative",
                    paddingTop: "66.67%", // 3:2 aspect ratio
                    borderRadius: 3,
                    overflow: "hidden",
                    "&:hover .delete-btn": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      "&:hover": {
                        bgcolor: "error.main",
                      },
                    }}
                  >
                    <XMarkIcon width={20} />
                  </IconButton>
                </Paper>
              </Grid>
            ))}

            {/* Add Image Button */}
            {gallery.length < MAX_IMAGES && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  sx={{
                    position: "relative",
                    paddingTop: "66.67%",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "2px dashed",
                    borderColor: "divider",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                  onClick={() =>
                    document.getElementById("gallery-upload")?.click()
                  }
                >
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    multiple
                    hidden
                    onChange={handleFileSelect}
                    disabled={uploading || loading}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        bgcolor: "action.selected",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlusIcon width={28} color="currentColor" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Agregar imagen
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Empty State */}
          {gallery.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "action.selected",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 2,
                }}
              >
                <CloudArrowUpIcon width={40} color="currentColor" />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay imágenes en tu galería
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Comienza agregando imágenes para mostrar tu hotel
              </Typography>
              <Button
                variant="outlined"
                onClick={() =>
                  document.getElementById("gallery-upload")?.click()
                }
              >
                Subir primera imagen
              </Button>
            </Box>
          )}

          {/* Counter */}
          {gallery.length > 0 && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {gallery.length} de {MAX_IMAGES} imágenes
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      <Loading open={loading || uploading} />
      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
    </>
  );
};

export default Gallery;
