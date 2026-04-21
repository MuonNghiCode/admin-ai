"use client";

import { type IconType } from "react-icons";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  icon: IconType;
  autoComplete?: string;
  disabled?: boolean;
}

export default function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  autoComplete,
  disabled,
}: InputFieldProps) {
  return (
    <label htmlFor={id} className="field-item block space-y-2.5">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#17409A]/75">
        {label}
      </span>
      <div className="flex min-h-12 items-center gap-3 border-b-2 border-[#E5E7EB] bg-transparent px-1 transition-all duration-200 focus-within:border-[#17409A]">
        <span className="text-[#17409A]/70">
          <Icon />
        </span>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full bg-transparent py-3 text-base font-semibold text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
    </label>
  );
}
