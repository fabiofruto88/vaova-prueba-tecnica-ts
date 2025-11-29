// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredModule?: string;
  requiredModules?: string[]; // ANY (al menos uno)
  requireAllModules?: string[]; // ALL (todos)
  isPublic?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredModule,
  requiredModules,
  requireAllModules,
  isPublic = false,
}: ProtectedRouteProps) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasModule,
    hasAnyModule,
    hasAllModules,
  } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // ==========================================
  // RUTA PÚBLICA (ej: login)
  // ==========================================
  if (isPublic) {
    // Si ya está autenticado y trata de ir a una ruta pública (ej: login),
    // intentar redirigir al origen (`from`) si existe; si no, usar ruta por rol.
    if (isAuthenticated) {
      console.log(user?.role);
      const rolePath =
        user?.role === "hotel"
          ? "/hotels"
          : user?.role === "admin"
          ? "/admin/dashboard"
          : "/";
      console.log("Role path:", rolePath);
      return <Navigate to={rolePath} replace />;
    }
    // Si no está autenticado, permitir acceso
    return children;
  }

  // ==========================================
  // RUTA PROTEGIDA
  // ==========================================
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ==========================================
  // VERIFICAR PERMISOS ESPECÍFICOS
  // ==========================================

  // Requiere un módulo específico
  if (requiredModule && !hasModule(requiredModule)) {
    console.warn(`🚫 Sin acceso al módulo: ${requiredModule}`);
    return <Navigate to="/sin-permiso" replace />;
  }

  // Requiere AL MENOS UNO de los módulos
  if (requiredModules && !hasAnyModule(requiredModules)) {
    console.warn(
      `🚫 Sin acceso. Necesita uno de: ${requiredModules.join(", ")}`
    );
    return <Navigate to="/sin-permiso" replace />;
  }

  // Requiere TODOS los módulos
  if (requireAllModules && !hasAllModules(requireAllModules)) {
    console.warn(
      `🚫 Sin acceso. Necesita todos: ${requireAllModules.join(", ")}`
    );
    return <Navigate to="/sin-permiso" replace />;
  }

  // ==========================================
  // TODO OK - RENDERIZAR
  // ==========================================
  return children;
};
