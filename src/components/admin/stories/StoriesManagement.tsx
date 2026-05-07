"use client";

import { useEffect, useMemo, useState } from "react";
import { MdEdit, MdRefresh, MdSave, MdMenuBook } from "react-icons/md";
import { adminService } from "@/services/admin.service";
import type { StoryItem, StoryUpsertRequest } from "@/types";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import AdminDeleteModal from "@/components/admin/shared/AdminDeleteModal";
import CrudEditorDrawer from "@/components/admin/shared/CrudEditorDrawer";
import CrudWorkspaceTabs, {
  type CrudTab,
} from "@/components/admin/shared/CrudWorkspaceTabs";

function emptyStory(): StoryUpsertRequest {
  return { name: "", gcsPath: "", contentType: "text/plain" };
}

function mapStoryToForm(story: StoryItem): StoryUpsertRequest {
  return { id: story.id, name: story.name, gcsPath: story.gcsPath || "", contentType: story.contentType || "text/plain" };
}

const STORY_COLORS = ["#FF8C42", "#7C5CFC", "#17409A", "#4ECDC4", "#FF6B9D"];

export default function StoriesManagement() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CrudTab>("list");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<StoryUpsertRequest>(emptyStory());
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showError, showSuccess, closeToast } = useToast();

  const selected = useMemo(() => stories.find((item) => item.id === selectedId) ?? null, [stories, selectedId]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const response = await adminService.getStories();
      if (response.isFailure) throw new Error(response.error?.description || "Không tải được truyện");
      const data = response.value ?? [];
      setStories(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch (error) {
      showError("Không tải được truyện", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => { setForm(emptyStory()); setDrawerMode("create"); setActiveTab("create"); };
  const openEdit = () => { if (!selected) return; setForm(mapStoryToForm(selected)); setDrawerMode("edit"); setActiveTab("edit"); };

  const saveStory = async () => {
    setSaving(true);
    try {
      if (drawerMode === "edit" && selected) {
        if (uploadFile) {
          const res = await adminService.uploadMedia(uploadFile, "story", { 
            id: selected.id,
            name: form.name || undefined 
          });
          if (res.isFailure) throw new Error(res.error?.description || "Cập nhật thất bại");
          showSuccess("Đã cập nhật tệp và thông tin truyện", form.name || uploadFile.name);
          setUploadFile(null);
        } else {
          const res = await adminService.updateStory(selected.id, form);
          if (res.isFailure) throw new Error(res.error?.description || "Cập nhật thất bại");
          showSuccess("Đã cập nhật truyện", form.name);
        }
      } else {
        if (uploadFile) {
          const res = await adminService.uploadMedia(uploadFile, "story", { name: form.name || undefined });
          if (res.isFailure) throw new Error(res.error?.description || "Tải lên thất bại");
          showSuccess("Đã tải lên và tạo truyện", form.name || uploadFile.name);
          setUploadFile(null);
        } else {
          const res = await adminService.createStory(form);
          if (res.isFailure) throw new Error(res.error?.description || "Tạo thất bại");
          showSuccess("Đã tạo truyện", form.name);
        }
      }
      await loadStories();
      setDrawerMode(null);
      setActiveTab("detail");
    } catch (error) {
      showError(drawerMode === "edit" ? "Cập nhật thất bại" : "Tạo thất bại", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  };

  const deleteStory = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await adminService.deleteStory(selected.id);
      if (res.isFailure) throw new Error(res.error?.description || "Xóa thất bại");
      showSuccess("Đã xóa truyện", selected.name);
      setSelectedId(null);
      setActiveTab("list");
      await loadStories();
    } catch (error) {
      showError("Xóa thất bại", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
      setIsDeleting(false);
    }
  };

  const fieldCls = "w-full rounded-xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#17409A] focus:ring-2 focus:ring-[#17409A]/10 transition-all";
  const labelCls = "block space-y-1.5 text-xs font-black uppercase tracking-wide text-[#9CA3AF]";

  return (
    <div className="space-y-7 text-[#1A1A2E]">
      <AdminPageHeader
        badge="Truyện"
        title="Kho truyện thiếu nhi"
        description="Quản lý danh sách truyện, đường dẫn GCS và định dạng nội dung trong hệ thống SmartBear."
        stats={[{ label: "tổng truyện", value: stories.length }]}
        actions={
          <>
            <button type="button" onClick={() => void loadStories()}
              className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A] transition-all hover:border-[#17409A] hover:shadow-sm">
              <MdRefresh className="text-base" /> Tải lại
            </button>
            <button type="button" onClick={openCreate}
              className="flex items-center gap-2 rounded-2xl bg-[#17409A] px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-[#0E2A66] transition-colors">
              Thêm truyện
            </button>
          </>
        }
      />

      {loading ? <AdminLoadingSkeleton rows={6} /> : (
        <CrudWorkspaceTabs
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); if (tab === "create") openCreate(); if (tab === "edit") openEdit(); }}
          stats={{ total: stories.length, activeLabel: "Đã chọn", activeValue: selected ? 1 : 0 }}
        >
          <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
            {/* ── Story list ── */}
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">Danh sách truyện</p>
              {stories.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#9CA3AF]">Chưa có truyện nào.</p>
              ) : (
                <div className="divide-y divide-[#F0F2F8]">
                  {stories.map((story, idx) => {
                    const isActive = story.id === selectedId;
                    const color = STORY_COLORS[idx % STORY_COLORS.length];
                    return (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() => { setSelectedId(story.id); setActiveTab("detail"); }}
                        className={`group w-full flex items-center gap-4 py-3.5 px-3 text-left transition-colors rounded-xl ${isActive ? "bg-[#17409A]/5" : "hover:bg-[#F4F7FF]"}`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base" style={{ background: `${color}15`, color }}>
                          <MdMenuBook />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black truncate ${isActive ? "text-[#17409A]" : "text-[#1A1A2E]"}`}>{story.name}</p>
                          <p className="text-[11px] text-[#9CA3AF] truncate">{story.contentType}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Detail panel ── */}
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">Chi tiết truyện</p>
              {selected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF8C42]/10 text-xl text-[#FF8C42]">
                      <MdMenuBook />
                    </div>
                    <div>
                      <p className="font-black text-[#1A1A2E]">{selected.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{selected.contentType}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#F0F2F8]">
                    <div className="py-2 border-b border-[#F0F2F8]">
                      <p className="text-[10px] text-[#9CA3AF] mb-1">GCS Path</p>
                      <p className="text-xs font-mono text-[#FF8C42] break-all">{selected.gcsPath || "–"}</p>
                    </div>
                    {selected.audioUrl && (
                      <div className="py-2 border-b border-[#F0F2F8]">
                        <p className="text-[10px] text-[#9CA3AF] mb-1">Signed URL</p>
                        <p className="text-xs font-mono text-[#6B7280] break-all">{selected.audioUrl}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#F0F2F8]">
                    <button type="button" onClick={openEdit}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#17409A] py-2.5 text-xs font-black text-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors">
                      <MdEdit className="text-sm" /> Chỉnh sửa
                    </button>
                    <button type="button" onClick={() => setIsDeleting(true)} disabled={saving}
                      className="flex flex-1 items-center justify-center rounded-xl border border-[#FF6B9D] py-2.5 text-xs font-black text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white transition-colors disabled:opacity-50">
                      Xóa
                    </button>
                  </div>
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-[#9CA3AF]">Chọn một truyện để xem chi tiết.</p>
              )}
            </div>
          </div>
        </CrudWorkspaceTabs>
      )}

      <CrudEditorDrawer open={drawerMode !== null} mode={drawerMode ?? "create"} title="Truyện" description="Thêm hoặc chỉnh sửa truyện trong kho nội dung." onClose={() => setDrawerMode(null)}>
        <div className="space-y-5">
          <label className={labelCls}>Tên truyện (Để trống nếu muốn lấy từ tên file)
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={fieldCls} />
          </label>
          
          <div className="py-4 border-t border-b border-dashed border-orange-200 bg-orange-50/30 rounded-xl px-4 space-y-3">
             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest text-center">Tải lên file truyện (TXT/MP3)</p>
             <input 
                type="file" 
                accept="text/plain,audio/mpeg" 
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadFile(file);
                  if (file && !form.name) {
                    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                    setForm(p => ({ ...p, name: nameWithoutExt }));
                  }
                }}
             />
             {uploadFile && (
               <p className="text-[10px] text-green-600 font-bold italic text-center">File đã chọn: {uploadFile.name}</p>
             )}
          </div>

          <p className="text-center text-[10px] text-slate-400 font-bold">HOẶC NHẬP PATH THỦ CÔNG</p>

          <label className={labelCls}>GCS Path
            <input value={form.gcsPath} onChange={(e) => setForm((p) => ({ ...p, gcsPath: e.target.value }))} className={fieldCls} />
          </label>
          <label className={labelCls}>Loại nội dung
            <input value={form.contentType} onChange={(e) => setForm((p) => ({ ...p, contentType: e.target.value }))} className={fieldCls} />
          </label>
          <button type="button" onClick={() => void saveStory()} disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17409A] py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-[#0E2A66] transition-colors">
            <MdSave className="text-base" />
            {saving ? "Đang xử lý..." : drawerMode === "edit" ? "Lưu thay đổi" : "Lưu truyện"}
          </button>
        </div>
      </CrudEditorDrawer>

      <AppToast toast={toast} onClose={closeToast} />

      <AdminDeleteModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={deleteStory}
        itemName={selected?.name ?? ""}
        description="Bạn có chắc chắn muốn xóa truyện"
        isSaving={saving}
      />
    </div>
  );
}
