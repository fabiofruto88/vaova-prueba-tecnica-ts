import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useRequest } from "../../hooks/useRequest";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hooks para peticiones y autenticación
  const { loadReq, loading, error } = useRequest();
  const { saveLoginData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Hacer petición al endpoint de login
      const loginData = {
        email,
        password,
      };

      // Llamar al endpoint sin autenticación (requiresAuth = false)
      const response = await loadReq("login", false, "POST", loginData);
      console.log("Respuesta del login:", response);
      // Guardar datos de login en cookies usando useAuth
      saveLoginData(response);

      // Verificar que el role se guardó correctamente
      console.log("Usuario logueado:", response);

      /*  // Redirigir al dashboard o página principal
      window.location.href = "/"; */
    } catch (err) {
      // El error ya está manejado por el hook useRequest
      console.error("Error en login:", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100dvh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2} align="center">
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
