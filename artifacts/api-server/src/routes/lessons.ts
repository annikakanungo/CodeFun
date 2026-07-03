import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { lessonsTable, exercisesTable, quizzesTable, quizQuestionsTable, curriculumMappingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/lessons/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  res.json({
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    description: lesson.description ?? null,
    order: lesson.order,
    durationMinutes: lesson.durationMinutes,
    hasVideo: lesson.hasVideo,
    hasExercises: lesson.hasExercises,
    hasQuiz: lesson.hasQuiz,
    videoUrl: lesson.videoUrl ?? null,
    content: lesson.content ?? null,
    objectives: lesson.objectives,
  });
});

router.get("/lessons/:id/exercises", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const exercises = await db.select().from(exercisesTable)
    .where(eq(exercisesTable.lessonId, id))
    .orderBy(exercisesTable.order);
  res.json(exercises.map((e) => ({
    id: e.id,
    lessonId: e.lessonId,
    title: e.title,
    instructions: e.instructions,
    starterCode: e.starterCode,
    expectedOutput: e.expectedOutput ?? null,
    language: e.language,
    order: e.order,
    difficulty: e.difficulty,
  })));
});

router.get("/lessons/:id/quiz", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.lessonId, id));
  if (!quiz) {
    res.status(404).json({ error: "No quiz for this lesson" });
    return;
  }
  const questions = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quiz.id));
  res.json({
    id: quiz.id,
    lessonId: quiz.lessonId,
    questions: questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
    })),
  });
});

router.get("/lessons/:id/curriculum-mappings", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const mappings = await db.select().from(curriculumMappingsTable)
    .where(eq(curriculumMappingsTable.lessonId, id));
  res.json(mappings.map((m) => ({
    id: m.id,
    lessonId: m.lessonId,
    expectationCode: m.expectationCode,
    expectationText: m.expectationText,
    strand: m.strand,
    grade: m.grade,
  })));
});

export default router;
