import type { ProfileSummary } from "@/types";
import {
  MdLightbulb,
  MdOutlineEdit,
  MdStar,
  MdWorkspacePremium,
  MdAccessTime,
  MdChildCare,
  MdPerson,
} from "react-icons/md";
import { GiBearFace } from "react-icons/gi";

interface ProfileDetailsProps {
  profile: ProfileSummary | null;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateSubscription: (subscriptionPlanId: number) => void;
  onGenerateRecommendation: () => void;
  recommending?: boolean;
  recommendationText?: string | null;
}

const STATUS_LABEL: Record<number, string> = {
  1: "Dùng thử",
  2: "Hoạt động",
  3: "Gia hạn",
  4: "Hết hạn",
};

const STATUS_TONE: Record<number, string> = {
  1: "text-[#B45309] bg-[#FFD93D]/20",
  2: "text-[#2A9D8F] bg-[#4ECDC4]/10",
  3: "text-[#FF8C42] bg-[#FF8C42]/10",
  4: "text-[#FF6B9D] bg-[#FF6B9D]/10",
};

const GENDER_COLOR: Record<string, string> = {
  Nam: "#17409A",
  Nu: "#FF6B9D",
};



function formatRecommendation(text: string) {
  if (!text) return null;

  // Split into paragraphs by newline or bullet points
  const lines = text.split(/\n|(?=\* \*\*)/g).filter(Boolean);

  return lines.map((line, idx) => {
    let content = line.trim();
    const isBullet = content.startsWith("* ");
    if (isBullet) content = content.substring(2);

    // Parse bold text **something**
    const parts = content.split(/(\*\*.*?\*\*)/g);

    return (
      <p key={idx} className={`mb-3 text-sm leading-relaxed ${isBullet ? "pl-4 relative" : ""}`}>
        {isBullet && <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-[#FF8C42]" />}
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <span key={i} className="font-black text-[#1A1A2E]">
                {part.slice(2, -2)}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  });
}

export default function ProfileDetails({
  profile,
  onEdit,
  onDelete,
  onUpdateSubscription,
  onGenerateRecommendation,
  recommending = false,
  recommendationText,
}: ProfileDetailsProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9CA3AF]">
        Chi tiết hồ sơ
      </p>

      {profile ? (
        <div className="space-y-5">
          {/* Profile identity */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg"
              style={{ backgroundColor: GENDER_COLOR[profile.gender] ?? "#17409A" }}
            >
              {profile.name[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-black text-[#1A1A2E]">{profile.name}</p>
                {profile.subscriptionStatus !== 1 && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${STATUS_TONE[profile.subscriptionStatus] ?? "text-[#9CA3AF] bg-[#F4F7FF]"}`}
                  >
                    {STATUS_LABEL[profile.subscriptionStatus] ?? "Không rõ"}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{profile.id}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              disabled={!profile}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#17409A] py-2.5 text-xs font-black text-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors disabled:opacity-40"
            >
              <MdOutlineEdit className="text-sm" /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={!profile}
              className="flex flex-1 items-center justify-center rounded-xl border border-[#FF6B9D] py-2.5 text-xs font-black text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white transition-colors disabled:opacity-40"
            >
              Xóa hồ sơ
            </button>
          </div>

          {/* Key-value rows */}
          <div className="space-y-0 border-t border-[#F0F2F8] pt-2">
            {[
              { icon: <MdChildCare />, label: "Tuổi", value: `${profile.age} tuổi`, color: "#17409A" },
              { icon: <MdPerson />, label: "Giới tính", value: profile.gender === "Nu" ? "Nữ" : "Nam", color: "#FF6B9D" },
              { icon: <MdStar />, label: "Kẹo hôm nay", value: `${profile.dailyCandyBalance} kẹo`, color: "#FF8C42" },
              { icon: <MdAccessTime />, label: "Hết hạn", value: profile.subscriptionEndUtc ?? "Không giới hạn", color: "#4ECDC4" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-b border-[#F0F2F8] last:border-0">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm"
                  style={{ background: `${color}15`, color }}
                >
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-[#9CA3AF]">{label}</p>
                  <p className="text-sm font-black text-[#1A1A2E]">{value}</p>
                </div>
              </div>
            ))}
          </div>


          {/* AI Recommendation */}
          <div className="border-t border-[#F0F2F8] pt-4">
            <button
              type="button"
              onClick={onGenerateRecommendation}
              disabled={recommending || !profile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8C42] py-2.5 text-xs font-black text-white transition-colors hover:bg-[#E07A35] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <MdLightbulb className="text-sm" />
              {recommending ? "Đang tạo gợi ý..." : "Gợi ý học tập AI"}
            </button>

            {recommendationText && (
              <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-[#FAFBFF] p-4 border-l-4 border-l-[#FF8C42]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#FF8C42] mb-3 flex items-center gap-2">
                  <MdLightbulb className="text-sm" />
                  Gợi ý từ AI SmartBear
                </p>
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar text-[#4B5563]">
                  {formatRecommendation(recommendationText)}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <GiBearFace className="mx-auto text-4xl text-[#E5E7EB] mb-3" />
          <p className="text-sm font-bold text-[#9CA3AF]">Chưa chọn hồ sơ</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Chọn một hàng ở danh sách bên trái để xem chi tiết.</p>
        </div>
      )}
    </div>
  );
}
