import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { teacherPlansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/teacher-plans", async (req, res) => {
  const { grade } = req.query as { grade?: string };
  let plans = await db.select().from(teacherPlansTable);
  if (grade) {
    plans = plans.filter((p) => p.grade === parseInt(grade));
  }
  res.json(plans.map((p) => ({
    id: p.id,
    lessonId: p.lessonId ?? null,
    grade: p.grade,
    title: p.title,
    objectives: p.objectives,
    materials: p.materials,
    activities: p.activities,
    assessmentIdeas: p.assessmentIdeas,
    durationMinutes: p.durationMinutes,
    curriculumExpectations: p.curriculumExpectations,
  })));
});

router.get("/teacher-plans/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isFinite(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const [plan] = await db.select().from(teacherPlansTable).where(eq(teacherPlansTable.id, id));
  if (!plan) {
    res.status(404).json({ error: "Teacher plan not found" });
    return;
  }
  res.json({
    id: plan.id,
    lessonId: plan.lessonId ?? null,
    grade: plan.grade,
    title: plan.title,
    objectives: plan.objectives,
    materials: plan.materials,
    activities: plan.activities,
    assessmentIdeas: plan.assessmentIdeas,
    durationMinutes: plan.durationMinutes,
    curriculumExpectations: plan.curriculumExpectations,
  });
});

export default router;
