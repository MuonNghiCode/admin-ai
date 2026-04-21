"use client";

import { useEffect, useMemo, useState } from "react";
import { MdEdit, MdRefresh, MdSave, MdVerified, MdPerson } from "react-icons/md";
import { adminService } from "@/services/admin.service";
import type { UserItem } from "@/types";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import AppDropdown from "@/components/ui/AppDropdown";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import CrudEditorDrawer from "@/components/admin/shared/CrudEditorDrawer";
import CrudWorkspaceTabs, {
  type CrudTab,
} from "@/components/admin/shared/CrudWorkspaceTabs";

const ROLE_OPTIONS = [
  { label: "Master (1)", value: 1 },
  { label: "User (2)", value: 2 },
];

const PROVIDER_TONE: Record<string, string> = {
  Google: "text-[#4285F4] bg-[#4285F4]/10",
  Facebook: "text-[#1877F2] bg-[#1877F2]/10",
  Local: "text-[#9CA3AF] bg-[#F0F2F8]",
};

export default function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CrudTab>("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editedRole, setEditedRole] = useState(1);
  const { toast, showError, showSuccess, closeToast } = useToast();

  const selected = useMemo(
    () => users.find((item) => item.userId === selectedId) ?? null,
    [users, selectedId],
  );

  const proCount = users.filter((item) => item.isPro).length;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      if (response.isFailure) throw new Error(response.error?.description || "Không tải được người dùng");
      const data = response.value ?? [];
      setUsers(data);
      setSelectedId((current) => current ?? data[0]?.userId ?? null);
    } catch (error) {
      showError("Không tải được người dùng", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = () => {
    if (!selected) return;
    setEditedRole(selected.roleId);
    setDrawerOpen(true);
    setActiveTab("edit");
  };

  const saveRole = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await adminService.updateUserRole(selected.userId, editedRole);
      if (response.isFailure) throw new Error(response.error?.description || "Cập nhật vai trò thất bại");
      setUsers((prev) => prev.map((item) => item.userId === selected.userId ? { ...item, roleId: editedRole } : item));
      showSuccess("Đã cập nhật vai trò", `${selected.userId} → ${editedRole}`);
      setDrawerOpen(false);
      setActiveTab("detail");
    } catch (error) {
      showError("Cập nhật vai trò thất bại", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 text-[#1A1A2E]">
      <AdminPageHeader
        badge="Người dùng"
        title="Quản trị tài khoản người dùng"
        description="Xem danh sách tài khoản, trạng thái Premium, nhà cung cấp xác thực và cập nhật vai trò."
        stats={[{ label: "tổng tài khoản", value: users.length }, { label: "Premium", value: proCount }]}
        actions={
          <>
            <button type="button" onClick={() => void loadUsers()}
              className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A] transition-all hover:border-[#17409A] hover:shadow-sm">
              <MdRefresh className="text-base" /> Tải lại
            </button>
            <button type="button" onClick={() => setActiveTab("create")}
              className="flex items-center gap-2 rounded-2xl border border-dashed border-[#17409A]/40 px-4 py-2.5 text-sm font-black text-[#17409A]/60 cursor-not-allowed" disabled>
              Tạo tài khoản (sắp có)
            </button>
          </>
        }
      />

      {loading ? <AdminLoadingSkeleton rows={6} /> : (
        <CrudWorkspaceTabs
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); if (tab === "edit") openEdit(); }}
          stats={{ total: users.length, activeLabel: "Premium", activeValue: proCount }}
        >
          {activeTab === "create" ? (
            <div className="py-10 text-center">
              <MdPerson className="mx-auto text-4xl text-[#E5E7EB] mb-3" />
              <p className="text-sm text-[#9CA3AF]">Backend chưa mở endpoint tạo người dùng qua admin.</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Tính năng sẽ được kích hoạt khi backend bổ sung POST/DELETE.</p>
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
              {/* ── User list ── */}
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">Danh sách tài khoản</p>
                {users.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[#9CA3AF]">Không có tài khoản nào.</p>
                ) : (
                  <div className="divide-y divide-[#F0F2F8]">
                    {users.map((user) => {
                      const isActive = user.userId === selectedId;
                      const provTone = PROVIDER_TONE[user.provider ?? "Local"] ?? PROVIDER_TONE.Local;
                      return (
                        <button
                          key={user.userId}
                          type="button"
                          onClick={() => { setSelectedId(user.userId); setActiveTab("detail"); }}
                          className={`group w-full flex items-center gap-4 py-3.5 px-3 text-left transition-colors rounded-xl ${isActive ? "bg-[#17409A]/5" : "hover:bg-[#F4F7FF]"}`}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17409A]/10 text-sm font-black text-[#17409A]">
                            {user.fullName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black text-[#1A1A2E] truncate">{user.fullName}</p>
                              {user.isPro && <MdVerified className="text-[#17409A] text-sm shrink-0" />}
                            </div>
                            <p className="text-[11px] text-[#9CA3AF] truncate">{user.email}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${provTone}`}>
                            {user.provider || "Local"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Detail panel ── */}
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">Chi tiết tài khoản</p>
                {selected ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17409A]/10 text-lg font-black text-[#17409A]">
                        {selected.fullName?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-black text-[#1A1A2E] flex items-center gap-1.5">
                          {selected.fullName}
                          {selected.isPro && <MdVerified className="text-[#17409A]" />}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{selected.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#F0F2F8]">
                      {[
                        { label: "Nhà cung cấp", value: selected.provider || "Local" },
                        { label: "Vai trò", value: `Role ${selected.roleId}` },
                        { label: "Smart Candies", value: `${selected.smartCandies} kẹo` },
                        { label: "Ngày tạo", value: new Date(selected.createdAt).toLocaleDateString("vi-VN") },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b border-[#F0F2F8] last:border-0">
                          <span className="text-xs text-[#9CA3AF]">{label}</span>
                          <span className="text-xs font-black text-[#1A1A2E]">{value}</span>
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={openEdit}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#17409A] py-2.5 text-xs font-black text-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors">
                      <MdEdit className="text-sm" /> Đổi vai trò
                    </button>
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-[#9CA3AF]">Chọn một tài khoản để xem chi tiết.</p>
                )}
              </div>
            </div>
          )}
        </CrudWorkspaceTabs>
      )}

      <CrudEditorDrawer open={drawerOpen} mode="edit" title="Cập nhật vai trò" description="Thay đổi vai trò cho tài khoản đã chọn." onClose={() => setDrawerOpen(false)}>
        <div className="space-y-5">
          <p className="text-sm font-bold text-[#1A1A2E]">Tài khoản: <span className="text-[#17409A]">{selected?.fullName ?? "–"}</span></p>
          <AppDropdown label="Vai trò" value={editedRole} options={ROLE_OPTIONS} onChange={setEditedRole} disabled={saving} />
          <button type="button" onClick={() => void saveRole()} disabled={saving || !selected}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17409A] py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-[#0E2A66] transition-colors">
            <MdSave className="text-base" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </CrudEditorDrawer>

      <AppToast toast={toast} onClose={closeToast} />
    </div>
  );
}
