import {
  HomeIcon as DashboardIcon,
  KeyIcon,
  HomeModernIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  requiredModule?: string; // Módulo del backend en este caso no lo puse debido a que no hay back
  children?: NavigationItem[];
  roles: "admin" | "hotel";
}

export const navigationConfig: NavigationItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
    roles: "admin",
  },
  {
    title: "Hoteles",
    path: "/admin/hotels",
    icon: <HomeModernIcon />,
    roles: "admin",
  },
  {
    title: "Mi Hotel",
    path: "/hotel/my-hotel",
    icon: <HomeModernIcon />,
    roles: "hotel",
  },
  {
    title: "Habitaciones",
    path: "/hotel/rooms",
    icon: <KeyIcon />,
    roles: "hotel",
  },
  {
    title: "Galería",
    path: "/hotel/gallery",
    icon: <PhotoIcon />,
    roles: "hotel",
  },

  /*   {
    title: "Productos",
    path: "/productos",
    icon: <InventoryIcon />,
    requiredModule: "productos",
    children: [
      {
        title: "Lista",
        path: "/productos/lista",
        icon: <InventoryIcon />,
        requiredModule: "productos",
      },
      {
        title: "Categorías",
        path: "/productos/categorias",
        icon: <InventoryIcon />,
        requiredModule: "productos",
      },
    ],
  },
  {
    title: "Reportes",
    path: "/reportes",
    icon: <AssessmentIcon />,
    requiredModule: "reportes",
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: <SettingsIcon />,
    requiredModule: "configuracion",
  }, */
];
