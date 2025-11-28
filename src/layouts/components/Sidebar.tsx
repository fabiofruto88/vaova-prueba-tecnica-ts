// src/layouts/components/Sidebar.tsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  navigationConfig,
  type NavigationItem,
} from "../../config/navigation.config";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
}

export default function Sidebar({
  open,
  onClose,
  drawerWidth = 240,
}: SidebarProps) {
  const { user, hasModule, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  // Filtrar items según permisos
  const filterNavItems = (items: NavigationItem[]): NavigationItem[] => {
    return items
      .filter((item) => {
        // Si no requiere módulo, mostrar
        if (!item.requiredModule) return true;
        // Si requiere módulo, verificar que el usuario lo tenga
        return hasModule(item.requiredModule);
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterNavItems(item.children) : undefined,
      }));
  };

  const availableItems = filterNavItems(navigationConfig);

  const handleItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle collapse
      setOpenItems((prev) => ({
        ...prev,
        [item.path]: !prev[item.path],
      }));
    } else {
      // Navegar
      navigate(item.path);
      onClose();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems[item.path];
    const active = isActive(item.path);

    return (
      <Box key={item.path} sx={{ mx: 1, my: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={active}
            sx={{
              pl: 2 + level * 2,
              bgcolor: active ? "action.selected" : "transparent",
              borderRadius: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
            {hasChildren &&
              (isOpen ? (
                <ChevronUpIcon style={{ width: 20, height: 20 }} />
              ) : (
                <ChevronDownIcon style={{ width: 20, height: 20 }} />
              ))}
          </ListItemButton>
        </ListItem>

        {/* Children (submenu) */}
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderNavItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        border: "none",

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          border: "none",
        },
      }}
    >
      {/* Header del drawer */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
        <Chip label={user?.role} size="small" sx={{ mt: 1 }} />
      </Box>

      <Divider />

      {/* Navegación */}
      <Stack
        sx={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          //mb: 1,
        }}
      >
        <List sx={{ flex: 1 }}>
          {availableItems.map((item) => renderNavItem(item))}
        </List>
        <Box>
          <Divider sx={{ width: "100%", mb: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",

              padding: 1,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={logout}
              sx={{ borderRadius: 2 }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}
