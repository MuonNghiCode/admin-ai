"use client";

import { useEffect, useMemo, useState } from "react";
import { MdRefresh, MdRecordVoiceOver, MdDelete, MdEdit } from "react-icons/md";
import { adminService } from "@/services/admin.service";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import CrudWorkspaceTabs, { type CrudTab } from "@/components/admin/shared/CrudWorkspaceTabs";
import CrudEditorDrawer from "@/components/admin/shared/CrudEditorDrawer";
import AdminDeleteModal from "@/components/admin/shared/AdminDeleteModal";
import type { DemoVoiceItem, DemoVoiceUpsertRequest } from "@/types";

export default function VoicesManagement() {
  const [voices, setVoices] = useState<DemoVoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CrudTab>("list");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<DemoVoiceUpsertRequest>({
    id: "",
    voiceId: "",
    name: "",
    provider: "GCP",
    isPremium: false,
    description: ""
  });

  const { toast, showError, showSuccess, closeToast } = useToast();

  const selected = useMemo(() => voices.find((v) => v.id === selectedId) ?? null, [voices, selectedId]);

  const loadVoices = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVoices();
      if (res.isFailure) throw new Error(res.error?.description || "Lỗi tải danh sách");
      
      let data = res.value as any;
      if (data && !Array.isArray(data) && Array.isArray(data.value)) {
        data = data.value;
      }
      data = Array.isArray(data) ? data : [];
      
      setVoices(data);
      if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
    } catch (e) {
      showError("Lỗi", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVoices();
  }, []);

  const openCreate = () => {
    setFormData({
      id: `voice-${Date.now()}`,
      voiceId: "",
      name: "",
      provider: "GCP",
      isPremium: false,
      description: ""
    });
    setDrawerMode("create");
  };

  const openEdit = () => {
    if (!selected) return;
    setFormData({ ...selected });
    setDrawerMode("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (drawerMode === "create") {
        const res = await adminService.createVoice(formData);
        if (res.isFailure) throw new Error(res.error?.description || "Lỗi tạo giọng");
        showSuccess("Thành công", "Đã thêm giọng mới");
      } else {
        const res = await adminService.updateVoice(formData.id!, formData);
        if (res.isFailure) throw new Error(res.error?.description || "Lỗi cập nhật giọng");
        showSuccess("Thành công", "Đã cập nhật giọng");
      }
      await loadVoices();
      setDrawerMode(null);
    } catch (e) {
      showError("Lỗi", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await adminService.deleteVoice(selected.id);
      if (res.isFailure) throw new Error(res.error?.description || "Lỗi xóa");
      showSuccess("Đã xóa", selected.name);
      setSelectedId(null);
      await loadVoices();
    } catch (e) {
      showError("Lỗi", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setSaving(false);
      setIsDeleting(false);
    }
  };

  const fieldCls = "w-full rounded-xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-2.5 text-sm outline-none focus:border-[#17409A] transition-all";
  const labelCls = "block space-y-1.5 text-xs font-black uppercase tracking-wide text-[#9CA3AF]";

  return (
    <div className="space-y-7">
      <AdminPageHeader 
        badge="Danh mục giọng nói"
        title="Quản lý Voice Catalog"
        description="Quản lý danh sách các giọng nói được hỗ trợ trong hệ thống (GCP, ElevenLabs)."
        stats={[{ label: "tổng số giọng", value: voices.length }]}
        actions={
          <>
            <button onClick={() => void loadVoices()} className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A]">
              <MdRefresh /> Tải lại
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-4 py-2.5 text-sm font-black text-white shadow-sm">
              <MdRecordVoiceOver /> Thêm giọng
            </button>
          </>
        }
      />

      {loading ? <AdminLoadingSkeleton rows={5} /> : (
        <CrudWorkspaceTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          stats={{ total: voices.length, activeLabel: "Đang chọn", activeValue: selected ? 1 : 0 }}
        >
          <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
            <div>
               <div className="divide-y divide-[#F0F2F8]">
                  {voices.map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => { setSelectedId(v.id); setActiveTab("detail"); }}
                      className={`w-full flex items-center gap-4 py-4 px-3 rounded-xl transition-all ${selectedId === v.id ? "bg-purple-50" : "hover:bg-gray-50"}`}
                    >
                      <div className={`h-10 w-10 flex items-center justify-center rounded-xl text-xl ${v.isPremium ? "bg-amber-100 text-amber-600" : "bg-purple-100 text-purple-600"}`}>
                        <MdRecordVoiceOver />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-black text-gray-900">{v.name}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase">{v.provider} • {v.voiceId} • {v.isPremium ? "Cao cấp" : "Miễn phí"}</p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>

            <div>
              {selected ? (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gray-50 p-6 space-y-4 border border-gray-100">
                    <div className="space-y-3">
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Mã nhà cung cấp (ID)</p>
                         <p className="text-sm font-mono font-bold text-gray-800 break-all">{selected.voiceId}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Nhà cung cấp</p>
                         <p className="text-sm font-bold text-gray-800">{selected.provider}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Mô tả</p>
                         <p className="text-xs text-gray-600 italic">"{selected.description}"</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Loại giọng</p>
                         <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${selected.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'}`}>
                           {selected.isPremium ? 'Cao cấp (Pro)' : 'Miễn phí (Standard)'}
                         </span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                      <button 
                        onClick={openEdit} 
                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-black hover:bg-gray-50 transition-colors"
                      >
                        <MdEdit /> Chỉnh sửa
                      </button>
                      <button 
                        onClick={() => setIsDeleting(true)} 
                        disabled={saving}
                        className="flex items-center justify-center gap-2 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-black hover:bg-red-50 transition-colors"
                      >
                        <MdDelete /> Xóa giọng
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 text-sm font-bold">
                  Chọn một giọng để xem chi tiết
                </div>
              )}
            </div>
          </div>
        </CrudWorkspaceTabs>
      )}

      <CrudEditorDrawer 
        open={drawerMode !== null} 
        mode={drawerMode || "create"} 
        title={drawerMode === "create" ? "Thêm Giọng Mới" : "Sửa Thông Tin Giọng"} 
        description="Quản lý cấu hình giọng nói từ các nhà cung cấp TTS." 
        onClose={() => setDrawerMode(null)}
      >
        <div className="space-y-6">
          <label className={labelCls}>Mã định danh hệ thống (ID)
             <input value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} disabled={drawerMode === "edit"} className={`${fieldCls} ${drawerMode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`} />
             <p className="text-[10px] text-gray-400 font-normal lowercase normal-case">Vd: voice-gcp-a, voice-eleven-adam</p>
          </label>
          <label className={labelCls}>Tên hiển thị
             <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Vd: Gấu Chị A (Nữ)" className={fieldCls} />
          </label>
          <label className={labelCls}>Mã nhà cung cấp (Voice ID)
             <input value={formData.voiceId} onChange={e => setFormData({ ...formData, voiceId: e.target.value })} placeholder="Vd: vi-VN-Neural2-A, pNInz6obpgnuPs397vXP" className={fieldCls} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelCls}>Nhà cung cấp
               <select value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} className={fieldCls}>
                 <option value="GCP">Google Cloud (GCP)</option>
                 <option value="ElevenLabs">ElevenLabs</option>
                 <option value="Azure">Azure</option>
                 <option value="AWS">AWS Polly</option>
               </select>
            </label>
            <label className={labelCls}>Loại giọng
               <select value={formData.isPremium ? "true" : "false"} onChange={e => setFormData({ ...formData, isPremium: e.target.value === "true" })} className={fieldCls}>
                 <option value="false">Miễn phí (Standard)</option>
                 <option value="true">Cao cấp (Pro)</option>
               </select>
            </label>
          </div>
          <label className={labelCls}>Mô tả ngắn
             <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Vd: Giọng nam trầm ấm, chuyên nghiệp." className={`${fieldCls} h-24 resize-none`} />
          </label>

          <button onClick={() => void handleSave()} disabled={saving} className="w-full py-3 bg-purple-600 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-200">
             {saving ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </CrudEditorDrawer>

      <AppToast toast={toast} onClose={closeToast} />

      <AdminDeleteModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        itemName={selected?.name ?? ""}
        description="Bạn có chắc chắn muốn xóa giọng mẫu"
        isSaving={saving}
      />
    </div>
  );
}
