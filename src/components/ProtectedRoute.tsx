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

  if (isPublic) {
    if (isAuthenticated) {
      console.log(user?.role);
      const rolePath =
        user?.role === "hotel"
          ? "/hotel/my-hotel"
          : user?.role === "admin"
          ? "/admin/dashboard"
          : "/";
      /*    console.log("Role path:", rolePath); */
      return <Navigate to={rolePath} replace />;
    }
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Requiere un módulo específico
  if (requiredModule && !hasModule(requiredModule)) {
    console.warn(`🚫 Sin acceso al módulo: ${requiredModule}`);
    return <Navigate to="/sin-permiso" replace />;
  }

  if (requiredModules && !hasAnyModule(requiredModules)) {
    console.warn(
      `🚫 Sin acceso. Necesita uno de: ${requiredModules.join(", ")}`
    );
    return <Navigate to="/sin-permiso" replace />;
  }

  if (requireAllModules && !hasAllModules(requireAllModules)) {
    console.warn(
      `🚫 Sin acceso. Necesita todos: ${requireAllModules.join(", ")}`
    );
    return <Navigate to="/sin-permiso" replace />;
  }

  return children;
};
