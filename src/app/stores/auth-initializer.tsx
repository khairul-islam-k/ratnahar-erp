"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/stores/auth.store";

export default function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
