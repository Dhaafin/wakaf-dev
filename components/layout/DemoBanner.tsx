"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import { Spinner } from "@/components/atoms/Spinner";

export function DemoBanner() {
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const router = useRouter();

  async function handleReset() {
    if (loading) return;
    const yakin = window.confirm(
      "Reset semua data demo ke kondisi awal? Semua transaksi & program yang dibuat selama demo akan hilang.",
    );
    if (!yakin) return;
    setLoading(true);
    try {
      const r = await api.resetDemo();
      push({ kind: "success", title: "Data demo direset", desc: r.message });
      router.refresh();
    } catch {
      push({ kind: "error", title: "Gagal mereset data demo" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-brand-950 text-white">
      <div className="container-app flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs">
        <p className="flex items-center gap-2">
          <span className="badge bg-white/15 text-white">MODE DEMO</span>
          <span className="hidden text-white/70 sm:inline">
            Data & pembayaran disimulasikan — tidak ada transaksi uang sungguhan.
          </span>
        </p>
        <button
          onClick={handleReset}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
        >
          {loading && <Spinner className="h-3 w-3" />}
          Reset data demo
        </button>
      </div>
    </div>
  );
}
