import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().unique(),
});

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctIndex: integer("correct_index").notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ id: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({ id: true });

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type Quiz = typeof quizzesTable.$inferSelect;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;
