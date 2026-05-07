import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import { MdAdd, MdRefresh } from "react-icons/md";

interface ProfileHeaderProps {
  total: number;
  activeCount: number;
  onCreate: () => void;
  onRefresh: () => void;
}

export default function ProfileHeader({
  total,
  activeCount,
  onCreate,
  onRefresh,
}: ProfileHeaderProps) {
  return (
    <AdminPageHeader
      badge="Trung tâm Hồ sơ"
      title="Quản lý hồ sơ bé bằng một luồng trực quan, đồng bộ."
      description="Danh sách hồ sơ, gói dịch vụ, an toàn và cá nhân hóa được gom trong cùng một trải nghiệm quản trị cao cấp, nhất quán từ di động đến máy tính."
      stats={[
        { label: "Tổng hồ sơ", value: total },
        { label: "Đang hoạt động", value: activeCount },
      ]}
      actions={
        <>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#17409A] bg-white px-5 py-3 text-sm font-black text-[#17409A] transition-all duration-200 hover:bg-[#17409A] hover:text-white"
          >
            <MdRefresh className="text-lg" />
            Tải lại
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17409A] px-5 py-3 text-sm font-black text-white shadow-xl shadow-[#17409A]/15 transition-all duration-200 hover:bg-[#0E2A66]"
          >
            <MdAdd className="text-lg" />
            Tạo profile
          </button>
        </>
      }
    />
  );
}
