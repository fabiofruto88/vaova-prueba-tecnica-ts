import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/simulatedEndpoints";
import type { LoginResponse } from "../../types/auth.types";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hooks para autenticación
  const { saveLoginData } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Hacer petición al endpoint de login
      setLoading(true);
      const response: LoginResponse = await login(email, password);

      // Guardar datos de login en el contexto/auth
      saveLoginData(response);

      // Redirigir según rol
      const role = response.user?.role;
      if (role === "hotel") {
        navigate("/hotels", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        // Si no tiene rol conocido, dejar en la misma página o enviar a '/'
        // aquí optamos por enviar a '/' como fallback
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
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

          <Box mt={2} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
