"use client";

import { useState } from "react";
import { MdCloudSync, MdRecordVoiceOver, MdFileUpload } from "react-icons/md";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/hooks/useToast";
import AppToast from "@/components/ui/AppToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";

export default function MediaTestPage() {
  const { toast, showError, showSuccess, closeToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Demo Gen State
  const [demoText, setDemoText] = useState("Chào bé, gấu là Lucky đây!");
  const [demoVoiceId, setDemoVoiceId] = useState("vi-VN-Neural2-A");
  const [demoProvider, setDemoProvider] = useState("GCP");

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("music");

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await adminService.syncMedia();
      if (res.isFailure) throw new Error(res.error?.description || "Đồng bộ thất bại");
      showSuccess("Đồng bộ thành công", "Đã quét xong GCS và cập nhật Database");
    } catch (e) {
      showError("Lỗi đồng bộ", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setLoading(false);
    }
  };



  const handleUpload = async () => {
    if (!uploadFile) {
      showError("Lỗi", "Vui lòng chọn file");
      return;
    }
    setLoading(true);
    try {
      const res = await adminService.uploadMedia(uploadFile, uploadCategory);
      if (res.isFailure) throw new Error(res.error?.description || "Upload thất bại");
      showSuccess("Upload thành công", `Đã lưu file và tạo bản ghi trong DB`);
      setUploadFile(null);
    } catch (e) {
      showError("Lỗi upload", e instanceof Error ? e.message : "Không xác định");
    } finally {
      setLoading(false);
    }
  };

  const cardCls = "rounded-3xl bg-white p-8 border border-[#F0F2F8] shadow-sm space-y-6";
  const btnCls = "flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black text-white transition-all disabled:opacity-50";
  const inputCls = "w-full rounded-xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-2.5 text-sm outline-none focus:border-[#17409A] transition-all";

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        badge="Tools"
        title="Quản lý & Thử nghiệm Media"
        description="Đồng bộ GCS, sinh giọng nói mẫu và upload file trực tiếp vào hệ thống."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sync Section */}
        <div className={cardCls}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-2xl">
              <MdCloudSync />
            </div>
            <div>
              <h3 className="font-black text-lg">Đồng bộ GCS</h3>
              <p className="text-sm text-gray-500">Quét toàn bộ bucket và cập nhật Database</p>
            </div>
          </div>
          <button 
            onClick={handleSync} 
            disabled={loading}
            className={`${btnCls} bg-blue-600 hover:bg-blue-700 w-full`}
          >
            {loading ? "Đang xử lý..." : "Bắt đầu đồng bộ"}
          </button>
        </div>



        {/* Upload Section */}
        <div className={cardCls + " lg:col-span-2"}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 text-2xl">
              <MdFileUpload />
            </div>
            <div>
              <h3 className="font-black text-lg">Upload Media trực tiếp</h3>
              <p className="text-sm text-gray-500">Tải file lên GCS và tự động đăng ký vào Database</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Loại Media</p>
              <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className={inputCls}>
                <option value="music">Nhạc (Music)</option>
                <option value="story">Truyện (Story)</option>
              </select>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Chọn file (MP3/TXT)</p>
              <input 
                type="file" 
                onChange={e => setUploadFile(e.target.files?.[0] || null)} 
                className={inputCls + " py-2"}
              />
            </div>
            <button 
              onClick={handleUpload} 
              disabled={loading || !uploadFile}
              className={`${btnCls} bg-green-600 hover:bg-green-700`}
            >
              {loading ? "Đang tải lên..." : "Tải lên ngay"}
            </button>
          </div>
        </div>
      </div>

      <AppToast toast={toast} onClose={closeToast} />
    </div>
  );
}
