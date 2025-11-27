// src/config/routes.config.tsx
import type { RouteConfig } from "../types/auth.types";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

// Páginas públicas
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Dashboard from "../pages/admin/Dashboard";
/* import Register from "../pages/public/Register"; */

// Páginas autenticadas

export const routes: RouteConfig[] = [
  // ==========================================
  // RUTAS PÚBLICAS (con PublicLayout)
  // ==========================================
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
  /*   {
    path: "/register",
    component: <Register />,
    isPublic: true,
    layout: "public",
    name: "Registrarse",
  }, */

  // ==========================================
  // RUTAS AUTENTICADAS (con AuthenticatedLayout)
  // ==========================================
  {
    path: "/dashboard",
    component: <Dashboard />,
    layout: "authenticated",
    name: "Dashboard",
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
