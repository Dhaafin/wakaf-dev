"use client";

import type {
  ApiResponse,
  Program,
  Transaction,
  Certificate,
  GlobalStats,
  DisbursementReport,
  DisbursementWithProgram,
  DisbursementStatsSummary,
  PublicDonation,
  PaginatedResult,
  AnnouncementBannerConfig,
  HeroSectionConfig,
  SiteSettings,
  ListTransactionsParams,
  ListTransactionsResult,
  AdminAnalyticsData,
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

export interface ListProgramsParams {
  page?: number;
  limit?: number;
  q?: string;
  type?: string;
  kategori?: string;
  status?: "all" | "active" | "inactive" | "deleted";
  sort?: "popular" | "urgent" | "near_goal" | "latest" | "oldest" | "target_asc" | "target_desc" | string;
}

export interface ListDisbursementsParams {
  page?: number;
  limit?: number;
  q?: string;
  programId?: string;
  sort?: "latest" | "oldest" | "nominal_desc" | "nominal_asc";
}

export interface ListDisbursementsResult {
  items: DisbursementWithProgram[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statsSummary: DisbursementStatsSummary;
}

export const api = {
  listPrograms: (params?: ListProgramsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.q) searchParams.set("q", params.q);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.kategori) searchParams.set("kategori", params.kategori);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.sort) searchParams.set("sort", params.sort);
    const qs = searchParams.toString();
    return req<PaginatedResult<Program>>(`/api/programs${qs ? `?${qs}` : ""}`);
  },

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

  updateProgram: (
    id: string,
    payload: Partial<{
      nama: string;
      kategori: string;
      program_type?: string;
      lokasi: string;
      ringkasan: string;
      deskripsi: string;
      imageUrl?: string;
      target: number;
      nazhir: string;
      aktif?: boolean;
    }>,
  ) =>
    req<Program>(`/api/programs/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteProgram: (id: string, options?: { permanent?: boolean }) => {
    const qs = options?.permanent ? "?permanent=true" : "";
    return req<{ success: boolean; message: string }>(
      `/api/programs/${encodeURIComponent(id)}${qs}`,
      {
        method: "DELETE",
      },
    );
  },

  restoreProgram: (id: string) =>
    req<{ success: boolean; message: string }>(
      `/api/programs/${encodeURIComponent(id)}/restore`,
      {
        method: "POST",
      },
    ),

  deletePrograms: (ids: string[], options?: { permanent?: boolean }) => {
    const qs = options?.permanent ? "?permanent=true" : "";
    return req<{ success: boolean; count: number; message: string }>(
      `/api/programs${qs}`,
      {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      },
    );
  },


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

  listDisbursements: (params?: ListDisbursementsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.q) searchParams.set("q", params.q);
    if (params?.programId) searchParams.set("programId", params.programId);
    if (params?.sort) searchParams.set("sort", params.sort);
    const qs = searchParams.toString();
    return req<ListDisbursementsResult>(`/api/disbursements${qs ? `?${qs}` : ""}`);
  },

  createDisbursement: (payload: {
    programId: string;
    judul: string;
    deskripsi: string;
    nominal: number;
    buktiImageUrl?: string;
    buktiFileName?: string;
  }) =>
    req<DisbursementWithProgram>("/api/disbursements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteDisbursement: (id: string) =>
    req<{ success: boolean; message: string }>(
      `/api/disbursements/${encodeURIComponent(id)}`,
      { method: "DELETE" },
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

  listTransactions: (params?: ListTransactionsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.q) searchParams.set("q", params.q);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.programId) searchParams.set("programId", params.programId);
    if (params?.sort) searchParams.set("sort", params.sort);
    if (params?.email) searchParams.set("email", params.email);
    const qs = searchParams.toString();
    return req<ListTransactionsResult>(`/api/transactions${qs ? `?${qs}` : ""}`);
  },

  listTransactionsByEmail: async (email: string) => {
    const res = await req<ListTransactionsResult>(
      `/api/transactions?email=${encodeURIComponent(email)}&limit=100`,
    );
    return res.items;
  },

  /** Wakif terbaru (proyeksi publik) untuk halaman transparansi. */
  listRecentDonations: (limit = 12) =>
    req<PublicDonation[]>(`/api/donations?limit=${limit}`),

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

  syncTransaction: (id: string) =>
    req<Transaction>(
      `/api/transactions/${encodeURIComponent(id)}/sync`,
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

  getAdminAnalytics: () => req<AdminAnalyticsData>("/api/admin/analytics"),

  // ------------------------------- Settings & Banner --------------------

  getBanner: () => req<AnnouncementBannerConfig>("/api/banner"),

  updateBanner: (config: AnnouncementBannerConfig) =>
    req<AnnouncementBannerConfig>("/api/banner", {
      method: "PUT",
      body: JSON.stringify(config),
    }),

  getHero: () => req<HeroSectionConfig>("/api/hero"),

  updateHero: (config: HeroSectionConfig) =>
    req<HeroSectionConfig>("/api/hero", {
      method: "PUT",
      body: JSON.stringify(config),
    }),

  getSettings: () => req<SiteSettings>("/api/settings"),

  updateSettings: (settings: Partial<SiteSettings>) =>
    req<SiteSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  // ------------------------------- Demo ops ----------------------------

  resetDemo: () => req<{ message: string }>("/api/reset", { method: "POST" }),
};
