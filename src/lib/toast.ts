export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastOptions = {
  description?: string;
  duration?: number;
};

export type ToastMessage = ToastOptions & {
  id: number;
  variant: ToastVariant;
  message: string;
  confirmation?: {
    confirmLabel: string;
    cancelLabel: string;
    destructive?: boolean;
    cancelDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };
};

export const TOAST_EVENT = "app-toast";
export const TOAST_CONFIRM_EVENT = "app-toast-confirm";

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
  
  confirm: (
    message: string,
    options: ToastOptions & {
      confirmLabel?: string;
      cancelLabel?: string;
      destructive?: boolean;
      cancelDestructive?: boolean;
    } = {},
  ): Promise<boolean> => {
    if (typeof window === "undefined") return Promise.resolve(false);

    return new Promise((resolve) => {
      const {
        confirmLabel = "Confirm",
        cancelLabel = "Cancel",
        destructive = false,
        cancelDestructive = false,
        ...toastOptions
      } = options;
      const toast: ToastMessage = {
        id: ++nextToastId,
        variant: "warning",
        message,
        ...toastOptions,
        duration: options.duration ?? 0,
        confirmation: {
          confirmLabel,
          cancelLabel,
          destructive,
          cancelDestructive,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        },
      };

      window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_CONFIRM_EVENT, { detail: toast }));
    });
  },
};
