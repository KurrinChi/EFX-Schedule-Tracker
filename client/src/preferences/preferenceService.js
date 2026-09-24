import { preferenceDefaults } from "./preferenceDefaults";
import { preferenceKeys } from "./preferenceKeys";

const read = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const preferenceService = {
  load() {
    return {
      theme: read(preferenceKeys.theme, preferenceDefaults.theme),
      sidebarCollapsed: read(
        preferenceKeys.sidebarCollapsed,
        preferenceDefaults.sidebarCollapsed,
      ),
      compactMode: read(
        preferenceKeys.compactMode,
        preferenceDefaults.compactMode,
      ),
    };
  },
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
