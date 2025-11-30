import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
  Rating,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  XMarkIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import type { CreateHotelFormData } from "../../../types/common";

interface CreateHotelModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateHotelFormData) => Promise<void>;
}

export default function CreateHotelModal({
  open,
  onClose,
  onCreate,
}: CreateHotelModalProps) {
  const theme = useTheme();
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateHotelFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      avatar: "",
      description: "",
      country: "",
      state: "",
      city: "",
      stars: 5,
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setValue("avatar", base64String);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona solo archivos JPEG");
    }
  };

  const onSubmit = async (data: CreateHotelFormData) => {
    setIsSubmitting(true);
    try {
      await onCreate(data);
      reset();
      setLogoPreview("");
      onClose();
    } catch (error) {
      console.error("Error al crear hotel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setLogoPreview("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          mx: { xs: 2, sm: 3 },
          width: { xs: "calc(100% - 32px)", sm: "calc(100% - 48px)" },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          Crear Nuevo Hotel
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2.5, sm: 3 },
          }}
        >
          {/* Sección de Credenciales */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 2 }}
            >
              Credenciales de Acceso
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="medium"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((s) => !s)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <EyeSlashIcon
                                style={{
                                  width: 20,
                                  height: 20,
                                  color: theme.palette.primary.main,
                                }}
                              />
                            ) : (
                              <EyeIcon
                                style={{
                                  width: 20,
                                  height: 20,
                                  color: theme.palette.primary.main,
                                }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          <Divider />

          {/* Sección de Información del Hotel */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 2 }}
            >
              Información del Hotel
            </Typography>

            {/* Logo Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: { xs: "wrap", sm: "nowrap" },
                mb: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={logoPreview}
                  sx={{
                    width: { xs: 70, sm: 80 },
                    height: { xs: 70, sm: 80 },
                    bgcolor: "#f5e6d3",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: 2,
                    borderColor: "primary.main",
                  }}
                >
                  <CameraIcon width={14} />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Logo del Hotel
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  fullWidth={false}
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Subir Logo
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg"
                    onChange={handleLogoUpload}
                  />
                </Button>
              </Box>
            </Box>

            {/* Name Field */}
            <Box sx={{ mb: 2 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "El nombre del hotel es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "El nombre no puede exceder 100 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Hotel"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="medium"
                  />
                )}
              />
            </Box>

            {/* Location Fields */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <Controller
                name="country"
                control={control}
                rules={{
                  required: "El país es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El país debe tener al menos 2 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="País"
                    fullWidth
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    size="medium"
                  />
                )}
              />
              <Controller
                name="state"
                control={control}
                rules={{
                  required: "El departamento/estado es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El departamento debe tener al menos 2 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Departamento / Estado"
                    fullWidth
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    size="medium"
                  />
                )}
              />
              <Controller
                name="city"
                control={control}
                rules={{
                  required: "La ciudad es obligatoria",
                  minLength: {
                    value: 2,
                    message: "La ciudad debe tener al menos 2 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ciudad"
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    size="medium"
                  />
                )}
              />
            </Box>

            {/* Description */}
            <Box sx={{ mb: 2 }}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 10,
                    message: "La descripción debe tener al menos 10 caracteres",
                  },
                  maxLength: {
                    value: 500,
                    message: "La descripción no puede exceder 500 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    size="medium"
                  />
                )}
              />
            </Box>

            {/* Rating */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Calificación Inicial
              </Typography>
              <Controller
                name="stars"
                control={control}
                rules={{
                  required: "La calificación es obligatoria",
                }}
                render={({ field }) => (
                  <Box>
                    <Rating
                      {...field}
                      value={field.value}
                      onChange={(_, newValue) => {
                        if (
                          newValue &&
                          (newValue === 1 ||
                            newValue === 2 ||
                            newValue === 3 ||
                            newValue === 4 ||
                            newValue === 5)
                        ) {
                          field.onChange(newValue);
                        }
                      }}
                      size="large"
                      max={5}
                      sx={{ fontSize: { xs: "1.75rem", sm: "2rem" } }}
                    />
                    {errors.stars && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {errors.stars.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 2.5 },
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" }, order: { xs: 2, sm: 1 } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" }, order: { xs: 1, sm: 2 } }}
        >
          {isSubmitting ? "Creando..." : "Crear Hotel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
