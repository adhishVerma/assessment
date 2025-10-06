/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { Auth } from '../decorators/auth';
import { Role } from '../decorators/role';
import { quizService } from '../services/quizService';

export class UserController {
  /**
   * @swagger
   * /api/user/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - name
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User registered
   *       400:
   *         description: Bad request / Validation error
   */
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await userService.register(name, email, password);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /api/user/login:
   *   post:
   *     summary: Login user and get JWT token
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User logged in, returns token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                 token:
   *                   type: string
   *       400:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.login(email, password);
      res.json({ user, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /api/user/profile:
   *   get:
   *     summary: Get logged-in user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async profile(req: Request, res: Response) {
    const userId = (req as any).userId;
    const user = await userService.getById(userId);
    res.json(user);
  }

  /**
   * @swagger
   * /api/user/reports:
   *   get:
   *     summary: Get all quiz reports of logged-in user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of quiz reports
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async getReports(req: Request, res: Response) {
    const userId = (req as any).userId;
    const reports = await quizService.getReports(userId);
    res.json(reports);
  }

  /**
   * @swagger
   * /api/user/list:
   *   get:
   *     summary: List all users (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async listUsers(req: Request, res: Response) {
    const users = await userService.listUsers();
    res.json(users);
  }

  /**
   * @swagger
   * /api/user/report/{id}:
   *   get:
   *     summary: Get a single user's quiz report
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *         description: User ID
   *     responses:
   *       200:
   *         description: User quiz report
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async getUserReport(req: Request, res: Response) {
    const { id } = req.params;
    const report = await quizService.getReportSingle(parseInt(id));
    res.json(report);
  }
}
