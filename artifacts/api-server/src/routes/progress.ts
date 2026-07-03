import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { progressRecordsTable, lessonsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { RecordProgressBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/progress/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const records = await db.select().from(progressRecordsTable)
    .where(eq(progressRecordsTable.studentId, studentId))
    .orderBy(desc(progressRecordsTable.completedAt));

  const totalLessons = await db.select().from(lessonsTable);
  const completedLessons = new Set(records.map((r) => r.lessonId)).size;

  // Determine current grade from completed lessons
  const lessonIds = records.map((r) => r.lessonId);
  let currentGrade: number | null = null;
  if (lessonIds.length > 0) {
    const recentLesson = await db.select().from(lessonsTable)
      .where(eq(lessonsTable.id, records[0].lessonId));
    if (recentLesson.length > 0) {
      // We'd need to join with courses to get grade - simplified here
      currentGrade = null;
    }
  }

  // Award badges based on progress
  const badges: string[] = [];
  if (completedLessons >= 1) badges.push("First Step");
  if (completedLessons >= 5) badges.push("Getting Started");
  if (completedLessons >= 10) badges.push("Building Momentum");
  if (completedLessons >= 20) badges.push("Code Explorer");
  if (completedLessons >= 50) badges.push("Code Champion");

  res.json({
    studentId,
    completedLessons,
    totalLessons: totalLessons.length,
    currentGrade,
    badges,
    recentCompletions: records.slice(0, 10).map((r) => ({
      id: r.id,
      studentId: r.studentId,
      lessonId: r.lessonId,
      completedAt: r.completedAt.toISOString(),
      score: r.score ?? null,
    })),
  });
});

router.post("/progress", async (req, res) => {
  const parsed = RecordProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { studentId, lessonId, score, exerciseId } = parsed.data;
  const [record] = await db.insert(progressRecordsTable).values({
    studentId,
    lessonId,
    score: score ?? null,
    exerciseId: exerciseId ?? null,
  }).returning();
  res.json({
    id: record.id,
    studentId: record.studentId,
    lessonId: record.lessonId,
    completedAt: record.completedAt.toISOString(),
    score: record.score ?? null,
  });
});

export default router;
