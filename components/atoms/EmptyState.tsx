export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl">
        📭
      </div>
      <h3 className="font-serif text-lg font-semibold text-brand-950">
        {title}
      </h3>
      {desc && <p className="max-w-sm text-sm text-brand-600">{desc}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
