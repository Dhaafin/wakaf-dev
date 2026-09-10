import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";

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
export const programs = pgTable("programs", {
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
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const disbursements = pgTable("disbursements", {
  id: text("id").primaryKey(),
  programId: text("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  tanggal: timestamp("tanggal").notNull().defaultNow(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi").notNull(),
  nominal: bigint("nominal", { mode: "number" }).notNull(),
  buktiImageUrl: text("bukti_image_url"),
  buktiFileName: text("bukti_file_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
