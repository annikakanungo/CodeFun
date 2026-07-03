import { pgTable, serial, integer, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(45),
  hasVideo: boolean("has_video").notNull().default(false),
  hasExercises: boolean("has_exercises").notNull().default(false),
  hasQuiz: boolean("has_quiz").notNull().default(false),
  videoUrl: text("video_url"),
  content: text("content"),
  objectives: text("objectives").array().notNull().default([]),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
