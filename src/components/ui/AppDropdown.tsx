"use client";

import { MdExpandMore } from "react-icons/md";
import { useDropdown } from "@/hooks/useDropdown";

export interface DropdownOption<TValue extends string | number> {
  label: string;
  value: TValue;
  description?: string;
}

interface AppDropdownProps<TValue extends string | number> {
  label?: string;
  value: TValue;
  options: Array<DropdownOption<TValue>>;
  onChange: (value: TValue) => void;
  disabled?: boolean;
  className?: string;
}

export default function AppDropdown<TValue extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className,
}: AppDropdownProps<TValue>) {
  const { open, rootRef, close, toggle } = useDropdown(false);

  const activeOption =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      {label ? (
        <p className="mb-2 text-sm font-bold text-[#1A1A2E]">{label}</p>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-4 py-3 text-left text-sm font-semibold text-[#1A1A2E] outline-none transition-colors hover:border-[#17409A]/50 focus:border-[#17409A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{activeOption?.label ?? "Chọn"}</span>
        <MdExpandMore
          className={`text-xl text-[#17409A] transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-40 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-2xl shadow-[#17409A]/10">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={`w-full rounded-xl px-3 py-2 text-left transition-colors ${
                  active
                    ? "bg-[#17409A] text-white"
                    : "text-[#1A1A2E] hover:bg-[#F4F7FF]"
                }`}
              >
                <p className="text-sm font-bold">{option.label}</p>
                {option.description ? (
                  <p className={`mt-0.5 text-xs ${active ? "text-white/80" : "text-[#6B7280]"}`}>
                    {option.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
