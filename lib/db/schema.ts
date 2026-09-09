import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Minimal starter schema for Neon & Drizzle
// Backend developers can add/modify table schemas here as needed.

export const healthchecks = pgTable('healthchecks', {
  id: serial('id').primaryKey(),
  status: text('status').notNull().default('ok'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
