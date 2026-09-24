import { Layout } from "antd";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SettingsDrawer from "./SettingsDrawer";
import { usePreferences } from "../../hooks/usePreferences";
import { useAuth } from "../../hooks/useAuth";
const { Content } = Layout;
export default function AppLayout({
  children,
  onAddEntity,
  onReport,
  search,
  setSearch,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed, compactMode } =
    usePreferences();
  const { logout } = useAuth();
  return (
    <Layout
      className={`app-layout ${compactMode ? "compact-mode" : ""}`}
      hasSider
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onAddEntity={onAddEntity}
        onReport={onReport}
        onSettings={() => setSettingsOpen(true)}
        onLogout={logout}
      />
      <Layout className="main-layout">
        <Header onMobileMenu={() => setMobileOpen(true)} onSearch={setSearch} />
        <Content className="app-content">{children}</Content>
      </Layout>
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Layout>
  );
}
