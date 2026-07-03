import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  studentName: varchar("student_name", { length: 100 }).notNull(),
  grade: integer("grade").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  projectUrl: text("project_url"),
  codeSnippet: text("code_snippet"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
