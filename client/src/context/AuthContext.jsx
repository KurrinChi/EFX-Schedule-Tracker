import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then(setUser)
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
  const register = (values) => authService.register(values);

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

export function useAuth() {
  return useContext(AuthContext);
}
