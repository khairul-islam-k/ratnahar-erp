"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../stores/auth.store";

export default function Home() {
  const refresh = useAuthStore((state) => state.refresh);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage("");

    try {
      await refresh();
      setMessage("Tokens refreshed.");
    } catch {
      setMessage("Unable to refresh tokens.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3>MD: Khairul Islam</h3>
      <Button onClick={handleRefresh} disabled={isRefreshing}>
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
      {message && <p aria-live="polite">{message}</p>}
    </div>
  );
}
