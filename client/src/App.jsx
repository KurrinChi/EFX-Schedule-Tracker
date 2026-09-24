import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PreferenceProvider } from "./context/PreferenceContext";
import { usePreferences } from "./hooks/usePreferences";
import {
  themeComponentTokens,
  themeConfig,
  themeVariables,
} from "./config/themeConfig";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function ThemedApplication() {
  const { theme } = usePreferences();
  const currentTheme = themeConfig[theme] || themeConfig.dark;
  useEffect(() => {
    Object.entries(themeVariables[theme] || themeVariables.dark).forEach(
      ([key, value]) => document.documentElement.style.setProperty(key, value),
    );
  }, [theme]);
  return (
    <ConfigProvider
      theme={{ ...currentTheme, components: themeComponentTokens(theme) }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
export default function App() {
  return (
    <PreferenceProvider>
      <ThemedApplication />
    </PreferenceProvider>
  );
}
