CREATE TABLE "disbursements" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"tanggal" timestamp DEFAULT now() NOT NULL,
	"judul" text NOT NULL,
	"deskripsi" text NOT NULL,
	"nominal" bigint NOT NULL,
	"bukti_image_url" text,
	"bukti_file_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"slug" text NOT NULL,
	"program_type" text NOT NULL,
	"kategori" text NOT NULL,
	"lokasi" text NOT NULL,
	"ringkasan" text NOT NULL,
	"deskripsi" text NOT NULL,
	"image_url" text,
	"target" bigint NOT NULL,
	"terkumpul" bigint DEFAULT 0 NOT NULL,
	"jumlah_wakif" integer DEFAULT 0 NOT NULL,
	"nazhir" text DEFAULT 'Nazhir Yayasan Khazanah Berkah Mulia' NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "disbursements" ADD CONSTRAINT "disbursements_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;