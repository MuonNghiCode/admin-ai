"use client";

import type { ReactNode } from "react";

export type ProfileWorkspaceTab = "list" | "detail" | "create" | "edit";

interface ProfileWorkspaceTabsProps {
  activeTab: ProfileWorkspaceTab;
  onTabChange: (tab: ProfileWorkspaceTab) => void;
  stats: {
    total: number;
    active: number;
  };
  children: ReactNode;
}

const tabs: Array<{ key: ProfileWorkspaceTab; label: string }> = [
  { key: "list", label: "Danh sách" },
  { key: "detail", label: "Chi tiết" },
  { key: "create", label: "Tạo mới" },
  { key: "edit", label: "Chỉnh sửa" },
];

export default function ProfileWorkspaceTabs({
  activeTab,
  onTabChange,
  stats,
  children,
}: ProfileWorkspaceTabsProps) {
  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#17409A]">{stats.total}</span>
            <span className="text-xs font-semibold text-[#9CA3AF]">tổng hồ sơ</span>
          </div>
          <div className="h-4 w-px bg-[#E5E7EB]" />
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#4ECDC4]">{stats.active}</span>
            <span className="text-xs font-semibold text-[#9CA3AF]">đang hoạt động</span>
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 rounded-2xl bg-[#F4F7FF] p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-150 ${
                  isActive
                    ? "bg-white text-[#17409A] shadow-sm"
                    : "text-[#9CA3AF] hover:text-[#17409A]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
