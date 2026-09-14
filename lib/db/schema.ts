import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Health check table
export const healthchecks = pgTable("healthchecks", {
  id: text("id").primaryKey(),
  status: text("status").notNull().default("ok"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Better Auth Schema
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonatedBy"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Program & Penyaluran (Disbursement) Schema
export const programs = pgTable(
  "programs",
  {
    id: text("id").primaryKey(),
    nama: text("nama").notNull(),
    slug: text("slug").notNull().unique(),
    programType: text("program_type").notNull(), // 'wakaf-uang' | 'wakaf-melalui-uang' | 'infaq-shadaqah' | 'zakat'
    kategori: text("kategori").notNull(), // 'masjid' | 'pendidikan' | 'produktif-umkm' | 'sumur-air-bersih' | 'kemanusiaan' | 'sosial-dhuafa'
    lokasi: text("lokasi").notNull(),
    ringkasan: text("ringkasan").notNull(),
    deskripsi: text("deskripsi").notNull(),
    imageUrl: text("image_url"),
    target: bigint("target", { mode: "number" }).notNull(),
    terkumpul: bigint("terkumpul", { mode: "number" }).notNull().default(0),
    jumlahWakif: integer("jumlah_wakif").notNull().default(0),
    nazhir: text("nazhir")
      .notNull()
      .default("Nazhir Yayasan Khazanah Berkah Mulia"),
    aktif: boolean("aktif").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"), // Soft delete untuk audit BWI
  },
  (table) => [
    index("programs_aktif_idx").on(table.aktif),
    index("programs_type_kategori_idx").on(table.programType, table.kategori),
    index("programs_created_at_idx").on(table.createdAt),
  ],
);

export const disbursements = pgTable(
  "disbursements",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "restrict" }), // Mencegah data keuangan terhapus tidak sengaja
    tanggal: timestamp("tanggal").notNull().defaultNow(),
    judul: text("judul").notNull(),
    deskripsi: text("deskripsi").notNull(),
    nominal: bigint("nominal", { mode: "number" }).notNull(),
    buktiImageUrl: text("bukti_image_url"),
    buktiFileName: text("bukti_file_name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("disbursements_program_id_idx").on(table.programId),
  ],
);

// Transaksi Wakaf & Donasi (Financial Audit Trail)
export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey(), // mis. WKF-20260901-AB12CD
    programType: text("program_type").notNull(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "restrict" }),
    programNama: text("program_nama").notNull(),
    nominal: bigint("nominal", { mode: "number" }).notNull(),
    biayaAdmin: integer("biaya_admin").notNull().default(0),
    total: bigint("total", { mode: "number" }).notNull(),
    namaWakif: text("nama_wakif").notNull(),
    emailWakif: text("email_wakif").notNull(),
    teleponWakif: text("telepon_wakif").notNull(),
    atasNama: text("atas_nama").notNull(), // 'sendiri' | 'orang-lain'
    namaAtasNama: text("nama_atas_nama"),
    visibilitas: text("visibilitas").notNull().default("publik"), // 'publik' | 'anonim'
    doa: text("doa"),
    vaNumber: text("va_number").notNull(),
    bank: text("bank").notNull().default("BSI"),
    status: text("status").notNull().default("pending"), // 'pending' | 'paid' | 'expired'
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    paidAt: timestamp("paid_at"),
    certificateId: text("certificate_id"),
    snapToken: text("snap_token"),
    snapRedirectUrl: text("snap_redirect_url"),
  },
  (table) => [
    index("transactions_program_id_idx").on(table.programId),
    index("transactions_email_wakif_idx").on(table.emailWakif),
    index("transactions_status_idx").on(table.status),
    index("transactions_created_at_idx").on(table.createdAt),
  ],
);

// Sertifikat Wakaf Digital
export const certificates = pgTable(
  "certificates",
  {
    id: text("id").primaryKey(), // mis. SW/2026/09/000123
    transactionId: text("transaction_id")
      .notNull()
      .unique()
      .references(() => transactions.id, { onDelete: "restrict" }),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "restrict" }),
    programNama: text("program_nama").notNull(),
    programType: text("program_type").notNull(),
    namaPihak: text("nama_pihak").notNull(),
    nominal: bigint("nominal", { mode: "number" }).notNull(),
    tanggal: timestamp("tanggal").notNull().defaultNow(),
    nazhir: text("nazhir")
      .notNull()
      .default("Nazhir Yayasan Khazanah Berkah Mulia"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("certificates_program_id_idx").on(table.programId),
    index("certificates_transaction_id_idx").on(table.transactionId),
  ],
);

// Drizzle Relations
export const programsRelations = relations(programs, ({ many }) => ({
  disbursements: many(disbursements),
  transactions: many(transactions),
  certificates: many(certificates),
}));

export const disbursementsRelations = relations(disbursements, ({ one }) => ({
  program: one(programs, {
    fields: [disbursements.programId],
    references: [programs.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  program: one(programs, {
    fields: [transactions.programId],
    references: [programs.id],
  }),
  certificate: one(certificates, {
    fields: [transactions.certificateId],
    references: [certificates.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  program: one(programs, {
    fields: [certificates.programId],
    references: [programs.id],
  }),
  transaction: one(transactions, {
    fields: [certificates.transactionId],
    references: [transactions.id],
  }),
}));

// Pengaturan Website (Site Settings & Announcement Banner)
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(), // mis. 'top_banner'
  value: text("value").notNull(), // JSON string: { text, linkText, linkUrl, enabled }
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});


