import type { TutorialSectionConfig, TutorialIconKey } from "@/types";
import { DEFAULT_TUTORIAL_SECTION } from "@/lib/settings";

interface TutorialSectionProps {
  initialConfig?: TutorialSectionConfig;
}

function renderIcon(iconKey?: TutorialIconKey) {
  switch (iconKey) {
    case "search":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "edit":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case "payment":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "heart":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "check":
    default:
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
  }
}

export function TutorialSection({ initialConfig }: TutorialSectionProps = {}) {
  const config = initialConfig || DEFAULT_TUTORIAL_SECTION;
  const steps = config.steps && config.steps.length > 0 ? config.steps : DEFAULT_TUTORIAL_SECTION.steps;

  return (
    <div className="container-app">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          {config.title || "Empat langkah, selesai"}
        </h2>
        {config.subtitle && (
          <p className="mt-2 text-sm text-brand-600 max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        )}
      </div>

      {/* Expanding Flex Accordion with Growing Image Preview */}
      <div className="flex flex-col md:flex-row w-full min-h-[580px] md:h-[480px] gap-4">
        {steps.map((s, idx) => {
          const stepNum = s.stepNumber || String(idx + 1).padStart(2, "0");
          return (
            <div
              key={stepNum}
              className="group relative flex-1 flex flex-col justify-between overflow-hidden rounded-[2rem] bg-brand-50 border border-brand-100 transition-all duration-500 ease-out hover:flex-[2.5] hover:bg-emerald-800 hover:border-emerald-700 cursor-pointer hover:shadow-2xl p-6 md:p-7"
            >
              {/* Header: Watermark Number & Floating Icon */}
              <div className="relative flex items-center justify-between w-full">
                {/* Background Number Watermark */}
                <div className="text-6xl sm:text-7xl font-black text-brand-200/50 group-hover:text-emerald-700/50 transition-colors duration-500 select-none">
                  {stepNum}
                </div>

                {/* Floating Icon */}
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-brand-600 group-hover:text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 shadow-xs transition-all duration-500 shrink-0">
                  {renderIcon(s.icon)}
                </div>
              </div>

              {/* Middle: Expanding Responsive Image */}
              {s.imageUrl && (
                <div className="my-auto py-3 flex items-center justify-center w-full transition-all duration-500">
                  <div className="overflow-hidden rounded-2xl border border-brand-200/60 group-hover:border-emerald-600/40 bg-white/80 shadow-xs group-hover:shadow-xl transition-all duration-500 w-24 h-24 group-hover:w-full group-hover:h-44 md:group-hover:h-48">
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Bottom Content Area */}
              <div className="z-10 w-full mt-auto">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-950 group-hover:text-white transition-colors duration-500 truncate md:whitespace-nowrap">
                  {s.title}
                </h3>

                {/* Expandable Description */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 md:opacity-0 md:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                  <p className="overflow-hidden mt-2.5 text-xs sm:text-sm text-brand-600 group-hover:text-emerald-100 leading-relaxed max-w-sm whitespace-normal">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
