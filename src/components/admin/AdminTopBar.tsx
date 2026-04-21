"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoNotificationsOutline,
  IoSearchOutline,
  IoMenuOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import {
  MdDashboard,
  MdDevices,
  MdLibraryMusic,
  MdMenuBook,
  MdPerson,
  MdSupervisedUserCircle,
} from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";

const BREADCRUMB_MAP: Record<string, { label: string; icon: React.ElementType }> = {
  "/admin/dashboard": { label: "Tổng quan", icon: MdDashboard },
  "/admin/profiles": { label: "Hồ sơ trẻ", icon: MdPerson },
  "/admin/devices": { label: "Thiết bị", icon: MdDevices },
  "/admin/songs": { label: "Âm nhạc", icon: MdLibraryMusic },
  "/admin/stories": { label: "Truyện", icon: MdMenuBook },
  "/admin/users": { label: "Người dùng", icon: MdSupervisedUserCircle },
};

export default function AdminTopBar({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  const pathname = usePathname();
  const [hasNotif] = useState(true);
  const { user } = useAuth();

  // Resolve current breadcrumb
  const currentKey = Object.keys(BREADCRUMB_MAP).find((key) => pathname.startsWith(key));
  const currentPage = currentKey ? BREADCRUMB_MAP[currentKey] : null;
  const PageIcon = currentPage?.icon;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-5 py-3.5 shadow-sm shadow-black/5">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F7FF] flex items-center justify-center text-[#6B7280] hover:text-[#17409A] transition-all md:hidden shrink-0"
          aria-label="Mở menu"
        >
          <IoMenuOutline className="text-xl" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/dashboard"
            className="hidden md:block text-xs font-bold text-[#9CA3AF] hover:text-[#17409A] transition-colors shrink-0"
          >
            Quản trị
          </Link>
          {currentPage && (
            <>
              <IoChevronForwardOutline className="hidden md:block text-xs text-[#9CA3AF] shrink-0" />
              <div className="flex items-center gap-2">
                {PageIcon && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#17409A]/8 text-[#17409A] text-sm shrink-0">
                    <PageIcon />
                  </span>
                )}
                <span className="text-sm font-black text-[#1A1A2E] truncate">
                  {currentPage.label}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: search + notif + user */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <button
          className="hidden sm:flex w-9 h-9 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F7FF] items-center justify-center text-[#9CA3AF] hover:text-[#17409A] transition-all"
          aria-label="Tìm kiếm"
        >
          <IoSearchOutline className="text-lg" />
        </button>

        {/* Notification */}
        <button
          className="relative w-9 h-9 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F7FF] flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] transition-all"
          aria-label="Thông báo"
        >
          <IoNotificationsOutline className="text-lg" />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B9D] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

        {/* User badge */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#17409A] text-xs font-black text-white">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-black text-[#1A1A2E] leading-none">{user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-none">Quản trị viên</p>
          </div>
        </div>
      </div>
    </header>
  );
}
