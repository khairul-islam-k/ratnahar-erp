import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthResponse, AuthUser } from "../../../types/auth";
import { authApi } from "@/lib/api/auth";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: AuthResponse) => void;
  refresh: () => Promise<string>;
  initializeAuth: () => void;
};

const cookieOptions = {
  path: "/",
  expires: 7,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const USER = "user";
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  refresh: async () => {
    const { accessToken, refreshToken } = await authApi.refresh();
    console.log('refres', refreshToken);
    Cookies.set(ACCESS_TOKEN, accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN, refreshToken, cookieOptions);
    set({ accessToken, refreshToken });
    return accessToken;
  },

  initializeAuth: () => {
    const userCookie = Cookies.get(USER);
    const accessToken = Cookies.get(ACCESS_TOKEN) ?? null;
    const refreshToken = Cookies.get(REFRESH_TOKEN) ?? null;

    let user: AuthUser | null = null;
    if (userCookie) {
      try {
        user = JSON.parse(userCookie) as AuthUser;
      } catch {
        Cookies.remove(USER, { path: "/" });
      }
    }

    set({ user, accessToken, refreshToken });
  },

  setAuth: ({ user, accessToken, refreshToken }) => {
    Cookies.set(USER, JSON.stringify(user), cookieOptions);
    Cookies.set(ACCESS_TOKEN, accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN, refreshToken, cookieOptions);
    set({ user, accessToken, refreshToken });
  }

}));
