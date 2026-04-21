"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import type { AdminDashboardStats } from "@/types";
import { MdRefresh } from "react-icons/md";
import {
  MdPeople,
  MdDevices,
  MdLibraryMusic,
  MdMenuBook,
  MdShoppingBag,
  MdTrendingUp,
} from "react-icons/md";
import { GiBearFace } from "react-icons/gi";
import AppToast from "@/components/ui/AppToast";
import { useToast } from "@/hooks/useToast";
import AdminLoadingSkeleton from "@/components/admin/shared/AdminLoadingSkeleton";

const vnd = new Intl.NumberFormat("vi-VN");

function StatRow({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-[#F0F2F8] last:border-0">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
        style={{ background: `${accent}12`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#9CA3AF]">{label}</p>
        <p className="text-sm font-black text-[#1A1A2E] truncate">{value}</p>
        {sub && <p className="text-[10px] text-[#9CA3AF]">{sub}</p>}
      </div>
    </div>
  );
}

function CircleProgress({ value, total, color }: { value: number; total: number; color: string }) {
  const ratio = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (ratio / 100) * circ;
  return (
    <svg width={90} height={90} viewBox="0 0 90 90">
      <circle cx={45} cy={45} r={r} stroke="#EEF2FD" strokeWidth={10} fill="none" />
      <circle
        cx={45} cy={45} r={r}
        stroke={color}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x={45} y={50} textAnchor="middle" fontSize={13} fontWeight={900} fill={color}>
        {Math.round(ratio)}%
      </text>
    </svg>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(3, (value / max) * 100) : 3;
  return (
    <div className="py-2 border-b border-[#F0F2F8] last:border-0">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#6B7280]">{label}</span>
        <span className="text-xs font-black text-[#1A1A2E]">{vnd.format(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#EEF2FD]">
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast, showError, closeToast } = useToast();

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getStats();
      if (response.isFailure || !response.value) {
        throw new Error(response.error?.description || "Không tải được dashboard stats");
      }
      setStats(response.value);
    } catch (error) {
      showError("Tải thống kê thất bại", error instanceof Error ? error.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-7 text-[#1A1A2E]">
      {/* ── Page header ─────────────────────────── */}
      <div className="flex items-end justify-between pb-5 border-b border-[#E5E7EB]">
        <div className="flex items-start gap-4">
          <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#17409A]" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GiBearFace className="text-sm text-[#17409A]/50" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#17409A]">
                Bảng điều khiển
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#1A1A2E] md:text-3xl">Tổng quan hệ thống</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Theo dõi người dùng, thiết bị, nội dung và doanh thu theo thời gian thực.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-black text-[#17409A] transition-all hover:border-[#17409A] hover:shadow-sm"
        >
          <MdRefresh className="text-base" />
          Tải lại
        </button>
      </div>

      {loading ? (
        <AdminLoadingSkeleton rows={8} />
      ) : stats ? (
        <>
          {/* ── KPI strip ───────────────────────── */}
          <div className="grid grid-cols-2 gap-px bg-[#E5E7EB] rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm md:grid-cols-4">
            {[
              { label: "Người dùng", value: vnd.format(stats.totalUsers), icon: <MdPeople />, color: "#17409A" },
              { label: "Thiết bị", value: vnd.format(stats.totalDevices), icon: <MdDevices />, color: "#7C5CFC" },
              { label: "Doanh thu (VNĐ)", value: vnd.format(stats.totalRevenueVnd), icon: <MdTrendingUp />, color: "#4ECDC4" },
              { label: "Đơn thành công", value: vnd.format(stats.successfulOrdersCount), icon: <MdShoppingBag />, color: "#FF8C42" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-[#FAFBFF] px-5 py-5">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold text-[#9CA3AF]">{kpi.label}</p>
                  <span className="text-base" style={{ color: kpi.color }}>{kpi.icon}</span>
                </div>
                <p className="mt-2 text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* ── Two-column analytics ─────────────── */}
          <div className="grid gap-8 xl:grid-cols-3">
            {/* Left col: user & premium ratio */}
            <div className="xl:col-span-1 py-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wide">Tỷ lệ Premium</h2>
                <span className="text-[10px] font-semibold text-[#9CA3AF]">Người dùng</span>
              </div>
              <div className="flex items-center gap-5">
                <CircleProgress value={stats.proUsers} total={stats.totalUsers} color="#17409A" />
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Gói Premium</p>
                    <p className="text-xl font-black text-[#17409A]">{vnd.format(stats.proUsers)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Tổng tài khoản</p>
                    <p className="text-xl font-black text-[#1A1A2E]">{vnd.format(stats.totalUsers)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Phiên hoạt động</p>
                    <p className="text-xl font-black text-[#7C5CFC]">{vnd.format(stats.activeSessions)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle col: content bars */}
            <div className="xl:col-span-1 border-l border-[#EAECF5] pl-8 py-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wide">Nội dung & Thiết bị</h2>
              </div>
              {[
                { label: "Thiết bị", value: stats.totalDevices, color: "#17409A" },
                { label: "Bài hát", value: stats.totalSongs, color: "#4ECDC4" },
                { label: "Truyện", value: stats.totalStories, color: "#FF8C42" },
                { label: "Phiên hoạt động", value: stats.activeSessions, color: "#7C5CFC" },
              ].map((item) => (
                <BarRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={Math.max(stats.totalDevices, stats.totalSongs, stats.totalStories, stats.activeSessions, 1)}
                  color={item.color}
                />
              ))}
            </div>

            {/* Right col: storage & orders */}
            <div className="xl:col-span-1 border-l border-[#EAECF5] pl-8 py-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wide">Chỉ số hệ thống</h2>
              </div>
              <StatRow icon={<MdLibraryMusic />} label="Lưu trữ nhạc" value={`${vnd.format(stats.musicStorageMb)} MB`} accent="#4ECDC4" />
              <StatRow icon={<MdMenuBook />} label="Lưu trữ truyện" value={`${vnd.format(stats.storyStorageKb)} KB`} accent="#FF8C42" />
              <StatRow
                icon={<MdShoppingBag />}
                label="Đơn hàng gần nhất"
                value={`${vnd.format(stats.lastOrderAmount)} VNĐ`}
                sub={stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleString("vi-VN") : "Chưa có"}
                accent="#17409A"
              />
              <StatRow
                icon={<GiBearFace />}
                label="Đồng bộ lần cuối"
                value={new Date(stats.lastSyncTime).toLocaleTimeString("vi-VN")}
                sub={new Date(stats.lastSyncTime).toLocaleDateString("vi-VN")}
                accent="#7C5CFC"
              />
            </div>
          </div>

          {/* ── Sparkline trend ──────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wide">Xu hướng hệ thống</h2>
              <span className="text-[10px] text-[#9CA3AF]">Dữ liệu nội suy</span>
            </div>
            <div className="relative h-20 w-full overflow-hidden">
              {/* Grid lines */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-[#EEF2FD]"
                  style={{ top: `${(i / 3) * 100}%` }}
                />
              ))}
              <Sparkline
                points={[
                  Math.round(stats.totalRevenueVnd / 1_000_000),
                  stats.successfulOrdersCount * 3,
                  stats.activeSessions * 5,
                  stats.totalUsers,
                  stats.proUsers * 8,
                ]}
              />
            </div>
            <div className="mt-2 flex gap-5 text-[10px] text-[#9CA3AF]">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#17409A]" />Doanh thu (M₫)</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#4ECDC4]" />Đơn × 3</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#7C5CFC]" />Phiên × 5</span>
            </div>
          </div>
        </>
      ) : null}

      <AppToast toast={toast} onClose={closeToast} />
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = Math.max(max - min, 1);
  const w = 1000;
  const h = 80;
  const coords = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * w;
      const y = h - ((point - min) / span) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${h} ${coords} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#17409A" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#17409A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#spark-fill)" />
      <polyline
        points={coords}
        fill="none"
        stroke="#17409A"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((point, index) => {
        const x = (index / (points.length - 1)) * w;
        const y = h - ((point - min) / span) * (h - 8) - 4;
        return <circle key={index} cx={x} cy={y} r={4} fill="#17409A" />;
      })}
    </svg>
  );
}
