CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"program_id" text NOT NULL,
	"program_nama" text NOT NULL,
	"program_type" text NOT NULL,
	"nama_pihak" text NOT NULL,
	"nominal" bigint NOT NULL,
	"tanggal" timestamp DEFAULT now() NOT NULL,
	"nazhir" text DEFAULT 'Nazhir Yayasan Khazanah Berkah Mulia' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"program_type" text NOT NULL,
	"program_id" text NOT NULL,
	"program_nama" text NOT NULL,
	"nominal" bigint NOT NULL,
	"biaya_admin" integer DEFAULT 0 NOT NULL,
	"total" bigint NOT NULL,
	"nama_wakif" text NOT NULL,
	"email_wakif" text NOT NULL,
	"telepon_wakif" text NOT NULL,
	"atas_nama" text NOT NULL,
	"nama_atas_nama" text,
	"visibilitas" text DEFAULT 'publik' NOT NULL,
	"doa" text,
	"va_number" text NOT NULL,
	"bank" text DEFAULT 'BSI' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"paid_at" timestamp,
	"certificate_id" text
);
--> statement-breakpoint
ALTER TABLE "disbursements" DROP CONSTRAINT "disbursements_program_id_programs_id_fk";
--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "certificates_program_id_idx" ON "certificates" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "certificates_transaction_id_idx" ON "certificates" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "transactions_program_id_idx" ON "transactions" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "transactions_email_wakif_idx" ON "transactions" USING btree ("email_wakif");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "disbursements" ADD CONSTRAINT "disbursements_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE no action;