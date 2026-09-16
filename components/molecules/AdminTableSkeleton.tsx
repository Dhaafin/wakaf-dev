import { Skeleton } from "@/components/atoms/Skeleton";

export interface AdminTableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

/**
 * Skeleton loading placeholder untuk tabel data Admin Panel.
 * Mendukung layout desktop table rows & mobile cards secara responsif.
 */
export function AdminTableSkeleton({
  rows = 5,
  cols = 6,
  className = "",
}: AdminTableSkeletonProps) {
  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      aria-label="Memuat data tabel..."
      role="status"
    >
      {/* DESKTOP TABLE SKELETON */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-sand-50/80 border-b border-brand-200/80">
            <tr>
              {Array.from({ length: cols }).map((_, idx) => (
                <th key={idx} className="px-5 py-3.5">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100/70">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} className="hover:bg-sand-50/30">
                {Array.from({ length: cols }).map((_, cIdx) => (
                  <td key={cIdx} className="px-5 py-4 align-top">
                    {cIdx === 0 ? (
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-2.5 w-16" />
                      </div>
                    ) : cIdx === 1 ? (
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-36" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                    ) : cIdx === cols - 2 ? (
                      <Skeleton className="h-5 w-20 rounded-full" />
                    ) : cIdx === cols - 1 ? (
                      <div className="flex justify-end gap-1.5">
                        <Skeleton className="h-7 w-16 rounded-lg" />
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-20" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS SKELETON */}
      <div className="lg:hidden divide-y divide-brand-100/80">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="rounded-xl bg-sand-50/60 p-3 space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
