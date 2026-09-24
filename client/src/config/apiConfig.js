export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== "false",
  timeout: 10000,
};
