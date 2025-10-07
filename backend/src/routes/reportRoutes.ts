import { Router } from "express";
import { ReportController } from "../controllers/reportController";

const router = Router();
const reportController = new ReportController();

/**
 * GET /api/reports/user/:userId
 * Get user's quiz reports with optional time filtering
 */
router.get("/user/:userId", (req, res) =>
  reportController.getUserReport(req, res)
);

/**
 * GET /api/reports/skill-gaps/:userId
 * Get skill gap analysis for a user
 */
router.get("/skill-gaps/:userId", async (req, res) =>
  reportController.getSkillGaps(req, res)
);

/**
 * GET /api/reports/comparative/:userId
 * Get comparative analysis for a user
 */
router.get("/comparative/:userId", async (req, res) =>
  reportController.getComparativeReport(req, res)
);

export default router;
