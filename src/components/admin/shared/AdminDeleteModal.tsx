"use client";

import { GiBearFace } from "react-icons/gi";

interface AdminDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description: string;
  itemName: string;
  isSaving?: boolean;
}

export default function AdminDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa?",
  description,
  itemName,
  isSaving = false,
}: AdminDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl transition-all border border-[#F0F2F8]">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#FF6B9D]/10 mx-auto">
          <GiBearFace className="text-4xl text-[#FF6B9D]" />
        </div>
        
        <div className="text-center">
          <h3 className="mb-2 text-xl font-black text-[#1A1A2E]">
            {title}
          </h3>
          <p className="mb-8 text-sm font-medium text-[#9CA3AF] leading-relaxed">
            {description} <span className="font-black text-[#1A1A2E]">{itemName}</span>? Hành động này không thể hoàn tác.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => void onConfirm()}
              disabled={isSaving}
              className="flex w-full items-center justify-center rounded-2xl bg-[#FF6B9D] py-4 text-sm font-black text-white shadow-lg shadow-[#FF6B9D]/20 hover:bg-[#E05A88] transition-all disabled:opacity-50"
            >
              {isSaving ? "Đang xóa..." : "Xác nhận xóa"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex w-full items-center justify-center rounded-2xl bg-[#F4F7FF] py-4 text-sm font-black text-[#17409A] hover:bg-[#E5EDFF] transition-all disabled:opacity-50"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
