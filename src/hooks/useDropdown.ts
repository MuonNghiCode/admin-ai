"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useDropdown(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, close]);

  return {
    open,
    rootRef,
    close,
    openMenu,
    toggle,
  };
}
