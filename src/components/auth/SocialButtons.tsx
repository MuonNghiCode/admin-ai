"use client";

import { FaFacebookF, FaGoogle } from "react-icons/fa";

export default function SocialButtons() {
  return (
    <div className="field-item space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
          hoặc
        </span>
        <span className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="min-h-11 rounded-2xl border border-[#E5E7EB] bg-white px-3 text-sm font-black text-[#17409A] transition-all duration-200 hover:border-[#17409A] hover:bg-[#17409A]/10"
        >
          <span className="inline-flex items-center gap-2">
            <FaGoogle />
            Google
          </span>
        </button>
        <button
          type="button"
          className="min-h-11 rounded-2xl border border-[#E5E7EB] bg-white px-3 text-sm font-black text-[#17409A] transition-all duration-200 hover:border-[#17409A] hover:bg-[#17409A]/10"
        >
          <span className="inline-flex items-center gap-2">
            <FaFacebookF />
            Facebook
          </span>
        </button>
      </div>
    </div>
  );
}
