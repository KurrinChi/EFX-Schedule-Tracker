import { Drawer, Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
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

  const menuItems = [
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
  ];

  /*
   * IMPORTANT:
   *
   * Do NOT use:
   *
   *   theme={theme}
   *
   * on Menu.
   *
   * ConfigProvider + themeComponentTokens() is responsible
   * for the application's theme.
   */

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={["dashboard"]}
      items={menuItems}
      className="efx-sidebar-menu"
    />
  );

  /*
   * ----------------------------------------------------------
   * SIDEBAR LOGO TOGGLE
   * ----------------------------------------------------------
   *
   * The logo itself is now the sidebar collapse/expand control.
   *
   * Dark mode:
   * Black SVG → inverted to white.
   *
   * Light mode:
   * Original black SVG.
   */
  const logoToggle = (
    <button
      type="button"
      className={`sidebar-logo-toggle ${
        collapsed ? "sidebar-logo-toggle-collapsed" : ""
      }`}
      onClick={() => onCollapse(!collapsed)}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <img
        className={`sidebar-logo ${collapsed ? "mark-logo" : "full-logo"}`}
        src={collapsed ? brandingConfig.logoMark : brandingConfig.logo}
        alt={brandingConfig.name}
      />
    </button>
  );

  return (
    <>
      <Sider
        className={`sidebar ${
          theme === "dark" ? "sidebar-dark" : "sidebar-light"
        }`}
        collapsed={collapsed}
        collapsedWidth={80}
        width={250}
        trigger={null}
        theme={theme === "dark" ? "dark" : "light"}
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <div className="sidebar-head">{logoToggle}</div>

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
        className={`mobile-drawer ${
          theme === "dark" ? "mobile-drawer-dark" : "mobile-drawer-light"
        }`}
        closable={false}
        styles={{
          body: {
            padding: 0,
            background: "var(--sidebar-bg)",
          },
          header: {
            background: "var(--sidebar-bg)",
          },
        }}
      >
        <div className="drawer-menu">
          {menu}

          <div className="system-status">
            <span className="status-dot" />

            <div>
              <strong>System status</strong>
              <small>All systems operational</small>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
