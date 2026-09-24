import api from "./api";
import { apiConfig } from "../config/apiConfig";
import { mockDatabase } from "../mocks/mockDatabase";

const SESSION_KEY = "efx_session";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 450));

export const authService = {
  async login({ identifier, password }) {
    if (!apiConfig.useMockApi)
      return (await api.post("/auth/login", { identifier, password })).data;
    const valid =
      (identifier === "admin@efxcreations.test" || identifier === "admin") &&
      password === "Admin123!";
    if (!valid)
      throw new Error(
        "Unable to sign in. Please check your credentials and try again.",
      );
    const user = mockDatabase.users[0];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return delay(user);
  },
  async register(values) {
    if (!apiConfig.useMockApi)
      return (await api.post("/auth/register", values)).data;
    return delay({ ...values, id: `usr-${Date.now()}`, role: "Staff" });
  },
  async me() {
    if (!apiConfig.useMockApi) return (await api.get("/auth/me")).data;
    const session = sessionStorage.getItem(SESSION_KEY);
    return delay(session ? JSON.parse(session) : null);
  },
  async logout() {
    if (!apiConfig.useMockApi) await api.post("/auth/logout");
    sessionStorage.removeItem(SESSION_KEY);
    return delay(true);
  },
};
