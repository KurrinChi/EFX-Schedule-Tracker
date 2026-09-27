import { Avatar, Button, Dropdown, Empty, Input, Tag } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Header({
  onMobileMenu,
  onSearch,
  projects = [],
  onProjectSelect,
}) {
  const { user, logout } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  /*
   * ----------------------------------------------------------
   * PROJECT LIST
   * ----------------------------------------------------------
   *
   * This is the SAME projects array loaded by Dashboard.
   *
   * No additional API request is made here.
   */
  const projectList = Array.isArray(projects) ? projects : [];

  /*
   * ----------------------------------------------------------
   * PROJECT SEARCH
   * ----------------------------------------------------------
   *
   * Search fields:
   *
   * 1. clientName
   * 2. projectType
   * 3. packageName
   *
   * Search is:
   * - case-insensitive
   * - partial
   * - performed against the existing project list
   */
  const filteredProjects = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return projectList
      .filter((project) => {
        if (!project) {
          return false;
        }

        const clientName = String(project.clientName || "").toLowerCase();

        const projectType = String(project.projectType || "").toLowerCase();

        const packageName = String(project.packageName || "").toLowerCase();

        return (
          clientName.includes(query) ||
          projectType.includes(query) ||
          packageName.includes(query)
        );
      })
      .slice(0, 8);
  }, [projectList, searchValue]);

  /*
   * ----------------------------------------------------------
   * SEARCH INPUT
   * ----------------------------------------------------------
   */
  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchValue(value);

    /*
     * Keep the existing Dashboard / ProjectTable search
     * synchronized with the Header search.
     */
    if (typeof onSearch === "function") {
      onSearch(value);
    }

    setSearchOpen(Boolean(value.trim()));
  };

  /*
   * ----------------------------------------------------------
   * PROJECT SELECTION
   * ----------------------------------------------------------
   *
   * Sends the original project object to Dashboard.
   *
   * Dashboard then passes it to ProjectTable, which opens
   * its EXISTING Project Details modal.
   */
  const handleProjectSelect = (project) => {
    if (!project) {
      return;
    }

    if (typeof onProjectSelect === "function") {
      onProjectSelect(project);
    }

    /*
     * Clear Header search after selecting a project.
     */
    setSearchValue("");

    if (typeof onSearch === "function") {
      onSearch("");
    }

    setSearchOpen(false);
  };

  /*
   * ----------------------------------------------------------
   * SEARCH FOCUS / BLUR
   * ----------------------------------------------------------
   */
  const handleSearchFocus = () => {
    if (searchValue.trim()) {
      setSearchOpen(true);
    }
  };

  const handleSearchBlur = () => {
    /*
     * Delay closing so the project button's click event
     * can execute first.
     */
    window.setTimeout(() => {
      setSearchOpen(false);
    }, 150);
  };

  /*
   * ----------------------------------------------------------
   * PROJECT DISPLAY HELPERS
   * ----------------------------------------------------------
   */
  const getProjectId = (project) => {
    return project?.id || "";
  };

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
        <div
          className="header-search-wrapper"
          style={{
            position: "relative",
          }}
        >
          <Input
            className="header-search"
            prefix={<SearchOutlined />}
            placeholder="Search projects..."
            value={searchValue}
            allowClear
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />

          {searchOpen && searchValue.trim() && (
            <div
              className="header-search-results"
              onMouseDown={(event) => {
                /*
                 * Prevent Input blur from closing the
                 * dropdown before the project can be clicked.
                 */
                event.preventDefault();
              }}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                zIndex: 1050,
                background: "var(--app-panel, #1f1b14)",
                border: "1px solid var(--border-color, #5e523b)",
                borderRadius: "8px",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
                overflow: "hidden",
              }}
            >
              {filteredProjects.length > 0 ? (
                <div>
                  {filteredProjects.map((project, index) => {
                    const projectId = getProjectId(project);

                    const clientName = project.clientName || "—";

                    const projectType = project.projectType || "—";

                    const packageName = project.packageName || "—";

                    return (
                      <button
                        key={projectId || `project-${index}`}
                        type="button"
                        onClick={() => handleProjectSelect(project)}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "4px",
                          padding: "12px 14px",
                          border: "none",
                          borderBottom:
                            "1px solid var(--border-color, #5e523b)",
                          background: "transparent",
                          color: "var(--text-primary, #f5f3ef)",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background =
                            "var(--app-panel-elevated, #3f3727)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* CLIENT */}
                        <span
                          style={{
                            width: "100%",
                            fontSize: "13px",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {clientName}
                        </span>

                        {/* PROJECT TYPE */}
                        <span
                          style={{
                            width: "100%",
                            fontSize: "11px",
                            color: "var(--text-secondary, #c4b8a1)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {projectType}
                          {" • "}
                          {packageName}
                        </span>

                        {/* PROJECT ID */}
                        {projectId && (
                          <span
                            style={{
                              width: "100%",
                              fontSize: "10px",
                              color: "var(--text-muted, #9d8962)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ID: {projectId}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    padding: "20px 12px",
                  }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span
                        style={{
                          color: "var(--text-secondary, #c4b8a1)",
                          fontSize: "12px",
                        }}
                      >
                        No projects found
                      </span>
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <Dropdown
          menu={{
            items: [
              {
                key: "role",
                label: <Tag color="orange">{user?.role || "Staff"}</Tag>,
                disabled: true,
              },
              {
                type: "divider",
              },
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
            <Avatar icon={<UserOutlined />} />
            <span>{user?.fullName || "Team member"}</span>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
