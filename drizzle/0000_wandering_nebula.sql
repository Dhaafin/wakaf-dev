CREATE TABLE "healthchecks" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'ok' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
