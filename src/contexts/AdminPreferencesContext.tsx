"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AdminDensity = "comfortable" | "normal" | "compact";

export interface AdminPrefs {
  accent: string;
  density: AdminDensity;
  language: string;
}

const DEFAULT: AdminPrefs = {
  accent: "#17409A",
  density: "normal",
  language: "vi",
};

const STORAGE_KEY = "admin_prefs";

interface PrefsCtx extends AdminPrefs {
  pending: AdminPrefs;
  setPending: (p: Partial<AdminPrefs>) => void;
  apply: () => void;
  applied: boolean;
}

const Ctx = createContext<PrefsCtx>({
  ...DEFAULT,
  pending: DEFAULT,
  setPending: () => {},
  apply: () => {},
  applied: false,
});

function applyToDOM(p: AdminPrefs) {
  document.documentElement.style.setProperty("--admin-accent", p.accent);
  document.documentElement.setAttribute("data-admin-density", p.density);
  document.documentElement.lang =
    p.language === "en" ? "en" : p.language === "zh" ? "zh" : "vi";
}

function readInitialPrefs(): AdminPrefs {
  if (typeof window === "undefined") {
    return DEFAULT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return JSON.parse(raw) as AdminPrefs;
  } catch {
    return DEFAULT;
  }
}

export function AdminPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<AdminPrefs>(readInitialPrefs);
  const [pending, setPendingState] = useState<AdminPrefs>(readInitialPrefs);
  const [applied, setApplied] = useState(false);

  // Keep DOM theme attributes in sync with resolved preferences.
  useEffect(() => {
    applyToDOM(prefs);
  }, [prefs]);

  function apply() {
    setPrefs(pending);
    applyToDOM(pending);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    } catch {}
    setApplied(true);
    setTimeout(() => setApplied(false), 2200);
  }

  return (
    <Ctx.Provider
      value={{
        ...prefs,
        pending,
        setPending: (p) => setPendingState((v) => ({ ...v, ...p })),
        apply,
        applied,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAdminPrefs = () => useContext(Ctx);
