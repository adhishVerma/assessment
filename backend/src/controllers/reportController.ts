/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting and analytics
 */

import { Request, Response } from "express";
import { ReportsService, TimeFilter } from "../services/reportService";
import { Auth } from "../decorators/auth";
// import { Role } from "../decorators/role";

const reportsService = new ReportsService();

export class ReportController {
  /**
   * @swagger
   * /api/reports/user/{userId}:
   *   get:
   *     summary: Get user's quiz reports with optional time filtering
   *     tags: [Reports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *       - in: query
   *         name: filter
   *         required: false
   *         schema:
   *           type: string
   *           enum: [all, week, month, year]
   *         description: "Optional time filter (default: all)"
   *     responses:
   *       200:
   *         description: Quiz reports for the user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   */
  @Auth()
  async getUserReport(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const timeFilter = (req.query.filter as TimeFilter) || "all";
    // Authorization logic (if needed)
    const report = await reportsService.getUserReport(userId, timeFilter);
    res.json({ success: true, data: report });
  }

  /**
   * @swagger
   * /api/reports/skill-gaps/{userId}:
   *   get:
   *     summary: Get skill gap analysis for a user
   *     tags: [Reports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *       - in: query
   *         name: filter
   *         required: false
   *         schema:
   *           type: string
   *           enum: [all, week, month, year]
   *         description: "Optional time filter (default: all)"
   *     responses:
   *       200:
   *         description: Skill gap analysis result
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   */
  @Auth()
  async getSkillGaps(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const timeFilter = (req.query.filter as TimeFilter) || "all";
    const skillGaps = await reportsService.getSkillGaps(userId, timeFilter);
    res.json({ success: true, data: skillGaps });
  }

  /**
   * @swagger
   * /api/reports/comparative/{userId}:
   *   get:
   *     summary: Get comparative analysis for a user
   *     tags: [Reports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: Comparative report data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   */
  @Auth()
  async getComparativeReport(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const report = await reportsService.getComparativeReport(userId);
    res.json({ success: true, data: report });
  }
}
