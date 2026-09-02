import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { coursesTable, lessonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/courses", async (req, res) => {
  const { grade, gradeband } = req.query as { grade?: string; gradeband?: string };
  let query = db.select().from(coursesTable);
  const courses = await query;
  let result = courses;
  if (grade) {
    result = result.filter((c) => c.grade === parseInt(grade));
  }
  if (gradeband) {
    result = result.filter((c) => c.gradeband === gradeband);
  }
  res.json(result.map((c) => ({
    id: c.id,
    grade: c.grade,
    title: c.title,
    description: c.description,
    language: c.language,
    gradeband: c.gradeband,
    lessonCount: c.lessonCount,
    color: c.color,
  })));
});

router.get("/courses/by-grade-band", async (_req, res) => {
  const courses = await db.select().from(coursesTable).orderBy(coursesTable.grade);
  const elementary = courses.filter((c) => c.gradeband === "elementary").map((c) => ({
    id: c.id, grade: c.grade, title: c.title, description: c.description,
    language: c.language, gradeband: c.gradeband, lessonCount: c.lessonCount, color: c.color,
  }));
  const middle = courses.filter((c) => c.gradeband === "middle").map((c) => ({
    id: c.id, grade: c.grade, title: c.title, description: c.description,
    language: c.language, gradeband: c.gradeband, lessonCount: c.lessonCount, color: c.color,
  }));
  const secondary = courses.filter((c) => c.gradeband === "secondary").map((c) => ({
    id: c.id, grade: c.grade, title: c.title, description: c.description,
    language: c.language, gradeband: c.gradeband, lessonCount: c.lessonCount, color: c.color,
  }));
  res.json({ elementary, middle, secondary });
});

router.get("/courses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json({
    id: course.id,
    grade: course.grade,
    title: course.title,
    description: course.description,
    language: course.language,
    gradeband: course.gradeband,
    lessonCount: course.lessonCount,
    color: course.color,
    objectives: course.objectives,
    weeklyTopics: course.weeklyTopics,
  });
});

router.get("/courses/:id/lessons", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const lessons = await db.select().from(lessonsTable)
    .where(eq(lessonsTable.courseId, id))
    .orderBy(lessonsTable.order);
  res.json(lessons.map((l) => ({
    id: l.id,
    courseId: l.courseId,
    title: l.title,
    description: l.description ?? null,
    order: l.order,
    durationMinutes: l.durationMinutes,
    hasExercises: l.hasExercises,
    hasQuiz: l.hasQuiz,
  })));
});

export default router;
