import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const teacherPlansTable = pgTable("teacher_plans", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id"),
  grade: integer("grade").notNull(),
  title: text("title").notNull(),
  objectives: text("objectives").array().notNull().default([]),
  materials: text("materials").array().notNull().default([]),
  activities: text("activities").array().notNull().default([]),
  assessmentIdeas: text("assessment_ideas").array().notNull().default([]),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  curriculumExpectations: text("curriculum_expectations").array().notNull().default([]),
});

export const insertTeacherPlanSchema = createInsertSchema(teacherPlansTable).omit({ id: true });
export type InsertTeacherPlan = z.infer<typeof insertTeacherPlanSchema>;
export type TeacherPlan = typeof teacherPlansTable.$inferSelect;
