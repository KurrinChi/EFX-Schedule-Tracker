import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return (
      <div className="route-loading">
        <Spin size="large" />
      </div>
    );
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
