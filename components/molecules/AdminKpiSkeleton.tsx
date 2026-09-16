import { Skeleton } from "@/components/atoms/Skeleton";

export interface AdminKpiSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton loading placeholder untuk 4 kartu metrik KPI eksekutif Admin Panel.
 */
export function AdminKpiSkeleton({
  count = 4,
  className = "",
}: AdminKpiSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 ${className}`}
      aria-label="Memuat ringkasan metrik..."
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card p-4 sm:p-5 border border-brand-200/70 bg-white"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton variant="circle" className="h-8 w-8" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-7 w-28 sm:w-36" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
