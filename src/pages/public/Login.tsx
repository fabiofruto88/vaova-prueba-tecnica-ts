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
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Hotel as HotelIcon } from "@mui/icons-material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/simulatedEndpoints";
import type { LoginResponse } from "../../types/auth.types";
import useNotification from "../../hooks/useNotification";
import NotificationSnackbar from "../../layouts/components/NotificationSnackbar";
import { simulateNetworkDelay } from "../../utils/localStorage";
import backgroundImage from "/img-login2.webp";

// 🔥 Import React Hook Form
import { useForm, Controller } from "react-hook-form";

const Login: React.FC = () => {
  const { showNotification, notification, handleAutoClose } = useNotification();

  const { saveLoginData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  // 🔥 Inicialización de React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 🔥 Ahora recibe los valores de RHF
  const onSubmit = async (formData: { email: string; password: string }) => {
    const { email, password } = formData;

    try {
      setLoading(true);

      const response: LoginResponse = await login(email, password);

      saveLoginData(response);
      simulateNetworkDelay(2000);

      showNotification("Inicio de sesión exitoso", "success", 2000);

      const role = response.user?.role;
      if (role === "hotel") {
        navigate("/hotels", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      console.error("Error en login:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Error en login";
      showNotification(message, "error");
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
        {/* Fondo difuminado */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
            transform: "scale(1.05)",
            zIndex: 0,
          }}
        />

        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="row"
          width={{ xs: "100%", sm: "80%", md: "70%" }}
          borderRadius={2}
          bgcolor="background.paper"
          sx={{
            position: "relative",
            zIndex: 1,
            animation: "slideIn 0.6s ease-out",
            "@keyframes slideIn": {
              from: { opacity: 0, transform: "translateX(-40px)" },
              to: { opacity: 1, transform: "translateX(0)" },
            },
          }}
        >
          <Stack
            justifyContent="center"
            p={2}
            sx={{
              ml: { xs: 0, md: 2 },
              display: "flex",
              flex: 1,
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} />
              <Typography variant="h6" fontWeight={800}>
                VAOVA
              </Typography>
            </Box>

            <Typography variant="h6">Bienvenido de vuelta</Typography>
            <Typography variant="body2">
              Por favor, ingresa tus datos para continuar
            </Typography>

            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Correo inválido",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Correo electrónico"
                      type="email"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "La contraseña es obligatoria" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((s) => !s)}
                              onMouseDown={(e) => e.preventDefault()}
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

                <Box mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }}>
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
                  ¿No tienes una cuenta?{" "}
                  <Typography
                    variant="body2"
                    component="span"
                    color="primary"
                    fontWeight={600}
                    fontSize={12}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    Regístrate
                  </Typography>
                </Typography>
              </form>
            </Paper>
          </Stack>

          {/* Imagen derecha */}
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

export default Login;
