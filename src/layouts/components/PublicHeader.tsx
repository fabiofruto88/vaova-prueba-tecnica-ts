// src/layouts/components/PublicHeader.tsx
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Hotel as HotelIcon } from "@mui/icons-material";
import { SunIcon, MoonIcon, HomeIcon } from "@heroicons/react/24/solid";

import { useThemeContext } from "../../context/theme-context";

export default function PublicHeader() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {/*  <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} /> */}
          <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} />
          <Typography variant="h6" component="div" fontWeight={800}>
            VAOVA
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, gap: 1 }} />
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? (
              <SunIcon
                style={{ width: 24, height: 24 }}
                color={theme.palette.primary.dark}
              />
            ) : (
              <MoonIcon
                style={{ width: 24, height: 24 }}
                color={theme.palette.primary.dark}
              />
            )}
          </IconButton>{" "}
          {/* Navegación */}
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <HomeIcon
              style={{ width: 24, height: 24 }}
              color={theme.palette.primary.dark}
            />
          </IconButton>
          <Button color="inherit" onClick={() => navigate("/register")}>
            Registrarse
          </Button>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
