// Wordmark KBM — mendekati logo Yayasan Khazanah Berkah Mulia:
// huruf kecil "kbm" hijau dengan sapuan aksen merah di kanan atas.
// (Placeholder demo — ganti dengan file SVG/PNG logo resmi bila tersedia.)
export function BrandLogo({
  variant = "dark",
  showText = true,
}: {
  variant?: "dark" | "light";
  showText?: boolean;
}) {
  const wordColor = variant === "light" ? "text-white" : "text-brand-600";
  const subColor = variant === "light" ? "text-white/70" : "text-brand-500";

  return (
    <span className="flex items-center gap-2.5">
      <span className="relative inline-flex items-end rounded-xl bg-white px-2 py-1 shadow-sm ring-1 ring-brand-100">
        <span className="font-sans text-xl font-extrabold leading-none tracking-tight text-brand-600">
          kbm
        </span>
        <span
          aria-hidden
          className="absolute right-1 top-0.5 h-1 w-3 -rotate-[30deg] rounded-full bg-accent-500"
        />
      </span>
      {showText && (
        <span className={`font-serif text-base font-semibold leading-tight ${wordColor}`}>
          Khazanah Berkah&nbsp;Mulia
          <span
            className={`block font-sans text-[10px] font-medium tracking-[0.18em] ${subColor}`}
          >
            WAKAF DIGITAL
          </span>
        </span>
      )}
    </span>
  );
}
