// src/layouts/components/PublicHeader.tsx
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
/* import logo from "/src/img/logo.png"; */

export default function PublicHeader() {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {/*  <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} /> */}
          <Typography variant="h6" component="div">
            Medisecure
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Navegación */}
        <Button color="inherit" onClick={() => navigate("/")}>
          Inicio
        </Button>
        <Button color="inherit" onClick={() => navigate("/register")}>
          Registrarse
        </Button>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}
