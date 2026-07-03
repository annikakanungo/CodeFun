import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const progressRecordsTable = pgTable("progress_records", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  score: integer("score"),
  exerciseId: integer("exercise_id"),
});

export const insertProgressRecordSchema = createInsertSchema(progressRecordsTable).omit({ id: true, completedAt: true });
export type InsertProgressRecord = z.infer<typeof insertProgressRecordSchema>;
export type ProgressRecord = typeof progressRecordsTable.$inferSelect;
