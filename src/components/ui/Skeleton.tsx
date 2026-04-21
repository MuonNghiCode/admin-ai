interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[#E7EDF9] ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
