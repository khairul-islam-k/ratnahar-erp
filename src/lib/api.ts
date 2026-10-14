import axios from "axios";
import { useAuthStore } from "@/app/stores/auth.store";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});
