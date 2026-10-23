"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { TOAST_CONFIRM_EVENT, TOAST_EVENT, type ToastMessage, type ToastVariant } from "@/lib/toast";

const variantStyles: Record<ToastVariant, { icon: typeof Check; className: string }> = {
  success: { icon: Check, className: "border-emerald-200 bg-emerald-50 text-emerald-950" },
  error: { icon: XCircle, className: "border-red-200 bg-red-50 text-red-950" },
  info: { icon: Info, className: "border-blue-200 bg-blue-50 text-blue-950" },
  warning: { icon: TriangleAlert, className: "border-amber-200 bg-amber-50 text-amber-950" },
};

export function Toaster() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const removeToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setMessages((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    const addToast = (event: Event) => {
      const message = (event as CustomEvent<ToastMessage>).detail;
      setMessages((current) => [...current, message]);
      if (message.duration !== 0) {
        timers.current.set(message.id, setTimeout(() => {
          message.confirmation?.onCancel();
          removeToast(message.id);
        }, message.duration ?? 4500));
      }
    };

    window.addEventListener(TOAST_EVENT, addToast);
    window.addEventListener(TOAST_CONFIRM_EVENT, addToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, addToast);
      window.removeEventListener(TOAST_CONFIRM_EVENT, addToast);
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, [removeToast]);

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
            {message.confirmation && (
              <div className="flex shrink-0 gap-2 self-end">
                <button
                  type="button"
                  onClick={() => {
                    message.confirmation?.onCancel();
                    removeToast(message.id);
                  }}
                  className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium hover:bg-black/5 focus-visible:outline-2"
                >
                  {message.confirmation.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    message.confirmation?.onConfirm();
                    removeToast(message.id);
                  }}
                  className="cursor-pointer rounded-md bg-black/10 px-2 py-1 text-xs font-semibold hover:bg-black/15 focus-visible:outline-2"
                >
                  {message.confirmation.confirmLabel}
                </button>
              </div>
            )}
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => {
                message.confirmation?.onCancel();
                removeToast(message.id);
              }}
              className="-mr-1 -mt-1 cursor-pointer rounded-md p-1 opacity-70 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
