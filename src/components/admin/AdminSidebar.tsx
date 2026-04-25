"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
  MdClose,
  MdDashboard,
  MdDevices,
  MdLibraryMusic,
  MdLogout,
  MdMenuBook,
  MdPerson,
  MdSupervisedUserCircle,
  MdSecurity,
  MdRecordVoiceOver,
} from "react-icons/md";
import { GiBearFace } from "react-icons/gi";
import { useAdminPrefs } from "@/contexts/AdminPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MdOutlineRecordVoiceOver } from "react-icons/md";

const NAV_ITEMS = [
  { icon: MdDashboard, label: "Tổng quan", href: "/admin/dashboard" },
  { icon: MdPerson, label: "Hồ sơ trẻ", href: "/admin/profiles" },
  { icon: MdDevices, label: "Thiết bị", href: "/admin/devices" },
  { icon: MdLibraryMusic, label: "Âm nhạc", href: "/admin/songs" },
  { icon: MdMenuBook, label: "Truyện", href: "/admin/stories" },
  { icon: MdRecordVoiceOver, label: "Giọng đọc mẫu", href: "/admin/voices" },
  { icon: MdSupervisedUserCircle, label: "Người dùng", href: "/admin/users" },
  { icon: MdSecurity, label: "An toàn AI", href: "/admin/safety" },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  open = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { accent } = useAdminPrefs();
  const { logout, user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleTabClick = () => {
    onClose?.();
  };

  return (
    <aside
      ref={dropdownRef}
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 shadow-2xl shadow-black/20 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      style={{ backgroundColor: accent }}
    >
      {/* Close button — mobile only */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors md:hidden"
        aria-label="Đóng menu"
      >
        <MdClose className="text-lg" />
      </button>

      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-white/10">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/15 shadow-lg transition-all hover:bg-white/25 hover:scale-105"
          title="Về trang chủ"
        >
          <Image
            src="/logo.webp"
            alt="Design a Bear"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>
        <div>
          <p className="text-white font-black text-sm leading-tight">Design a Bear</p>
          <p className="text-white/50 text-xs font-semibold">Quản trị hệ thống</p>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-white/35 text-[10px] font-black uppercase tracking-[0.25em]">Điều hướng</p>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={handleTabClick}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                active
                  ? "bg-white shadow-xl shadow-black/15"
                  : "text-white/60 hover:bg-white/12 hover:text-white"
              }`}
            >
              <span className={`text-xl shrink-0 ${active ? "text-[#17409A]" : ""}`}>
                <Icon />
              </span>
              <span className={`text-sm font-bold ${active ? "text-[#17409A]" : ""}`}>
                {label}
              </span>
              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-[#17409A] shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-4 space-y-2">
        {/* User info */}
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-sm font-black text-white border border-white/20">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-bold truncate">{user?.name ?? "Admin"}</p>
            <p className="text-white/45 text-[10px] truncate">{user?.email ?? ""}</p>
          </div>
          <GiBearFace className="text-white/30 text-base shrink-0" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-white/45 transition-all hover:bg-[#FF6B9D]/20 hover:text-[#FF6B9D]"
        >
          <MdLogout className="text-xl shrink-0" />
          <span className="text-sm font-bold">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
