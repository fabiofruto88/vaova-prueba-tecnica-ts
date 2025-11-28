import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  Container,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { Hotel as HotelIcon } from "@mui/icons-material";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../../lib/simulatedEndpoints";
import { fileToBase64 } from "../../utils/generals";
import type { RegisterFormData, RegisterRequest } from "../../types/auth.types";
import useNotification from "../../hooks/useNotification";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import backgroundImage from "/img-register.webp";

const Register: React.FC = () => {
  const { showNotification, notification, handleAutoClose } = useNotification();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      acceptTerms: false,
      avatar: null,
    },
  });

  const passwordValue = watch("password");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      setValue("avatar", file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      setLoading(true);

      // Convertir avatar a base64 si existe
      let avatarBase64: string | undefined;
      if (formData.avatar) {
        avatarBase64 = await fileToBase64(formData.avatar);
      }

      // Preparar request
      const requestData: RegisterRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: avatarBase64,
      };

      const response = await registerUser(requestData);

      showNotification("Usuario registrado exitosamente", "success");

      console.log("User registered:", response);

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Error registering user:", error);
      showNotification("Error al registrarte", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container
        sx={{
          position: "relative",
          overflow: "hidden",
          minWidth: "100%",
          paddingY: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* difuminar el fondo */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(2px)",
            transform: "scale(1.05)",
            zIndex: 0,
          }}
        />

        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="row-reverse"
          width={{ xs: "100%", sm: "80%", md: "70%" }}
          borderRadius={2}
          bgcolor="background.paper"
          sx={{
            position: "relative",
            zIndex: 1,
            animation: "slideIn 0.6s ease-out",
            "@keyframes slideIn": {
              from: {
                opacity: 0,
                transform: "translateX(-40px)",
              },
              to: {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
        >
          <Stack
            justifyContent="center"
            display="flex"
            p={2}
            sx={{
              mr: { xs: 0, md: 2 },
              display: "flex",
              flex: 1,
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} />
              <Typography variant="h6" component="div" fontWeight={800}>
                VAOVA
              </Typography>
            </Box>

            <Typography variant="h6">Crea tu cuenta</Typography>
            <Typography variant="body2">
              Por favor, completa el formulario para registrar tu hotel.
            </Typography>

            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={3}
                >
                  <Box position="relative">
                    <Avatar
                      src={avatarPreview}
                      sx={{
                        width: 90,
                        height: 90,
                        bgcolor: "grey.200",
                        border: "3px solid",
                        borderColor: "grey.300",
                      }}
                    >
                      {!avatarPreview && (
                        <UserIcon width={40} color="#9e9e9e" />
                      )}
                    </Avatar>

                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        bgcolor: "primary.main",
                        color: "white",
                        width: 32,
                        height: 32,
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <CameraIcon width={18} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  </Box>

                  <Typography variant="caption" color="text.secondary" mt={1}>
                    Avatar (opcional)
                  </Typography>
                </Box>

                {/* NAME */}
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Nombre del Hotel"
                    placeholder="Ingresa el nombre"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 3,
                        message: "Mínimo 3 caracteres",
                      },
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UserIcon width={20} color="#666" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* EMAIL */}
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    {...register("email", {
                      required: "El email es obligatorio",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email no válido",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EnvelopeIcon width={20} color="#666" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Contraseña"
                    placeholder="Mínimo 6 caracteres"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockClosedIcon width={20} color="#666" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <EyeSlashIcon width={20} />
                            ) : (
                              <EyeIcon width={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirmar contraseña"
                    placeholder="Repite tu contraseña"
                    {...register("confirmPassword", {
                      required: "Debes confirmar la contraseña",
                      validate: (value) =>
                        value === passwordValue ||
                        "Las contraseñas no coinciden",
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockClosedIcon width={20} color="#666" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon width={20} />
                            ) : (
                              <EyeIcon width={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Controller
                    name="acceptTerms"
                    control={control}
                    rules={{ required: "Debes aceptar los términos" }}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Acepto los términos y condiciones
                          </Typography>
                        }
                      />
                    )}
                  />
                  {errors.acceptTerms && (
                    <Typography color="error" fontSize={14}>
                      {errors.acceptTerms.message}
                    </Typography>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ py: 1.2, fontWeight: "bold", mt: 1 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={22} /> : "Registrarse"}
                </Button>
              </form>
              <Divider sx={{ my: 1 }}>
                <Typography
                  variant="body2"
                  fontSize={12}
                  sx={{ color: "text.secondary", fontWeight: 200 }}
                >
                  o continúa con
                </Typography>
              </Divider>
              <Typography
                variant="body2"
                textAlign="center"
                fontSize={12}
                sx={{ color: "text.secondary", fontWeight: 200, mb: 1 }}
              >
                ¿Tienes una cuenta?{" "}
                <Typography
                  variant="body2"
                  component="span"
                  color="primary"
                  fontWeight={600}
                  fontSize={12}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Inicia sesión
                </Typography>
              </Typography>
            </Paper>
          </Stack>

          <Box
            width="55%"
            height="80dvh"
            display={{ xs: "none", md: "block" }}
            m={2}
            borderRadius={2}
            sx={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Stack>
      </Container>

      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
    </>
  );
};

export default Register;
