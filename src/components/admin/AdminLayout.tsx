"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { useAdminPrefs } from "@/contexts/AdminPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import Skeleton from "@/components/ui/Skeleton";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { density } = useAdminPrefs();
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.replace("/auth");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <div className="w-64 shrink-0 bg-[#17409A]" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 border-b border-[#E5E7EB] bg-white px-8 flex items-center">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex-1 p-8 space-y-4">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const contentPadding =
    density === "compact"
      ? "p-4 md:p-5"
      : density === "comfortable"
        ? "p-7 md:p-10"
        : "p-5 md:p-7";

  return (
    <div className="flex h-screen bg-[#F4F7FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Sidebar — fixed left, full height */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area — offset by sidebar width on md+ */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        {/* Top Bar */}
        <AdminTopBar onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Scrollable content area */}
        <main className={`flex-1 overflow-y-auto bg-[#F4F7FF] ${contentPadding}`}>
          <div className="min-h-full rounded-2xl bg-white p-6 shadow-sm shadow-black/5 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
