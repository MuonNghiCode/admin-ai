"use client";

import { useCallback, useState } from "react";

export type ToastKind = "success" | "error" | "info";

export interface ToastState {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

type ToastInput = Omit<ToastState, "id">;

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((payload: ToastInput) => {
    setToast({
      id: Date.now(),
      ...payload,
    });
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast({ kind: "success", title, message });
    },
    [showToast],
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast({ kind: "error", title, message });
    },
    [showToast],
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast({ kind: "info", title, message });
    },
    [showToast],
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    closeToast,
  };
}
