export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastOptions = {
  description?: string;
  duration?: number;
};

export type ToastMessage = ToastOptions & {
  id: number;
  variant: ToastVariant;
  message: string;
};

export const TOAST_EVENT = "app-toast";

let nextToastId = 0;

function showToast(variant: ToastVariant, message: string, options: ToastOptions = {}) {
  if (typeof window === "undefined") return;

  const toast: ToastMessage = {
    id: ++nextToastId,
    variant,
    message,
    ...options,
  };

  window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_EVENT, { detail: toast }));
}

export const toast = {
  success: (message: string, options?: ToastOptions) => showToast("success", message, options),

  error: (message: string, options?: ToastOptions) => showToast("error", message, options),

  info: (message: string, options?: ToastOptions) => showToast("info", message, options),

  warning: (message: string, options?: ToastOptions) => showToast("warning", message, options),
  
};
