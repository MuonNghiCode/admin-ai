import type { ReactNode } from "react";
import { GiBearFace } from "react-icons/gi";

interface AdminPageHeaderProps {
  badge: string;
  title: string;
  description: string;
  actions?: ReactNode;
  stats?: Array<{ label: string; value: string | number }>;
}

export default function AdminPageHeader({
  badge,
  title,
  description,
  actions,
  stats,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 pb-6 border-b border-[#E5E7EB] lg:flex-row lg:items-end lg:justify-between">
      {/* Left: title block */}
      <div className="flex items-start gap-4">
        {/* Accent bar */}
        <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#17409A]" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <GiBearFace className="text-base text-[#17409A]/50" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#17409A]">
              {badge}
            </span>
          </div>
          <h1 className="text-2xl font-black leading-tight text-[#1A1A2E] md:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-[#6B7280] max-w-2xl">{description}</p>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-5 pt-1">
              {stats.map((item) => (
                <div key={item.label} className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#17409A]">{item.value}</span>
                  <span className="text-xs font-semibold text-[#9CA3AF]">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: actions */}
      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
