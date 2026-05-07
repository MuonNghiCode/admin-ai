"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProfileSummary, ProfileUpsertRequest } from "@/types";
import { profileService } from "@/services/profile.service";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import ProfileHeader from "./ProfileHeader";
import ProfilesList from "./ProfilesList";
import ProfileDetails from "./ProfileDetails";
import ProfileEditorDrawer from "./ProfileEditorDrawer";
import ProfileWorkspaceTabs, {
  type ProfileWorkspaceTab,
} from "./ProfileWorkspaceTabs";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";
import AdminDeleteModal from "@/components/admin/shared/AdminDeleteModal";

export default function ProfilesDashboard() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recommending, setRecommending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileWorkspaceTab>("list");
  const [recommendationText, setRecommendationText] = useState<string | null>(
    null,
  );
  const { toast, showError, showSuccess, closeToast } = useToast();

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedId) ?? null,
    [profiles, selectedId],
  );

  const activeCount = profiles.filter(
    (profile) => profile.subscriptionStatus === 2,
  ).length;
  const hasSelection = !!selectedProfile;

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.getAll();
      if (response.isFailure) {
        throw new Error(
          response.error?.description || "Không tải được profile",
        );
      }
      const data = response.value ?? [];
      setProfiles(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Lỗi không xác định";
      setError(message);
      showError("Không tải được danh sách profile", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (payload: ProfileUpsertRequest) => {
    setSaving(true);
    try {
      if (drawerMode === "edit" && selectedProfile) {
        const response = await profileService.update(
          selectedProfile.id,
          payload,
        );
        if (response.isFailure) {
          throw new Error(
            response.error?.description || "Cập nhật profile thất bại",
          );
        }
        await loadProfiles();
        setSelectedId(response.value?.id ?? selectedProfile.id);
        showSuccess(
          "Cập nhật profile thành công",
          `Profile ${response.value?.name ?? selectedProfile.name} đã được cập nhật`,
        );
      } else {
        const response = await profileService.create(payload);
        if (response.isFailure) {
          throw new Error(
            response.error?.description || "Tạo profile thất bại",
          );
        }
        await loadProfiles();
        setSelectedId(response.value?.id ?? selectedId);
        showSuccess(
          "Tạo profile thành công",
          `Đã tạo profile ${response.value?.name ?? "mới"}`,
        );
      }
      setDrawerMode(null);
      setActiveTab("detail");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Không thể lưu profile";
      showError("Lưu profile thất bại", message);
      throw saveError;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProfile) return;
    
    setSaving(true);
    try {
      const response = await profileService.remove(selectedProfile.id);
      if (response.isFailure) {
        throw new Error(response.error?.description || "Xóa profile thất bại");
      }
      await loadProfiles();
      setSelectedId((current) =>
        current === selectedProfile.id ? null : current,
      );
      setActiveTab("list");
      showSuccess(
        "Xóa profile thành công",
        `Profile ${selectedProfile.name} đã được xóa`,
      );
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Không thể xóa profile";
      showError("Xóa profile thất bại", message);
    } finally {
      setSaving(false);
      setIsDeleting(false);
    }
  };

  const openCreate = () => {
    setDrawerMode("create");
    setActiveTab("create");
  };

  const openEdit = () => {
    if (!selectedProfile) return;
    setDrawerMode("edit");
    setActiveTab("edit");
  };

  const handleSelect = (profile: ProfileSummary) => {
    setSelectedId(profile.id);
    setActiveTab("detail");
    setRecommendationText(null);
  };

  const handleUpdateSubscription = async (subscriptionPlanId: number) => {
    if (!selectedProfile) return;

    setSaving(true);
    try {
      const response = await profileService.updateSubscription(selectedProfile.id, {
        subscriptionPlanId,
      });

      if (response.isFailure) {
        throw new Error(
          response.error?.description || "Cập nhật gói subscription thất bại",
        );
      }

      await loadProfiles();
      setSelectedId(selectedProfile.id);
      showSuccess(
        "Đã cập nhật subscription",
        `Profile ${selectedProfile.name} đã đổi sang gói ${subscriptionPlanId}`,
      );
    } catch (subscriptionError) {
      const message =
        subscriptionError instanceof Error
          ? subscriptionError.message
          : "Không thể cập nhật subscription";
      showError("Cập nhật subscription thất bại", message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateRecommendation = async () => {
    if (!selectedProfile) return;

    setRecommending(true);
    try {
      const response = await profileService.getLearningRecommendation(
        selectedProfile.id,
      );

      if (response.isFailure || !response.value) {
        throw new Error(
          response.error?.description || "Không tạo được gợi ý học tập",
        );
      }

      setRecommendationText(response.value.recommendation);
      showSuccess(
        "Đã tạo gợi ý học tập",
        `Gợi ý cho profile ${response.value.childName} đã sẵn sàng`,
      );
    } catch (recommendationError) {
      const message =
        recommendationError instanceof Error
          ? recommendationError.message
          : "Không thể tạo gợi ý học tập";
      showError("Gợi ý học tập thất bại", message);
    } finally {
      setRecommending(false);
    }
  };

  return (
    <div className="space-y-6 text-[#1A1A2E]">
      <ProfileHeader
        total={profiles.length}
        activeCount={activeCount}
        onCreate={openCreate}
        onRefresh={() => void loadProfiles()}
      />

      {loading ? (
        <AdminLoadingSkeleton rows={6} />
      ) : error ? (
        <div className="rounded-3xl border border-[#FF6B9D] bg-white p-6 text-sm font-semibold text-[#FF6B9D] shadow-lg shadow-[#17409A]/5">
          {error}
        </div>
      ) : (
        <ProfileWorkspaceTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "create") {
              setDrawerMode("create");
            }
            if (tab === "edit" && hasSelection) {
              setDrawerMode("edit");
            }
          }}
          stats={{ total: profiles.length, active: activeCount }}
        >
          {(activeTab === "list" || activeTab === "detail") && (
            <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
              <ProfilesList
                profiles={profiles}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
              <ProfileDetails
                profile={selectedProfile}
                onEdit={openEdit}
                onDelete={() => setIsDeleting(true)}
                onUpdateSubscription={(planId) => void handleUpdateSubscription(planId)}
                onGenerateRecommendation={() => void handleGenerateRecommendation()}
                recommending={recommending}
                recommendationText={recommendationText}
              />
            </div>
          )}

          {activeTab === "create" && (
            <div className="py-10 text-center">
              <p className="text-sm text-[#9CA3AF]">Form tạo mới đang mở trong panel bên phải.</p>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="py-10 text-center">
              <p className="text-sm text-[#9CA3AF]">Form chỉnh sửa đang mở trong panel bên phải.</p>
            </div>
          )}
        </ProfileWorkspaceTabs>
      )}

      <ProfileEditorDrawer
        open={drawerMode !== null}
        mode={drawerMode ?? "create"}
        profile={drawerMode === "edit" ? selectedProfile : null}
        onClose={() => setDrawerMode(null)}
        onSave={handleSave}
        saving={saving}
      />

      <AppToast toast={toast} onClose={closeToast} />

      <AdminDeleteModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        itemName={selectedProfile?.name ?? ""}
        description="Bạn có chắc chắn muốn xóa hồ sơ"
        isSaving={saving}
      />
    </div>
  );
}
