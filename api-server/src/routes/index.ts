import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scansRouter from "./scans";
import statsRouter from "./stats";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scansRouter);
router.use(statsRouter);
router.use(contactRouter);

export default router;
