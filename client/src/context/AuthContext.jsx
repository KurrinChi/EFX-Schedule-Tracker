import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(sessionStorage.getItem("efx_auth_token")),
  );

  useEffect(() => {
    const token = sessionStorage.getItem("efx_auth_token");

    if (!token) {
      return undefined;
    }

    authService
      .me()
      .then((nextUser) => setUser(nextUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const onExpired = () => setUser(null);
    window.addEventListener("efx:session-expired", onExpired);
    return () => window.removeEventListener("efx:session-expired", onExpired);
  }, []);

  const login = async (values) => {
    const nextUser = await authService.login(values);
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (values) => {
    const result = await authService.register(values);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        register,
        getCurrentUser: authService.me,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
