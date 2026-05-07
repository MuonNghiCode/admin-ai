"use client";

import { useEffect, useMemo, useState } from "react";
import { MdEdit, MdRefresh, MdSave, MdToken, MdCheck } from "react-icons/md";
import { adminService } from "@/services/admin.service";
import type { DeviceItem, DeviceUpsertRequest } from "@/types";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import AdminDeleteModal from "@/components/admin/shared/AdminDeleteModal";
import CrudEditorDrawer from "@/components/admin/shared/CrudEditorDrawer";
import CrudWorkspaceTabs, {
  type CrudTab,
} from "@/components/admin/shared/CrudWorkspaceTabs";

function emptyDevice(): DeviceUpsertRequest {
  return {
    deviceId: crypto.randomUUID(),
    serialNumber: "",
    nickname: "",
    status: "Active",
    profileId: null,
    userId: null,
    isHardwareProtectionEnabled: false,
  };
}

function mapDeviceToForm(device: DeviceItem): DeviceUpsertRequest {
  return {
    deviceId: device.deviceId,
    serialNumber: device.serialNumber,
    nickname: device.nickname ?? "",
    status: device.status,
    profileId: device.profileId ?? null,
    userId: null,
    isHardwareProtectionEnabled: device.isHardwareProtectionEnabled,
  };
}

const STATUS_TONE: Record<string, string> = {
  Active: "text-[#2A9D8F] bg-[#4ECDC4]/10",
  Inactive: "text-[#9CA3AF] bg-[#F0F2F8]",
  Online: "text-[#17409A] bg-[#17409A]/10",
  ReadyToPair: "text-[#FF8C42] bg-[#FF8C42]/10",
};

export default function DevicesManagement() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState("");
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CrudTab>("list");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<DeviceUpsertRequest>(emptyDevice());
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showError, showSuccess, closeToast } = useToast();

  const selected = useMemo(
    () => devices.find((item) => item.deviceId === selectedId) ?? null,
    [devices, selectedId],
  );

  const activeCount = devices.filter((item) => item.status === "Active").length;

  const loadDevices = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDevices();
      if (response.isFailure)
        throw new Error(
          response.error?.description || "Không tải được thiết bị",
        );
      const data = response.value ?? [];
      setDevices(data);
      setSelectedId((current) => current ?? data[0]?.deviceId ?? null);
    } catch (error) {
      showError(
        "Không tải được thiết bị",
        error instanceof Error ? error.message : "Lỗi không xác định",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setForm(emptyDevice());
    setDrawerMode("create");
    setActiveTab("create");
  };
  const openEdit = () => {
    if (!selected) return;
    setForm(mapDeviceToForm(selected));
    setDrawerMode("edit");
    setActiveTab("edit");
  };

  const saveDevice = async () => {
    setSaving(true);
    try {
      if (drawerMode === "edit" && selected) {
        const res = await adminService.updateDevice(selected.deviceId, form);
        if (res.isFailure)
          throw new Error(res.error?.description || "Cập nhật thất bại");
        showSuccess("Đã cập nhật thiết bị", selected.deviceId);
      } else {
        const res = await adminService.createDevice(form);
        if (res.isFailure)
          throw new Error(res.error?.description || "Tạo thất bại");
        showSuccess("Đã tạo thiết bị", form.serialNumber);
      }
      await loadDevices();
      setDrawerMode(null);
      setActiveTab("detail");
    } catch (error) {
      showError(
        drawerMode === "edit" ? "Cập nhật thất bại" : "Tạo thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteDevice = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await adminService.deleteDevice(selected.deviceId);
      if (res.isFailure)
        throw new Error(res.error?.description || "Xóa thất bại");
      showSuccess("Đã xóa thiết bị", selected.deviceId);
      setSelectedId(null);
      setActiveTab("list");
      await loadDevices();
    } catch (error) {
      showError(
        "Xóa thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định",
      );
    } finally {
      setSaving(false);
      setIsDeleting(false);
    }
  };

  const issueToken = async () => {
    if (!selected) return;
    try {
      const res = await adminService.issueDeviceToken(selected.deviceId);
      if (res.isFailure || !res.value)
        throw new Error(res.error?.description || "Phát token thất bại");
      setIssuedToken(res.value.token);
      showSuccess("Token mới đã tạo", `TokenId: ${res.value.tokenId}`);
    } catch (error) {
      showError(
        "Phát token thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định",
      );
    }
  };

  const revokeToken = async () => {
    if (!selected || !tokenId.trim()) return;
    try {
      const res = await adminService.revokeDeviceToken(
        selected.deviceId,
        tokenId.trim(),
      );
      if (res.isFailure)
        throw new Error(res.error?.description || "Thu hồi token thất bại");
      showSuccess("Đã thu hồi token", tokenId.trim());
      setTokenId("");
      setIssuedToken(null);
    } catch (error) {
      showError(
        "Thu hồi token thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định",
      );
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#17409A] focus:ring-2 focus:ring-[#17409A]/10 transition-all";
  const labelCls =
    "block space-y-1.5 text-xs font-black uppercase tracking-wide text-[#9CA3AF]";

  return (
    <div className="space-y-7 text-[#1A1A2E]">
      <AdminPageHeader
        badge="Thiết bị"
        title="Quản trị thiết bị thông minh"
        description="Tạo mới, chỉnh sửa, xóa và phát token xác thực cho các thiết bị gấu SmartBear."
        stats={[
          { label: "tổng thiết bị", value: devices.length },
          { label: "đang hoạt động", value: activeCount },
        ]}
        actions={
          <>
            <button
              type="button"
              onClick={() => void loadDevices()}
              className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A] transition-all hover:border-[#17409A] hover:shadow-sm"
            >
              <MdRefresh className="text-base" /> Tải lại
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-2xl bg-[#17409A] px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-[#0E2A66] transition-colors"
            >
              Thêm thiết bị
            </button>
          </>
        }
      />

      {loading ? (
        <AdminLoadingSkeleton rows={6} />
      ) : (
        <CrudWorkspaceTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "create") openCreate();
            if (tab === "edit") openEdit();
          }}
          stats={{
            total: devices.length,
            activeLabel: "Đang hoạt động",
            activeValue: activeCount,
          }}
        >
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* ── Device list table ── */}
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">
                Danh sách thiết bị
              </p>
              {devices.length === 0 ? (
                <p className="text-sm text-[#9CA3AF] py-6 text-center">
                  Chưa có thiết bị nào.
                </p>
              ) : (
                <div className="divide-y divide-[#F0F2F8]">
                  {devices.map((device) => {
                    const isActive = device.deviceId === selectedId;
                    const tone =
                      STATUS_TONE[device.status] ??
                      "text-[#9CA3AF] bg-[#F0F2F8]";
                    return (
                      <button
                        key={device.deviceId}
                        type="button"
                        onClick={() => {
                          setSelectedId(device.deviceId);
                          setActiveTab("detail");
                        }}
                        className={`group w-full flex items-center gap-4 py-3.5 px-3 text-left transition-colors rounded-xl ${isActive ? "bg-[#17409A]/5" : "hover:bg-[#F4F7FF]"}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base ${tone}`}
                        >
                          {isActive ? (
                            <MdCheck />
                          ) : (
                            <span className="text-xs font-black">
                              {device.serialNumber.slice(-2)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-[#1A1A2E] truncate">
                            {device.nickname || device.serialNumber}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF] truncate">
                            {device.deviceId}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${tone}`}
                        >
                          {device.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Detail panel ── */}
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">
                Chi tiết thiết bị
              </p>
              {selected ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
                      Serial
                    </p>
                    <p className="mt-1 text-lg font-black text-[#17409A]">
                      {selected.serialNumber}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {selected.deviceId}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={openEdit}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#17409A] py-2.5 text-xs font-black text-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors"
                    >
                      <MdEdit className="text-sm" /> Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeleting(true)}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center rounded-xl border border-[#FF6B9D] py-2.5 text-xs font-black text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white transition-colors disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </div>

                  {/* Token section */}
                  <div className="pt-4 border-t border-[#F0F2F8] space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
                      Quản lý token
                    </p>
                    <button
                      type="button"
                      onClick={() => void issueToken()}
                      className="flex items-center gap-2 rounded-xl bg-[#FF8C42]/10 px-4 py-2.5 text-xs font-black text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white transition-colors"
                    >
                      <MdToken className="text-sm" /> Phát token mới
                    </button>
                    {issuedToken && (
                      <div className="rounded-xl bg-[#F4F7FF] p-3">
                        <p className="text-[10px] font-black text-[#9CA3AF] mb-1">
                          Token
                        </p>
                        <p className="text-xs break-all font-mono text-[#1A1A2E]">
                          {issuedToken}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        placeholder="Nhập Token ID để thu hồi"
                        className="flex-1 rounded-xl border border-[#E5E7EB] bg-[#F4F7FF] px-3 py-2 text-xs outline-none focus:border-[#17409A] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => void revokeToken()}
                        disabled={!tokenId.trim()}
                        className="rounded-xl border border-[#FF6B9D] px-3 py-2 text-xs font-black text-[#FF6B9D] disabled:opacity-40 hover:bg-[#FF6B9D] hover:text-white transition-colors"
                      >
                        Thu hồi
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#9CA3AF] py-6 text-center">
                  Chọn một thiết bị để xem chi tiết.
                </p>
              )}
            </div>
          </div>
        </CrudWorkspaceTabs>
      )}

      <CrudEditorDrawer
        open={drawerMode !== null}
        mode={drawerMode ?? "create"}
        title="Thiết bị"
        description="Thêm hoặc chỉnh sửa thông tin thiết bị SmartBear."
        onClose={() => setDrawerMode(null)}
      >
        <div className="space-y-5">
          <label className={labelCls}>
            Device ID
            <input
              value={form.deviceId}
              onChange={(e) =>
                setForm((p) => ({ ...p, deviceId: e.target.value }))
              }
              className={fieldCls}
            />
          </label>
          <label className={labelCls}>
            Số serial
            <input
              value={form.serialNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, serialNumber: e.target.value }))
              }
              className={fieldCls}
            />
          </label>
          <label className={labelCls}>
            Tên thiết bị
            <input
              value={form.nickname ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, nickname: e.target.value }))
              }
              className={fieldCls}
            />
          </label>
          <label className={labelCls}>
            Trạng thái
            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
              className={fieldCls}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Online">Online</option>
              <option value="ReadyToPair">ReadyToPair</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void saveDevice()}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17409A] py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-[#0E2A66] transition-colors"
          >
            <MdSave className="text-base" />
            {saving
              ? "Đang lưu..."
              : drawerMode === "edit"
                ? "Lưu thay đổi"
                : "Tạo thiết bị"}
          </button>
        </div>
      </CrudEditorDrawer>

      <AppToast toast={toast} onClose={closeToast} />
      
      <AdminDeleteModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={deleteDevice}
        itemName={selected?.nickname || selected?.serialNumber || ""}
        description="Bạn có chắc chắn muốn xóa thiết bị"
        isSaving={saving}
      />
    </div>
  );
}
