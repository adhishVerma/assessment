import { Request, Response } from 'express';
import { questionService } from '../services/questionService';
import { Auth } from '../decorators/auth';
import { Role } from '../decorators/role';

export class QuestionController {
  @Auth()
  @Role(['ADMIN'])
  async create(req: Request, res: Response) {
    const question = await questionService.create(req.body);
    res.status(201).json(question);
  }

  @Auth()
  async list(req: Request, res: Response) {
    const { skillId } = req.query;
    const questions = await questionService.findById(Number(skillId));
    res.json(questions);
  }

  @Auth()
  @Role(['ADMIN'])
  async update(req: Request, res: Response) {
    const question = await questionService.update(Number(req.params.id), req.body);
    res.json(question);
  }

  @Auth()
  @Role(['ADMIN'])
  async delete(req: Request, res: Response) {
    const result = await questionService.delete(Number(req.params.id));
    res.json(result);
  }
}
