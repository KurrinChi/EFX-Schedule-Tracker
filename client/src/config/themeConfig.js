import { theme } from "antd";

export const themeModes = { dark: "dark", light: "light" };

const shared = {
  colorPrimary: "#ff8a00",
  colorPrimaryHover: "#ff9f2f",
  colorPrimaryActive: "#d96e00",
  colorSuccess: "#2f9e5b",
  colorWarning: "#d98200",
  colorError: "#d64545",
  colorInfo: "#ff8a00",
  borderRadius: 8,
  controlHeight: 38,
  fontFamily: "'DM Sans', sans-serif",
};

export const themeConfig = {
  dark: {
    algorithm: theme.darkAlgorithm,
    token: {
      ...shared,
      colorBgBase: "#0b0b0b",
      colorBgContainer: "#111111",
      colorBgElevated: "#161616",
      colorBgLayout: "#0b0b0b",
      colorBorder: "#242424",
      colorBorderSecondary: "#202020",
      colorText: "#f5f5f5",
      colorTextSecondary: "#b0b0b0",
      colorTextTertiary: "#999999",
      colorTextPlaceholder: "#888888",
      colorFill: "#242424",
      colorFillSecondary: "#1b1b1b",
      colorFillTertiary: "#161616",
    },
  },
  light: {
    algorithm: theme.defaultAlgorithm,
    token: {
      ...shared,
      colorPrimary: "#e87500",
      colorPrimaryHover: "#f08a19",
      colorPrimaryActive: "#c96500",
      colorBgBase: "#f5f6f8",
      colorBgContainer: "#ffffff",
      colorBgElevated: "#ffffff",
      colorBgLayout: "#f5f6f8",
      colorBorder: "#e5e7eb",
      colorBorderSecondary: "#eef0f2",
      colorText: "#171717",
      colorTextSecondary: "#525252",
      colorTextTertiary: "#737373",
      colorTextPlaceholder: "#737373",
      colorFill: "#eef0f2",
      colorFillSecondary: "#f5f6f8",
      colorFillTertiary: "#fafafa",
    },
  },
};

export const themeComponentTokens = (mode) =>
  mode === "light"
    ? {
        Button: { controlHeightLG: 48, primaryShadow: "none" },
        Input: { activeBorderColor: "#e87500", hoverBorderColor: "#f08a19" },
        Card: { colorBgContainer: "#ffffff" },
        Table: {
          headerBg: "#f5f6f8",
          rowHoverBg: "#fff8ef",
          borderColor: "#e5e7eb",
        },
        Menu: {
          itemBg: "#ffffff",
          itemSelectedBg: "#fff1df",
          itemSelectedColor: "#c96500",
          itemColor: "#525252",
          itemHoverBg: "#fff8ef",
          itemHoverColor: "#c96500",
        },
        Modal: {
          contentBg: "#ffffff",
          headerBg: "#ffffff",
          footerBg: "#ffffff",
        },
        Drawer: { colorBgElevated: "#ffffff" },
      }
    : {
        Button: { controlHeightLG: 48, primaryShadow: "none" },
        Input: { activeBorderColor: "#ff8a00", hoverBorderColor: "#ff9f2f" },
        Card: { colorBgContainer: "#111111" },
        Table: {
          headerBg: "#161616",
          rowHoverBg: "#191919",
          borderColor: "#242424",
        },
        Menu: {
          darkItemBg: "#0d0d0d",
          darkSubMenuItemBg: "#0d0d0d",
          darkItemSelectedBg: "#2a1c0d",
          darkItemSelectedColor: "#ff9f2f",
          darkItemColor: "#b0b0b0",
        },
        Modal: {
          contentBg: "#111111",
          headerBg: "#111111",
          footerBg: "#111111",
        },
        Drawer: { colorBgElevated: "#161616" },
      };

export const themeVariables = {
  dark: {
    "--app-bg": "#0b0b0b",
    "--app-panel": "#111111",
    "--app-panel-elevated": "#161616",
    "--app-border": "#242424",
    "--app-text": "#f5f5f5",
    "--app-text-secondary": "#b0b0b0",
    "--app-text-muted": "#999999",
    "--app-primary": "#ff8a00",
    "--app-shadow": "0 16px 40px rgba(0, 0, 0, .22)",
  },
  light: {
    "--app-bg": "#f5f6f8",
    "--app-panel": "#ffffff",
    "--app-panel-elevated": "#ffffff",
    "--app-border": "#e5e7eb",
    "--app-text": "#171717",
    "--app-text-secondary": "#525252",
    "--app-text-muted": "#737373",
    "--app-primary": "#e87500",
    "--app-shadow": "0 12px 32px rgba(23, 23, 23, .08)",
  },
};
