/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill management
 */

import { Request, Response } from 'express';
import { skillService } from '../services/skillService';
import { Auth } from '../decorators/auth';
import { Role } from '../decorators/role';

export class SkillController {
  /**
   * @swagger
   * /api/skills:
   *   post:
   *     summary: Create a new skill
   *     tags: [Skills]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *             required:
   *               - name
   *     responses:
   *       201:
   *         description: Skill created
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async create(req: Request, res: Response) {
    const skill = await skillService.create(req.body);
    res.status(201).json(skill);
  }

  /**
   * @swagger
   * /api/skills:
   *   get:
   *     summary: Get all skills
   *     tags: [Skills]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of skills
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: number
   *                   name:
   *                     type: string
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  async getAll(req: Request, res: Response) {
    const skills = await skillService.findAll();
    res.json(skills);
  }

  /**
   * @swagger
   * /api/skills/{id}:
   *   put:
   *     summary: Update a skill
   *     tags: [Skills]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *         description: Skill ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Skill updated
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async update(req: Request, res: Response) {
    const skill = await skillService.update(parseInt(req.params.id), req.body);
    res.json(skill);
  }

  /**
   * @swagger
   * /api/skills/{id}:
   *   delete:
   *     summary: Delete a skill
   *     tags: [Skills]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *         description: Skill ID
   *     responses:
   *       200:
   *         description: Skill deleted
   *       401:
   *         description: Unauthorized
   */
  @Auth()
  @Role(['ADMIN'])
  async delete(req: Request, res: Response) {
    const result = await skillService.delete(parseInt(req.params.id));
    res.json(result);
  }
}
