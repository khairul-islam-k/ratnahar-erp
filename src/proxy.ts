import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // These routes are available only to signed-in users.
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userCookie = request.cookies.get("user")?.value;
  let userType: string | undefined;

  try {
    userType = userCookie ? JSON.parse(userCookie)?.type : undefined;
  } catch {
    // Treat an invalid or missing user cookie as an unauthenticated session.
  }

  const isTenantDashboard = pathname.startsWith("/dashboard/tenant-dashboard");
  const isAdminDashboard = pathname.startsWith("/dashboard/admin-dashboard");

  if (
    (isTenantDashboard && userType !== "TENANT") ||
    (isAdminDashboard && userType !== "ADMIN")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/tenant-dashboard/:path*", "/dashboard/admin-dashboard/:path*"],
}
