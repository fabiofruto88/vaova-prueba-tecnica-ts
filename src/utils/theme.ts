// src/utils/theme.ts
import { createTheme, type ThemeOptions } from "@mui/material/styles";

// Opciones base para que luego puedas extenderlas fácilmente
const themeOptions: ThemeOptions = {
  palette: {
    mode: "light", // 'dark' si quieres modo oscuro
    primary: {
      main: "#1976d2", // azul predeterminado de MUI
    },
    secondary: {
      main: "#9c27b0", // púrpura predeterminado
    },
    background: {
      default: "#f5f5f5", // color de fondo de la app
      paper: "#ffffff", // color de fondo para cards y contenedores
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    button: {
      textTransform: "none", // evita mayúsculas automáticas en botones
    },
  },
  shape: {
    borderRadius: 8, // radio de borde por defecto
  },
  components: {
    // Sobrescribir estilos por componente
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
  },
};

// Exportar el theme
const theme = createTheme(themeOptions);

export default theme;
