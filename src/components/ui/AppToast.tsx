"use client";

import { useEffect, type ReactNode } from "react";
import { MdCheckCircle, MdErrorOutline, MdInfoOutline } from "react-icons/md";
import type { ToastKind, ToastState } from "@/hooks/useToast";

interface AppToastProps {
  toast: ToastState | null;
  onClose: () => void;
  durationMs?: number;
}

const styles: Record<ToastKind, { container: string; icon: ReactNode }> = {
  success: {
    container: "border-[#4ECDC4]/30 bg-[#4ECDC4]/10 text-[#0F766E]",
    icon: <MdCheckCircle className="text-xl" />,
  },
  error: {
    container: "border-[#FF6B9D]/30 bg-[#FF6B9D]/10 text-[#BE123C]",
    icon: <MdErrorOutline className="text-xl" />,
  },
  info: {
    container: "border-[#17409A]/30 bg-[#17409A]/10 text-[#17409A]",
    icon: <MdInfoOutline className="text-xl" />,
  },
};

export default function AppToast({
  toast,
  onClose,
  durationMs = 3200,
}: AppToastProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [toast, onClose, durationMs]);

  if (!toast) return null;

  const style = styles[toast.kind];

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-70 w-full max-w-sm">
      <div
        className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl shadow-[#17409A]/15 ${style.container}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span>{style.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{toast.title}</p>
            {toast.message ? (
              <p className="mt-1 text-xs font-semibold opacity-80">{toast.message}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs font-black hover:bg-white/40"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
