import axios from "axios";
import { apiConfig } from "../config/apiConfig";

const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401)
      window.dispatchEvent(new Event("efx:session-expired"));
    return Promise.reject(error);
  },
);

export default api;
