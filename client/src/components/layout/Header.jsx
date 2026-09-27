import { Avatar, Button, Dropdown, Input, Tag } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

export default function Header({ onMobileMenu, onSearch }) {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <Button
        className="mobile-menu"
        type="text"
        icon={<MenuOutlined />}
        onClick={onMobileMenu}
      />
      <div className="header-title">
        <span>Workspace /</span>
        <strong>Overview</strong>
      </div>
      <div className="header-actions">
        <Input
          className="header-search"
          prefix={<SearchOutlined />}
          placeholder="Search projects..."
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
        <Button
          type="text"
          icon={<BellOutlined />}
          className="notification-button"
        />
        <Dropdown
          menu={{
            items: [
              {
                key: "role",
                label: <Tag color="orange">{user?.role || "Staff"}</Tag>,
                disabled: true,
              },
              { type: "divider" },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Sign out",
                onClick: logout,
              },
            ],
          }}
          placement="bottomRight"
        >
          <button className="profile-button">
            <Avatar icon={<UserOutlined />} />{" "}
            <span>{user?.fullName || "Team member"}</span>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
