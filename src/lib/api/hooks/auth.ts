"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/app/stores/auth.store";

export function useAuthMutation() {
  const logoutFromStore = useAuthStore((state) => state.logout);

  return {
    logout: useMutation({
      mutationFn: () => logoutFromStore(),
    }),
  };
}
