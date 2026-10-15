"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "../../../../../types/auth";

type RoleRedirectProps = {
  userType: AuthUser["type"];
};

export default function RoleRedirect({ userType }: RoleRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    switch (userType) {
      case "TENANT":
        router.push("/dashboard/tenant-dashboard");
        break;
      case "ADMIN":
        router.push("/dashboard/admin-dashboard");
        break;
    }
  }, [router, userType]);

  return null;
}
