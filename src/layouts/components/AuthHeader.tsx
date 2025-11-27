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
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
/* import logo from "/src/img/logo.png"; */

interface AuthHeaderProps {
  onMenuClick: () => void;
}

export default function AuthHeader({ onMenuClick }: AuthHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        {/* Botón menú (sidebar) */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} /> */}
          <Typography variant="h6" component="div">
            Campus IUB
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Notificaciones */}
        <IconButton color="inherit">
          <Notifications />
        </IconButton>

        {/* Usuario */}
        <IconButton onClick={handleMenu} color="inherit">
          <Avatar sx={{ width: 32, height: 32 }}>
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
            onClick={() => {
              handleClose();
              navigate("/perfil");
            }}
          >
            Mi Perfil
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/configuracion");
            }}
          >
            Configuración
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
