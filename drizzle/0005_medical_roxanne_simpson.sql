CREATE INDEX "disbursements_program_id_idx" ON "disbursements" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "programs_aktif_idx" ON "programs" USING btree ("aktif");--> statement-breakpoint
CREATE INDEX "programs_type_kategori_idx" ON "programs" USING btree ("program_type","kategori");--> statement-breakpoint
CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");