export function ProgramCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-2.5 w-full rounded-full" />
        <div className="flex justify-between">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProgramGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </div>
  );
}
