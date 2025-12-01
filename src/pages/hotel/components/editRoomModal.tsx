import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  FormHelperText,
  OutlinedInput,
  type SelectChangeEvent,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { XMarkIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import type { Room } from "../../../types/auth.types";
import type { CreateRoomFormData } from "../../../types/common";
import { ROOM_AMENITIES } from "../../../utils/constants";

interface EditRoomModalProps {
  open: Room | null;
  onClose: () => void;
  onEdit: (id: string, data: Partial<CreateRoomFormData>) => Promise<void>;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({
  open,
  onClose,
  onEdit,
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateRoomFormData>({
    defaultValues: {
      name: "",
      type: "single",
      price: 0,
      available: 1,
      description: "",
      images: [],
      amenities: [],
    },
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (open) {
      setValue("name", open.name);
      setValue("type", open.type);
      setValue("price", open.price);
      setValue("available", open.available);
      setValue("description", open.description || "");
      setSelectedAmenities(open.amenities);
      setExistingImages(open.images);
      setImagePreviewUrls([]);
      setImageFiles([]);
    }
  }, [open, setValue]);

  const handleAmenitiesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedAmenities(typeof value === "string" ? value.split(",") : value);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) => file.size <= 5 * 1024 * 1024 // 5MB max
    );

    if (validFiles.length !== fileArray.length) {
      alert("Algunas imágenes exceden el tamaño máximo de 5MB");
    }

    setImageFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = await Promise.all(
      validFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImagesToBase64 = async (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
  };

  const onSubmit = async (data: CreateRoomFormData) => {
    if (!open) return;

    try {
      setIsSubmitting(true);

      // Convert new images to base64
      const base64NewImages = await convertImagesToBase64(imageFiles);

      // Combine existing images with new ones
      const allImages = [...existingImages, ...base64NewImages];

      const formData: Partial<CreateRoomFormData> = {
        name: data.name,
        type: data.type,
        price: data.price,
        available: data.available,
        description: data.description,
        amenities: selectedAmenities,
        images: allImages,
      };

      await onEdit(open.id, formData);

      // Reset form
      reset();
      setSelectedAmenities([]);
      setImageFiles([]);
      setImagePreviewUrls([]);
      setExistingImages([]);
      onClose();
    } catch (error) {
      console.error("Error updating room:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedAmenities([]);
    setImageFiles([]);
    setImagePreviewUrls([]);
    setExistingImages([]);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Editar Habitación
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <XMarkIcon width={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Nombre de la habitación */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: "El nombre de la habitación es obligatorio",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de la habitación"
                  placeholder="Casa Blanca del Amor"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* Tipo y Precio en la misma fila */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Selecciona un tipo de habitación" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel>Tipo</InputLabel>
                    <Select {...field} label="Tipo">
                      <MenuItem value="single">Single (1 persona)</MenuItem>
                      <MenuItem value="twin">Twin (2 personas)</MenuItem>
                      <MenuItem value="queen">Queen (2 personas)</MenuItem>
                    </Select>
                    {errors.type && (
                      <FormHelperText>{errors.type.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="price"
                control={control}
                rules={{
                  required: "El precio es obligatorio",
                  min: {
                    value: 1,
                    message: "El precio debe ser mayor a 0",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Precio por noche"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Box>

            {/* Habitaciones disponibles */}
            <Controller
              name="available"
              control={control}
              rules={{
                required: "La cantidad es obligatoria",
                min: {
                  value: 0,
                  message: "La cantidad no puede ser negativa",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Habitaciones disponibles"
                  type="number"
                  fullWidth
                  error={!!errors.available}
                  helperText={errors.available?.message}
                />
              )}
            />

            {/* Descripción */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  placeholder="Suite con balcón y vista al centro histórico"
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />

            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Imágenes actuales
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {existingImages.map((url, index) => (
                    <Box
                      key={`existing-${index}`}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "background.paper",
                          "&:hover": { bgcolor: "error.main", color: "white" },
                        }}
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        <XMarkIcon width={20} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Agregar nuevas imágenes */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Agregar nuevas imágenes
              </Typography>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() =>
                  document.getElementById("image-upload-edit")?.click()
                }
              >
                <input
                  id="image-upload-edit"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                <CloudArrowUpIcon width={25} />
                <Typography variant="body2" color="text.secondary">
                  Arrastra una imagen o haz clic para seleccionar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG hasta 5MB
                </Typography>
              </Box>

              {/* Preview de nuevas imágenes */}
              {imagePreviewUrls.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  {imagePreviewUrls.map((url, index) => (
                    <Box
                      key={`new-${index}`}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "2px solid",
                        borderColor: "primary.main",
                      }}
                    >
                      <img
                        src={url}
                        alt={`New ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "background.paper",
                          "&:hover": { bgcolor: "error.main", color: "white" },
                        }}
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <XMarkIcon width={20} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Amenidades */}
            <FormControl fullWidth>
              <InputLabel>Amenidades</InputLabel>
              <Select
                multiple
                value={selectedAmenities}
                onChange={handleAmenitiesChange}
                input={<OutlinedInput label="Amenidades" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {ROOM_AMENITIES.map((amenity) => (
                  <MenuItem key={amenity} value={amenity}>
                    {amenity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditRoomModal;
