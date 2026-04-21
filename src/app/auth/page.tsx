import { GiBearFace } from "react-icons/gi";
import AuthCard from "../../components/auth/AuthCard";

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F7FF] text-[#1A1A2E]">
      <div className="pointer-events-none absolute -left-20 top-20 h-44 w-44 rounded-full bg-[#17409A]/10" />
      <div className="pointer-events-none absolute right-10 top-14 h-24 w-24 rounded-full bg-[#FF8C42]/20" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-52 w-52 rounded-full bg-[#4ECDC4]/20" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-screen-2xl grid-cols-1 px-4 py-6 sm:px-8 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-14 lg:py-10">
        <section className="flex items-center border border-[#E5E7EB] bg-white/95 px-6 py-8 shadow-2xl shadow-[#17409A]/10 sm:px-10 sm:py-12 lg:border-r-0 lg:rounded-l-[2.2rem] lg:px-12 lg:py-14">
          <AuthCard />
        </section>

        <aside className="hidden border border-[#E5E7EB] border-t-0 bg-[#17409A] px-10 py-12 text-white shadow-2xl shadow-[#17409A]/25 lg:flex lg:flex-col lg:justify-between lg:rounded-r-[2.2rem] lg:border-l-0 lg:border-t">
          <div>
            <div className="mb-10 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-white/90">
              <span className="text-lg">
                <GiBearFace />
              </span>
              Design a Bear
            </div>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/65">
              Smart Commerce Control
            </p>
            <h2 className="mt-4 max-w-xl text-5xl font-black leading-tight text-white">
              Luxury Admin Space for Smart Teddy Data.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/75">
              Quản trị đơn hàng, danh mục sản phẩm và dữ liệu người dùng trong
              giao diện đồng bộ, tinh tế và nhất quán.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["Orders", "128"],
              ["Products", "96"],
              ["Reports", "24"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
