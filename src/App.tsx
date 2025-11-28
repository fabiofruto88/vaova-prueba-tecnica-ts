// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import routes from "./config/routes.config";
import NotFound from "./pages/NotFound";
import NoPermission from "./pages/NoPermission";

function App() {
  const publicRoutes = routes.filter((r) => r.layout === "public");
  const authRoutes = routes.filter((r) => r.layout === "authenticated");

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute isPublic={route.isPublic}>
                {route.component}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      <Route element={<AuthenticatedLayout />}>
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute
                requiredModule={route.requiredModule}
                requiredModules={route.requiredModules}
                requireAllModules={route.requireAllModules}
              >
                {route.component}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Rutas especiales */}
      <Route path="/sin-permiso" element={<NoPermission />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
