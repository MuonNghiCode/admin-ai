import { type ReactNode } from "react";
import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPreferencesProvider } from "@/contexts/AdminPreferencesContext";

export const metadata: Metadata = {
  title: "Quản trị hệ thống",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminPreferencesProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminPreferencesProvider>
  );
}
