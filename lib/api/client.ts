"use client";

import type {
  ApiResponse,
  Program,
  Transaction,
  Certificate,
  GlobalStats,
  DisbursementReport,
} from "@/types";

// ============================================================================
// API client sisi browser. Semua pemanggilan lewat sini agar komponen tidak
// menyentuh `fetch` langsung. Delay network disimulasikan di SERVER
// (lihat lib/api/server.ts), jadi client cukup memanggil apa adanya.
// ============================================================================

export class ApiError extends Error {
  fieldErrors?: Record<string, string>;
  status: number;
  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok) {
    throw new ApiError(json.error, res.status, json.fieldErrors);
  }
  return json.data;
}

// ------------------------------- Programs ---------------------------------

export const api = {
  listPrograms: () => req<Program[]>("/api/programs"),

  getProgram: (idOrSlug: string) =>
    req<Program>(`/api/programs/${encodeURIComponent(idOrSlug)}`),

  createProgram: (payload: {
    nama: string;
    kategori: string;
    program_type?: string;
    lokasi: string;
    ringkasan: string;
    deskripsi: string;
    imageUrl?: string;
    target: number;
    nazhir: string;
  }) =>
    req<Program>("/api/programs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  addDisbursement: (
    programId: string,
    payload: {
      judul: string;
      deskripsi: string;
      nominal: number;
      buktiImageUrl?: string;
      buktiFileName?: string;
    },
  ) =>
    req<{ program: Program; disbursement: DisbursementReport }>(
      `/api/programs/${encodeURIComponent(programId)}/disbursements`,
      { method: "POST", body: JSON.stringify(payload) },
    ),

  // ----------------------------- Transactions ---------------------------

  createTransaction: (payload: {
    programId: string;
    nominal: number;
    nama: string;
    email: string;
    telepon: string;
    atasNama: "sendiri" | "orang-lain";
    namaAtasNama?: string;
    visibilitas: "publik" | "anonim";
    doa?: string;
    bank?: string;
  }) =>
    req<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTransaction: (id: string) =>
    req<Transaction>(`/api/transactions/${encodeURIComponent(id)}`),

  listTransactions: () => req<Transaction[]>("/api/transactions"),

  listTransactionsByEmail: (email: string) =>
    req<Transaction[]>(
      `/api/transactions?email=${encodeURIComponent(email)}`,
    ),

  /** Mock "webhook": memanggil ini menandai transaksi sebagai paid. */
  simulatePayment: (id: string) =>
    req<{ transaction: Transaction; certificate: Certificate }>(
      `/api/transactions/${encodeURIComponent(id)}/pay`,
      { method: "POST" },
    ),

  expireTransaction: (id: string) =>
    req<Transaction>(
      `/api/transactions/${encodeURIComponent(id)}/expire`,
      { method: "POST" },
    ),

  // ----------------------------- Certificates --------------------------

  getCertificate: (id: string) =>
    req<Certificate>(`/api/certificates/${encodeURIComponent(id)}`),

  // -------------------------------- Auth -------------------------------

  wakifLogin: (email: string, otp: string) =>
    req<{ email: string; nama: string }>("/api/auth/wakif", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  adminLogin: (email: string, password: string) =>
    req<{ email: string; nama: string }>("/api/auth/admin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // -------------------------------- Stats ------------------------------

  getStats: () => req<GlobalStats>("/api/stats"),

  // ------------------------------- Demo ops ----------------------------

  resetDemo: () => req<{ message: string }>("/api/reset", { method: "POST" }),
};
