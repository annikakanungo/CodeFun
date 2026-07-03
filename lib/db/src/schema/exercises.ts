import { pgTable, serial, integer, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  title: text("title").notNull(),
  instructions: text("instructions").notNull(),
  starterCode: text("starter_code").notNull().default(""),
  expectedOutput: text("expected_output"),
  language: varchar("language", { length: 50 }).notNull(),
  order: integer("order").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("beginner"),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
