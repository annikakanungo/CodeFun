import { pgTable, serial, integer, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  grade: integer("grade").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  gradeband: varchar("gradeband", { length: 20 }).notNull(), // elementary, middle, secondary
  lessonCount: integer("lesson_count").notNull().default(0),
  color: varchar("color", { length: 50 }).notNull().default("#6366f1"),
  objectives: text("objectives").array().notNull().default([]),
  weeklyTopics: text("weekly_topics").array().notNull().default([]),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
