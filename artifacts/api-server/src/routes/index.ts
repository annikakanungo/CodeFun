import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import lessonsRouter from "./lessons";
import resourcesRouter from "./resources";
import projectsRouter from "./projects";
import teacherPlansRouter from "./teacher_plans";
import progressRouter from "./progress";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(resourcesRouter);
router.use(projectsRouter);
router.use(teacherPlansRouter);
router.use(progressRouter);
router.use(statsRouter);

export default router;
