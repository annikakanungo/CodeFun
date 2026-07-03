import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { coursesTable, lessonsTable, projectsTable, resourcesTable, progressRecordsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  const [courses, lessons, projects, resources, progressRecords] = await Promise.all([
    db.select().from(coursesTable),
    db.select().from(lessonsTable),
    db.select().from(projectsTable),
    db.select().from(resourcesTable),
    db.select().from(progressRecordsTable),
  ]);

  const uniqueStudents = new Set(progressRecords.map((r) => r.studentId));

  // Grade breakdown: count unique students per grade via projects as proxy
  const gradeMap: Record<number, Set<string>> = {};
  progressRecords.forEach((r) => {
    // We don't have grade directly on progress — use a simplified approach
    if (!gradeMap[0]) gradeMap[0] = new Set();
    gradeMap[0].add(r.studentId);
  });

  // Build grade breakdown from projects
  const projectsByGrade: Record<number, number> = {};
  projects.forEach((p) => {
    projectsByGrade[p.grade] = (projectsByGrade[p.grade] || 0) + 1;
  });

  const gradeBreakdown = Object.entries(projectsByGrade).map(([grade, studentCount]) => ({
    grade: parseInt(grade),
    studentCount,
  })).sort((a, b) => a.grade - b.grade);

  res.json({
    totalCourses: courses.length,
    totalLessons: lessons.length,
    totalStudents: uniqueStudents.size || projects.length,
    totalProjects: projects.length,
    totalResources: resources.length,
    gradeBreakdown,
  });
});

router.get("/recent-activity", async (req, res) => {
  const { limit } = req.query as { limit?: string };
  const limitNum = limit ? Math.min(Math.max(parseInt(limit) || 10, 1), 100) : 10;

  const projects = await db.select().from(projectsTable)
    .orderBy(desc(projectsTable.createdAt))
    .limit(limitNum);

  const activity = projects.map((p) => ({
    id: p.id,
    type: "project_submitted" as const,
    description: `${p.studentName} submitted "${p.title}"`,
    grade: p.grade,
    studentName: p.studentName,
    createdAt: p.createdAt.toISOString(),
  }));

  res.json(activity);
});

export default router;
