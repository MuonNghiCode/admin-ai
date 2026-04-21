"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  MdRefresh, 
  MdAdd, 
  MdDelete, 
  MdSecurity, 
  MdSearch,
  MdLabel,
  MdChevronLeft,
  MdChevronRight
} from "react-icons/md";
import { adminService } from "@/services/admin.service";
import type { BannedWord } from "@/types";
import AppToast from "@/components/ui/AppToast";
import AppDropdown from "@/components/ui/AppDropdown";
import { useToast } from "@/hooks/useToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import CrudEditorDrawer from "@/components/admin/shared/CrudEditorDrawer";
import CrudWorkspaceTabs, {
  type CrudTab,
} from "@/components/admin/shared/CrudWorkspaceTabs";

const SAFETY_CATEGORIES = [
  { label: "Ngôn ngữ thô tục", value: "Ngôn ngữ thô tục" },
  { label: "Bạo lực", value: "Bạo lực" },
  { label: "Nội dung người lớn", value: "Nội dung người lớn" },
  { label: "Phân biệt đối xử", value: "Phân biệt đối xử" },
  { label: "Chính trị & Tôn giáo", value: "Chính trị & Tôn giáo" },
  { label: "Chung", value: "Chung" },
  { label: "Khác", value: "Khác" },
];

export default function SafetyManagement() {
  const [words, setWords] = useState<BannedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CrudTab>("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Form state for new word
  const [newWord, setNewWord] = useState("");
  const [newCategory, setNewCategory] = useState("Chung");

  const { toast, showError, showSuccess, closeToast } = useToast();

  const filteredWords = useMemo(() => {
    if (!searchQuery) return words;
    const q = searchQuery.toLowerCase();
    return words.filter(w => 
      w.word.toLowerCase().includes(q) || 
      (w.category?.toLowerCase()?.includes(q))
    );
  }, [words, searchQuery]);

  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredWords.slice(startIndex, startIndex + pageSize);
  }, [filteredWords, currentPage]);

  const totalPages = Math.ceil(filteredWords.length / pageSize);

  const loadWords = async () => {
    setLoading(true);
    try {
      const response = await adminService.getGlobalSafety();
      if (response.isFailure) throw new Error(response.error?.description || "Không tải được danh sách từ khóa");
      setWords(response.value ?? []);
    } catch (error) {
      showError("Lỗi tải dữ liệu", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page when search or word list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, words.length]);

  const handleAddWord = async () => {
    if (!newWord.trim()) return;
    setSaving(true);
    try {
      const response = await adminService.addGlobalWord({
        word: newWord.trim(),
        category: newCategory
      });
      if (response.isFailure) throw new Error(response.error?.description || "Không thể thêm từ khóa");
      
      showSuccess("Đã thêm từ khóa", `"${newWord}" đã được thêm vào danh sách hệ thống.`);
      setNewWord("");
      setNewCategory("Chung");
      setDrawerOpen(false);
      void loadWords();
    } catch (error) {
      showError("Thêm từ khóa thất bại", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWord = async (id: number, wordStr: string) => {
    if (!confirm(`Bạn có chắc muốn xóa từ khóa "${wordStr}" khỏi danh sách hệ thống?`)) return;
    
    try {
      const response = await adminService.deleteGlobalWord(id);
      if (response.isFailure) throw new Error(response.error?.description || "Không thể xóa từ khóa");
      
      showSuccess("Đã xóa từ khóa", `"${wordStr}" đã được gỡ bỏ.`);
      setWords(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      showError("Xóa từ khóa thất bại", error instanceof Error ? error.message : "Lỗi không xác định");
    }
  };

  return (
    <div className="space-y-7 text-[#1A1A2E]">
      <AdminPageHeader
        badge="An toàn hệ thống"
        title="Quản trị nội dung & Từ khóa nhạy cảm"
        description="Quản lý danh sách từ khóa bị cấm trên toàn hệ thống. AI sẽ sử dụng danh sách này để lọc nội dung và phản hồi an toàn cho trẻ."
        stats={[
          { label: "tổng từ khóa", value: words.length },
          { label: "đang hiển thị", value: filteredWords.length }
        ]}
        actions={
          <>
            <button 
              type="button" 
              onClick={() => void loadWords()}
              className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A] transition-all hover:border-[#17409A] hover:shadow-sm"
            >
              <MdRefresh className="text-base" /> Tải lại
            </button>
            <button 
              type="button" 
              onClick={() => {
                setNewWord("");
                setNewCategory("Chung");
                setDrawerOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-[#17409A] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#17409A]/20 transition-all hover:bg-[#0E2A66] hover:scale-[1.02] active:scale-95"
            >
              <MdAdd className="text-lg" /> Thêm từ khóa
            </button>
          </>
        }
      />

      {loading ? (
        <AdminLoadingSkeleton rows={8} />
      ) : (
        <CrudWorkspaceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={{ total: words.length, activeLabel: "Filtered", activeValue: filteredWords.length }}
        >
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group max-w-md">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#9CA3AF] group-focus-within:text-[#17409A] transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm từ khóa hoặc phân loại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#F0F2F8] bg-[#F4F7FF]/50 py-3 pl-11 pr-4 text-sm font-medium outline-none border-transparent focus:border-[#17409A] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Flat List */}
            <div className="bg-white rounded-3xl border border-[#F0F2F8] overflow-hidden">
              <div className="grid grid-cols-[1fr_200px_100px] items-center gap-4 px-6 py-4 bg-[#F4F7FF]/30 border-b border-[#F0F2F8]">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Từ khóa nhạy cảm</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Phân loại</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] text-right">Thao tác</span>
              </div>

              {paginatedWords.length === 0 ? (
                <div className="py-20 text-center">
                  <MdSecurity className="mx-auto text-5xl text-[#E5E7EB] mb-4" />
                  <p className="text-sm font-bold text-[#9CA3AF]">
                    {searchQuery ? "Không tìm thấy kết quả phù hợp" : "Danh sách từ khóa đang trống"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F0F2F8]">
                  {paginatedWords.map((item) => (
                    <div 
                      key={item.id} 
                      className="grid grid-cols-[1fr_200px_100px] items-center gap-4 px-6 py-4 hover:bg-[#F4F7FF]/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17409A]/5 text-[#17409A]">
                          <MdLabel className="text-lg" />
                        </div>
                        <span className="text-sm font-bold text-[#1A1A2E]">{item.word}</span>
                      </div>
                      
                      <div>
                        <span className="inline-flex items-center rounded-full bg-[#17409A]/10 px-3 py-1 text-[10px] font-black text-[#17409A]">
                          {item.category || "Chung"}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleDeleteWord(item.id, item.word)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                          title="Xóa từ khóa"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-2">
                <p className="text-xs font-bold text-[#9CA3AF]">
                  Trang <span className="text-[#17409A]">{currentPage}</span> / {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0F2F8] bg-white text-[#17409A] transition-all hover:border-[#17409A] disabled:opacity-30 disabled:border-[#F0F2F8]"
                  >
                    <MdChevronLeft className="text-xl" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-9 w-9 rounded-xl text-xs font-black transition-all ${
                        currentPage === (i + 1)
                          ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
                          : "text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#F4F7FF]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0F2F8] bg-white text-[#17409A] transition-all hover:border-[#17409A] disabled:opacity-30 disabled:border-[#F0F2F8]"
                  >
                    <MdChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </CrudWorkspaceTabs>
      )}

      {/* Add Word Drawer */}
      <CrudEditorDrawer
        open={drawerOpen}
        mode="create"
        title="Thêm từ khóa mới"
        description="Thêm từ khóa vào danh sách chặn trên toàn hệ thống AI."
        onClose={() => setDrawerOpen(false)}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-[#9CA3AF] ml-1">Từ khóa bị chặn</label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Nhập từ hoặc cụm từ..."
              className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF]/50 p-4 text-sm font-bold outline-none focus:border-[#17409A] focus:bg-white transition-all shadow-sm focus:shadow-md"
              autoFocus
            />
          </div>

          <AppDropdown 
            label="Phân loại nội dung"
            value={newCategory}
            options={SAFETY_CATEGORIES}
            onChange={setNewCategory}
            className="w-full"
          />

          <div className="pt-4">
            <button
              type="button"
              onClick={() => void handleAddWord()}
              disabled={saving || !newWord.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#17409A] py-4 text-sm font-black text-white shadow-xl shadow-[#17409A]/30 transition-all hover:bg-[#0E2A66] hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {saving ? "Đang xử lý..." : "Xác nhận thêm"}
            </button>
          </div>
        </div>
      </CrudEditorDrawer>

      <AppToast toast={toast} onClose={closeToast} />
    </div>
  );
}
