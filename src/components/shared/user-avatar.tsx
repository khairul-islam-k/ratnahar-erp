"use client";
import Link from "next/link";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.store";
import { useAuthMutation } from "@/lib/api/hooks/auth";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/toast";
import { getImageUrl } from "@/lib/image-url";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserAvatar = () => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthMutation();
  const router = useRouter();
  if (!user) return null;

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const dashboardHref = user.type === "ADMIN"
    ? "/dashboard/admin-dashboard"
    : "/dashboard/tenant-dashboard";

  const handleLogout = async () => {
    const confirmed = await toast.confirm("Are you sure you want to log out?", {
      confirmLabel: "Log out",
      cancelLabel: "Cancel",
      destructive: true,
      cancelDestructive: true,
    });
    if (!confirmed) return;

    try {
      await logout.mutateAsync();
      router.push("/");
      toast.success('logout successfully')
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open account menu for ${user.name}`}
        title={`${user.name} - ${user.email}`}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        <Avatar className="size-10 border border-slate-200 bg-white">
          {user.photo && <AvatarImage src={getImageUrl(user.photo) ?? undefined} alt={`${user.name}'s profile photo`} />}
          <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-800">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="normal-case">
            <span className="block truncate font-semibold text-slate-900">{user.name}</span>
            <span className="mt-0.5 block truncate font-normal text-slate-500">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />} className="cursor-pointer">
          <UserRound aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={dashboardHref} />} className="cursor-pointer">
          <LayoutDashboard aria-hidden="true" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={logout.isPending}
          onClick={() => void handleLogout()}
        >
          <LogOut aria-hidden="true" />
          {logout.isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
