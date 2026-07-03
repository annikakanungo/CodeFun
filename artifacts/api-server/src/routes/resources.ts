import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { resourcesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/resources", async (req, res) => {
  const { grade, category } = req.query as { grade?: string; category?: string };
  const resources = await db.select().from(resourcesTable);
  let result = resources;
  if (grade) {
    const g = parseInt(grade);
    result = result.filter((r) => r.gradeMin <= g && r.gradeMax >= g);
  }
  if (category) {
    result = result.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }
  res.json(result.map((r) => ({
    id: r.id,
    title: r.title,
    url: r.url,
    description: r.description,
    category: r.category,
    isFree: r.isFree,
    gradeMin: r.gradeMin,
    gradeMax: r.gradeMax,
    platform: r.platform ?? null,
  })));
});

export default router;
