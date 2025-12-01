import type { RouteConfig } from "../types/auth.types";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Dashboard from "../pages/admin/Dashboard";
import Hotels from "../pages/admin/hotels";
import HotelPage from "../pages/public/hotel";
import Register from "../pages/public/register";
import MyHotel from "../pages/hotel/myHotel";
import MyRooms from "../pages/hotel/rooms";
import Gallery from "../pages/hotel/gallery";

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: <Home />,
    isPublic: true,
    layout: "public",
    name: "Inicio",
  },
  {
    path: "/login",
    component: <Login />,
    isPublic: true,
    layout: "public",
    name: "Login",
  },
  {
    path: "/register",
    component: <Register />,
    isPublic: true,
    layout: "public",
    name: "Registrarse",
  },
  {
    path: "/hotel/:id",
    component: <HotelPage />,
    isPublic: true,
    layout: "public",
    name: "Hotel",
  },

  // ==========================================
  // RUTAS AUTENTICADAS (con AuthenticatedLayout)
  // ==========================================
  {
    path: "/admin/dashboard",
    component: <Dashboard />,
    layout: "authenticated",
    name: "Dashboard",
  },
  {
    path: "/admin/hotels",
    component: <Hotels />,
    layout: "authenticated",
    name: "Hoteles",
  },
  {
    path: "/hotel/my-hotel",
    component: <MyHotel />,
    name: "Mi Hotel",
    layout: "authenticated",
  },

  {
    path: "/hotel/rooms",
    component: <MyRooms />,
    name: "Mis Habitaciones",
    layout: "authenticated",
  },
  {
    path: "/hotel/gallery",
    component: <Gallery />,
    name: "Galería",
    layout: "authenticated",
  },
  /*  {
    path: "/perfil",
    component: <Profile />,
    layout: "authenticated",
    name: "Mi Perfil",
  },
  {
    path: "/usuarios",
    component: <Users />,
    requiredModule: "usuarios",
    layout: "authenticated",
    name: "Usuarios",
  },
  {
    path: "/productos",
    component: <Products />,
    requiredModule: "productos",
    layout: "authenticated",
    name: "Productos",
  },
  {
    path: "/reportes",
    component: <Reports />,
    requiredModule: "reportes",
    layout: "authenticated",
    name: "Reportes",
  },
  {
    path: "/configuracion",
    component: <Settings />,
    requiredModule: "configuracion",
    layout: "authenticated",
    name: "Configuración",
  }, */
];

export default routes;
