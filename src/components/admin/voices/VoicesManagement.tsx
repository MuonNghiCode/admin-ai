"use client";

import { useEffect, useMemo, useState } from "react";
import { MdRefresh, MdRecordVoiceOver, MdFileUpload, MdDelete } from "react-icons/md";
import { adminService } from "@/services/admin.service";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import CrudWorkspaceTabs, { type CrudTab } from "@/components/admin/shared/CrudWorkspaceTabs";
import CrudEditorDrawer from "@/components/admin/shared/CrudEditorDrawer";

interface DemoVoiceItem {
  id: string;
  name: string;
  gcsPath: string;
  provider: string;
  isPremium: boolean;
  description: string;
  previewUrl: string;
}

export default function VoicesManagement() {
  const [voices, setVoices] = useState<DemoVoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CrudTab>("list");
  const [drawerMode, setDrawerMode] = useState<"create" | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Generation state
  const [genText, setGenText] = useState("Chào bé, gấu là Lucky đây!");
  const [genVoiceId, setGenVoiceId] = useState("vi-VN-Neural2-A");
  const [genProvider, setGenProvider] = useState("GCP");

  const { toast, showError, showSuccess, closeToast } = useToast();

  const selected = useMemo(() => voices.find((v) => v.id === selectedId) ?? null, [voices, selectedId]);

  const loadVoices = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDemoVoices();
      if (res.isFailure) throw new Error(res.error?.description || "Lỗi tải danh sách");
      const data = res.value ?? [];
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

  const handleProviderChange = (provider: string) => {
    setGenProvider(provider);
    if (provider === "GCP") {
      setGenVoiceId("vi-VN-Neural2-A");
    } else {
      setGenVoiceId("pNInz6obpgnuPs397vXP");
    }
  };

  const handleGenerate = async () => {
    setSaving(true);
    try {
      const res = await adminService.generateDemo({
        text: genText,
        voiceId: genVoiceId,
        provider: genProvider
      });
      if (res.isFailure) throw new Error(res.error?.description || "Lỗi sinh demo");
      showSuccess("Thành công", "Đã sinh và lưu giọng đọc mẫu");
      await loadVoices();
      setDrawerMode(null);
    } catch (e) {
      showError("Lỗi", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setSaving(true);
    try {
      const res = await adminService.uploadMedia(uploadFile, "demovoice");
      if (res.isFailure) throw new Error(res.error?.description || "Lỗi tải lên");
      showSuccess("Thành công", "Đã tải lên giọng đọc mẫu");
      setUploadFile(null);
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
    if (!confirm(`Xóa giọng mẫu "${selected.name}"?`)) return;
    setSaving(true);
    try {
      const res = await adminService.deleteDemoVoice(selected.id);
      if (res.isFailure) throw new Error(res.error?.description || "Lỗi xóa");
      showSuccess("Đã xóa", selected.name);
      setSelectedId(null);
      await loadVoices();
    } catch (e) {
      showError("Lỗi", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setSaving(false);
    }
  };

  const fieldCls = "w-full rounded-xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-2.5 text-sm outline-none focus:border-[#17409A] transition-all";
  const labelCls = "block space-y-1.5 text-xs font-black uppercase tracking-wide text-[#9CA3AF]";

  return (
    <div className="space-y-7">
      <AdminPageHeader 
        badge="AI Voices"
        title="Quản lý Giọng đọc mẫu"
        description="Sinh giọng nói AI hoặc tải lên các mẫu giọng để người dùng nghe thử."
        stats={[{ label: "tổng số giọng", value: voices.length }]}
        actions={
          <>
            <button onClick={() => void loadVoices()} className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A]">
              <MdRefresh /> Tải lại
            </button>
            <button onClick={() => setDrawerMode("create")} className="flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-4 py-2.5 text-sm font-black text-white shadow-sm">
              <MdRecordVoiceOver /> Thêm giọng mẫu
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
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 text-xl">
                        <MdRecordVoiceOver />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-black text-gray-900">{v.name}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase">{v.provider} • {v.isPremium ? "Premium" : "Free"}</p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>

            <div>
              {selected ? (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gray-50 p-6 space-y-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Nghe thử</p>
                    <audio controls src={selected.previewUrl} className="w-full h-10" />
                    
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">GCS Path</p>
                         <p className="text-xs font-mono text-gray-600 break-all">{selected.gcsPath}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Mô tả/Text</p>
                         <p className="text-xs text-gray-600 italic">"{selected.description}"</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => void handleDelete()} 
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-xs font-black hover:bg-red-50 transition-colors"
                    >
                      <MdDelete /> Xóa giọng mẫu
                    </button>
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
        mode="create" 
        title="Thêm Giọng mẫu" 
        description="Bạn có thể tự sinh giọng AI hoặc tải lên file MP3 có sẵn." 
        onClose={() => setDrawerMode(null)}
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-4">
             <p className="text-[10px] font-black text-purple-600 uppercase text-center">Tùy chọn 1: Sinh giọng AI</p>
             <label className={labelCls}>Nội dung văn bản
               <input value={genText} onChange={e => setGenText(e.target.value)} className={fieldCls} />
             </label>
             <div className="grid grid-cols-2 gap-3">
               <label className={labelCls}>Provider
                  <select value={genProvider} onChange={e => handleProviderChange(e.target.value)} className={fieldCls}>
                    <option value="GCP">Google Cloud</option>
                    <option value="ElevenLabs">ElevenLabs</option>
                  </select>
               </label>
               <label className={labelCls}>Giọng nói (Voice)
                  <select value={genVoiceId} onChange={e => setGenVoiceId(e.target.value)} className={fieldCls}>
                    {genProvider === "GCP" ? (
                      <>
                        <optgroup label="Neural2 (Chất lượng cao)">
                          <option value="vi-VN-Neural2-A">Việt Nam - Nữ (A)</option>
                          <option value="vi-VN-Neural2-D">Việt Nam - Nam (D)</option>
                        </optgroup>
                        <optgroup label="Wavenet">
                          <option value="vi-VN-Wavenet-A">Việt Nam - Nữ (A)</option>
                          <option value="vi-VN-Wavenet-B">Việt Nam - Nam (B)</option>
                          <option value="vi-VN-Wavenet-C">Việt Nam - Nữ (C)</option>
                          <option value="vi-VN-Wavenet-D">Việt Nam - Nam (D)</option>
                        </optgroup>
                      </>
                    ) : (
                      <>
                        <optgroup label="ElevenLabs (VJP Premium)">
                          <option value="pNInz6obpgnuPs397vXP">Adam (Nam - Trầm)</option>
                          <option value="TX3LPaxmHKxFfW646Sse">Liam (Nam - Ấm áp VJP)</option>
                          <option value="EXAVITQu4vr4xnSDxMaL">Bella (Nữ - Ngọt ngào)</option>
                          <option value="Lcf7eeY9feD1p95OmDAn">Sarah (Nữ - Truyền cảm VJP)</option>
                          <option value="MF3mGyEYCl7XYW7L696t">Rachel (Nữ - Chuyên nghiệp)</option>
                          <option value="ErXw7ePBqOfDr909BvG6">Antoni (Nam - Trẻ)</option>
                          <option value="IKne3meq5pC9XdtgXx6M">Charlie (Nam - Kể chuyện VJP)</option>
                        </optgroup>
                      </>
                    )}
                  </select>
               </label>
             </div>
             <button onClick={() => void handleGenerate()} disabled={saving} className="w-full py-3 bg-purple-600 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-200">
               {saving ? "Đang xử lý..." : "Sinh & Lưu vào Kho"}
             </button>
          </div>

          <div className="relative py-2 flex items-center">
             <div className="flex-1 border-t border-gray-100"></div>
             <span className="px-3 text-[10px] font-black text-gray-300 uppercase">Hoặc</span>
             <div className="flex-1 border-t border-gray-100"></div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
             <p className="text-[10px] font-black text-blue-600 uppercase text-center">Tùy chọn 2: Tải lên file MP3</p>
             <input 
                type="file" 
                accept="audio/mpeg" 
                onChange={e => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
             />
             <button onClick={() => void handleUpload()} disabled={saving || !uploadFile} className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black">
               {saving ? "Đang tải lên..." : "Tải lên & Lưu"}
             </button>
          </div>
        </div>
      </CrudEditorDrawer>

      <AppToast toast={toast} onClose={closeToast} />
    </div>
  );
}
