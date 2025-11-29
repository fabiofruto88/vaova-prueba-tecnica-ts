// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { CookieUtils } from "../utils/cookies";
import { logout as logoutStorage } from "../lib/simulatedEndpoints";
import type { User, LoginResponse } from "../types/auth.types";

// ============================================
// INTERFAZ DEL CONTEXTO
// ============================================
interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Métodos principales (exactamente como los tenías en useAuth)
  isLoggedIn: () => boolean;
  getUser: () => User | null;
  saveLoginData: (loginResponse: LoginResponse) => void;
  logout: () => void;

  // Métodos adicionales para permisos
  hasModule: (moduleName: string) => boolean;
  hasAnyModule: (moduleNames: string[]) => boolean;
  hasAllModules: (moduleNames: string[]) => boolean;
  getModules: () => string[];
}

// ============================================
// CREAR CONTEXTO
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ============================================
  // VERIFICAR AUTENTICACIÓN AL INICIAR
  // ============================================
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    try {
      const token = CookieUtils.getCookie("accessToken");
      const userData = CookieUtils.getCookie("user");

      if (!token || !userData) {
        console.log("❌ No hay sesión activa");
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Verificar si el token expiró
      if (CookieUtils.isTokenExpired()) {
        console.log("❌ Token expirado");
        clearAuthData();
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Todo OK
      const parsedUser: User = JSON.parse(userData);
      console.log("✅ Sesión activa:", parsedUser.name);
      console.log("📦 Módulos disponibles:", parsedUser.modules);
      console.log(parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("❌ Error al verificar autenticación:", error);
      clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // isLoggedIn (tu método original)
  // ============================================
  const isLoggedIn = useCallback((): boolean => {
    const token = CookieUtils.getCookie("accessToken");
    const userCookie = CookieUtils.getCookie("user");

    return !!(token && userCookie && !CookieUtils.isTokenExpired());
  }, []);

  // ============================================
  // getUser (tu método original)
  // ============================================
  const getUser = useCallback((): User | null => {
    const userData = CookieUtils.getCookie("user");
    return userData ? JSON.parse(userData) : null;
  }, []);

  // ============================================
  // saveLoginData (tu método original, mejorado)
  // ============================================
  const saveLoginData = useCallback((loginResponse: LoginResponse) => {
    const { token, user, refreshToken, expiresIn } = loginResponse;

    console.log("🔐 Guardando datos de login...");
    console.log("👤 Usuario:", user.name);
    console.log("📦 Módulos:", user.modules);

    // Si no viene expiresIn, usar 24 horas por defecto
    const tokenExpiresIn = expiresIn || 86400;

    // Calcular timestamp de expiración
    const expiresAt = Date.now() + tokenExpiresIn * 1000;

    // Calcular días para la cookie
    const cookieDays = Math.floor(tokenExpiresIn / (24 * 60 * 60)) || 1;

    // Guardar en cookies
    CookieUtils.setCookie("accessToken", token, cookieDays);
    const { avatar, ...userWithoutAvatar } = user;
    CookieUtils.setCookie(
      "user",
      JSON.stringify(userWithoutAvatar),
      cookieDays
    );
    CookieUtils.setCookie("tokenExpires", expiresAt.toString(), cookieDays);

    if (refreshToken) {
      CookieUtils.setCookie("refreshToken", refreshToken, cookieDays * 7);
    }

    // Actualizar estado del contexto
    setUser(user);

    console.log("✅ Cookies guardadas correctamente");
    console.log("- accessToken:", token.substring(0, 20) + "...");
    console.log("- tokenExpires:", new Date(expiresAt).toLocaleString());
  }, []);

  // ============================================
  // logout (tu método original, mejorado)
  // ============================================
  const logout = useCallback(() => {
    console.log("👋 Cerrando sesión...");
    logoutStorage();
    clearAuthData();
    setUser(null);
    navigate("/login", { replace: true });
    console.log("✅ Sesión cerrada");
  }, [navigate]);

  const clearAuthData = () => {
    CookieUtils.deleteCookie("accessToken");
    CookieUtils.deleteCookie("refreshToken");
    CookieUtils.deleteCookie("tokenExpires");
    CookieUtils.deleteCookie("user");
  };

  // ============================================
  // MÉTODOS ADICIONALES PARA PERMISOS
  // ============================================

  /**
   * Verifica si tiene un módulo específico
   */
  const hasModule = useCallback(
    (moduleName: string): boolean => {
      if (!user) return false;
      return user.modules?.includes(moduleName) || false;
    },
    [user]
  );

  /**
   * Verifica si tiene AL MENOS UNO de los módulos
   */
  const hasAnyModule = useCallback(
    (moduleNames: string[]): boolean => {
      if (!user) return false;
      return moduleNames.some((module) => user.modules?.includes(module));
    },
    [user]
  );

  /**
   * Verifica si tiene TODOS los módulos
   */
  const hasAllModules = useCallback(
    (moduleNames: string[]): boolean => {
      if (!user) return false;
      return moduleNames.every((module) => user.modules?.includes(module));
    },
    [user]
  );

  /**
   * Obtener lista de módulos
   */
  const getModules = useCallback((): string[] => {
    return user?.modules || [];
  }, [user]);

  // ============================================
  // VALOR DEL CONTEXTO
  // ============================================
  const value: AuthContextType = {
    // Estado
    user,
    isAuthenticated: !!user,
    isLoading,

    // Tus métodos originales
    isLoggedIn,
    getUser,
    saveLoginData,
    logout,

    // Métodos adicionales
    hasModule,
    hasAnyModule,
    hasAllModules,
    getModules,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// HOOK PARA USAR EL CONTEXTO
// ============================================
/**
 * Hook useAuth - reemplaza tu hook anterior
 * Ahora usa el contexto en lugar de leer cookies directamente
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
