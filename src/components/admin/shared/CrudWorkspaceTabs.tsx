"use client";

import type { ReactNode } from "react";

export type CrudTab = "list" | "detail" | "create" | "edit";

interface CrudWorkspaceTabsProps {
  activeTab: CrudTab;
  onTabChange: (tab: CrudTab) => void;
  stats: {
    total: number;
    activeLabel: string;
    activeValue: number;
  };
  children: ReactNode;
}

const TAB_ITEMS: Array<{ key: CrudTab; label: string }> = [
  { key: "list", label: "Danh sách" },
  { key: "detail", label: "Chi tiết" },
  { key: "create", label: "Tạo mới" },
  { key: "edit", label: "Chỉnh sửa" },
];

export default function CrudWorkspaceTabs({
  activeTab,
  onTabChange,
  stats,
  children,
}: CrudWorkspaceTabsProps) {
  return (
    <div className="space-y-5">
      {/* Toolbar: stats + tabs in one row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Stats inline */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#17409A]">{stats.total}</span>
            <span className="text-xs font-semibold text-[#9CA3AF]">tổng bản ghi</span>
          </div>
          <div className="h-4 w-px bg-[#E5E7EB]" />
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#4ECDC4]">{stats.activeValue}</span>
            <span className="text-xs font-semibold text-[#9CA3AF]">{stats.activeLabel}</span>
          </div>
        </div>

        {/* Tabs pill group */}
        <div className="flex items-center gap-1 rounded-2xl bg-[#F4F7FF] p-1">
          {TAB_ITEMS.map((item) => {
            const isActive = item.key === activeTab;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onTabChange(item.key)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-150 ${
                  isActive
                    ? "bg-white text-[#17409A] shadow-sm"
                    : "text-[#9CA3AF] hover:text-[#17409A]"
                }`}
              >
                {item.label}
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
