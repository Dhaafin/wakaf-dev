"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WakifSession, AdminSession } from "@/types";

// ============================================================================
// State sesi login (wakif & admin) — Zustand + persist ke localStorage.
// CATATAN: yang disimpan di browser hanya IDENTITAS sesi (siapa yang login).
// Seluruh DATA transaksi/program tetap di database utama.
// ============================================================================

interface SessionState {
  wakif: WakifSession | null;
  admin: AdminSession | null;
  loginWakif: (s: Omit<WakifSession, "loggedInAt">) => void;
  logoutWakif: () => void;
  loginAdmin: (s: Omit<AdminSession, "loggedInAt">) => void;
  logoutAdmin: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      wakif: null,
      admin: null,
      loginWakif: (s) =>
        set({ wakif: { ...s, loggedInAt: new Date().toISOString() } }),
      logoutWakif: () => set({ wakif: null }),
      loginAdmin: (s) =>
        set({ admin: { ...s, loggedInAt: new Date().toISOString() } }),
      logoutAdmin: () => set({ admin: null }),
    }),
    { name: "wakaf-demo-session" },
  ),
);
