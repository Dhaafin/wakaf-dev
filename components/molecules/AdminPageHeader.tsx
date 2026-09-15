"use client";

import { ReactNode } from "react";

export interface AdminPageHeaderProps {
  /**
   * Main page title
   */
  title: ReactNode;
  /**
   * Concise subtitle or description
   */
  description?: ReactNode;
  /**
   * Optional badge label or node shown directly above the title
   */
  badge?: ReactNode;
  /**
   * Extra informational node placed next to actions (e.g., last updated timestamp)
   */
  subtitleExtra?: ReactNode;
  /**
   * Optional trigger for data refresh
   */
  onRefresh?: () => void;
  /**
   * Loading state for the refresh button
   */
  refreshing?: boolean;
  /**
   * Custom label for refresh button
   */
  refreshLabel?: string;
  /**
   * Action buttons or controls rendered on the right side of the header
   */
  actions?: ReactNode;
  /**
   * Custom container class names
   */
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  subtitleExtra,
  onRefresh,
  refreshing = false,
  refreshLabel = "Segarkan",
  actions,
  className = "",
}: AdminPageHeaderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 text-white shadow-md ${className}`}
    >
      {/* Decorative radial glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
      <div className="pointer-events-none absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-accent-500/10 blur-xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          {badge && (
            <div>
              {typeof badge === "string" ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-brand-200 backdrop-blur-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{badge}</span>
                </div>
              ) : (
                badge
              )}
            </div>
          )}

          <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="max-w-2xl text-xs sm:text-sm text-brand-200/90 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {subtitleExtra}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Perbarui data"
            >
              <svg
                className={`h-4 w-4 ${refreshing ? "animate-spin text-brand-300" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>{refreshing ? "Menyegarkan..." : refreshLabel}</span>
            </button>
          )}

          {actions}
        </div>
      </div>
    </div>
  );
}
