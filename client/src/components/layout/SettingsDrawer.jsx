import {
  Descriptions,
  Divider,
  Drawer,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useAuth } from "../../hooks/useAuth";
import { usePreferences } from "../../hooks/usePreferences";
import { apiConfig } from "../../config/apiConfig";
import { appConfig } from "../../config/appConfig";

export default function SettingsDrawer({ open, onClose }) {
  const { user, logout } = useAuth();
  const {
    theme,
    setTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    compactMode,
    setCompactMode,
  } = usePreferences();
  return (
    <Drawer
      title="Workspace settings"
      open={open}
      onClose={onClose}
      size="default"
    >
      <Typography.Title level={5}>Appearance</Typography.Title>
      <div className="setting-row">
        <span>
          Theme<small>Choose the workspace appearance</small>
        </span>
        <Select
          value={theme}
          onChange={setTheme}
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />
      </div>
      <div className="setting-row">
        <span>
          Sidebar<small>Keep navigation expanded by default</small>
        </span>
        <Switch
          checked={!sidebarCollapsed}
          checkedChildren="Expanded"
          unCheckedChildren="Collapsed"
          onChange={(expanded) => setSidebarCollapsed(!expanded)}
        />
      </div>
      <div className="setting-row">
        <span>
          Compact mode<small>Reduce table and panel spacing</small>
        </span>
        <Switch checked={compactMode} onChange={setCompactMode} />
      </div>
      <Divider />
      <Typography.Title level={5}>Account</Typography.Title>
      <Descriptions
        column={1}
        size="small"
        items={[
          {
            key: "name",
            label: "Current user",
            children: user?.fullName || "-",
          },
          { key: "email", label: "Email", children: user?.email || "-" },
          {
            key: "role",
            label: "Role",
            children: <Tag color="orange">{user?.role || "Staff"}</Tag>,
          },
        ]}
      />
      <Divider />
      <Typography.Title level={5}>System</Typography.Title>
      <Descriptions
        column={1}
        size="small"
        items={[
          {
            key: "version",
            label: "Application version",
            children: appConfig.version,
          },
          {
            key: "api",
            label: "API mode",
            children: (
              <Tag color={apiConfig.useMockApi ? "gold" : "green"}>
                {apiConfig.useMockApi ? "Mock API" : "REST API"}
              </Tag>
            ),
          },
        ]}
      />
      <Divider />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Text type="secondary">Session</Typography.Text>
        <a onClick={logout}>Sign out of this workspace</a>
      </Space>
    </Drawer>
  );
}
