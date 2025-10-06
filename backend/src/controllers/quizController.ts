import { Request, Response } from 'express';
import { quizService } from '../services/quizService';
import { Auth } from '../decorators/auth';

export class QuizController {
    @Auth()
    async startSession(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { skillId } = req.body;
        const session = await quizService.startSession(userId, skillId);
        res.json(session);
    }

    @Auth()
    async submitAnswer(req: Request, res: Response) {
        const { sessionId, questionId, selectedOption } = req.body;
        const result = await quizService.submitAnswer(sessionId, questionId, selectedOption);
        res.json(result);
    }

    @Auth()
    async completeSession(req: Request, res: Response) {
        const { sessionId } = req.body;
        const session = await quizService.completeSession(sessionId);
        res.json(session);
    }

    @Auth()
    async getQuizReports(req: Request, res: Response) {
        const userId = (req as any).userId;
        const reports = await quizService.getReports(userId);
        res.json(reports);
    }
}
