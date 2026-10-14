import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/app/stores/auth.store";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export const publicApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

refreshApi.interceptors.request.use((config) => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (refreshToken) {
    config.headers.set("Authorization", `Bearer ${refreshToken}`);
  }

  return config;
});

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as typeof error.config & { _retry?: boolean };
    if (config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      refreshPromise ??= useAuthStore.getState().refresh();
      const accessToken = await refreshPromise;
      config.headers.set("Authorization", `Bearer ${accessToken}`);
      return api.request(config);
    } catch (refreshError) {
      useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
      Cookies.remove("user", { path: "/" });
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);
