import { Button, Drawer, Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { brandingConfig } from "../../config/brandingConfig";
import { usePreferences } from "../../hooks/usePreferences";

const { Sider } = Layout;

export default function Sidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
  onAddEntity,
  onReport,
  onSettings,
  onLogout,
}) {
  const navigate = useNavigate();
  const { theme } = usePreferences();
  const menu = (
    <Menu
      theme={theme}
      mode="inline"
      selectedKeys={["dashboard"]}
      items={[
        {
          key: "dashboard",
          icon: <AppstoreOutlined />,
          label: "Dashboard",
          onClick: () => navigate("/dashboard"),
        },
        {
          type: "group",
          label: "MANAGE",
          children: [
            {
              key: "add",
              icon: <PlusOutlined />,
              label: "Add Entity",
              children: [
                {
                  key: "client",
                  label: "Client",
                  onClick: () => onAddEntity("client"),
                },
                {
                  key: "package",
                  label: "Package",
                  onClick: () => onAddEntity("package"),
                },
                {
                  key: "service",
                  label: "Service",
                  onClick: () => onAddEntity("service"),
                },
                {
                  key: "project",
                  label: "Project",
                  onClick: () => onAddEntity("project"),
                },
              ],
            },
          ],
        },
        {
          type: "group",
          label: "REPORTS",
          children: [
            {
              key: "reports",
              icon: <FileTextOutlined />,
              label: "Generate report",
              onClick: onReport,
            },
          ],
        },
        {
          type: "group",
          label: "SYSTEM",
          children: [
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              onClick: onSettings,
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: onLogout,
            },
          ],
        },
      ]}
    />
  );
  return (
    <>
      <Sider
        className="sidebar"
        collapsed={collapsed}
        collapsedWidth={80}
        width={250}
        trigger={null}
      >
        <div className="sidebar-head">
          <img
            className="sidebar-logo full-logo"
            src={brandingConfig.logo}
            alt={brandingConfig.name}
          />
          <img
            className="sidebar-logo mark-logo"
            src={brandingConfig.logoMark}
            alt={brandingConfig.name}
          />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
          />
        </div>
        {menu}
        <div className="system-status">
          <span className="status-dot" />
          <div>
            <strong>System status</strong>
            <small>All systems operational</small>
          </div>
        </div>
      </Sider>
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={onMobileClose}
        size="default"
        className="mobile-drawer"
        closable={false}
      >
        <div className="drawer-menu">{menu}</div>
      </Drawer>
    </>
  );
}
