import type { ProfileSummary } from "@/types";
import { MdStar, MdChildCare, MdModeNight } from "react-icons/md";

interface ProfilesListProps {
  profiles: ProfileSummary[];
  selectedId: string | null;
  onSelect: (profile: ProfileSummary) => void;
}

const statusLabel: Record<number, string> = {
  1: "Dùng thử",
  2: "Hoạt động",
  3: "Gia hạn",
  4: "Hết hạn",
};

const statusTone: Record<number, string> = {
  1: "bg-[#FFD93D]/20 text-[#B45309]",
  2: "bg-[#4ECDC4]/10 text-[#2A9D8F]",
  3: "bg-[#FF8C42]/10 text-[#FF8C42]",
  4: "bg-[#FF6B9D]/10 text-[#FF6B9D]",
};

const GENDER_COLOR: Record<string, string> = {
  Male: "#17409A",
  Female: "#FF6B9D",
};

export default function ProfilesList({
  profiles,
  selectedId,
  onSelect,
}: ProfilesListProps) {
  if (profiles.length === 0) {
    return (
      <div className="py-12 text-center">
        <MdChildCare className="mx-auto text-4xl text-[#E5E7EB] mb-3" />
        <p className="text-sm text-[#9CA3AF]">Chưa có hồ sơ nào trong danh sách.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">
        Hồ sơ trẻ · {profiles.length} hồ sơ
      </p>
      <div className="divide-y divide-[#F0F2F8]">
        {profiles.map((profile) => {
          const active = selectedId === profile.id;
          const genderColor = GENDER_COLOR[profile.gender] ?? "#9CA3AF";
          const tone = statusTone[profile.subscriptionStatus] ?? "bg-[#17409A]/10 text-[#17409A]";

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile)}
              className={`group w-full flex items-center gap-4 py-3.5 px-3 text-left transition-all duration-150 rounded-xl ${
                active ? "bg-[#17409A]/5" : "hover:bg-[#F4F7FF]"
              }`}
            >
              {/* Avatar */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
                style={{ backgroundColor: genderColor }}
              >
                {profile.name[0]?.toUpperCase() ?? "?"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-black truncate ${active ? "text-[#17409A]" : "text-[#1A1A2E]"}`}>
                    {profile.name}
                  </p>
                  {profile.subscriptionStatus !== 1 && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${tone}`}>
                      {statusLabel[profile.subscriptionStatus] ?? "Không rõ"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#9CA3AF]">
                  <span>{profile.gender} · {profile.age} tuổi</span>
                  <span className="flex items-center gap-1">
                    <MdStar className="text-xs text-[#FFD93D]" />
                    {profile.dailyCandyBalance}
                  </span>
                </div>
              </div>

              {/* Active indicator */}
              {active && (
                <div className="h-2 w-2 shrink-0 rounded-full bg-[#17409A]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
