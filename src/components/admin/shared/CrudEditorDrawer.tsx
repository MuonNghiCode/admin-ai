"use client";

import type { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { GiBearFace } from "react-icons/gi";

interface CrudEditorDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export default function CrudEditorDrawer({
  open,
  mode,
  title,
  description,
  onClose,
  children,
}: CrudEditorDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl shadow-[#17409A]/25">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E5E7EB] bg-white px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#17409A]/8">
              <GiBearFace className="text-base text-[#17409A]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9CA3AF]">
                {mode === "create" ? "Tạo mới" : "Chỉnh sửa"}
              </p>
              <h3 className="mt-0.5 text-lg font-black text-[#1A1A2E]">{title}</h3>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#9CA3AF] transition-colors hover:bg-[#F4F7FF] hover:text-[#17409A]"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
