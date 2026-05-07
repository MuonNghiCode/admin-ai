import type { AdminDashboardStats } from "@/types";

interface DashboardChartsProps {
  stats: AdminDashboardStats;
}

function CircleChart({ value, total }: { value: number; total: number }) {
  const ratio = total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (ratio / 100) * circumference;

  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Tỷ lệ Premium</p>
      <div className="mt-4 flex items-center gap-4">
        <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
          <circle cx="60" cy="60" r="44" stroke="#E6ECF9" strokeWidth="12" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="44"
            stroke="#17409A"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="66" textAnchor="middle" className="fill-[#17409A] text-[16px] font-black">
            {Math.round(ratio)}%
          </text>
        </svg>
        <div>
          <p className="text-sm text-[#6B7280]">{value.toLocaleString("vi-VN")} / {total.toLocaleString("vi-VN")} người dùng</p>
          <p className="mt-2 text-xs text-[#9CA3AF]">Thành viên gói Premium trên tổng người dùng</p>
        </div>
      </div>
    </div>
  );
}

function BarChart({ items }: { items: Array<{ label: string; value: number; tone: string }> }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Nội dung & Thiết bị</p>
      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const width = `${Math.max(6, (item.value / maxValue) * 100)}%`;
          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs font-bold text-[#6B7280]">
                <span>{item.label}</span>
                <span>{item.value.toLocaleString("vi-VN")}</span>
              </div>
              <div className="h-3 rounded-full bg-[#EEF2FD]">
                <div className={`h-3 rounded-full ${item.tone}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = Math.max(max - min, 1);
  const coords = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 280;
      const y = 90 - ((point - min) / span) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-lg shadow-[#17409A]/5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Xu hướng doanh thu</p>
      <svg viewBox="0 0 280 100" className="mt-4 h-24 w-full">
        <polyline
          points={coords}
          fill="none"
          stroke="#17409A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-2 text-xs text-[#6B7280]">Dữ liệu xu hướng dựa trên các chỉ số đơn hàng, phiên và doanh thu hiện tại.</p>
    </div>
  );
}

export default function DashboardCharts({ stats }: DashboardChartsProps) {
  const barItems = [
    { label: "Thiết bị", value: stats.totalDevices, tone: "bg-[#17409A]" },
    { label: "Bài hát", value: stats.totalSongs, tone: "bg-[#4ECDC4]" },
    { label: "Truyện", value: stats.totalStories, tone: "bg-[#FF8C42]" },
    { label: "Phiên hoạt động", value: stats.activeSessions, tone: "bg-[#7C5CFC]" },
  ];

  const trendPoints = [
    Math.round(stats.totalRevenueVnd / 1_000_000),
    stats.successfulOrdersCount * 3,
    stats.activeSessions * 5,
    stats.totalUsers,
    stats.proUsers * 8,
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <CircleChart value={stats.proUsers} total={stats.totalUsers} />
      <BarChart items={barItems} />
      <Sparkline points={trendPoints} />
    </div>
  );
}
