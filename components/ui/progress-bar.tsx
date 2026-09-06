import { persen } from "@/lib/format";

// Progress bar program. Nilai selalu dihitung ulang dari (terkumpul/target)
// mock-db, sehingga ikut naik setelah pembayaran mock sukses.
export function ProgressBar({
  terkumpul,
  target,
  showLabel = true,
  size = "md",
}: {
  terkumpul: number;
  target: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const pct = persen(terkumpul, target);
  return (
    <div className="w-full">
      <div
        className={`w-full overflow-hidden rounded-full bg-brand-100 ${
          size === "sm" ? "h-1.5" : "h-2.5"
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-brand-700">{pct}% tercapai</span>
        </div>
      )}
    </div>
  );
}
