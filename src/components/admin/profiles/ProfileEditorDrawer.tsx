"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { ProfileSummary, ProfileUpsertRequest } from "@/types";
import { MdClose, MdSave, MdSubject } from "react-icons/md";
import AppDropdown from "@/components/ui/AppDropdown";

interface ProfileEditorDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  profile: ProfileSummary | null;
  onClose: () => void;
  onSave: (payload: ProfileUpsertRequest) => Promise<void>;
  saving?: boolean;
}

const GENDER_OPTIONS = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nu" },
] as const;

const MODE_OPTIONS = [
  { label: "Normal", value: "Normal", description: "Chế độ mặc định" },
  { label: "Learning", value: "Learning", description: "Tập trung học tập" },
  { label: "Sleep", value: "Sleep", description: "Hạn chế tương tác" },
] as const;

const SAFETY_MODE_OPTIONS = [
  { label: "Nhẹ nhàng", value: 1, description: "Nhắc nhở nhẹ" },
  { label: "Cân bằng", value: 2, description: "Cân bằng tự do và an toàn" },
  { label: "Nghiêm ngặt", value: 3, description: "Chặn nội dung nhạy cảm mạnh" },
] as const;

const TTS_PROVIDER_OPTIONS = [
  { label: "Azure", value: "azure" },
  { label: "Google", value: "google" },
  { label: "System", value: "system" },
] as const;

const PERSONALITY_OPTIONS = [
  { label: "Thân thiện", value: "Than thien" },
  { label: "Sáng tạo", value: "Sang tao" },
  { label: "Kỷ luật", value: "Ky luat" },
] as const;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  label: `${String(hour).padStart(2, "0")}:00`,
  value: hour,
}));

function isoToLocalInput(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 16);
}

function localInputToIso(value: string, fallback: string) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString();
}

function createEmptyValue(id = ""): ProfileUpsertRequest {
  const now = new Date().toISOString();

  return {
    id,
    name: "",
    age: 0,
    subscriptionPlanId: 0,
    subscriptionPlan: {
      id: 0,
      planType: 1,
      name: "",
      description: "",
      canPlayMusic: true,
      canTellStoriesOnUserSpeech: true,
      canUseLearningAI: true,
      priceMonthly: 0,
      isActive: true,
      dailyCandyLimit: 0,
    },
    subscribedSubjects: [],
    subscriptionStatus: 1,
    subscriptionStartUtc: now,
    subscriptionEndUtc: now,
    graceEndUtc: now,
    allowedStartHour: 0,
    allowedEndHour: 23,
    blockedTopics: [],
    whitelistTopics: [],
    bannedKeywords: [],
    currentMode: "Normal",
    bearCategory: 1,
    gender: "Nam",
    honorific: "",
    personality: "",
    personalityDescription: "",
    preferredVoiceId: "",
    preferredTtsProvider: "",
    safetyResponseMode: 1,
    safetyPretendMessage: "",
    safetyWarningMessage: "",
    dailyCandyBalance: 0,
    lastQuotaResetUtc: now,
  };
}

function arrayToCsv(value: string[]) {
  return value.join(", ");
}

function csvInputToArray(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProfileEditorDrawer({
  open,
  mode,
  profile,
  onClose,
  onSave,
  saving = false,
}: ProfileEditorDrawerProps) {
  const [form, setForm] = useState<ProfileUpsertRequest>(() =>
    createEmptyValue(profile?.id ?? crypto.randomUUID()),
  );

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(
      profile
        ? {
            ...createEmptyValue(profile.id),
            id: profile.id,
            name: profile.name,
            age: profile.age,
            gender: profile.gender === "Nu" ? "Nu" : "Nam",
            currentMode: profile.currentMode,
            subscriptionStatus: profile.subscriptionStatus,
            subscriptionEndUtc:
              profile.subscriptionEndUtc ?? new Date().toISOString(),
            dailyCandyBalance: profile.dailyCandyBalance,
          }
        : createEmptyValue(crypto.randomUUID()),
    );
  }, [open, profile]);

  if (!open) return null;

  const update = <Key extends keyof ProfileUpsertRequest>(
    key: Key,
    value: ProfileUpsertRequest[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave({
      ...form,
      subscribedSubjects: form.subscribedSubjects,
      blockedTopics: form.blockedTopics,
      whitelistTopics: form.whitelistTopics,
      bannedKeywords: form.bannedKeywords,
    });
  };

  const ageValue = Number.isFinite(form.age) ? Math.min(12, Math.max(1, form.age || 1)) : 1;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-[1px]">
      <div className="h-full w-full max-w-4xl overflow-y-auto border-l border-white/20 bg-[#F4F7FF] shadow-2xl shadow-[#17409A]/20">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#9CA3AF]">
              {mode === "create" ? "Tạo mới" : "Chỉnh sửa"}
            </p>
            <h3 className="mt-1 text-2xl font-black text-[#17409A]">
              Hồ sơ profile
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              {mode === "create"
                ? "Tạo mới theo contract request create"
                : "Chỉnh sửa theo contract request edit"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E5E7EB] text-[#17409A] transition-colors hover:bg-[#F4F7FF]"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
            <div className="flex items-center gap-2 text-[#17409A]">
              <MdSubject className="text-xl" />
              <h4 className="text-lg font-black">Thông tin cơ bản</h4>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-[#1A1A2E]">
                <span>Tên</span>
                <input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                />
              </label>

              <AppDropdown
                label="Giới tính"
                value={(form.gender as "Nam" | "Nu") || "Nam"}
                options={[...GENDER_OPTIONS]}
                onChange={(value) => update("gender", value)}
              />

              <AppDropdown
                label="Chế độ hiện tại"
                value={MODE_OPTIONS.some((option) => option.value === form.currentMode) ? form.currentMode : "Normal"}
                options={[...MODE_OPTIONS]}
                onChange={(value) => update("currentMode", value)}
              />

              <label className="space-y-2 text-sm font-bold text-[#1A1A2E]">
                <span>Tuổi (1 - 12)</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={ageValue}
                  onChange={(event) => {
                    const parsed = Number(event.target.value);
                    const bounded = Number.isNaN(parsed)
                      ? 1
                      : Math.min(12, Math.max(1, parsed));
                    update("age", bounded);
                  }}
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                />
              </label>

              <label className="space-y-2 text-sm font-bold text-[#1A1A2E]">
                <span>Candy</span>
                <input
                  type="number"
                  min={0}
                  value={form.dailyCandyBalance}
                  onChange={(event) =>
                    update("dailyCandyBalance", Math.max(0, Number(event.target.value) || 0))
                  }
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                />
              </label>

              <label className="space-y-2 text-sm font-bold text-[#1A1A2E]">
                <span>Subscription status</span>
                <input
                  type="number"
                  min={0}
                  max={3}
                  value={form.subscriptionStatus}
                  onChange={(event) => update("subscriptionStatus", Math.max(0, Number(event.target.value) || 0))}
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
            <h4 className="text-lg font-black text-[#17409A]">Subscription</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["subscriptionPlanId", "Plan ID"] as const,
                ["bearCategory", "Bear category"] as const,
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="space-y-2 text-sm font-bold text-[#1A1A2E]"
                >
                  <span>{label}</span>
                  <input
                    type="number"
                    value={String(form[key])}
                    onChange={(event) =>
                      update(
                        key,
                        Number(
                          event.target.value,
                        ) as ProfileUpsertRequest[typeof key],
                      )
                    }
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                  />
                </label>
              ))}

              <AppDropdown
                label="Giờ bắt đầu"
                value={form.allowedStartHour}
                options={HOUR_OPTIONS}
                onChange={(value) => update("allowedStartHour", value)}
              />
              <AppDropdown
                label="Giờ kết thúc"
                value={form.allowedEndHour}
                options={HOUR_OPTIONS}
                onChange={(value) => update("allowedEndHour", value)}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
            <h4 className="text-lg font-black text-[#17409A]">
              Business rules
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["subscriptionStartUtc", "Subscription start"] as const,
                ["subscriptionEndUtc", "Subscription end"] as const,
                ["graceEndUtc", "Grace end"] as const,
                ["lastQuotaResetUtc", "Quota reset"] as const,
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="space-y-2 text-sm font-bold text-[#1A1A2E]"
                >
                  <span>{label}</span>
                  <input
                    type="datetime-local"
                    value={isoToLocalInput(String(form[key]))}
                    onChange={(event) =>
                      update(
                        key,
                        localInputToIso(event.target.value, String(form[key])) as ProfileUpsertRequest[typeof key],
                      )
                    }
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
            <h4 className="text-lg font-black text-[#17409A]">
              Thuộc tính và an toàn
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AppDropdown
                label="TTS provider"
                value={TTS_PROVIDER_OPTIONS.some((option) => option.value === form.preferredTtsProvider) ? form.preferredTtsProvider : "azure"}
                options={[...TTS_PROVIDER_OPTIONS]}
                onChange={(value) => update("preferredTtsProvider", value)}
              />
              <AppDropdown
                label="Personality"
                value={PERSONALITY_OPTIONS.some((option) => option.value === form.personality) ? form.personality : "Than thien"}
                options={[...PERSONALITY_OPTIONS]}
                onChange={(value) => update("personality", value)}
              />
              <AppDropdown
                label="Safety mode"
                value={SAFETY_MODE_OPTIONS.some((option) => option.value === form.safetyResponseMode) ? form.safetyResponseMode : 1}
                options={[...SAFETY_MODE_OPTIONS]}
                onChange={(value) => update("safetyResponseMode", value)}
              />
              {[
                ["honorific", "Danh xưng"] as const,
                ["preferredVoiceId", "Voice ID"] as const,
                ["safetyPretendMessage", "Pretend message"] as const,
                ["safetyWarningMessage", "Warning message"] as const,
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="space-y-2 text-sm font-bold text-[#1A1A2E]"
                >
                  <span>{label}</span>
                  <input
                    value={String(form[key])}
                    onChange={(event) =>
                      update(
                        key,
                        event.target.value as ProfileUpsertRequest[typeof key],
                      )
                    }
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {[
                ["subscribedSubjects", "Subscribed subjects"] as const,
                ["blockedTopics", "Blocked topics"] as const,
                ["whitelistTopics", "Whitelist topics"] as const,
                ["bannedKeywords", "Banned keywords"] as const,
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="block space-y-2 text-sm font-bold text-[#1A1A2E]"
                >
                  <span>{label}</span>
                  <textarea
                    rows={4}
                    value={arrayToCsv(form[key])}
                    onChange={(event) =>
                      update(
                        key,
                        csvInputToArray(
                          event.target.value,
                        ) as ProfileUpsertRequest[typeof key],
                      )
                    }
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 outline-none transition-colors focus:border-[#17409A]"
                    placeholder="Nhập cách nhau bởi dấu phẩy hoặc xuống dòng"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border-2 border-[#17409A] bg-white px-5 py-3 text-sm font-black text-[#17409A]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17409A] px-5 py-3 text-sm font-black text-white shadow-xl shadow-[#17409A]/15 disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
            >
              <MdSave className="text-lg" />
              {saving ? "Đang lưu..." : "Lưu profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
