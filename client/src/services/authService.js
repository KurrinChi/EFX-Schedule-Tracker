import api from "./api";

const AUTH_TOKEN_KEY = "efx_auth_token";
const CURRENT_USER_KEY = "efx_current_user";

const getApiError = (error) => {
  const responseData = error.response?.data;
  const validationErrors = responseData?.errors
    ? Object.values(responseData.errors).join(" ")
    : "";
  const message = validationErrors || responseData?.message || error.message;

  return new Error(message || "Authentication request failed.");
};

export const authService = {
  async login({ identifier, password }) {
    try {
      const response = await api.post("/auth/login", { identifier, password });
      const { token, user } = response.data;

      if (token) {
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      }

      if (user) {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      }

      return user;
    } catch (error) {
      throw getApiError(error);
    }
  },

  async register(values) {
    try {
      const response = await api.post("/auth/register", values);
      return response.data;
    } catch (error) {
      throw getApiError(error);
    }
  },

  async me() {
    const response = await api.get("/auth/me");
    const user = response.data?.user ?? response.data;

    if (user) {
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    return user;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore backend logout failures; local session cleanup should still happen.
    }

    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    return true;
  },
};
