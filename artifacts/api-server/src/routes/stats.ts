import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { coursesTable, lessonsTable, resourcesTable, progressRecordsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  const [courses, lessons, resources, progressRecords] = await Promise.all([
    db.select().from(coursesTable),
    db.select().from(lessonsTable),
    db.select().from(resourcesTable),
    db.select().from(progressRecordsTable),
  ]);

  const uniqueStudents = new Set(progressRecords.map((r) => r.studentId));

  const completedByGrade = await db
    .select({ studentId: progressRecordsTable.studentId, grade: coursesTable.grade })
    .from(progressRecordsTable)
    .innerJoin(lessonsTable, eq(progressRecordsTable.lessonId, lessonsTable.id))
    .innerJoin(coursesTable, eq(lessonsTable.courseId, coursesTable.id));
  const studentsByGrade = new Map<number, Set<string>>();
  completedByGrade.forEach(({ studentId, grade }) => {
    if (!studentsByGrade.has(grade)) studentsByGrade.set(grade, new Set());
    studentsByGrade.get(grade)!.add(studentId);
  });
  const gradeBreakdown = [...studentsByGrade.entries()]
    .map(([grade, students]) => ({ grade, studentCount: students.size }))
    .sort((a, b) => a.grade - b.grade);

  res.json({
    totalCourses: courses.length,
    totalLessons: lessons.length,
    totalStudents: uniqueStudents.size,
    totalResources: resources.length,
    gradeBreakdown,
  });
});

router.get("/recent-activity", async (req, res) => {
  const { limit } = req.query as { limit?: string };
  const limitNum = limit ? Math.min(Math.max(parseInt(limit) || 10, 1), 100) : 10;

  const completions = await db.select({
    id: progressRecordsTable.id,
    studentId: progressRecordsTable.studentId,
    lessonId: progressRecordsTable.lessonId,
    completedAt: progressRecordsTable.completedAt,
    grade: coursesTable.grade,
    title: lessonsTable.title,
  })
    .from(progressRecordsTable)
    .innerJoin(lessonsTable, eq(progressRecordsTable.lessonId, lessonsTable.id))
    .innerJoin(coursesTable, eq(lessonsTable.courseId, coursesTable.id))
    .orderBy(desc(progressRecordsTable.completedAt))
    .limit(limitNum);

  const activity = completions.map((completion) => ({
    id: completion.id,
    type: "lesson_completed" as const,
    description: `completed "${completion.title}"`,
    grade: completion.grade,
    studentName: null,
    createdAt: completion.completedAt.toISOString(),
  }));

  res.json(activity);
});

export default router;
