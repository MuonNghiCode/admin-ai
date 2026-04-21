import Skeleton from "@/components/ui/Skeleton";

interface AdminLoadingSkeletonProps {
  rows?: number;
}

export default function AdminLoadingSkeleton({
  rows = 5,
}: AdminLoadingSkeletonProps) {
  return (
    <div className="space-y-7">
      {/* Header skeleton */}
      <div className="flex items-end justify-between pb-5 border-b border-[#E5E7EB]">
        <div className="flex items-start gap-4">
          <Skeleton className="mt-1 h-12 w-1 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-2xl" />
      </div>

      {/* KPI strip skeleton */}
      <div className="grid grid-cols-2 gap-px bg-[#E5E7EB] rounded-2xl overflow-hidden border border-[#E5E7EB] md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white px-5 py-5 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Content rows skeleton */}
      <div className="space-y-0 divide-y divide-[#F0F2F8]">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 py-4">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
