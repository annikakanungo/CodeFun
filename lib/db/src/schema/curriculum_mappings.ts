import { pgTable, serial, integer, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const curriculumMappingsTable = pgTable("curriculum_mappings", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  expectationCode: varchar("expectation_code", { length: 50 }).notNull(),
  expectationText: text("expectation_text").notNull(),
  strand: varchar("strand", { length: 100 }).notNull(),
  grade: integer("grade").notNull(),
});

export const insertCurriculumMappingSchema = createInsertSchema(curriculumMappingsTable).omit({ id: true });
export type InsertCurriculumMapping = z.infer<typeof insertCurriculumMappingSchema>;
export type CurriculumMapping = typeof curriculumMappingsTable.$inferSelect;
