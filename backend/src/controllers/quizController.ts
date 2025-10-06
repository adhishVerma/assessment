/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management
 */

import { Request, Response } from 'express';
import { quizService } from '../services/quizService';
import { Auth } from '../decorators/auth';

export class QuizController {
  /**
   * @swagger
   * /api/quizzes/start:
   *   post:
   *     summary: Start a new quiz session
   *     tags: [Quizzes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               skillId:
   *                 type: number
   *             required:
   *               - skillId
   *     responses:
   *       200:
   *         description: Quiz session started
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async startSession(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { skillId } = req.body;
    const session = await quizService.startSession(userId, skillId);
    res.json(session);
  }

  /**
   * @swagger
   * /api/quizzes/submit:
   *   post:
   *     summary: Submit an answer for a quiz question
   *     tags: [Quizzes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               sessionId:
   *                 type: number
   *               questionId:
   *                 type: number
   *               selectedOption:
   *                 type: string
   *             required:
   *               - sessionId
   *               - questionId
   *               - selectedOption
   *     responses:
   *       200:
   *         description: Answer submitted
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async submitAnswer(req: Request, res: Response) {
    const { sessionId, questionId, selectedOption } = req.body;
    const result = await quizService.submitAnswer(sessionId, questionId, selectedOption);
    res.json(result);
  }

  /**
   * @swagger
   * /api/quizzes/complete:
   *   post:
   *     summary: Complete a quiz session
   *     tags: [Quizzes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               sessionId:
   *                 type: number
   *             required:
   *               - sessionId
   *     responses:
   *       200:
   *         description: Quiz session completed
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async completeSession(req: Request, res: Response) {
    const { sessionId } = req.body;
    const session = await quizService.completeSession(sessionId);
    res.json(session);
  }

  /**
   * @swagger
   * /api/quizzes/reports:
   *   get:
   *     summary: Get quiz reports for the authenticated user
   *     tags: [Quizzes]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of quiz reports
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async getQuizReports(req: Request, res: Response) {
    const userId = (req as any).userId;
    const reports = await quizService.getReports(userId);
    res.json(reports);
  }
}
