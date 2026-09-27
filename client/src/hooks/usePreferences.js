import { useContext } from "react";
import { PreferenceContext } from "../context/preferenceContextValue";

export function usePreferences() {
  return useContext(PreferenceContext);
}
