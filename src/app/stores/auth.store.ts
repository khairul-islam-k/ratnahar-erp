import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthResponse, AuthUser, Permissions } from "../../../types/auth";
import { authApi } from "@/lib/api/auth";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permission: Permissions[] | null;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  refresh: () => Promise<string>;
  initializeAuth: () => Promise<void>;
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

function parseTokenCookie(value?: string): string | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "string" ? parsed : value;
  } catch {
    // Existing token cookies are stored as plain strings, so keep them usable.
    return value;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  permission: null,

  refresh: async () => {
    const { accessToken, refreshToken } = await authApi.refresh();
    
    Cookies.set(ACCESS_TOKEN, accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN, refreshToken, cookieOptions);
    set({ accessToken, refreshToken });
    return accessToken;
  },

  setAuth: ({ user, accessToken, refreshToken, permission }) => {
    Cookies.set(USER, JSON.stringify(user), cookieOptions);
    Cookies.set(ACCESS_TOKEN, accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN, refreshToken, cookieOptions);
    set({ user, accessToken, refreshToken, permission });
  },

  logout: async () => {
    try {
      await authApi.logout();
      Cookies.remove(USER, { path: "/" });
      Cookies.remove(ACCESS_TOKEN, { path: "/" });
      Cookies.remove(REFRESH_TOKEN, { path: "/" });
      set({ user: null, accessToken: null, refreshToken: null });
    } catch (error) {
      console.error("Logout API request failed:", error);
    }
  },
  
  initializeAuth: async () => {
    const userCookie = Cookies.get(USER);
    const accessToken = parseTokenCookie(Cookies.get(ACCESS_TOKEN));
    const refreshToken = parseTokenCookie(Cookies.get(REFRESH_TOKEN));

    let user: AuthUser | null = null;
    if (userCookie) {
      try {
        user = JSON.parse(userCookie) as AuthUser;
      } catch {
        Cookies.remove(USER, { path: "/" });
      }
    }

    set({ user, accessToken, refreshToken });

    if (accessToken || refreshToken) {
      try {
        const response = await authApi.permission();
        set({ permission: response.data });
      } catch (error) {
        console.error("Unable to load permissions:", error);
      }
    }
  },

}));
