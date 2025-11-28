// src/layouts/components/AuthHeader.tsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Hotel as HotelIcon } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/theme-context";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

interface AuthHeaderProps {
  onMenuClick: () => void;
}

export default function AuthHeader({ onMenuClick }: AuthHeaderProps) {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useThemeContext();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        {/* Botón menú (sidebar) */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <Bars3Icon style={{ width: 24, height: 24 }} />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} /> */}
          <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} />
          <Typography variant="h6" component="div" fontWeight={800}>
            VAOVA
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
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
        </IconButton>

        {/* Notificaciones */}

        {/*  <IconButton color="inherit">
          <BellIcon style={{ width: 24, height: 24 }} />
        </IconButton> */}

        {/* Usuario */}
        <IconButton onClick={handleMenu} color="inherit">
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.dark }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            sx={{ my: 1, mx: 1, borderRadius: 2 }}
            onClick={() => {
              handleClose();
              navigate("/perfil");
            }}
          >
            Mi perfil
          </MenuItem>

          <Divider />
          <MenuItem
            sx={{ my: 1, mx: 1, borderRadius: 2 }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
