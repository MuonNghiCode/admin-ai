"use client";

import { useEffect, useState } from "react";
import { MdRefresh, MdOutlineToken, MdOutlineAccountCircle, MdOutlineHistoryToggleOff, MdOutlineBarChart } from "react-icons/md";
import { elevenLabsService } from "@/services/elevenlabs.service";
import type { ElevenLabsSubscription } from "@/types";
import { useToast } from "@/hooks/useToast";
import AppToast from "@/components/ui/AppToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";

export default function ElevenLabsManagement() {
  const [subscription, setSubscription] = useState<ElevenLabsSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast, showError, closeToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await elevenLabsService.getSubscriptionInfo();
      setSubscription(data);
    } catch (e) {
      showError("Lỗi", e instanceof Error ? e.message : "Không thể tải dữ liệu từ ElevenLabs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const usagePercent = subscription 
    ? Math.min(100, (subscription.character_count / subscription.character_limit) * 100)
    : 0;

  const resetDate = subscription 
    ? new Date(subscription.next_character_count_reset_unix * 1000).toLocaleDateString("vi-VN")
    : "N/A";

  return (
    <div className="space-y-7">
      <AdminPageHeader 
        badge="ElevenLabs API"
        title="Quản lý Hạn mức & Token"
        description="Theo dõi tình trạng sử dụng ký tự và gói đăng ký ElevenLabs AI của hệ thống."
        stats={[
          { label: "Trạng thái", value: subscription?.status?.toUpperCase() || "---" },
          { label: "Gói hiện tại", value: subscription?.tier?.toUpperCase() || "---" }
        ]}
        actions={
          <button 
            onClick={() => void loadData()} 
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <MdRefresh className={loading ? "animate-spin" : ""} /> Tải lại
          </button>
        }
      />

      {loading ? <AdminLoadingSkeleton rows={4} /> : subscription && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Character Usage Card */}
          <div className="col-span-full lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl text-purple-600">
                  <MdOutlineToken />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Sử dụng ký tự</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hạn mức ký tự</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{subscription.character_count.toLocaleString()}</p>
                <p className="text-xs font-bold text-gray-400">trên {subscription.character_limit.toLocaleString()}</p>
                <p className="mt-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg inline-block">
                  ~{(subscription.character_count * 4.5).toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-purple-600'}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-gray-400">0%</span>
                <span className={usagePercent > 90 ? 'text-red-500' : 'text-purple-600'}>{usagePercent.toFixed(1)}% Đã dùng</span>
                <span className="text-gray-400">100% ({(subscription.character_limit * 4.5).toLocaleString("vi-VN")} VNĐ)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">Ngày làm mới tiếp theo</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <MdOutlineHistoryToggleOff className="text-purple-500" />
                  {resetDate}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">Tỷ giá quy đổi</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="text-emerald-600">1 Credit = 4,5 VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Slots Card */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl text-blue-600">
                <MdOutlineAccountCircle />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">Số lượng giọng nói</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giới hạn Voice Slots</p>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-gray-900">{subscription.voice_slots_used}</p>
                  <p className="text-xs font-bold text-gray-400">Đã tạo</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-400">/ {subscription.voice_limit}</p>
                  <p className="text-xs font-bold text-gray-400">Tối đa</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600">Nhân bản giọng chuyên nghiệp</span>
                    <span className={subscription.can_use_professional_voice_cloning ? "text-green-600" : "text-gray-400"}>
                      {subscription.can_use_professional_voice_cloning ? "Khả dụng" : "Không hỗ trợ"}
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600">Nhân bản giọng tức thời</span>
                    <span className={subscription.can_use_instant_voice_cloning ? "text-green-600" : "text-gray-400"}>
                      {subscription.can_use_instant_voice_cloning ? "Khả dụng" : "Không hỗ trợ"}
                    </span>
                 </div>
              </div>
            </div>
          </div>

          {/* Plan Info Card */}
          <div className="col-span-full rounded-3xl bg-gradient-to-br from-[#17409A] to-[#0D2861] p-8 text-white shadow-xl shadow-blue-900/20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                   <p className="text-xs font-black uppercase tracking-widest text-white/50">Chi tiết gói đăng ký</p>
                   <h2 className="text-3xl font-black">Gói: {subscription.tier.toUpperCase()}</h2>
                   <p className="text-white/70 font-medium">Bạn đang sử dụng gói dịch vụ {subscription.tier} với đầy đủ các tính năng hỗ trợ.</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase text-white/40">Chu kỳ làm mới</p>
                      <p className="text-sm font-bold">{subscription.character_refresh_period === 'monthly_period' ? 'Hàng tháng' : subscription.character_refresh_period}</p>
                   </div>
                   <div className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase text-white/40">Gia hạn hạn mức</p>
                      <p className="text-sm font-bold">{subscription.can_extend_character_limit ? 'Có thể gia hạn' : 'Không thể gia hạn'}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <AppToast toast={toast} onClose={closeToast} />
    </div>
  );
}
