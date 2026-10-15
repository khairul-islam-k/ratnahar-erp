"use client";

import { useEffect, useState } from "react";
import { Check, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { TOAST_EVENT, type ToastMessage, type ToastVariant } from "@/lib/toast";

const variantStyles: Record<ToastVariant, { icon: typeof Check; className: string }> = {
  success: { icon: Check, className: "border-emerald-200 bg-emerald-50 text-emerald-950" },
  error: { icon: XCircle, className: "border-red-200 bg-red-50 text-red-950" },
  info: { icon: Info, className: "border-blue-200 bg-blue-50 text-blue-950" },
  warning: { icon: TriangleAlert, className: "border-amber-200 bg-amber-50 text-amber-950" },
};

export function Toaster() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const timers = new Map<number, ReturnType<typeof setTimeout>>();

    const removeToast = (id: number) => {
      const timer = timers.get(id);
      if (timer) clearTimeout(timer);
      timers.delete(id);
      setMessages((current) => current.filter((item) => item.id !== id));
    };

    const addToast = (event: Event) => {
      const message = (event as CustomEvent<ToastMessage>).detail;
      setMessages((current) => [...current, message]);
      timers.set(message.id, setTimeout(() => removeToast(message.id), message.duration ?? 4500));
    };

    window.addEventListener(TOAST_EVENT, addToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, addToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {messages.map((message) => {
        const { icon: Icon, className } = variantStyles[message.variant];
        return (
          <div
            key={message.id}
            role={message.variant === "error" ? "alert" : "status"}
            aria-live={message.variant === "error" ? "assertive" : "polite"}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg ${className}`}
          >
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{message.message}</p>
              {message.description && (
                <p className="mt-1 text-sm opacity-80">{message.description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setMessages((current) => current.filter((item) => item.id !== message.id))}
              className="-mr-1 -mt-1 rounded-md p-1 opacity-70 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
