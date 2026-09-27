import { theme } from "antd";

// ============================================================
// EFX CREATIONS — COFFEE THEME
//
// #131010  Espresso Black
// #543A14  Dark Coffee
// #F0BB78  Caramel
// #FFF0DC  Cream
// ============================================================

export const themeVariables = {
  dark: {
    // Main surfaces
    "--app-bg": "#131010",
    "--app-panel": "#1B1612",
    "--app-panel-elevated": "#251C14",
    "--app-border": "#543A14",

    // Text
    "--app-text": "#FFF0DC",
    "--app-text-secondary": "#F0BB78",
    "--app-text-muted": "#C6A77E",

    // Brand
    "--app-primary": "#F0BB78",
    "--app-primary-hover": "#FFF0DC",

    // Layout
    "--page-bg": "#131010",
    "--panel-bg": "#1B1612",
    "--sidebar-bg": "#543A14",

    // Borders
    "--border-color": "#543A14",

    // Text aliases
    "--text-primary": "#FFF0DC",
    "--text-secondary": "#F0BB78",
    "--text-muted": "#C6A77E",

    "--app-shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
  },

  light: {
    // Main surfaces
    "--app-bg": "#FFF0DC",
    "--app-panel": "#FFFFFF",
    "--app-panel-elevated": "#FFF8EF",
    "--app-border": "#D8B47A",

    // Text
    "--app-text": "#131010",
    "--app-text-secondary": "#543A14",
    "--app-text-muted": "#76572D",

    // Brand
    "--app-primary": "#543A14",
    "--app-primary-hover": "#F0BB78",

    // Layout
    "--page-bg": "#FFF0DC",
    "--panel-bg": "#FFFFFF",
    "--sidebar-bg": "#543A14",

    // Borders
    "--border-color": "#D8B47A",

    // Text aliases
    "--text-primary": "#131010",
    "--text-secondary": "#543A14",
    "--text-muted": "#76572D",

    "--app-shadow": "0 8px 24px rgba(84, 58, 20, 0.16)",
  },
};

// ============================================================
// ANT DESIGN GLOBAL THEME
// ============================================================

export const themeConfig = {
  dark: {
    algorithm: theme.darkAlgorithm,

    token: {
      colorPrimary: "#F0BB78",
      colorPrimaryHover: "#FFF0DC",
      colorPrimaryActive: "#D89B55",

      colorBgBase: "#131010",
      colorBgLayout: "#131010",
      colorBgContainer: "#1B1612",
      colorBgElevated: "#251C14",

      colorText: "#FFF0DC",
      colorTextSecondary: "#F0BB78",
      colorTextTertiary: "#C6A77E",
      colorTextQuaternary: "#8E7048",

      colorBorder: "#543A14",
      colorBorderSecondary: "#3A2812",

      colorFill: "#543A14",
      colorFillSecondary: "#251C14",
      colorFillTertiary: "#1B1612",
      colorFillQuaternary: "#131010",

      colorLink: "#F0BB78",
      colorLinkHover: "#FFF0DC",
      colorLinkActive: "#D89B55",

      colorError: "#D66A5C",
      colorWarning: "#F0BB78",
      colorSuccess: "#8EAF72",
      colorInfo: "#F0BB78",

      borderRadius: 8,
      controlHeight: 38,

      fontFamily: '"DM Sans", sans-serif',
      fontSize: 13,

      lineWidth: 1,

      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
    },
  },

  light: {
    algorithm: theme.defaultAlgorithm,

    token: {
      colorPrimary: "#543A14",
      colorPrimaryHover: "#76572D",
      colorPrimaryActive: "#382509",

      colorBgBase: "#FFF0DC",
      colorBgLayout: "#FFF0DC",
      colorBgContainer: "#FFFFFF",
      colorBgElevated: "#FFF8EF",

      colorText: "#131010",
      colorTextSecondary: "#543A14",
      colorTextTertiary: "#76572D",
      colorTextQuaternary: "#9A7A4C",

      colorBorder: "#D8B47A",
      colorBorderSecondary: "#E9D0A9",

      colorFill: "#F0BB78",
      colorFillSecondary: "#FFF8EF",
      colorFillTertiary: "#FFF0DC",
      colorFillQuaternary: "#F0BB78",

      colorLink: "#543A14",
      colorLinkHover: "#76572D",
      colorLinkActive: "#382509",

      colorError: "#B94E42",
      colorWarning: "#A96D25",
      colorSuccess: "#5F7E4F",
      colorInfo: "#543A14",

      borderRadius: 8,
      controlHeight: 38,

      fontFamily: '"DM Sans", sans-serif',
      fontSize: 13,

      lineWidth: 1,

      boxShadow: "0 8px 24px rgba(84, 58, 20, 0.16)",
    },
  },
};

// ============================================================
// COMPONENT TOKENS
// ============================================================

export const themeComponentTokens = (themeName) => {
  const dark = themeName === "dark";

  const c = {
    background: dark ? "#131010" : "#FFF0DC",
    panel: dark ? "#1B1612" : "#FFFFFF",
    elevated: dark ? "#251C14" : "#FFF8EF",

    text: dark ? "#FFF0DC" : "#131010",
    secondary: dark ? "#F0BB78" : "#543A14",
    muted: dark ? "#C6A77E" : "#76572D",

    border: dark ? "#543A14" : "#D8B47A",

    primary: dark ? "#F0BB78" : "#543A14",
    primaryHover: dark ? "#FFF0DC" : "#F0BB78",

    selected: dark ? "#543A14" : "#F0BB78",
  };

  return {
    // ========================================================
    // LAYOUT
    // ========================================================

    Layout: {
      headerBg: dark ? "#1B1612" : "#FFFFFF",
      siderBg: "#543A14",
      bodyBg: c.background,

      headerHeight: 82,
      headerPadding: "0 36px",
    },

    // ========================================================
    // MENU
    // ========================================================

    Menu: {
      itemBg: "transparent",

      itemColor: "#FFF0DC",

      itemHoverColor: "#131010",
      itemHoverBg: "#F0BB78",

      itemSelectedColor: "#131010",
      itemSelectedBg: "#F0BB78",

      itemActiveBg: "#F0BB78",

      subMenuItemBg: "transparent",

      groupTitleColor: "#F0BB78",
    },

    // ========================================================
    // CARD
    // ========================================================

    Card: {
      colorBgContainer: c.panel,
      colorBorderSecondary: c.border,

      borderRadiusLG: 8,
    },

    // ========================================================
    // TABLE
    // ========================================================

    Table: {
      headerBg: c.elevated,
      headerColor: c.text,

      rowHoverBg: dark ? "#2D2116" : "#FFF3E4",

      borderColor: c.border,

      colorText: c.text,
    },

    // ========================================================
    // INPUT
    // ========================================================

    Input: {
      colorBgContainer: c.panel,
      colorBorder: c.border,

      colorText: c.text,
      colorTextPlaceholder: c.muted,

      activeBorderColor: c.primary,
      hoverBorderColor: c.primary,
    },

    InputNumber: {
      colorBgContainer: c.panel,
      colorBorder: c.border,

      colorText: c.text,
      colorTextPlaceholder: c.muted,

      activeBorderColor: c.primary,
      hoverBorderColor: c.primary,
    },

    // ========================================================
    // SELECT
    // ========================================================

    Select: {
      colorBgContainer: c.panel,
      colorBorder: c.border,

      colorText: c.text,

      optionSelectedBg: c.selected,
      optionActiveBg: c.elevated,
    },

    // ========================================================
    // BUTTON
    // ========================================================

    Button: {
      primaryShadow: "none",

      colorPrimary: c.primary,
      colorPrimaryHover: c.primaryHover,

      colorPrimaryActive: dark ? "#D89B55" : "#382509",

      defaultBg: c.panel,
      defaultColor: c.text,
      defaultBorderColor: c.border,

      defaultHoverBg: c.elevated,
      defaultHoverColor: c.text,
      defaultHoverBorderColor: c.primary,
    },

    // ========================================================
    // MODAL
    // ========================================================

    Modal: {
      contentBg: c.panel,
      headerBg: c.panel,

      titleColor: c.text,

      colorIcon: c.secondary,
      colorIconHover: c.text,
    },

    // ========================================================
    // DRAWER
    // ========================================================

    Drawer: {
      colorBgElevated: c.panel,
      colorText: c.text,
    },

    // ========================================================
    // DROPDOWN
    // ========================================================

    Dropdown: {
      colorBgElevated: c.elevated,

      controlItemBgHover: c.selected,
    },

    // ========================================================
    // FORM
    // ========================================================

    Form: {
      labelColor: c.secondary,
      labelFontSize: 12,
    },

    // ========================================================
    // TYPOGRAPHY
    // ========================================================

    Typography: {
      colorText: c.text,
      colorTextSecondary: c.secondary,

      colorLink: c.primary,
      colorLinkHover: c.primaryHover,
    },

    // ========================================================
    // TAG
    // ========================================================

    Tag: {
      defaultBg: c.elevated,
      defaultColor: c.secondary,
    },

    // ========================================================
    // SWITCH
    // ========================================================

    Switch: {
      colorPrimary: c.primary,
      colorPrimaryHover: c.primaryHover,
    },

    // ========================================================
    // TABS
    // ========================================================

    Tabs: {
      itemColor: c.muted,

      itemHoverColor: c.primary,
      itemSelectedColor: c.primary,

      inkBarColor: c.primary,
    },

    // ========================================================
    // PAGINATION
    // ========================================================

    Pagination: {
      itemActiveBg: c.primary,
      itemBg: c.panel,
      itemLinkBg: c.panel,
      itemColor: c.secondary,
    },

    // ========================================================
    // DATE PICKER
    // ========================================================

    DatePicker: {
      colorBgContainer: c.panel,
      colorBgElevated: c.elevated,

      colorBorder: c.border,

      colorText: c.text,
      colorTextPlaceholder: c.muted,

      activeBorderColor: c.primary,
      hoverBorderColor: c.primary,
    },

    // ========================================================
    // CALENDAR
    // ========================================================

    Calendar: {
      colorBgContainer: c.panel,
      colorBgElevated: c.elevated,

      colorText: c.text,
      colorTextHeading: c.text,
      colorTextDescription: c.secondary,

      colorBorder: c.border,

      itemActiveBg: c.primary,
    },

    // ========================================================
    // TOOLTIP
    // ========================================================

    Tooltip: {
      colorBgSpotlight: "#543A14",
      colorTextLightSolid: "#FFF0DC",
    },

    // ========================================================
    // POPOVER
    // ========================================================

    Popover: {
      colorBgElevated: c.elevated,
    },

    // ========================================================
    // MESSAGE
    // ========================================================

    Message: {
      contentBg: c.panel,
      colorText: c.text,
    },

    // ========================================================
    // NOTIFICATION
    // ========================================================

    Notification: {
      colorBgElevated: c.panel,
      colorText: c.text,
    },

    // ========================================================
    // ALERT
    // ========================================================

    Alert: {
      colorInfoBg: c.elevated,
      colorInfoBorder: c.border,

      colorText: c.text,
      colorTextHeading: c.text,
    },

    // ========================================================
    // PROGRESS
    // ========================================================

    Progress: {
      defaultColor: c.primary,
    },

    // ========================================================
    // SPIN
    // ========================================================

    Spin: {
      colorPrimary: c.primary,
    },

    // ========================================================
    // SKELETON
    // ========================================================

    Skeleton: {
      gradientFromColor: c.elevated,
      gradientToColor: c.panel,
    },

    // ========================================================
    // AVATAR
    // ========================================================

    Avatar: {
      colorBgContainer: c.primary,
      colorTextPlaceholder: dark ? "#131010" : "#FFF0DC",
    },

    // ========================================================
    // BADGE
    // ========================================================

    Badge: {
      colorBgContainer: c.panel,
    },

    // ========================================================
    // STEPS
    // ========================================================

    Steps: {
      colorPrimary: c.primary,

      colorText: c.text,
      colorTextDescription: c.secondary,

      colorBorder: c.border,
    },

    // ========================================================
    // SEGMENTED
    // ========================================================

    Segmented: {
      itemColor: c.secondary,

      itemHoverColor: c.text,

      itemSelectedColor: dark ? "#131010" : "#FFF0DC",

      itemSelectedBg: c.primary,

      trackBg: c.elevated,
    },

    // ========================================================
    // BREADCRUMB
    // ========================================================

    Breadcrumb: {
      itemColor: c.muted,

      lastItemColor: c.text,

      linkColor: c.secondary,
      linkHoverColor: c.primary,
    },
  };
};
