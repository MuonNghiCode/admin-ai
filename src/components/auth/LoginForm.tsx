"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import InputField from "@/components/auth/InputField";

import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !submitting;
  }, [email, password, submitting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      await login(email.trim(), password);
      router.replace("/admin");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Đăng nhập thất bại, vui lòng thử lại";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        icon={IoMailOutline}
        placeholder="admin@admin.com"
        autoComplete="email"
        disabled={submitting}
      />

      <InputField
        id="password"
        name="password"
        type="password"
        label="Mật khẩu"
        value={password}
        onChange={setPassword}
        icon={IoLockClosedOutline}
        placeholder="Nhập mật khẩu của bạn"
        autoComplete="current-password"
        disabled={submitting}
      />

      {error ? (
        <p className="field-item rounded-2xl border border-[#FF6B9D]/30 bg-[#FF6B9D]/10 px-4 py-3 text-sm font-bold text-[#B4234D]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="field-item min-h-12 w-full rounded-2xl bg-[#17409A] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-[#17409A]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0E2A66] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>


    </form>
  );
}
