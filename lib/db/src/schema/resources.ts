import { pgTable, serial, integer, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  isFree: boolean("is_free").notNull().default(true),
  gradeMin: integer("grade_min").notNull(),
  gradeMax: integer("grade_max").notNull(),
  platform: varchar("platform", { length: 100 }),
});

export const insertResourceSchema = createInsertSchema(resourcesTable).omit({ id: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resourcesTable.$inferSelect;
