"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCard() {
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAuth();
  const cleanedRef = useRef(false);

  useEffect(() => {
    if (cleanedRef.current) return;
    cleanedRef.current = true;
    localStorage.clear();
    logout();
  }, [logout]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fields = document.querySelectorAll(".field-item");
    if (fields.length === 0) return;

    gsap.set(fields, { y: 20, opacity: 0 });
    gsap.to(fields, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="w-full max-w-xl">
      <div className="field-item mb-8 space-y-4">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#17409A]/70">
          Xác thực quản trị
        </p>
        <h1 className="text-4xl font-black leading-tight text-[#17409A] sm:text-5xl">
          Đăng nhập hệ thống quản trị
        </h1>
        <p className="max-w-lg text-sm leading-7 text-[#6B7280] sm:text-base">
          Phiên truy cập mới luôn bắt đầu từ trạng thái sạch để bảo vệ dữ liệu 
          quản trị và giữ trải nghiệm đăng nhập nhất quán.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
