import React, { useState, useEffect } from "react";
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
  Checkbox,
  FormControlLabel,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  XMarkIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import type { Hotel } from "../types/auth.types";

interface EditHotelModalProps {
  open: Hotel | null;
  onClose: () => void;
  onEdit: (
    id: string,
    data: Partial<Omit<Hotel, "id" | "createdAt" | "updatedAt" | "score">>,
    credentials?: { email?: string; password?: string }
  ) => Promise<void>;
  role: "admin" | "hotel";
}

interface HotelFormData {
  name: string;
  country: string;
  state: string;
  city: string;
  description: string;
  logo: string;
  stars: 1 | 2 | 3 | 4 | 5;
  updateCredentials?: boolean;
  credentialsEmail?: string;
  credentialsPassword?: string;
}

export default function EditHotelModal({
  open,
  onClose,
  onEdit,
  role,
}: EditHotelModalProps) {
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      country: "",
      state: "",
      city: "",
      description: "",
      logo: "",
      stars: 5,
      updateCredentials: false,
      credentialsEmail: "",
      credentialsPassword: "",
    },
  });

  const showCreds = watch("updateCredentials");

  useEffect(() => {
    if (open) {
      reset({
        name: open.name || "",
        country: open.country || "",
        state: open.state || "",
        city: open.city || "",
        description: open.description || "",
        logo: open.logo || "",
        stars: open.stars || 5,
        updateCredentials: false,
        credentialsEmail: open?.email || "",
        credentialsPassword: open?.password || "",
      });
      setLogoPreview(open.logo || "");
    }
  }, [open, reset]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setValue("logo", base64String);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona solo archivos JPEG");
    }
  };

  const onSubmit = async (data: HotelFormData) => {
    if (open) {
      setIsSubmitting(true);
      try {
        const {
          updateCredentials,
          credentialsEmail,
          credentialsPassword,
          ...hotelData
        } = data as unknown as {
          updateCredentials?: boolean;
          credentialsEmail?: string;
          credentialsPassword?: string;
        } & Partial<Hotel>;

        const credentials = updateCredentials
          ? { email: credentialsEmail, password: credentialsPassword }
          : undefined;

        if (role === "admin") {
          await onEdit(open.id, hotelData, credentials);
        } else {
          await onEdit(open.id, hotelData);
        }

        onClose();
      } catch (error) {
        console.error("Error al actualizar hotel:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={!!open}
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
          Editar Hotel
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
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: { xs: "wrap", sm: "nowrap" },
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

          {/* Location Fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 2,
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
                min: { value: 1, message: "La calificación mínima es 1" },
                max: { value: 5, message: "La calificación máxima es 5" },
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
            {/* Credentials toggle and fields */}
            {role === "admin" && (
              <Box>
                <Controller
                  name="updateCredentials"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Actualizar credenciales (email/password)"
                    />
                  )}
                />

                {showCreds && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Controller
                      name="credentialsEmail"
                      control={control}
                      rules={{
                        required: "El email es requerido",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Email inválido",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          fullWidth
                          error={!!errors.credentialsEmail}
                          helperText={errors.credentialsEmail?.message}
                        />
                      )}
                    />

                    <Controller
                      name="credentialsPassword"
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
                          error={!!errors.credentialsPassword}
                          helperText={errors.credentialsPassword?.message}
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
                )}
              </Box>
            )}
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
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
