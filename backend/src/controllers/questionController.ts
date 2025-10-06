/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management
 */

import { Request, Response } from 'express';
import { questionService } from '../services/questionService';
import { Auth } from '../decorators/auth';
import { Role } from '../decorators/role';

export class QuestionController {
  /**
   * @swagger
   * /api/questions:
   *   post:
   *     summary: Create a new question
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               text:
   *                 type: string
   *               skillId:
   *                 type: number
   *             required:
   *               - text
   *               - skillId
   *     responses:
   *       201:
   *         description: Question created
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async create(req: Request, res: Response) {
    const question = await questionService.create(req.body);
    res.status(201).json(question);
  }

  /**
   * @swagger
   * /api/questions:
   *   get:
   *     summary: Get questions by skill
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: skillId
   *         schema:
   *           type: number
   *         required: true
   *         description: Skill ID to filter questions
   *     responses:
   *       200:
   *         description: List of questions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: number
   *                   text:
   *                     type: string
   *                   skillId:
   *                     type: number
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async list(req: Request, res: Response) {
    const { skillId } = req.query;
    const questions = await questionService.findById(Number(skillId));
    res.json(questions);
  }

  /**
   * @swagger
   * /api/questions/{id}:
   *   put:
   *     summary: Update a question
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *         description: Question ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               text:
   *                 type: string
   *               skillId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Question updated
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async update(req: Request, res: Response) {
    const question = await questionService.update(Number(req.params.id), req.body);
    res.json(question);
  }

  /**
   * @swagger
   * /api/questions/{id}:
   *   delete:
   *     summary: Delete a question
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *         description: Question ID
   *     responses:
   *       200:
   *         description: Question deleted
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async delete(req: Request, res: Response) {
    const result = await questionService.delete(Number(req.params.id));
    res.json(result);
  }
}
