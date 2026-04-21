import type { ReactNode } from "react";

interface AdminSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminSection({
  title,
  description,
  actions,
  children,
}: AdminSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-black text-[#1A1A2E]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-[#9CA3AF]">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2">{actions}</div>
        )}
      </div>
      {children}
    </div>
  );
}
