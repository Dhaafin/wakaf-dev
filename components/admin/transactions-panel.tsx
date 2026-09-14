"use client";

import { AdminTransactionOrganism } from "@/components/organisms/admin/AdminTransactionOrganism";

/**
 * Backward compatibility wrapper untuk panel transaksi di Admin Dashboard.
 * Seluruh fungsi utama didelegasikan ke AdminTransactionOrganism.
 */
export function TransactionsPanel() {
  return <AdminTransactionOrganism />;
}
