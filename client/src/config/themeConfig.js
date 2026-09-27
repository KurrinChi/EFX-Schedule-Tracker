import { theme } from "antd";

// ============================================================
// EFX CREATIONS — NEW COLOR PALETTE
//
// Black
// #f5f3ef → #16130e
//
// Dim Grey
// #f2f2f3 → #111113
//
// Rosy Granite
// #f2f2f3 → #111113
//
// Platinum
// #f1f1f4 → #101014
//
// Amber Flame
// #fef7e6 → #231901
// #f9b006 → Primary accent
// ============================================================

export const themeVariables = {
  dark: {
    // ========================================================
    // MAIN SURFACES
    // ========================================================

    "--app-bg": "#16130e",
    "--app-panel": "#1f1b14",
    "--app-panel-elevated": "#3f3727",
    "--app-border": "#5e523b",

    // ========================================================
    // TEXT
    // ========================================================

    "--app-text": "#f5f3ef",
    "--app-text-secondary": "#c4b8a1",
    "--app-text-muted": "#9d8962",

    // ========================================================
    // BRAND
    // ========================================================

    "--app-primary": "#f9b006",
    "--app-primary-hover": "#fac038",

    // ========================================================
    // LAYOUT
    // ========================================================

    "--page-bg": "#16130e",
    "--panel-bg": "#1f1b14",
    "--sidebar-bg": "#1f1b14",

    // ========================================================
    // BORDERS
    // ========================================================

    "--border-color": "#5e523b",

    // ========================================================
    // TEXT ALIASES
    // ========================================================

    "--text-primary": "#f5f3ef",
    "--text-secondary": "#c4b8a1",
    "--text-muted": "#9d8962",

    // ========================================================
    // SHADOW
    // ========================================================

    "--app-shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
  },

  light: {
    // ========================================================
    // MAIN SURFACES
    // ========================================================

    "--app-bg": "#f5f3ef",
    "--app-panel": "#ffffff",
    "--app-panel-elevated": "#f2f2f3",
    "--app-border": "#d8d0c0",

    // ========================================================
    // TEXT
    // ========================================================

    "--app-text": "#16130e",
    "--app-text-secondary": "#5e523b",
    "--app-text-muted": "#7d6e4f",

    // ========================================================
    // BRAND
    // ========================================================

    "--app-primary": "#f9b006",
    "--app-primary-hover": "#fac038",

    // ========================================================
    // LAYOUT
    // ========================================================

    "--page-bg": "#f5f3ef",
    "--panel-bg": "#ffffff",
    "--sidebar-bg": "#1f1b14",

    // ========================================================
    // BORDERS
    // ========================================================

    "--border-color": "#d8d0c0",

    // ========================================================
    // TEXT ALIASES
    // ========================================================

    "--text-primary": "#16130e",
    "--text-secondary": "#5e523b",
    "--text-muted": "#7d6e4f",

    // ========================================================
    // SHADOW
    // ========================================================

    "--app-shadow": "0 8px 24px rgba(22, 19, 14, 0.16)",
  },
};

// ============================================================
// ANT DESIGN GLOBAL THEME
// ============================================================

export const themeConfig = {
  // ==========================================================
  // DARK THEME
  // ==========================================================

  dark: {
    algorithm: theme.darkAlgorithm,

    token: {
      // ------------------------------------------------------
      // BRAND
      // ------------------------------------------------------

      colorPrimary: "#f9b006",
      colorPrimaryHover: "#fac038",
      colorPrimaryActive: "#c78d05",

      // ------------------------------------------------------
      // BACKGROUNDS
      // ------------------------------------------------------

      colorBgBase: "#16130e",
      colorBgLayout: "#16130e",
      colorBgContainer: "#1f1b14",
      colorBgElevated: "#3f3727",

      // ------------------------------------------------------
      // TEXT
      // ------------------------------------------------------

      colorText: "#f5f3ef",
      colorTextSecondary: "#c4b8a1",
      colorTextTertiary: "#9d8962",
      colorTextQuaternary: "#7d6e4f",

      // ------------------------------------------------------
      // BORDERS
      // ------------------------------------------------------

      colorBorder: "#5e523b",
      colorBorderSecondary: "#3f3727",

      // ------------------------------------------------------
      // FILLS
      // ------------------------------------------------------

      colorFill: "#5e523b",
      colorFillSecondary: "#3f3727",
      colorFillTertiary: "#1f1b14",
      colorFillQuaternary: "#16130e",

      // ------------------------------------------------------
      // LINKS
      // ------------------------------------------------------

      colorLink: "#f9b006",
      colorLinkHover: "#fac038",
      colorLinkActive: "#c78d05",

      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

      colorError: "#d66a5c",
      colorWarning: "#f9b006",
      colorSuccess: "#8eaf72",
      colorInfo: "#f9b006",

      // ------------------------------------------------------
      // GLOBAL
      // ------------------------------------------------------

      borderRadius: 8,
      controlHeight: 38,

      fontFamily: '"DM Sans", sans-serif',
      fontSize: 13,

      lineWidth: 1,

      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
    },
  },

  // ==========================================================
  // LIGHT THEME
  // ==========================================================

  light: {
    algorithm: theme.defaultAlgorithm,

    token: {
      // ------------------------------------------------------
      // BRAND
      // ------------------------------------------------------

      colorPrimary: "#f9b006",
      colorPrimaryHover: "#fac038",
      colorPrimaryActive: "#c78d05",

      // ------------------------------------------------------
      // BACKGROUNDS
      // ------------------------------------------------------

      colorBgBase: "#f5f3ef",
      colorBgLayout: "#f5f3ef",
      colorBgContainer: "#ffffff",
      colorBgElevated: "#f2f2f3",

      // ------------------------------------------------------
      // TEXT
      // ------------------------------------------------------

      colorText: "#16130e",
      colorTextSecondary: "#5e523b",
      colorTextTertiary: "#7d6e4f",
      colorTextQuaternary: "#9d8962",

      // ------------------------------------------------------
      // BORDERS
      // ------------------------------------------------------

      colorBorder: "#d8d0c0",
      colorBorderSecondary: "#e4e4e7",

      // ------------------------------------------------------
      // FILLS
      // ------------------------------------------------------

      colorFill: "#fcdf9c",
      colorFillSecondary: "#f2f2f3",
      colorFillTertiary: "#f5f3ef",
      colorFillQuaternary: "#fef7e6",

      // ------------------------------------------------------
      // LINKS
      // ------------------------------------------------------

      colorLink: "#c78d05",
      colorLinkHover: "#956a04",
      colorLinkActive: "#634603",

      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

      colorError: "#b94e42",
      colorWarning: "#c78d05",
      colorSuccess: "#5f7e4f",
      colorInfo: "#c78d05",

      // ------------------------------------------------------
      // GLOBAL
      // ------------------------------------------------------

      borderRadius: 8,
      controlHeight: 38,

      fontFamily: '"DM Sans", sans-serif',
      fontSize: 13,

      lineWidth: 1,

      boxShadow: "0 8px 24px rgba(22, 19, 14, 0.16)",
    },
  },
};

// ============================================================
// COMPONENT TOKENS
// ============================================================

export const themeComponentTokens = (themeName) => {
  const dark = themeName === "dark";

  const c = {
    // ========================================================
    // BASE COLORS
    // ========================================================

    background: dark ? "#16130e" : "#f5f3ef",

    panel: dark ? "#1f1b14" : "#ffffff",

    elevated: dark ? "#3f3727" : "#f2f2f3",

    // ========================================================
    // TEXT
    // ========================================================

    text: dark ? "#f5f3ef" : "#16130e",

    secondary: dark ? "#c4b8a1" : "#5e523b",

    muted: dark ? "#9d8962" : "#7d6e4f",

    // ========================================================
    // BORDER
    // ========================================================

    border: dark ? "#5e523b" : "#d8d0c0",

    // ========================================================
    // BRAND
    // ========================================================

    primary: "#f9b006",

    primaryHover: "#fac038",

    // ========================================================
    // SELECTED
    // ========================================================

    selected: dark ? "#5e523b" : "#fcdf9c",
  };

  return {
    // ========================================================
    // LAYOUT
    // ========================================================

    Layout: {
      headerBg: dark ? "#1f1b14" : "#ffffff",

      siderBg: dark ? "#1f1b14" : "#1f1b14",

      bodyBg: c.background,

      headerHeight: 82,

      headerPadding: "0 36px",
    },

    // ========================================================
    // MENU
    // ========================================================

    Menu: {
      itemBg: "transparent",

      itemColor: "#f5f3ef",

      itemHoverColor: "#16130e",

      itemHoverBg: "#fac038",

      itemSelectedColor: "#16130e",

      itemSelectedBg: "#f9b006",

      itemActiveBg: "#f9b006",

      subMenuItemBg: "transparent",

      groupTitleColor: "#f9b006",
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

      rowHoverBg: dark ? "#2e271c" : "#fef7e6",

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

    // ========================================================
    // INPUT NUMBER
    // ========================================================

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

      colorPrimaryActive: dark ? "#c78d05" : "#c78d05",

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
  };
};
