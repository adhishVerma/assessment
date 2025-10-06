import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { Auth } from '../decorators/auth';
import { Role } from '../decorators/role';
import { quizService } from '../services/quizService';

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const user = await userService.register(name, email, password);
            res.json(user);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await userService.login(email, password);
            res.json({ user, token });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @Auth()
    async profile(req: Request, res: Response) {
        const userId = (req as any).userId;
        const user = await userService.getById(userId);
        res.json(user);
    }

    @Auth()
    async getReports(req: Request, res: Response) {
        const userId = (req as any).userId;
        const reports = await quizService.getReports(userId);
        res.json(reports);
    }

    @Auth()
    @Role(['ADMIN'])
    async listUsers(req: Request, res: Response) {
        const users = await userService.listUsers();
        res.json(users);
    }

    @Auth()
    async getUserReport(req: Request, res: Response) {
        const { id } = req.params;
        const report = await quizService.getReportSingle(parseInt(id));
        res.json(report);
    }

}
