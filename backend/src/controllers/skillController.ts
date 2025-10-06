import { Request, Response } from 'express';
import { skillService } from '../services/skillService';
import { Auth } from '../decorators/auth';
import { Role } from '../decorators/role';

export class SkillController {
  @Auth()
  @Role(['ADMIN'])
  async create(req: Request, res: Response) {
    const skill = await skillService.create(req.body);
    res.status(201).json(skill);
  }

  @Auth()
  async getAll(req: Request, res: Response) {
    const skills = await skillService.findAll();
    res.json(skills);
  }

  @Auth()
  @Role(['ADMIN'])
  async update(req: Request, res: Response) {
    const skill = await skillService.update(parseInt(req.params.id), req.body);
    res.json(skill);
  }

  @Auth()
  @Role(['ADMIN'])
  async delete(req: Request, res: Response) {
    const result = await skillService.delete(parseInt(req.params.id));
    res.json(result);
  }
}
