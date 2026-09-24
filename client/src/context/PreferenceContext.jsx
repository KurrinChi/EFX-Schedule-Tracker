import { createContext, useContext, useEffect, useState } from "react";
import { preferenceDefaults } from "../preferences/preferenceDefaults";
import { preferenceService } from "../preferences/preferenceService";

const PreferenceContext = createContext(null);

export function PreferenceProvider({ children }) {
  const [preferences, setPreferences] = useState(() =>
    preferenceService.load(),
  );
  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.compact = preferences.compactMode
      ? "true"
      : "false";
  }, [preferences]);
  const update = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    preferenceService.save(key, value);
  };
  const value = {
    ...preferences,
    setTheme: (value) => update("theme", value),
    setSidebarCollapsed: (value) => update("sidebarCollapsed", value),
    setCompactMode: (value) => update("compactMode", value),
    resetPreferences: () => setPreferences(preferenceDefaults),
  };
  return (
    <PreferenceContext.Provider value={value}>
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferenceContext);
}
