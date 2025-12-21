import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // Cookie will be sent to server
});

// Attach access token into request header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState(); // Using getState for not changing the state of this accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
