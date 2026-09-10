"use client";

import { useState } from "react";
import { AdminSummary } from "@/components/admin/admin-summary";
import { TransactionsPanel } from "@/components/admin/transactions-panel";
import { ProgramsPanel } from "@/components/admin/programs-panel";
import { DisbursementPanel } from "@/components/admin/disbursement-panel";

const TABS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "transaksi", label: "Transaksi masuk" },
  { id: "program", label: "Kelola program" },
  { id: "penyaluran", label: "Penyaluran dana" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<TabId>("ringkasan");

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-brand-950">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-brand-600">
        Semua data di bawah dibaca langsung dari mock-db yang sama dengan situs
        publik — perubahan di sini tampak seketika di halaman publik.
      </p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-brand-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "border-brand-600 text-brand-900"
                : "border-transparent text-brand-500 hover:text-brand-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "ringkasan" && <AdminSummary />}
        {tab === "transaksi" && <TransactionsPanel />}
        {tab === "program" && <ProgramsPanel />}
        {tab === "penyaluran" && <DisbursementPanel />}
      </div>
    </div>
  );
}
