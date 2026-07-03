import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SubmitProjectBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res) => {
  const { grade, limit } = req.query as { grade?: string; limit?: string };
  const limitNum = limit ? Math.min(Math.max(parseInt(limit) || 20, 1), 100) : 20;
  let projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
  if (grade) {
    projects = projects.filter((p) => p.grade === parseInt(grade));
  }
  res.json(projects.slice(0, limitNum).map((p) => ({
    id: p.id,
    studentName: p.studentName,
    grade: p.grade,
    title: p.title,
    description: p.description,
    language: p.language,
    projectUrl: p.projectUrl ?? null,
    codeSnippet: p.codeSnippet ?? null,
    createdAt: p.createdAt.toISOString(),
  })));
});

router.post("/projects", async (req, res) => {
  const parsed = SubmitProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { studentName, grade, title, description, language, projectUrl, codeSnippet } = parsed.data;
  const [project] = await db.insert(projectsTable).values({
    studentName,
    grade,
    title,
    description,
    language,
    projectUrl: projectUrl ?? null,
    codeSnippet: codeSnippet ?? null,
  }).returning();
  res.status(201).json({
    id: project.id,
    studentName: project.studentName,
    grade: project.grade,
    title: project.title,
    description: project.description,
    language: project.language,
    projectUrl: project.projectUrl ?? null,
    codeSnippet: project.codeSnippet ?? null,
    createdAt: project.createdAt.toISOString(),
  });
});

export default router;
